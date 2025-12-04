import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../helpers/auth";
import { getProjectsByUser, getAllTasksByUser } from "../../helpers/projects";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    pending: 0,
    completed: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);

        const allProjects = getProjectsByUser(user.id);
        const myProjects = allProjects.filter(p => String(p.userId) === String(user.id));

        const allTasks = getAllTasksByUser(user.id);
        const myTasks = allTasks.filter(t => String(t.projectUserId) === String(user.id));

        const completedTasksCount = myTasks.filter(t => t.completada).length;
        const completedProjectsCount = myProjects.filter(p => (p.progreso === 100 || p.estado === 'completado')).length;

        // Pending logic: count pending tasks plus projects that are not completed and have no completed-all state
        const pendingTasksCount = myTasks.filter(t => !t.completada).length;
        const pendingProjectsCount = myProjects.filter(p => {
          // project is pending if not completed and either has no tasks or still has incomplete tasks
          if (p.progreso === 100 || p.estado === 'completado') return false;
          if (!p.tareas || p.tareas.length === 0) return true;
          // if tareasTotales / tareasCompletadas fields exist, use them; otherwise infer from tareas
          const total = p.tareasTotales || p.tareas.length || 0;
          const completed = p.tareasCompletadas || p.tareas.filter(t => t.completada).length || 0;
          return completed < total;
        }).length;

        setStats({
          projects: myProjects.length,
          tasks: myTasks.length,
          pending: pendingTasksCount + pendingProjectsCount,
          completed: completedTasksCount + completedProjectsCount
        });

        const sortedProjects = [...myProjects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentProjects(sortedProjects.slice(0, 3));
      }
    };

    loadData();

    const onDataChanged = () => {
      loadData();
    };
    try {
      if (typeof window !== 'undefined') {
        window.addEventListener('studyhub:data-changed', onDataChanged);
      }
    } catch (error) { void error; }

    return () => {
      try {
        if (typeof window !== 'undefined') {
          window.removeEventListener('studyhub:data-changed', onDataChanged);
        }
      } catch (error) { void error; }
    };
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Menú Principal
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenido a tu panel de control de StudyHub, {currentUser?.name}
        </p>
      </div>
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/*RECUADRO DE PROYECTOS */}
        <Link to="/dashboard/proyectos" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Proyectos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.projects}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Link>
        {/*RECUADRO DE TAREAS*/}
        <Link to="/dashboard/tareas" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tareas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.tasks}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </Link>
        {/*RECUADRO DE PENDIENTES*/}
        <Link to="/dashboard/tareas" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
        {/*RECUADRO DE COMPLETADOS*/}
        <Link to="/dashboard/tareas" className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completados</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completed}</p>
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
            <Link to="/dashboard/proyectos" className="text-sky-600 hover:text-sky-700 font-medium text-sm">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((proyecto) => (
                <Link to={`/dashboard/proyectos/${proyecto.id}`} key={proyecto.id} className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {proyecto.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {proyecto.descripcion.length > 60 ? `${proyecto.descripcion.substring(0, 60)}...` : proyecto.descripcion}
                      </p>

                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Progreso</span>
                          <span className="text-xs font-semibold text-gray-700">{proyecto.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-sky-600 h-1.5 rounded-full"
                            style={{ width: `${proyecto.progreso}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          📅 Entrega: {proyecto.fechaEntrega ? new Date(proyecto.fechaEntrega).toLocaleDateString() : 'Sin fecha'}
                        </div>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${proyecto.estado === 'activo' ? 'bg-blue-100 text-blue-700' :
                        proyecto.estado === 'completado' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                      }`}>
                      {proyecto.estado.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay proyectos recientes</p>
            )}
          </div>
        </div>
        {/* Actividad reciente */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            {/* Placeholder para actividad futura */}
            <p className="text-gray-500 text-sm italic">Próximamente: Historial de actividad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
