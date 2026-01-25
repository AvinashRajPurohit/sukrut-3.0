'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import { format } from 'date-fns';
import { Clock, LogIn, LogOut, CheckCircle2, Calendar } from 'lucide-react';
import Alert from '@/components/shared/Alert';

const FaceCamera = dynamic(() => import('@/components/user/FaceCamera'), { ssr: false });

export default function PunchCard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ipStatus, setIpStatus] = useState({ isAllowed: true, currentIP: null, message: null });
  const [punchError, setPunchError] = useState('');
  const [punchSuccess, setPunchSuccess] = useState('');
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceModalMode, setFaceModalMode] = useState('verify');
  const [facePunchType, setFacePunchType] = useState('in');
  const [pendingPunchDescriptor, setPendingPunchDescriptor] = useState(null);
  const [faceRetryTrigger, setFaceRetryTrigger] = useState(0);
  const [faceVerificationError, setFaceVerificationError] = useState(null);
  const [faceModalSuccess, setFaceModalSuccess] = useState(null);

  useEffect(() => {
    fetchStatus();
    checkIPStatus();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/app/api/attendance/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIPStatus = async () => {
    try {
      const res = await fetch('/app/api/attendance/check-ip');
      const data = await res.json();
      if (data.success) {
        setIpStatus({
          isAllowed: data.isAllowed,
          currentIP: data.currentIP,
          message: data.message
        });
      }
    } catch (error) {
      console.error('Error checking IP status:', error);
      // Default to allowed if check fails (don't block user)
      setIpStatus({ isAllowed: true, currentIP: null, message: null });
    }
  };

  const closeFaceModal = () => {
    setShowFaceModal(false);
    setFaceVerificationError(null);
    setFaceModalSuccess(null);
  };

  const doPunchIn = async (descriptor, reasonText = '') => {
    setFaceVerificationError(null);
    setPunchLoading(true);
    try {
      const res = await fetch('/app/api/attendance/punch-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faceDescriptor: descriptor,
          ...(reasonText ? { reason: reasonText } : {})
        })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresReason) {
          setPendingPunchDescriptor(descriptor);
          setReasonType('late');
          setShowReasonModal(true);
          setShowFaceModal(false);
          setPunchLoading(false);
          return;
        }
        if (data.faceNotRegistered) {
          setShowFaceModal(true);
          setFaceModalMode('register');
          setFacePunchType('in');
          setPunchLoading(false);
          return;
        }
        if (data.requiresFaceVerification) {
          setShowFaceModal(true);
          setFaceModalMode('verify');
          setFacePunchType('in');
          setPunchLoading(false);
          return;
        }
        if (res.status === 403 && data.error === 'Face verification failed') {
          setFaceVerificationError('Face didn\'t match. Please look at the camera to try again.');
          setFaceRetryTrigger((t) => t + 1);
          setPunchLoading(false);
          return;
        }
        if (data.requiresAllowedIP) {
          setPunchError(`${data.error}. Your current IP: ${data.currentIP || 'Unknown'}. Please contact your administrator.`);
        } else {
          setPunchError(data.error || 'Failed to punch in');
        }
        setPunchLoading(false);
        setTimeout(() => setPunchError(''), 5000);
        return;
      }

      setFaceVerificationError(null);
      setFaceModalSuccess('Punched in successfully!');
      setPunchSuccess('Punched in successfully!');
      await fetchStatus();
      await checkIPStatus();
      setShowReasonModal(false);
      setReason('');
      setReasonError('');
      setPendingPunchDescriptor(null);
      setTimeout(() => setPunchSuccess(''), 3000);
      setTimeout(() => {
        setShowFaceModal(false);
        setFaceModalSuccess(null);
      }, 1800);
    } catch (error) {
      console.error('Error punching in:', error);
      setPunchError('An error occurred. Please try again.');
      setTimeout(() => setPunchError(''), 5000);
    } finally {
      setPunchLoading(false);
    }
  };

  const doPunchOut = async (descriptor, reasonText = '') => {
    setFaceVerificationError(null);
    setPunchLoading(true);
    try {
      const res = await fetch('/app/api/attendance/punch-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faceDescriptor: descriptor,
          ...(reasonText ? { reason: reasonText } : {})
        })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresReason) {
          setPendingPunchDescriptor(descriptor);
          setReasonType('early');
          setShowReasonModal(true);
          setShowFaceModal(false);
          setPunchLoading(false);
          return;
        }
        if (data.faceNotRegistered) {
          setShowFaceModal(true);
          setFaceModalMode('register');
          setFacePunchType('out');
          setPunchLoading(false);
          return;
        }
        if (data.requiresFaceVerification) {
          setShowFaceModal(true);
          setFaceModalMode('verify');
          setFacePunchType('out');
          setPunchLoading(false);
          return;
        }
        if (res.status === 403 && data.error === 'Face verification failed') {
          setFaceVerificationError('Face didn\'t match. Please look at the camera to try again.');
          setFaceRetryTrigger((t) => t + 1);
          setPunchLoading(false);
          return;
        }
        if (data.requiresAllowedIP) {
          setPunchError(`${data.error}. Your current IP: ${data.currentIP || 'Unknown'}. Please contact your administrator.`);
        } else {
          setPunchError(data.error || 'Failed to punch out');
        }
        setPunchLoading(false);
        setTimeout(() => setPunchError(''), 5000);
        return;
      }

      setFaceVerificationError(null);
      setFaceModalSuccess('Punched out successfully!');
      setPunchSuccess('Punched out successfully!');
      await fetchStatus();
      await checkIPStatus();
      setShowReasonModal(false);
      setReason('');
      setReasonError('');
      setPendingPunchDescriptor(null);
      setTimeout(() => setPunchSuccess(''), 3000);
      setTimeout(() => {
        setShowFaceModal(false);
        setFaceModalSuccess(null);
      }, 1800);
    } catch (error) {
      console.error('Error punching out:', error);
      setPunchError('An error occurred. Please try again.');
      setTimeout(() => setPunchError(''), 5000);
    } finally {
      setPunchLoading(false);
    }
  };

  const handlePunchIn = async (needsReason = false, reasonText = '') => {
    if (needsReason && reasonText) {
      doPunchIn(pendingPunchDescriptor, reasonText);
      return;
    }

    try {
      const faceRes = await fetch('/app/api/user/face/status');
      const faceData = await faceRes.json();
      if (!faceData.registered) {
        setPunchError('');
        setShowFaceModal(true);
        setFaceModalMode('register');
        setFacePunchType('in');
        return;
      }
      setPunchError('');
      setShowFaceModal(true);
      setFaceModalMode('verify');
      setFacePunchType('in');
    } catch (e) {
      setPunchError('Could not check face status. Please try again.');
      setTimeout(() => setPunchError(''), 5000);
    }
  };

  const handlePunchOut = async (needsReason = false, reasonText = '') => {
    if (needsReason && reasonText) {
      doPunchOut(pendingPunchDescriptor, reasonText);
      return;
    }

    try {
      const faceRes = await fetch('/app/api/user/face/status');
      const faceData = await faceRes.json();
      if (!faceData.registered) {
        setPunchError('');
        setShowFaceModal(true);
        setFaceModalMode('register');
        setFacePunchType('out');
        return;
      }
      setPunchError('');
      setShowFaceModal(true);
      setFaceModalMode('verify');
      setFacePunchType('out');
    } catch (e) {
      setPunchError('Could not check face status. Please try again.');
      setTimeout(() => setPunchError(''), 5000);
    }
  };

  const handleFaceVerifySuccess = (descriptor) => {
    // Don't close modal here; doPunchIn/doPunchOut close on success. On 403 (face mismatch) we keep it open so FaceCamera can auto-retry after retryTrigger bumps.
    if (facePunchType === 'in') {
      doPunchIn(descriptor);
    } else {
      doPunchOut(descriptor);
    }
  };

  const handleFaceRegisterSuccess = () => {
    setShowFaceModal(false);
    setPunchSuccess('Face registered. You can now punch in.');
    setTimeout(() => setPunchSuccess(''), 4000);
  };

  const handleFaceError = (msg) => {
    setPunchError(msg || 'Face verification failed');
    setTimeout(() => setPunchError(''), 5000);
  };

  const submitReason = () => {
    if (!reason || reason.trim().length < 10) {
      setReasonError('Reason must be at least 10 characters');
      return;
    }

    if (reasonType === 'late') {
      handlePunchIn(true, reason);
    } else {
      handlePunchOut(true, reason);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-slate-700 border-t-[#E39A2E]"></div>
          </div>
        </div>
      </Card>
    );
  }

  const timeString = format(currentTime, 'HH:mm:ss');
  const dateString = format(currentTime, 'EEEE, MMMM d, yyyy');

  return (
    <>
      <Card className="relative overflow-hidden group">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E39A2E]/10 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
        
        <div className="relative">
          {punchError && (
            <div className="mb-4">
              <Alert type="error" message={punchError} onDismiss={() => setPunchError('')} />
            </div>
          )}
          {punchSuccess && (
            <div className="mb-4">
              <Alert type="success" message={punchSuccess} onDismiss={() => setPunchSuccess('')} />
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Time Tracking
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {dateString}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#E39A2E]/10 to-[#E39A2E]/5 border border-[#E39A2E]/20">
              <Clock className="w-6 h-6 text-[#E39A2E]" />
            </div>
          </div>

          {/* Live Clock */}
          <div className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#E39A2E]/10">
                <Clock className="w-5 h-5 text-[#E39A2E]" />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Current Time
              </span>
            </div>
            <div className="text-5xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {timeString}
            </div>
          </div>

          {/* IP Warning */}
          {!ipStatus.isAllowed && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    IP Address Not Allowed
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
                    {ipStatus.message || 'Punch in/out is only allowed from configured IP addresses.'}
                  </p>
                  {ipStatus.currentIP && (
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-mono">
                      Your IP: {ipStatus.currentIP}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Content */}
          {status?.status === 'not_punched_in' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mb-4">
                  <LogIn className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ready to start your day?
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Click below to punch in and begin tracking your time
                </p>
              </div>
              <Button
                onClick={() => handlePunchIn()}
                loading={punchLoading}
                disabled={!ipStatus.isAllowed}
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg shadow-[#E39A2E]/20 hover:shadow-xl hover:shadow-[#E39A2E]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-6 h-6 mr-2" />
                Punch In
              </Button>
            </div>
          )}

          {status?.status === 'punched_in' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-emerald-500">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    Punched In Successfully
                  </span>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Punch In Time</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {format(new Date(status.punchInTime), 'HH:mm:ss')}
                  </p>
                  {status.punchInLateReason && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Late arrival: {status.punchInLateReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={() => handlePunchOut()}
                loading={punchLoading}
                disabled={!ipStatus.isAllowed}
                variant="danger"
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-6 h-6 mr-2" />
                Punch Out
              </Button>
            </div>
          )}

          {status?.status === 'completed' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="p-2 rounded-full bg-emerald-500">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Today's Attendance Complete
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Punch In</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {format(new Date(status.punchInTime), 'HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Punch Out</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {format(new Date(status.punchOutTime), 'HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {(status.punchInLateReason || status.punchOutEarlyReason) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {status.punchInLateReason && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                        Late: {status.punchInLateReason}
                      </p>
                    )}
                    {status.punchOutEarlyReason && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                        Early: {status.punchOutEarlyReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Great work! You have completed today's attendance.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showReasonModal}
        onClose={() => {
          setShowReasonModal(false);
          setReason('');
          setReasonError('');
          setPendingPunchDescriptor(null);
        }}
        title={reasonType === 'late' ? 'Late Punch-In Reason' : 'Early Punch-Out Reason'}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {reasonType === 'late'
                ? 'You are punching in late. Please provide a reason for your late arrival (minimum 10 characters).'
                : 'You are leaving early. Please provide a reason for leaving early (minimum 10 characters).'}
            </p>
          </div>
          <Input
            label="Reason"
            as="textarea"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setReasonError('');
            }}
            placeholder="Enter your reason..."
            error={reasonError}
            rows={4}
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowReasonModal(false);
                setReason('');
                setReasonError('');
                setPendingPunchDescriptor(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={submitReason}
              loading={punchLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showFaceModal}
        onClose={closeFaceModal}
        title={
          faceModalMode === 'register'
            ? 'Register your face'
            : `Verify your face to punch ${facePunchType === 'in' ? 'in' : 'out'}`
        }
        size="md"
      >
        {showFaceModal && (
          <FaceCamera
            mode={faceModalMode}
            onRegisterSuccess={handleFaceRegisterSuccess}
            onVerifySuccess={handleFaceVerifySuccess}
            onError={handleFaceError}
            onClose={closeFaceModal}
            retryTrigger={faceRetryTrigger}
            verificationError={faceVerificationError}
            successMessage={faceModalSuccess}
          />
        )}
      </Modal>
    </>
  );
}
