import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de cierre de sesión
    // Por ejemplo, limpiar tokens, localStorage, etc.
    console.log("Cerrando sesión...");
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleViewProfile = () => {
    // Navegar a la página de perfil (puedes crear esta ruta después)
    navigate("/dashboard/perfil");
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación superior */}
      <nav className="bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Botón de menú hamburguesa (móvil) */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-sky-900">StudyHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">Usuario</p>
                    <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                    U
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Menú desplegable */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 sm:hidden">
                      <p className="text-sm font-semibold text-gray-800">Usuario</p>
                      <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
                    </div>
                    <button
                      onClick={handleViewProfile}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Ver Perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Overlay para móvil */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/15 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 md:top-[73px] left-0 z-30
            w-64 bg-white shadow-lg h-screen md:h-[calc(100vh-73px)]
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <nav className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center md:hidden mb-6">
              <h2 className="text-xl font-bold text-sky-900">Menú</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/dashboard")
                    ? "bg-sky-100 text-sky-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/proyectos"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/dashboard/proyectos")
                    ? "bg-sky-100 text-sky-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/tareas"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/dashboard/tareas")
                    ? "bg-sky-100 text-sky-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Tareas
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/calendario"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/dashboard/calendario")
                    ? "bg-sky-100 text-sky-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendario
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 w-full md:w-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

