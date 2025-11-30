import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectsByUser, createProject, deleteProject } from "../../helpers/projects";
import { getCurrentUser } from "../../helpers/auth";

const Proyectos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [proyectos, setProyectos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    nombre: "",
    descripcion: "",
    fechaEntrega: "",
    estado: "activo"
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadProjects(user.id);
    }
  }, []);

  const loadProjects = (userId) => {
    const data = getProjectsByUser(userId);
    setProyectos(data);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    createProject({
      ...newProject,
      userId: currentUser.id
    });

    loadProjects(currentUser.id);
    setIsModalOpen(false);
    setNewProject({ nombre: "", descripcion: "", fechaEntrega: "", estado: "activo" });
  };

  const handleDeleteProject = (e, projectId) => {
    e.stopPropagation(); // Evitar navegar al detalle
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      deleteProject(projectId);
      if (currentUser) loadProjects(currentUser.id);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "activo": return "bg-blue-100 text-blue-700";
      case "completado": return "bg-green-100 text-green-700";
      case "pausado": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (estado) => {
    switch (estado) {
      case "activo": return "Activo";
      case "completado": return "Completado";
      case "pausado": return "Pausado";
      default: return estado;
    }
  };

  const filteredProyectos = proyectos.filter((proyecto) => {
    const matchesSearch =
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" || proyecto.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Proyectos
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona y organiza todos tus proyectos académicos
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Proyecto
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="completado">Completados</option>
            <option value="pausado">Pausados</option>
          </select>
        </div>
      </div>

      {/* Lista de proyectos */}
      {filteredProyectos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">
            {searchTerm || filterStatus !== 'todos'
              ? "No se encontraron proyectos con los filtros seleccionados"
              : "No tienes proyectos aún. ¡Crea el primero!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              onClick={() => navigate(`/dashboard/proyectos/${proyecto.id}`)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1 pr-8">
                  {proyecto.nombre}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proyecto.estado)}`}>
                  {getStatusLabel(proyecto.estado)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                {proyecto.descripcion.length > 80
                  ? `${proyecto.descripcion.substring(0, 80)}...`
                  : proyecto.descripcion}
              </p>

              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Progreso</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {proyecto.progreso}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all"
                    style={{ width: `${proyecto.progreso}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Entrega: {formatDate(proyecto.fechaEntrega)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDeleteProject(e, proyecto.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10"
                    title="Eliminar proyecto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Proyecto</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  value={newProject.nombre}
                  onChange={e => setNewProject({ ...newProject, nombre: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  rows="3"
                  value={newProject.descripcion}
                  onChange={e => setNewProject({ ...newProject, descripcion: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de Entrega</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  value={newProject.fechaEntrega}
                  onChange={e => setNewProject({ ...newProject, fechaEntrega: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyectos;

