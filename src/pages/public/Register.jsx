import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir al login o a una página de éxito
        navigate("/");
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <>
      <div className="md:p-12 py-6 px-4 sm:px-8 rounded-lg mb-8 md:mb-0 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-gray-200">
          StudyHub
        </h1>
        <span className="text-gray-300 text-lg sm:text-xl md:text-2xl font-semibold">
          Únete a nuestra comunidad académica
        </span>
      </div>
      <div className="bg-gray-200 p-6 sm:p-8 md:p-10 w-full max-w-sm mx-auto rounded-xl shadow-2xl transition-all duration-300">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 tracking-tight">
            REGISTRO
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Campo Nombre */}
          <div className="mb-4 sm:mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Nombre Completo
            </label>
            <input
              className="border-b-2 border-gray-300 rounded-lg w-full p-2.5 sm:p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-sky-900 focus:ring-1 focus:ring-sky-900 transition duration-150 ease-in-out text-sm sm:text-base"
              type="text"
              name="name"
              id="name"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Email */}
          <div className="mb-4 sm:mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Correo Electrónico
            </label>
            <input
              className="border-b-2 border-gray-300 rounded-lg w-full p-2.5 sm:p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-sky-900 focus:ring-1 focus:ring-sky-900 transition duration-150 ease-in-out text-sm sm:text-base"
              type="email"
              name="email"
              id="email"
              placeholder="tu.correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mb-4 sm:mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="border-b-2 border-gray-300 rounded-lg w-full p-2.5 sm:p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-sky-900 focus:ring-1 focus:ring-sky-900 transition duration-150 ease-in-out text-sm sm:text-base"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="mb-4 sm:mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="password_confirmation"
            >
              Confirmar Contraseña
            </label>
            <input
              className="border-b-2 border-gray-300 rounded-lg w-full p-2.5 sm:p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-sky-900 focus:ring-1 focus:ring-sky-900 transition duration-150 ease-in-out text-sm sm:text-base"
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botón de Submit */}
          <button
            className="w-full bg-sky-900 text-white py-2.5 sm:py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-sky-700 transition duration-200 ease-in-out shadow-md shadow-blue-500/50 transform hover:scale-[1.01] hover:cursor-pointer text-sm sm:text-base"
            type="submit"
          >
            Crear Cuenta
          </button>

          {/* Enlace de Login */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-sky-900 text-xs sm:text-sm">
              ¿Ya tienes una cuenta?
              <Link
                to="/"
                className="text-sky-900 hover:text-sky-700 font-semibold ml-1"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
