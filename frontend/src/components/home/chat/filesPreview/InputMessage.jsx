export default function InputMessage({ message, setMessage }) {
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="w-full h-11 flex justify-center items-center">
      <input
        type="text"
        className="w-[60%] h-full pl-12 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#ff5722] focus:border-[#ff5722] dark:bg-dark_bg_7 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#ff5722] dark:focus:border-[#ff5722]"
        placeholder="Add a caption"
        onChange={handleChange}
        value={message}
      />
    </div>
  );
}
