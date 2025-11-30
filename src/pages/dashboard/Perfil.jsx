import { useState, useEffect } from "react";
import { getCurrentUser } from "../../helpers/auth";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    universidad: "",
    carrera: "",
    semestre: "",
    bio: "",
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserData(prev => ({
        ...prev,
        nombre: user.name || "",
        email: user.email || "",
        // Mantener los otros campos vacíos o con valores por defecto si no existen en el usuario
        // En una implementación real, estos datos también se guardarían en el usuario
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar los datos
    console.log("Guardando datos:", userData);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
        <p className="text-gray-600 text-lg">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="nombre"
                  value={userData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="telefono"
                  value={userData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.telefono}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Universidad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="universidad"
                  value={userData.universidad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.universidad}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrera
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="carrera"
                  value={userData.carrera}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.carrera}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semestre
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="semestre"
                  value={userData.semestre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.semestre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              ) : (
                <p className="text-gray-800">{userData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Avatar y estadísticas */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-32 h-32 bg-sky-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
              {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : "U"}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {userData.nombre}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{userData.email}</p>
            <button className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
              Cambiar Foto
            </button>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Proyectos</span>
                <span className="font-bold text-gray-800">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tareas Completadas</span>
                <span className="font-bold text-gray-800">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Eventos</span>
                <span className="font-bold text-gray-800">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

