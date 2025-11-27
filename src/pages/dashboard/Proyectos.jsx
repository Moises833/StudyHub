import { useState } from "react";

const Proyectos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Datos de ejemplo de proyectos
  const proyectos = [
    {
      id: 1,
      nombre: "Sistema de Gestión Académica",
      descripcion: "Desarrollo de una plataforma para gestionar estudiantes y calificaciones",
      estado: "activo",
      fechaCreacion: "2024-01-15",
      fechaEntrega: "2024-03-30",
      progreso: 65,
      tareasCompletadas: 13,
      tareasTotales: 20,
    },
    {
      id: 2,
      nombre: "Aplicación Móvil Educativa",
      descripcion: "App para dispositivos móviles con contenido educativo interactivo",
      estado: "activo",
      fechaCreacion: "2024-02-01",
      fechaEntrega: "2024-04-15",
      progreso: 40,
      tareasCompletadas: 8,
      tareasTotales: 20,
    },
    {
      id: 3,
      nombre: "Plataforma de E-learning",
      descripcion: "Sistema completo de aprendizaje en línea con videoconferencias",
      estado: "completado",
      fechaCreacion: "2023-11-10",
      fechaEntrega: "2024-01-20",
      progreso: 100,
      tareasCompletadas: 25,
      tareasTotales: 25,
    },
    {
      id: 4,
      nombre: "Base de Datos de Investigación",
      descripcion: "Sistema de almacenamiento y consulta de papers académicos",
      estado: "pausado",
      fechaCreacion: "2024-01-20",
      fechaEntrega: "2024-05-10",
      progreso: 30,
      tareasCompletadas: 6,
      tareasTotales: 20,
    },
    {
      id: 5,
      nombre: "Portal de Estudiantes",
      descripcion: "Interfaz web para que los estudiantes accedan a sus recursos",
      estado: "activo",
      fechaCreacion: "2024-02-10",
      fechaEntrega: "2024-04-30",
      progreso: 55,
      tareasCompletadas: 11,
      tareasTotales: 20,
    },
    {
      id: 6,
      nombre: "Sistema de Evaluación Online",
      descripcion: "Plataforma para realizar exámenes y evaluaciones en línea",
      estado: "activo",
      fechaCreacion: "2024-01-05",
      fechaEntrega: "2024-03-20",
      progreso: 75,
      tareasCompletadas: 15,
      tareasTotales: 20,
    },
  ];

  const getStatusColor = (estado) => {
    switch (estado) {
      case "activo":
        return "bg-blue-100 text-blue-700";
      case "completado":
        return "bg-green-100 text-green-700";
      case "pausado":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (estado) => {
    switch (estado) {
      case "activo":
        return "Activo";
      case "completado":
        return "Completado";
      case "pausado":
        return "Pausado";
      default:
        return estado;
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
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
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
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {proyectos.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Activos</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {proyectos.filter((p) => p.estado === "activo").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium">Completados</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {proyectos.filter((p) => p.estado === "completado").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-medium">Pausados</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {proyectos.filter((p) => p.estado === "pausado").length}
          </p>
        </div>
      </div>

      {/* Lista de proyectos */}
      {filteredProyectos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 text-lg">
            No se encontraron proyectos con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                  {proyecto.nombre}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    proyecto.estado
                  )}`}
                >
                  {getStatusLabel(proyecto.estado)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {proyecto.descripcion.length > 100 
                  ? `${proyecto.descripcion.substring(0, 100)}...` 
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

              {/* Información adicional */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span>
                    {proyecto.tareasCompletadas} de {proyecto.tareasTotales}{" "}
                    tareas
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Entrega: {formatDate(proyecto.fechaEntrega)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Ver detalles
                </button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Proyectos;

