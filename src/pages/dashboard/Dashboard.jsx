import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Menú Principal
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenido a tu panel de control de StudyHub
        </p>
      </div>
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/*RECUADRO DE PROYECTOS */}
        <Link to="/dashboard/proyectos" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Proyectos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Link>
        {/*RECUADRO DE TAREAS*/}
        <Link to="/dashboard/proyectos" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tareas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </Link>
        {/*RECUADRO DE PENDIENTES*/}
        <Link to="/dashboard/proyectos" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
        {/*RECUADRO DE COMPLETADOS*/}
        <Link to="/dashboard/proyectos" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completados</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proyectos recientes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Proyectos Recientes</h2>
            <button className="text-sky-600 hover:text-sky-700 font-medium text-sm">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Proyecto Académico {item}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Descripción del proyecto académico número {item}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 Hace {item} días</span>
                      <span>👤 Usuario</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Activo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Actividad reciente */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            {[
              { action: "Nuevo proyecto creado", time: "Hace 2 horas" },
              { action: "Tarea completada", time: "Hace 5 horas" },
              { action: "Archivo subido", time: "Ayer" },
              { action: "Comentario agregado", time: "Hace 2 días" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

