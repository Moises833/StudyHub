
const PROJECTS_KEY = "studyhub_projects";
const CALENDAR_KEY = "studyhub_events";

// Obtener todos los proyectos
const getAllProjects = () => {
    const projects = localStorage.getItem(PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
};

// Guardar proyectos
const saveProjects = (projects) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

// --- CALENDAR / EVENTS ---
const getAllEvents = () => {
    const events = localStorage.getItem(CALENDAR_KEY);
    return events ? JSON.parse(events) : [];
};

const saveEvents = (events) => {
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(events));
};

export const addEvent = (eventData) => {
    const events = getAllEvents();
    const newEvent = {
        id: Date.now(),
        ...eventData,
        // ensure userId is explicit when provided
        userId: eventData.userId || null,
    };
    events.push(newEvent);
    saveEvents(events);
    try {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
        }
    } catch (error) { void error; }
    return newEvent;
};

// Get events; if userId provided, return only events visible to that user
export const getEvents = (userId) => {
    const events = getAllEvents();
    if (!userId) return events;

    // Projects the user has access to (owner or collaborator)
    const userProjects = getProjectsByUser(userId);
    const userProjectIds = userProjects.map(p => String(p.id));

    return events.filter(e => {
        if (e.userId && String(e.userId) === String(userId)) return true;
        if (e.projectId && userProjectIds.includes(String(e.projectId))) return true;
        return false;
    });
};

// Obtener proyectos de un usuario específico (propios + colaboraciones)
export const getProjectsByUser = (userId) => {
    const allProjects = getAllProjects();
    return allProjects.filter(project =>
        String(project.userId) === String(userId) ||
        (project.colaboradores && project.colaboradores.some(c => String(c.id) === String(userId)))
    );
};

// Obtener un proyecto por ID
export const getProjectById = (projectId) => {
    const allProjects = getAllProjects();
    return allProjects.find(project => String(project.id) === String(projectId));
};

// Crear un nuevo proyecto
export const createProject = (projectData) => {
    const allProjects = getAllProjects();

    const newProject = {
        id: Date.now(),
        ...projectData,
        createdAt: new Date().toISOString(),
        progreso: 0,
        tareasCompletadas: 0,
        tareasTotales: 0,
        tareas: [],
        colaboradores: []
    };

    allProjects.push(newProject);
    saveProjects(allProjects);

    // Sync project to calendar: create an event for the project (uses fechaEntrega if provided)
    try {
        const eventDateIso = projectData.fechaEntrega || newProject.createdAt;
        addEvent({
            title: newProject.nombre || "Nuevo Proyecto",
            date: eventDateIso,
            time: projectData.hora || "",
            type: "proyecto",
            projectId: newProject.id,
            userId: newProject.userId || projectData.userId || null,
        });
    } catch (e) {
        // ignore calendar sync errors
        console.error("Error syncing project to calendar", e);
    }

    try {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
        }
    } catch (error) { void error; }

    return newProject;
};

// Eliminar un proyecto
export const deleteProject = (projectId) => {
    const allProjects = getAllProjects();
    const filteredProjects = allProjects.filter(project => project.id !== projectId);
    saveProjects(filteredProjects);
    try {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
        }
    } catch (error) { void error; }
};

// Actualizar un proyecto
export const updateProject = (projectId, updates) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        allProjects[index] = { ...allProjects[index], ...updates };
        saveProjects(allProjects);
        // Debug: log updated project and total projects to help trace persistence issues
        try {
            if (typeof console !== 'undefined' && console.debug) {
                console.debug('[studyhub] updateProject saved:', allProjects[index]);
                console.debug('[studyhub] all projects now:', allProjects.length);
            }
        } catch (err) { void err; }
        try {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
            }
        } catch (error) { void error; }
        return allProjects[index];
    }
    return null;
};

// --- TAREAS ---

