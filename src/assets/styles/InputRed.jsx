export default function InputRed({
  id,
  title,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  min
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
              bg-textColor/40 dark:bg-textColor text-white text-xs md:text-sm
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
        min={min}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          rounded-lg
          border-2
          h-[50px]
          px-3
          text-lg
          bg-[#f4f8ff]
          dark:bg-textColor/20
          outline-none
          focus:ring-blue-400/60
          dark:focus:ring-blue-900/60
          focus:ring-2
          dark:placeholder:text-white/50
          placeholder:text-blue-800/50
          dark:focus:text-white
          transition-all
          ${
            error
              ? "border-red-500/70"
              : "border-blue-400/10 dark:border-transparent"
          }
        `}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}