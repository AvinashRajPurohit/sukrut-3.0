const DESCRIPTOR_LENGTH = 128;
// Stricter threshold: lower = only closer matches pass. 0.5 reduces false accepts (other people's faces).
const DISTANCE_THRESHOLD = 0.5;

/**
 * Euclidean distance between two 128-d face descriptors.
 * Used for face-api.js descriptors; lower = more similar.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export function euclideanDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return Infinity;
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] || 0) - (b[i] || 0);
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/**
 * @param {number[]} stored - from DB
 * @param {number[]} received - from request body
 * @returns {{ ok: boolean, distance?: number }}
 */
export function verifyFaceDescriptor(stored, received) {
  if (!stored || !Array.isArray(stored) || stored.length !== DESCRIPTOR_LENGTH) {
    return { ok: false };
  }
  if (!received || !Array.isArray(received) || received.length !== DESCRIPTOR_LENGTH) {
    return { ok: false };
  }
  const receivedNums = received.slice(0, DESCRIPTOR_LENGTH).map(Number);
  if (receivedNums.some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
    return { ok: false };
  }
  const distance = euclideanDistance(stored, receivedNums);
  return { ok: distance <= DISTANCE_THRESHOLD, distance };
}

export { DESCRIPTOR_LENGTH, DISTANCE_THRESHOLD };
