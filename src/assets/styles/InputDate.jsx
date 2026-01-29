

export default function Input({ id, title, type = "text", value, onChange, placeholder }) {

  return (
    <div className="flex flex-col gap-4  w-full">
      <label className="text-lg font-medium md:text-xl text-gray-700 flex gap-1">
      {title}
      <span className="relative group cursor-help text-red-600">
        *
        <span
          className="
            absolute left-1/2 -translate-x-1/2 top-6
            hidden group-hover:block
            bg-black text-white text-xs md:text-sm
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
        className="w-[100%] h-[50px] px-3 placeholder:text-lg  placeholder:text-[#000000] placeholder:text-[#a7a7a7] bg-[#e5eeff] outline-none focus:text-[#4c82e6] focus:outline-none focus:ring-1 focus:ring-none"
      />
    </div>
  );
}

