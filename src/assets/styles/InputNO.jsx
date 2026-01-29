

export default function InputNO({ id, title, type = "text", value, onChange, placeholder }) {

  return (
    <div className="flex flex-col gap-4 w-[100%] md:w-full">
      <label className="text-lg font-medium md:text-xl text-gray-700 flex gap-1">
      {title}
    </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-[100%] md:w-full h-[50px] px-3 text-lg placeholder:text-[#000000] bg-[#e5eeff] outline-none  focus:outline-none focus:ring-1 focus:ring-none"
      />
    </div>
  );
}