export const addTask = (projectId, taskData) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        const project = allProjects[index];
        const newTask = {
            id: Date.now(),
            ...taskData,
            completada: false,
            createdAt: new Date().toISOString()
        };

        if (!project.tareas) project.tareas = [];
        project.tareas.push(newTask);

        // Actualizar progreso
        project.tareasTotales = project.tareas.length;
        project.tareasCompletadas = project.tareas.filter(t => t.completada).length;
        project.progreso = project.tareasTotales === 0 ? 0 : Math.round((project.tareasCompletadas / project.tareasTotales) * 100);

        saveProjects(allProjects);
        try {
            if (typeof console !== 'undefined' && console.debug) {
                console.debug('[studyhub] addTask saved for projectId=', projectId, 'task=', newTask);
            }
        } catch (err) { void err; }
        try {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
            }
        } catch (error) { void error; }
        return project;
    }
    return null;
};

export const toggleTask = (projectId, taskId) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.tareas) return null;

        const taskIndex = project.tareas.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            project.tareas[taskIndex].completada = !project.tareas[taskIndex].completada;

            // Actualizar progreso
            project.tareasCompletadas = project.tareas.filter(t => t.completada).length;
            project.progreso = project.tareasTotales === 0 ? 0 : Math.round((project.tareasCompletadas / project.tareasTotales) * 100);

            saveProjects(allProjects);
            try {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
                }
            } catch (error) { void error; }
            return project;
        }
    }
    return null;
};

export const deleteTask = (projectId, taskId) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.tareas) return null;

        project.tareas = project.tareas.filter(t => t.id !== taskId);

        // Actualizar progreso
        project.tareasTotales = project.tareas.length;
        project.tareasCompletadas = project.tareas.filter(t => t.completada).length;
        project.progreso = project.tareasTotales === 0 ? 0 : Math.round((project.tareasCompletadas / project.tareasTotales) * 100);

        saveProjects(allProjects);
        try {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
            }
        } catch (error) { void error; }
        return project;
    }
    return null;
};

// --- COLABORADORES ---

export const addCollaborator = (projectId, user) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.colaboradores) project.colaboradores = [];

        // Evitar duplicados
        if (!project.colaboradores.some(c => c.id === user.id)) {
            project.colaboradores.push({
                id: user.id,
                name: user.name,
                email: user.email
            });
            saveProjects(allProjects);
            try {
                if (typeof console !== 'undefined' && console.debug) {
                    console.debug('[studyhub] addCollaborator saved for projectId=', projectId, 'collaborator=', user.id);
                }
            } catch (err) { void err; }
            try {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
                }
            } catch (error) { void error; }
            return project;
        }
    }
    return null;
};

export const removeCollaborator = (projectId, userId) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.colaboradores) return null;

        project.colaboradores = project.colaboradores.filter(c => c.id !== userId);
        saveProjects(allProjects);
        try {
            if (typeof console !== 'undefined' && console.debug) {
                console.debug('[studyhub] removeCollaborator saved for projectId=', projectId, 'removedUserId=', userId);
            }
        } catch (err) { void err; }
        try {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
            }
        } catch (error) { void error; }
        return project;
    }
    return null;
};

// Agregar archivo/metadatos a un proyecto (persistir referencia local)
export const addProjectFile = (projectId, fileMeta) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => String(p.id) === String(projectId));

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.files) project.files = [];

        project.files.push(fileMeta);

        // Al guardar un archivo, asumimos que el proyecto tiene progreso completo
        project.progreso = 100;
        // Opcional: actualizar contadores de tareas si se desea
        project.tareasTotales = project.tareasTotales || (project.tareas ? project.tareas.length : 0);
        project.tareasCompletadas = project.tareasCompletadas || (project.tareas ? project.tareas.filter(t => t.completada).length : 0);

        saveProjects(allProjects);
        try {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
            }
        } catch (error) { void error; }
        return project;
    }
    return null;
};

// Obtener todas las tareas de un usuario (de todos sus proyectos)
export const getAllTasksByUser = (userId) => {
    const userProjects = getProjectsByUser(userId);
    let allTasks = [];

    userProjects.forEach(project => {
        if (project.tareas && project.tareas.length > 0) {
            const projectTasks = project.tareas.map(task => ({
                ...task,
                projectId: project.id,
                projectName: project.nombre,
                projectStatus: project.estado,
                projectUserId: project.userId // Added to allow filtering by project creator
            }));
            allTasks = [...allTasks, ...projectTasks];
        }
    });

    return allTasks;
};
