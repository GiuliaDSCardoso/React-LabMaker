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
    <div className="flex flex-col gap-2 w-full">
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
        </span>
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ colorScheme: "light dark" }}
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
        
      />
      {error && (
             <p className="text-red-500 text-sm -mt-1">{error}</p>
        )}
    </div>
  );
}