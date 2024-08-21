import Ojo from "./icons/Ojo";

export default function Login() {
  return (
    <main className="h-screen w-[80vw] rounded-[10rem] bg-slate-200 p-10 text-black md:h-[60vh]">
      <div className="flex flex-col md:flex-row">
        <div className="m-auto">
          <img src="/girando.gif" alt="Capy!" />
        </div>

        <div className="m-auto">
          <div className="mb-8">
            <h1>Inicie sesión en Capyfocus</h1>
            <p className="text-lg text-slate-900">
              Ingrese sus credenciales para continuar
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col">
              <label>Username</label>
              <input type="text" placeholder="breightend" />
            </div>

            <div className="flex flex-col">
              <label className="block">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => {
                    const field = document.getElementById(
                      "password",
                    ) as HTMLInputElement;

                    if (field.type === "password") field.type = "text";
                    else field.type = "password";
                  }}
                  className="text-primary absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-3 focus:text-blue-600 focus:outline-none dark:focus:text-blue-500"
                >
                  <Ojo />
                </button>
              </div>
            </div>

            <button
              className="m-auto flex items-end justify-end rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-900"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
