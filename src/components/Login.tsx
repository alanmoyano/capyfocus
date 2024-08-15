export default function Login() {
  return (
    <div className="flex-2 flex h-[60vh] w-[80vw] flex-row rounded-[10rem] bg-slate-200 p-10">
      <div className="m-auto">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHhvb3d3b2M3M3l6dHVxdjRzcmc2OTE5bjdtZGp3MXlnNnJ2d2RxeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/sbW2AUZLt98WoenLSl/giphy.webp"
          alt="Capy!"
        />
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
            <label>Password</label>
            <input type="password" placeholder="superSecurePassword" />
          </div>

          <button
            className="m-auto flex items-end justify-end rounded bg-slate-800 py-2 px-4 text-white hover:bg-slate-900"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
