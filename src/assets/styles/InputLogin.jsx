export default function InputLogin({
  id,
  title,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  min,
  rightElement,
}) {
  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="text-lg font-medium md:text-xl text-gray-800 dark:text-white flex gap-1">
        {title}
        <span className="text-red-500">*</span>
      </label>

      <div className="relative w-full">
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
            px-4
            pr-12
            text-lg
            outline-none
            transition-all

            /* 🌞 MODO CLARO */
            bg-white/60
            text-gray-900
            placeholder:text-gray-500
            border-blue-200
            focus:ring-2
            focus:ring-blue-400/40

            /* 🌙 MODO DARK */
            dark:bg-transparent
            dark:text-white
            dark:placeholder:text-white/60
            dark:border-white/20
            dark:focus:ring-white

            backdrop-blur-md

            ${
              error
                ? "border-red-500/70 dark:border-red-400"
                : ""
            }
          `}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-white">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm -mt-1">
          {error}
        </p>
      )}
    </div>
  );
}