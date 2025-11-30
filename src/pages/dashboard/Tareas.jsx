import { useState } from "react";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllTasksByUser, toggleTask, deleteTask } from "../../helpers/projects";
import { getCurrentUser } from "../../helpers/auth";

const Tareas = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("todos");
    const [tareas, setTareas] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            loadTasks(user.id);
        }
    }, []);

    const loadTasks = (userId) => {
        const data = getAllTasksByUser(userId);
        // Filtrar solo las tareas de proyectos creados por el usuario
        const myTasks = data.filter(t => t.projectUserId === userId);
        setTareas(myTasks);
    };

    const handleToggleTask = (projectId, taskId) => {
        toggleTask(projectId, taskId);
        if (currentUser) loadTasks(currentUser.id);
    };

    const handleDeleteTask = (projectId, taskId) => {
        if (window.confirm("¿Eliminar tarea?")) {
            deleteTask(projectId, taskId);
            if (currentUser) loadTasks(currentUser.id);
        }
    };

    const getStatusColor = (completada) => {
        return completada ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
    };

    const getStatusLabel = (completada) => {
        return completada ? "Completada" : "Pendiente";
    };

    const filteredTareas = tareas.filter((tarea) => {
        const matchesSearch =
            tarea.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tarea.projectName.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filterStatus === "pendiente") matchesFilter = !tarea.completada;
        if (filterStatus === "completada") matchesFilter = tarea.completada;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "-";
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
                        <option value="completada">Completadas</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-medium">Total Tareas</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {tareas.length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-sm font-medium">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {tareas.filter((t) => !t.completada).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-medium">Completadas</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                        {tareas.filter((t) => t.completada).length}
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
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Fecha Creación
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
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={tarea.completada}
                                                    onChange={() => handleToggleTask(tarea.projectId, tarea.id)}
                                                    className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
                                                />
                                                <p className={`font-medium ${tarea.completada ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                    {tarea.nombre}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <Link to={`/dashboard/proyectos/${tarea.projectId}`} className="hover:text-sky-600 hover:underline">
                                                {tarea.projectName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    tarea.completada
                                                )}`}
                                            >
                                                {getStatusLabel(tarea.completada)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(tarea.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteTask(tarea.projectId, tarea.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                >
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
