'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import { Camera, Loader2, X, CheckCircle2 } from 'lucide-react';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

// In verify mode: require this many consecutive face detections (each 500ms) before auto-capture
const AUTO_VERIFY_CONSECUTIVE = 3;

export default function FaceCamera({ mode, onRegisterSuccess, onVerifySuccess, onError, onClose, retryTrigger, verificationError, successMessage }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'capturing' | 'error'
  const [message, setMessage] = useState('Loading face detection...');
  const [faceDetected, setFaceDetected] = useState(false);
  const streamRef = useRef(null);
  const modelsLoadedRef = useRef(false);
  const onErrorRef = useRef(onError);
  const onVerifySuccessRef = useRef(onVerifySuccess);
  const autoVerifyTriggeredRef = useRef(false);
  const consecutiveFaceRef = useRef(0);
  onErrorRef.current = onError;
  onVerifySuccessRef.current = onVerifySuccess;

  // Reset auto-verify when parent signals retry (e.g. after 403 Face verification failed)
  useEffect(() => {
    autoVerifyTriggeredRef.current = false;
    consecutiveFaceRef.current = 0;
    if (mode === 'verify') setStatus((s) => (s === 'capturing' ? 'ready' : s));
  }, [retryTrigger, mode]);

  // Load models then start camera (single sequence). Empty deps = run once on mount.
  // onError in deps would retrigger every parent re-render (e.g. setCurrentTime every 1s) and cause infinite model fetches.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setMessage('Loading face detection...');
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        if (cancelled) return;
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        if (cancelled) return;
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        if (cancelled) return;
        modelsLoadedRef.current = true;

        setMessage('Starting camera...');
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported. Use HTTPS or localhost.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (!cancelled) {
          setStatus('ready');
          setMessage(null);
        }
        // Note: we do NOT set videoRef.current.srcObject here. The <video> is only
        // rendered when status === 'ready', so videoRef.current is null until then.
        // We attach the stream in a separate useEffect that runs after the video mounts.
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          const msg =
            e.name === 'NotAllowedError'
              ? 'Camera permission denied.'
              : e.message || 'Could not access camera. Use HTTPS or localhost.';
          if (e.message && e.message.includes('model')) {
            setMessage('Failed to load face models. Run: npm run download-face-models');
          } else {
            setMessage(msg);
          }
          onErrorRef.current?.(msg);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      const s = streamRef.current;
      if (s) {
        s.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Attach stream to <video> once it mounts. The video is only rendered when status==='ready',
  // so we must set srcObject here, not in init() where videoRef.current was null.
  useEffect(() => {
    if (status !== 'ready' || !streamRef.current || !videoRef.current) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    video.srcObject = stream;
    video.play().catch(() => {});
  }, [status]);

  // Low-frequency check: show "Face detected" badge and, in verify mode, auto-capture after stable face
  useEffect(() => {
    if (status !== 'ready' || !videoRef.current) return;

    const video = videoRef.current;
    const id = setInterval(async () => {
      if (!video.videoWidth || !modelsLoadedRef.current) return;
      if (status === 'capturing') return;

      try {
        const det = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
        setFaceDetected(!!det);

        // In verify mode: auto-capture after stable face (no button click)
        if (mode === 'verify' && det?.descriptor && !autoVerifyTriggeredRef.current) {
          consecutiveFaceRef.current += 1;
          if (consecutiveFaceRef.current >= AUTO_VERIFY_CONSECUTIVE) {
            autoVerifyTriggeredRef.current = true;
            setStatus('capturing');
            onVerifySuccessRef.current(Array.from(det.descriptor));
          }
        } else if (!det) {
          consecutiveFaceRef.current = 0;
        }
      } catch {
        setFaceDetected(false);
        consecutiveFaceRef.current = 0;
      }
    }, 500);
    return () => clearInterval(id);
  }, [status, mode]);

  const handleCapture = async () => {
    if (status !== 'ready' || !videoRef.current) return;

    setStatus('capturing');
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection || !detection.descriptor) {
        setStatus('ready');
        onError?.('No face detected. Please look at the camera.');
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      if (mode === 'register') {
        const res = await fetch('/app/api/user/face/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ faceDescriptor: descriptor }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus('ready');
          onError?.(data.error || 'Registration failed');
          return;
        }
        onRegisterSuccess?.();
      } else {
        onVerifySuccess?.(descriptor);
      }
    } catch (e) {
      setStatus('ready');
      onError?.(e.message || 'Capture failed');
    }
  };

  const isRegister = mode === 'register';
  const isVerify = mode === 'verify';
  const showSuccess = !!successMessage;

  return (
    <div className="space-y-4">
      {/* In-modal verification failed: user-friendly error */}
      {verificationError && !showSuccess && (
        <Alert
          type="error"
          message={verificationError}
          onDismiss={() => {}}
          dismissible={false}
        />
      )}

      <div className="relative flex justify-center rounded-xl overflow-hidden bg-slate-900 aspect-video max-h-[320px]">
        {/* Success: checkmark + message with animation */}
        {showSuccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900 p-6">
            <div className="animate-face-success-pop">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
            </div>
            <p className="text-lg font-semibold text-emerald-400 text-center animate-face-success-pop" style={{ animationDelay: '0.12s' }}>
              {successMessage}
            </p>
          </div>
        )}

        {!showSuccess && status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        {!showSuccess && status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-amber-200 px-4 text-center">
            <Camera className="w-10 h-10 opacity-70" />
            <span className="text-sm">{message}</span>
            <p className="text-xs text-slate-400">
              Models are loaded from CDN. If this persists, check the browser console for errors.
            </p>
          </div>
        )}

        {!showSuccess && status === 'ready' && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {faceDetected && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
                Face detected
              </div>
            )}
            {isVerify && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-800/90 text-slate-300 text-xs text-center max-w-[90%]">
                Look at the camera to verify automatically
              </div>
            )}
          </>
        )}

        {!showSuccess && status === 'capturing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 bg-slate-900/80">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-sm">Verifying...</span>
          </div>
        )}
      </div>

      {message && status !== 'loading' && status !== 'capturing' && !showSuccess && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{message}</p>
      )}

      {!showSuccess && (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className={isVerify ? 'w-full' : 'flex-1'}
            onClick={onClose}
            disabled={status === 'capturing'}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          {isRegister && (
            <Button
              className="flex-1"
              onClick={handleCapture}
              disabled={status !== 'ready' || status === 'capturing'}
              loading={status === 'capturing'}
            >
              <Camera className="w-4 h-4 mr-1" />
              Register face
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
