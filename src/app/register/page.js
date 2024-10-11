import RegisterForm from "@/components/auth/RegisterForm";

function Register() {
  return (
    <div className="h-screen border-2 dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container */}
      <div className=" flex border-2 w-[1600px] h-full mx-auto">
        {/*Register Form */}
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
