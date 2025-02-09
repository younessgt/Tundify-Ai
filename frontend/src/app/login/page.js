import LoginForm from "@/components/auth/LoginForm";

function Login() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container */}
      <div className=" flex  w-[1600px] h-full mx-auto">
        {/*Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
