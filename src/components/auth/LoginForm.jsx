export default function LoginForm() {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden  ">
      {/*container */}
      <div className="max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-md">
        {/*heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-3xl font-bold mt-6">Welcome Back</h2>
          <p className="text-sm mt-2"> Sign In</p>
        </div>
        {/*form */}
        <form className="space-y-6"> </form>
      </div>
    </div>
  );
}
