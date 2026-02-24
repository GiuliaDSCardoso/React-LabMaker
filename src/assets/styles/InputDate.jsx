export default function InputDate({
  id,
  title,
  type = "text",
  value,
  error,
  onChange,
  placeholder,
}) {
  return (
<<<<<<< Updated upstream
    <div className="flex flex-col gap-4  w-full">
      <label className="text-lg font-medium md:text-xl dark:text-white  text-gray-700 flex gap-1">
      {title}
      <span className="relative group cursor-help text-red-600">
        *
        <span
          className="
            absolute left-1/2 -translate-x-1/2 top-6
            hidden group-hover:block
            bg-textColor/40 dark:bg-textColor text-white text-xs md:text-sm
            px-2 py-1 rounded
            whitespace-nowrap
            z-50
          "
        >
          item obrigatório
=======
    <div className="flex flex-col gap-4 w-full">
      <label className="text-lg font-medium md:text-xl text-gray-700 dark:text-white flex gap-1">
        {title}
        <span className="relative group cursor-help text-red-600">
          *
          <span
            className="
              absolute left-1/2 -translate-x-1/2 top-6
              hidden group-hover:block
              bg-textColor/40 dark:bg-textColor
              text-[#003FC3] dark:text-white text-xs md:text-sm
              px-2 py-1 rounded
              whitespace-nowrap
              z-50
            "
          >
            item obrigatório
          </span>
>>>>>>> Stashed changes
        </span>
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
<<<<<<< Updated upstream
        className="w-[100%] rounded-lg border-2 dark:border-none border-blue-400/10 md:w-full h-[50px] px-3 text-lg dark:placeholder:text-white/50 placeholder:text-blue-800/50 bg-[#f4f8ff] outline-none dark:bg-textColor/20 focus:outline-blue-400/50  dark:focus:outline-textColor/80  dark:focus:text-white focus:ring-none"
=======
        className={`
          w-full
          rounded-lg
          h-[50px]
          px-3
          text-lg
          bg-[#f4f8ff]
          dark:bg-textColor/20
          text-blue-800
          dark:text-white
          border border-transparent
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400/60
          dark:focus:ring-blue-900/60
          transition-all
          color-scheme: light dark;
          ${
            error
              ? "border-red-500/70"
              : "border-blue-400/10 dark:border-transparent"
          }
          
      `}
        
>>>>>>> Stashed changes
      />
      {error && (
             <p className="text-red-500 text-sm -mt-1">{error}</p>
        )}
    </div>
  );
}