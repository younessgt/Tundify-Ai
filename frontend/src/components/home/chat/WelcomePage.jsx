export default function WelcomePage() {
  return (
    <div className="dark:bg-dark_bg_2 h-full flex items-center justify-center w-full border-l dark:border-l-dark_border_2">
      <div className="-mt-2 w-[550px] flex flex-col items-center justify-center">
        <img src="/images/welcome2.png" alt="Welcome Image" />
        <div>
          <h1 className="text-2xl  font-bold text-center text-white">
            Welcome to TunDify
          </h1>
          <p className="text-center text-white mt-2 ">
            Click on a conversation to start chatting
          </p>
        </div>
      </div>
    </div>
  );
}
