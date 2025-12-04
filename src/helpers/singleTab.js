const LOCK_KEY = 'studyhub_tab_lock_v1';
const HEARTBEAT_MS = 3000; // refresh lock
const STALE_MS = 10000; // consider lock stale if older than this

export function initSingleTab() {
  const instanceId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let intervalId = null;

  const readLock = () => {
    try {
      const raw = localStorage.getItem(LOCK_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const writeLock = () => {
    try {
      localStorage.setItem(LOCK_KEY, JSON.stringify({ id: instanceId, ts: Date.now() }));
    } catch (e) { void e; }
  };

  const clearLock = () => {
    try {
      const cur = readLock();
      if (cur && cur.id === instanceId) localStorage.removeItem(LOCK_KEY);
    } catch (e) { void e; }
  };

  const isLockedByOther = () => {
    const cur = readLock();
    if (!cur) return false;
    if (cur.id === instanceId) return false;
    // if stale, ignore
    if (Date.now() - (cur.ts || 0) > STALE_MS) return false;
    return true;
  };

  // try to claim lock
  if (isLockedByOther()) {
    return { duplicate: true, instanceId, stop: () => {} };
  }

  writeLock();
  intervalId = setInterval(writeLock, HEARTBEAT_MS);

  const beforeUnloadHandler = () => clearLock();
  window.addEventListener('beforeunload', beforeUnloadHandler);

  // also listen to storage changes; if another tab takes lock, we could detect it later

  const stop = () => {
    try {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      clearLock();
    } catch (e) { void e; }
  };

  return { duplicate: false, instanceId, stop };
}
