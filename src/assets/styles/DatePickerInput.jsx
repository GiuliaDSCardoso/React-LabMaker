import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";

export default function DatePickerInput({ title, selected, error, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-lg font-medium md:text-xl text-gray-700 dark:text-white">
        {title}
      </label>

      <DatePicker
        selected={selected}
        onChange={onChange}
        locale={ptBR}
        dateFormat="dd/MM/yyyy"
        placeholderText="Toque para selecionar a data"
        className={`
          w-full
          rounded-lg
          border-2
          h-[50px]
          px-3
          text-lg
          bg-[#f4f8ff]
          dark:bg-textColor/20
          text-blue-800
          placeholder:text-blue-800
          dark:text-white
          dark:placeholder:text-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400/60
          dark:focus:ring-blue-900/60
        ${
            error
              ? "border-red-500/70"
              : "border-blue-400/10 dark:border-transparent"
          }
        calendarClassName="dark:bg-[#001438] dark:text-white text-blue-800 rounded-xl"
        popperClassName="z-50"
        
      `}
      />  
      {error && (
        <p className="text-red-500 text-sm -mt-1">{error}</p>
      )}
      
      

    </div>
  );
}