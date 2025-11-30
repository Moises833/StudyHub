
const PROJECTS_KEY = "studyhub_projects";

// Obtener todos los proyectos
const getAllProjects = () => {
    const projects = localStorage.getItem(PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
};

// Guardar proyectos
const saveProjects = (projects) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

// Obtener proyectos de un usuario específico (propios + colaboraciones)
export const getProjectsByUser = (userId) => {
    const allProjects = getAllProjects();
    return allProjects.filter(project =>
        project.userId === userId ||
        (project.colaboradores && project.colaboradores.some(c => c.id === userId))
    );
};

// Obtener un proyecto por ID
export const getProjectById = (projectId) => {
    const allProjects = getAllProjects();
    return allProjects.find(project => project.id === projectId);
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

    return newProject;
};

// Eliminar un proyecto
export const deleteProject = (projectId) => {
    const allProjects = getAllProjects();
    const filteredProjects = allProjects.filter(project => project.id !== projectId);
    saveProjects(filteredProjects);
};

// Actualizar un proyecto
export const updateProject = (projectId, updates) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => p.id === projectId);

    if (index !== -1) {
        allProjects[index] = { ...allProjects[index], ...updates };
        saveProjects(allProjects);
        return allProjects[index];
    }
    return null;
};

// --- TAREAS ---

export const addTask = (projectId, taskData) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => p.id === projectId);

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
        return project;
    }
    return null;
};

export const toggleTask = (projectId, taskId) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => p.id === projectId);

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
            return project;
        }
    }
    return null;
};

export const deleteTask = (projectId, taskId) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => p.id === projectId);

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.tareas) return null;

        project.tareas = project.tareas.filter(t => t.id !== taskId);

        // Actualizar progreso
        project.tareasTotales = project.tareas.length;
        project.tareasCompletadas = project.tareas.filter(t => t.completada).length;
        project.progreso = project.tareasTotales === 0 ? 0 : Math.round((project.tareasCompletadas / project.tareasTotales) * 100);

        saveProjects(allProjects);
        return project;
    }
    return null;
};

// --- COLABORADORES ---

export const addCollaborator = (projectId, user) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => p.id === projectId);

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
            return project;
        }
    }
    return null;
};

export const removeCollaborator = (projectId, userId) => {
    const allProjects = getAllProjects();
    const index = allProjects.findIndex(p => p.id === projectId);

    if (index !== -1) {
        const project = allProjects[index];
        if (!project.colaboradores) return null;

        project.colaboradores = project.colaboradores.filter(c => c.id !== userId);
        saveProjects(allProjects);
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
