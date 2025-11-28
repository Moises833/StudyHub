import { useParams, Link } from "react-router-dom";

const ConfirmAccount = () => {
  const { id } = useParams();

  return (
    <>
      <div className="md:p-12 py-6 px-4 sm:px-8 rounded-lg mb-8 md:mb-0 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-gray-200">
          StudyHub
        </h1>
        <span className="text-gray-300 text-lg sm:text-xl md:text-2xl font-semibold">
          Confirma tu cuenta
        </span>
      </div>
      <div className="bg-gray-200 p-6 sm:p-8 md:p-10 w-full max-w-sm mx-auto rounded-xl shadow-2xl transition-all duration-300">
        <form action="">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 tracking-tight">
            CONFIRMAR CUENTA
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 text-center">
            Ingresa el código de confirmación que recibiste en tu correo electrónico para activar tu cuenta.
          </p>

          {/* Campo Código de Confirmación */}
          <div className="mb-4 sm:mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="token"
            >
              Código de Confirmación
            </label>
            <input
              className="border-b-2 border-gray-300 rounded-lg w-full p-2.5 sm:p-3 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-sky-900 focus:ring-1 focus:ring-sky-900 transition duration-150 ease-in-out text-center text-xl sm:text-2xl font-mono tracking-widest"
              type="text"
              name="token"
              id="token"
              placeholder="000000"
              maxLength="6"
            />
          </div>

          {/* Botón de Submit */}
          <button
            className="w-full bg-sky-900 text-white py-2.5 sm:py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-sky-700 transition duration-200 ease-in-out shadow-md shadow-blue-500/50 transform hover:scale-[1.01] hover:cursor-pointer text-sm sm:text-base"
            type="submit"
          >
            Confirmar Cuenta
          </button>

          {/* Opción de Reenviar Código */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-gray-600 text-xs sm:text-sm mb-2">
              ¿No recibiste el código?
            </p>
            <a
              href="#"
              className="text-xs sm:text-sm text-sky-900 hover:text-sky-700 font-semibold hover:underline"
            >
              Reenviar código de confirmación
            </a>
          </div>

          {/* Enlace de Volver al Login */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-xs sm:text-sm text-sky-900 hover:text-sky-700 font-medium hover:underline"
            >
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ConfirmAccount;
