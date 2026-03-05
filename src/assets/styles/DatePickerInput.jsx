import { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";

// Input customizado que aplica máscara DD/MM/YYYY
const MaskedInput = forwardRef(({ value, onClick, onChange, error }, ref) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
    if (val.length > 8) val = val.slice(0, 8);

    // aplica barras automaticamente
    if (val.length >= 5) val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    else if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;

    onChange(val);
  };

  return (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      onChange={handleChange}
      placeholder="DD/MM/AAAA"
      className={` w-full
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
          dark:placeholder:text-white
          placeholder:text-blue-800
          dark:focus:text-white
          transition-all ${
            error ? "border-red-500/70" : "border-blue-400/10 dark:border-transparent"
          }`}
    />
  );
});
MaskedInput.displayName = "MaskedInput";

export default function DatePickerInput({ title, selected, error, onChange }) {
  const [dateValue, setDateValue] = useState(selected || null); // objeto Date
  const [inputValue, setInputValue] = useState(
    selected
      ? `${String(selected.getDate()).padStart(2, "0")}/${String(
          selected.getMonth() + 1
        ).padStart(2, "0")}/${selected.getFullYear()}`
      : ""
  );

  // Sincroniza quando parent muda 'selected'
  useEffect(() => {
    if (selected instanceof Date && !isNaN(selected)) {
      setDateValue(selected);
      setInputValue(
        `${String(selected.getDate()).padStart(2, "0")}/${String(
          selected.getMonth() + 1
        ).padStart(2, "0")}/${selected.getFullYear()}`
      );
    } else {
      setDateValue(null);
      setInputValue("");
    }
  }, [selected]);

  // Quando o usuário seleciona pelo calendário
  const handleChange = (date) => {
    setDateValue(date);
    if (!date || isNaN(date)) {
      setInputValue("");
      onChange(null);
      return;
    }
    const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
    setInputValue(formatted);
    onChange(date); // passa o objeto Date
  };

  // Quando o usuário digita no input manualmente
  const handleInputChange = (val) => {
    setInputValue(val);

    // tenta transformar DD/MM/YYYY em Date
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = val.match(regex);
    if (match) {
      const dia = parseInt(match[1], 10);
      const mes = parseInt(match[2], 10) - 1; // meses 0-11
      const ano = parseInt(match[3], 10);
      const date = new Date(ano, mes, dia);
      if (!isNaN(date)) {
        setDateValue(date);
        onChange(date); // envia Date válido
      }
    } else {
      onChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-lg font-medium md:text-xl text-gray-700 dark:text-white">
        {title}
      </label>

      <DatePicker
        selected={dateValue}
        onChange={handleChange}
        locale={ptBR}
        dateFormat="dd/MM/yyyy"
        placeholderText="Toque para selecionar a data"
        calendarClassName="dark:bg-[#001438] dark:text-white text-blue-800 rounded-xl"
        popperClassName="z-50"
        customInput={<MaskedInput value={inputValue} onChange={handleInputChange} error={error} />}
      />

      {error && <p className="text-red-500 text-sm -mt-1">{error}</p>}
    </div>
  );
}