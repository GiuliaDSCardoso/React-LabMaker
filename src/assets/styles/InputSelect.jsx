import { useState, useRef, useEffect } from "react";

export default function InputSelect({
  title,
  value,
  onChange,
  error,
  options = [],
  placeholder = "Selecione uma opção",
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((option) =>
    typeof option === "string"
      ? option === value
      : option.value === value
  );

  const displayValue = selectedLabel
    ? typeof selectedLabel === "string"
      ? selectedLabel
      : selectedLabel.label
    : placeholder;

  return (
    <div className="flex flex-col gap-2 w-full">
      {title && (
        <label className="text-lg font-medium md:text-xl flex gap-1 text-gray-700 dark:text-white">
          {title}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div ref={wrapperRef} className="relative w-full">

        {/* BOTÃO */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`
            w-full
            h-[50px]
            px-3
            border-2
            pr-3
            text-left
            text-lg
            rounded-lg
            transition
            flex
            items-center
            justify-between
            bg-[#f4f8ff]
            dark:bg-textColor/20
            ${
              value
                ? "text-blue-800 dark:text-white"
                : "text-blue-800 dark:text-white"
            }
            ${
              error
                ? "border-red-500/70"
                : "border-blue-400/10 dark:border-transparent"
            }
          `}
        >
          <span className="truncate">{displayValue}</span>

          {/* SETA */}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } text-blue-800 dark:text-white`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* DROPDOWN */}
        {open && (
          <ul className="
            absolute
            z-50
            mt-2
            w-full
            rounded-lg
            shadow-lg
            max-h-60
            overflow-y-auto
            bg-white
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            animate-fadeIn
          ">
            {options.map((option, index) => {
              const valueOption =
                typeof option === "string"
                  ? option
                  : option.value;

              const labelOption =
                typeof option === "string"
                  ? option
                  : option.label;

              return (
                <li
                  key={index}
                  onClick={() => {
                    onChange({
                      target: { value: valueOption },
                    });
                    setOpen(false);
                  }}
                  className="
                    px-4
                    py-3
                    cursor-pointer
                    text-blue-800
                    dark:text-white
                    hover:bg-blue-50
                    dark:hover:bg-[#001438]
                    transition
                  "
                >
                  {labelOption}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm -mt-1">
          {error}
        </p>
      )}
    </div>
  );
}