import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    getProjectById,
    updateProject,
    addTask,
    toggleTask,
    deleteTask,
    addCollaborator,
    removeCollaborator
} from "../../helpers/projects";
import { getAllUsers, getCurrentUser } from "../../helpers/auth";

const ProyectoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para formularios
    const [newTask, setNewTask] = useState("");
    const [collaboratorEmail, setCollaboratorEmail] = useState("");
    const [msg, setMsg] = useState({ type: "", content: "" });

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        loadProject();
    }, [id]);

    const loadProject = () => {
        const foundProject = getProjectById(Number(id));
        setProyecto(foundProject);
        setLoading(false);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        const updatedProject = updateProject(proyecto.id, { estado: newStatus });
        setProyecto(updatedProject);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const updatedProject = addTask(proyecto.id, { nombre: newTask });
        setProyecto(updatedProject);
        setNewTask("");
    };

    const handleToggleTask = (taskId) => {
        const updatedProject = toggleTask(proyecto.id, taskId);
        setProyecto(updatedProject);
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm("¿Eliminar tarea?")) {
            const updatedProject = deleteTask(proyecto.id, taskId);
            setProyecto(updatedProject);
        }
    };

    const handleAddCollaborator = (e) => {
        e.preventDefault();
        setMsg({ type: "", content: "" });

        const allUsers = getAllUsers();
        const userToAdd = allUsers.find(u => u.email === collaboratorEmail);

        if (!userToAdd) {
            setMsg({ type: "error", content: "Usuario no encontrado" });
            return;
        }

        if (userToAdd.id === proyecto.userId) {
            setMsg({ type: "error", content: "El creador del proyecto ya es colaborador" });
            return;
        }

        if (proyecto.colaboradores?.some(c => c.id === userToAdd.id)) {
            setMsg({ type: "error", content: "El usuario ya es colaborador" });
            return;
        }

        const updatedProject = addCollaborator(proyecto.id, userToAdd);
        if (updatedProject) {
            setProyecto(updatedProject);
            setCollaboratorEmail("");
            setMsg({ type: "success", content: "Colaborador agregado correctamente" });
            setTimeout(() => setMsg({ type: "", content: "" }), 3000);
        }
    };

    const handleRemoveCollaborator = (userId) => {
        if (window.confirm("¿Eliminar colaborador?")) {
            const updatedProject = removeCollaborator(proyecto.id, userId);
            setProyecto(updatedProject);
        }
    };

    if (loading) return <div className="p-6 text-center">Cargando...</div>;
    if (!proyecto) return <div className="p-6 text-center">Proyecto no encontrado</div>;

    const isCreator = currentUser?.id === proyecto.userId;

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to="/dashboard/proyectos" className="text-sky-600 hover:text-sky-800 flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver a Proyectos
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">{proyecto.nombre}</h1>
                        <p className="text-gray-600 text-lg">{proyecto.descripcion}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Estado:</span>
                        <select
                            value={proyecto.estado}
                            onChange={handleStatusChange}
                            className={`px-3 py-1 rounded-md text-sm font-bold border-none focus:ring-2 focus:ring-sky-500 cursor-pointer ${proyecto.estado === 'activo' ? 'bg-blue-100 text-blue-700' :
                                proyecto.estado === 'completado' ? 'bg-green-100 text-green-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}
                        >
                            <option value="activo">Activo</option>
                            <option value="pausado">Pausado</option>
                            <option value="completado">Completado</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna Principal: Tareas */}
                <div className="md:col-span-2 space-y-6">
                    {/* Progreso */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Progreso General</h2>
                        <div className="mb-2 flex justify-between text-sm text-gray-600">
                            <span>{proyecto.tareasCompletadas} de {proyecto.tareasTotales} tareas completadas</span>
                            <span>{proyecto.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-sky-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${proyecto.progreso}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Tareas */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Tareas</h2>
                        </div>

                        <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
                            <input
                                type="text"
                                placeholder="Nueva tarea..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                            >
                                Agregar
                            </button>
                        </form>

                        <div className="space-y-3">
                            {proyecto.tareas && proyecto.tareas.length > 0 ? (
                                proyecto.tareas.map(tarea => (
                                    <div key={tarea.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={tarea.completada}
                                                onChange={() => handleToggleTask(tarea.id)}
                                                className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
                                            />
                                            <span className={`${tarea.completada ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {tarea.nombre}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTask(tarea.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No hay tareas en este proyecto</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Info y Colaboradores */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Información</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500">Fecha de Inicio</p>
                                <p className="font-medium">{new Date(proyecto.fechaCreacion).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Fecha de Entrega</p>
                                <p className="font-medium">{new Date(proyecto.fechaEntrega).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Colaboradores</h3>

                        {isCreator && (
                            <form onSubmit={handleAddCollaborator} className="mb-4">
                                <div className="mb-2">
                                    <input
                                        type="email"
                                        placeholder="Email del usuario..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        value={collaboratorEmail}
                                        onChange={(e) => setCollaboratorEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-sky-100 text-sky-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors"
                                >
                                    Añadir Colaborador
                                </button>
                                {msg.content && (
                                    <p className={`text-xs mt-2 ${msg.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                        {msg.content}
                                    </p>
                                )}
                            </form>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {(() => {
                                            const allUsers = getAllUsers();
                                            const creator = allUsers.find(u => u.id === proyecto.userId);
                                            return creator ? creator.name.charAt(0).toUpperCase() : "C";
                                        })()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {(() => {
                                                const allUsers = getAllUsers();
                                                const creator = allUsers.find(u => u.id === proyecto.userId);
                                                return creator ? creator.name : "Creador desconocido";
                                            })()}
                                            <span className="text-xs text-sky-600 ml-2 font-normal">(Propietario)</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(() => {
                                                const allUsers = getAllUsers();
                                                const creator = allUsers.find(u => u.id === proyecto.userId);
                                                return creator ? creator.email : "";
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {proyecto.colaboradores?.map(colab => (
                                <div key={colab.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {colab.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{colab.name}</p>
                                            <p className="text-xs text-gray-500">{colab.email}</p>
                                        </div>
                                    </div>
                                    {isCreator && (
                                        <button
                                            onClick={() => handleRemoveCollaborator(colab.id)}
                                            className="text-red-400 hover:text-red-600"
                                            title="Eliminar colaborador"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}

                            {(!proyecto.colaboradores || proyecto.colaboradores.length === 0) && (
                                <p className="text-xs text-gray-500 text-center py-2">No hay colaboradores</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProyectoDetalle;
