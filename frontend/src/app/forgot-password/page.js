import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function forgotPassword() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container */}
      <div className=" flex  w-[1600px] h-full mx-auto">
        {/*Login Form */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
