import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    getProjectById,
    updateProject,
    addTask,
    toggleTask,
    deleteTask,
    addCollaborator,
    removeCollaborator,
    addProjectFile
} from "../../helpers/projects";
import { getAllUsers, getCurrentUser } from "../../helpers/auth";
import { speak } from "../../helpers/speech";

const ProyectoDetalle = () => {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para formularios
    const [newTask, setNewTask] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [collaboratorEmail, setCollaboratorEmail] = useState("");
    const [msg, setMsg] = useState({ type: "", content: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

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
        if (updatedProject) {
            setProyecto(updatedProject);
        } else {
            // If updateProject failed to find the project, keep local state but show an error message
            setMsg({ type: 'error', content: 'No se pudo actualizar el proyecto (problema de persistencia).' });
            setTimeout(() => setMsg({ type: '', content: '' }), 3500);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const updatedProject = addTask(proyecto.id, {
            nombre: newTask,
            descripcion: taskDescription,
            creador: currentUser ? currentUser.name : "Desconocido"
        });
        setProyecto(updatedProject);
        setNewTask("");
        setTaskDescription("");
        speak(`Tarea ${newTask} agregada`);
    };

    const handleToggleTask = (taskId) => {
        const updatedProject = toggleTask(proyecto.id, taskId);
        setProyecto(updatedProject);

        const task = updatedProject.tareas.find(t => t.id === taskId);
        if (task) {
            speak(task.completada ? "Tarea completada" : "Tarea pendiente");
        }
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm("¿Eliminar tarea?")) {
            const updatedProject = deleteTask(proyecto.id, taskId);
            setProyecto(updatedProject);
            speak("Tarea eliminada");
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
            speak(`Colaborador ${userToAdd.name} agregado`);
        }
    };

    const handleRemoveCollaborator = (userId) => {
        if (window.confirm("¿Eliminar colaborador?")) {
            const updatedProject = removeCollaborator(proyecto.id, userId);
            setProyecto(updatedProject);
            speak("Colaborador eliminado");
        }
    };

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0];
        setSelectedFile(f || null);
        try { if (typeof console !== 'undefined' && console.debug) console.debug('[studyhub] handleFileChange selected:', f); } catch (e) { void e; }
        setUploadProgress(0);
    };

    const handleFileButtonClick = () => {
        if (uploading) return;
        if (!selectedFile) {
            if (fileInputRef && fileInputRef.current) {
                try {
                    fileInputRef.current.click();
                } catch (err) {
                    try { console.error('[studyhub] could not open file selector', err); } catch (e) { void e; }
                }
            } else {
                try { console.warn('[studyhub] fileInputRef not ready'); } catch (e) { void e; }
            }
            return;
        }
        startUpload();
    };

    const startUpload = () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadProgress(0);

        // Read file data if small, otherwise only persist metadata
        const reader = new FileReader();
        let readResult = null;

        reader.onload = () => {
            readResult = reader.result;
        };

        reader.onerror = () => {
            readResult = null;
        };

        // Start reading (this is quick for small files)
        try {
            reader.readAsDataURL(selectedFile);
        } catch (err) { void err; }

        // Simulate upload progress until read completes
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const next = Math.min(95, prev + Math.floor(Math.random() * 10) + 5);
                return next;
            });
        }, 200);

        // Poll for reader completion
        const completeCheck = setInterval(() => {
            // finish when reader finished (result set)
            if (readResult !== null) {
                clearInterval(interval);
                clearInterval(completeCheck);
                setUploadProgress(100);
                // prepare metadata
                const meta = {
                    id: Date.now(),
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    createdAt: new Date().toISOString(),
                };
                // include data only if small (<1MB)
                if (selectedFile.size <= 1024 * 1024 && readResult) {
                    meta.dataUrl = readResult;
                }

                const updatedProject = addProjectFile(proyecto.id, meta);
                if (updatedProject) {
                    setProyecto(updatedProject);
                }

                setUploading(false);
                setSelectedFile(null);
                setUploadProgress(0);
            }
        }, 300);
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
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Archivos del Proyecto</h3>

                        <div className="mb-3">
                            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="w-full" />
                        </div>

                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (uploading) return;
                                    if (!selectedFile) {
                                        try { fileInputRef.current && fileInputRef.current.click(); } catch (e) { void e; }
                                        return;
                                    }
                                    startUpload();
                                }}
                                className="flex-1 bg-sky-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50"
                            >
                                {uploading ? 'Subiendo...' : (selectedFile ? 'Subir archivo' : 'Seleccionar archivo')}
                            </button>
                        </div>

                        {uploading && (
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                <div className="bg-sky-600 h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                        )}

                        <div className="text-xs text-gray-600">
                            {proyecto.files && proyecto.files.length > 0 ? (
                                <ul className="space-y-2">
                                    {proyecto.files.map(f => (
                                        <li key={f.id} className="flex items-center justify-between">
                                            <div className="truncate pr-2">{f.name} <span className="text-gray-400">({Math.round((f.size || 0) / 1024)} KB)</span></div>
                                            {f.dataUrl ? (
                                                <a href={f.dataUrl} download={f.name} className="text-sky-600 hover:underline text-sm">Descargar</a>
                                            ) : (
                                                <span className="text-xs text-gray-400">(metadatos)</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-500">No hay archivos subidos</p>
                            )}
                        </div>
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

                        <form onSubmit={handleAddTask} className="mb-6 space-y-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nombre de la tarea..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Descripción (opcional)..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                                >
                                    Agregar
                                </button>
                            </div>
                        </form>

                        <div className="space-y-3">
                            {proyecto.tareas && proyecto.tareas.length > 0 ? (
                                proyecto.tareas.map(tarea => (
                                    <div key={tarea.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-start gap-3 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={tarea.completada}
                                                onChange={() => handleToggleTask(tarea.id)}
                                                className="w-5 h-5 mt-1 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <p className={`font-medium ${tarea.completada ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                    {tarea.nombre}
                                                </p>
                                                {tarea.descripcion && (
                                                    <p className={`text-sm mt-1 ${tarea.completada ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {tarea.descripcion}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Agregado por: {tarea.creador || "Desconocido"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleTask(tarea.id)}
                                            className={`cursor-pointer text-sm font-medium mr-2 ${tarea.completada ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                                        >
                                            {tarea.completada ? "Reabrir" : "Completar"}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(tarea.id)}
                                            className="cursor-pointer text-red-500 hover:text-red-700 p-1 ml-2"
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
