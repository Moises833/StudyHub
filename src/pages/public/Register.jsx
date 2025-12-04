import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../helpers/auth";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const result = registerUser({ name: form.name, email: form.email, password: form.password });
    if (!result.success) {
      setError(result.message || "Error al registrar");
      return;
    }

    // Redirigir al login después de registrarse
    navigate("/");
  };

  return (
    <>
      <div className=" md:p-12 py-4 px-8 rounded-lg mb-12 md:mb-0 ">
        <h1 className="text-6xl font-bold place-content-center mb-2 text-gray-200">StudyHub</h1>
        <span className="text-gray-300 md:text-2xl text-2xl font-semibold">Crea tu cuenta</span>
      </div>

      <div className="bg-gray-200 p-8 sm:p-10 w-full max-w-sm mx-auto rounded-xl shadow-2xl transition-all duration-300">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8 tracking-tight">REGISTRARSE</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Nombre</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} className="border-b-2 border-gray-300 rounded-lg w-full p-3 bg-gray-50 placeholder-gray-400 focus:outline-none" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Correo Electrónico</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="border-b-2 border-gray-300 rounded-lg w-full p-3 bg-gray-50 placeholder-gray-400 focus:outline-none" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className="border-b-2 border-gray-300 rounded-lg w-full p-3 bg-gray-50 placeholder-gray-400 focus:outline-none" />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm">Confirmar Contraseña</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} className="border-b-2 border-gray-300 rounded-lg w-full p-3 bg-gray-50 placeholder-gray-400 focus:outline-none" />
          </div>

          <button type="submit" className="w-full bg-sky-900 text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-sky-700 transition duration-200">Crear cuenta</button>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">¿Ya tienes cuenta? <Link to="/" className="text-sky-900 font-semibold">Inicia sesión</Link></p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
