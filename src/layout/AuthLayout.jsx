import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto md:grid md:grid-cols-2 md:mt-24 gap-6 md:gap-10 items-center p-4 sm:p-5 min-h-screen flex flex-col justify-center">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
