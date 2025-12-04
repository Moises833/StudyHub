import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSingleTab } from './helpers/singleTab'

const root = createRoot(document.getElementById('root'));

const { duplicate, stop } = initSingleTab();

function DuplicateNotice() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sesión duplicada detectada</h1>
      <p className="mb-4">Otra ventana o pestaña de StudyHub ya está abierta. Por seguridad, esta pestaña está bloqueada.</p>
      <p className="text-sm text-gray-600">Si necesitas usar esta ventana, cierra la otra pestaña o presiona "Reclamar" para forzar la sesión aquí.</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            try {
              // force takeover: remove the lock and reload
              localStorage.removeItem('studyhub_tab_lock_v1');
              location.reload();
            } catch (e) { void e; }
          }}
          className="bg-sky-600 text-white px-3 py-2 rounded"
        >Reclamar</button>
      </div>
    </div>
  );
}

if (duplicate) {
  root.render(
    <StrictMode>
      <DuplicateNotice />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Optional: stop lock when the app unmounts (never called normally in SPA)
  // expose for debugging
  window.__studyhub_stop_single_tab = stop;
}
