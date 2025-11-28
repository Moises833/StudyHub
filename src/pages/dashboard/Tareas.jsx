import { useState } from "react";

const Tareas = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("todos");

    // Mock data for tasks
    const tareas = [
        {
            id: 1,
            titulo: "Diseñar base de datos",
            proyecto: "Sistema de Gestión Académica",
            prioridad: "alta",
            estado: "pendiente",
            fechaLimite: "2024-02-15",
            asignadoA: "Davi",
        },
        {
            id: 2,
            titulo: "Implementar autenticación",
            proyecto: "Sistema de Gestión Académica",
            prioridad: "alta",
            estado: "en_progreso",
            fechaLimite: "2024-02-20",
            asignadoA: "Davi",
        },
        {
            id: 3,
            titulo: "Crear wireframes",
            proyecto: "Aplicación Móvil Educativa",
            prioridad: "media",
            estado: "completado",
            fechaLimite: "2024-01-30",
            asignadoA: "Davi",
        },
        {
            id: 4,
            titulo: "Redactar documentación API",
            proyecto: "Plataforma de E-learning",
            prioridad: "baja",
            estado: "pendiente",
            fechaLimite: "2024-03-01",
            asignadoA: "Davi",
        },
        {
            id: 5,
            titulo: "Tests unitarios",
            proyecto: "Sistema de Evaluación Online",
            prioridad: "media",
            estado: "en_progreso",
            fechaLimite: "2024-02-25",
            asignadoA: "Davi",
        },
    ];

    const getPriorityColor = (prioridad) => {
        switch (prioridad) {
            case "alta":
                return "bg-red-100 text-red-700";
            case "media":
                return "bg-yellow-100 text-yellow-700";
            case "baja":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case "pendiente":
                return "bg-gray-100 text-gray-700";
            case "en_progreso":
                return "bg-blue-100 text-blue-700";
            case "completado":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (estado) => {
        switch (estado) {
            case "pendiente":
                return "Pendiente";
            case "en_progreso":
                return "En Progreso";
            case "completado":
                return "Completado";
            default:
                return estado;
        }
    };

    const filteredTareas = tareas.filter((tarea) => {
        const matchesSearch =
            tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tarea.proyecto.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "todos" || tarea.estado === filterStatus;
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
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Tareas</h1>
                        <p className="text-gray-600 text-lg">
                            Administra tus actividades diarias y pendientes
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
                        Nueva Tarea
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar tareas..."
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
                        <option value="pendiente">Pendientes</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="completado">Completadas</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-medium">En Progreso</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {tareas.filter((t) => t.estado === "en_progreso").length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-sm font-medium">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {tareas.filter((t) => t.estado === "pendiente").length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-medium">Completadas</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {tareas.filter((t) => t.estado === "completado").length}
                    </p>
                </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {filteredTareas.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-600 text-lg">
                            No se encontraron tareas con los filtros seleccionados
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Tarea
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Proyecto
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Prioridad
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Fecha Límite
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTareas.map((tarea) => (
                                    <tr key={tarea.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{tarea.titulo}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {tarea.proyecto}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                                    tarea.prioridad
                                                )}`}
                                            >
                                                {tarea.prioridad.charAt(0).toUpperCase() +
                                                    tarea.prioridad.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    tarea.estado
                                                )}`}
                                            >
                                                {getStatusLabel(tarea.estado)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(tarea.fechaLimite)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="text-sky-600 hover:text-sky-800 font-medium text-sm">
                                                    Editar
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tareas;
