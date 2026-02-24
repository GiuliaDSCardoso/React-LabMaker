import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function InputFile({
  title,
  error,
  onChange,
  accept = "*",
  required = false,
}) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  }

  function handleRemove() {
    setFileName("");
    inputRef.current.value = "";
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {title && (
        <label className="text-lg font-medium md:text-xl flex gap-1 text-gray-700 dark:text-white">
          {title}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {/* BOTÃO */}
        <div
          onClick={() => inputRef.current.click()}
          className={`
            w-full
            h-[50px]
            px-4
            flex
            items-center
            justify-between
            rounded-lg
            cursor-pointer
            bg-[#f4f8ff]
            dark:bg-textColor/20
            text-blue-800
            dark:text-white
            border
            border-dashed
            border-blue-300
            dark:border-blue-900
            hover:bg-blue-50
            dark:hover:bg-[#001438]
            transition
            ${
            error
              ? "border-red-500/70"
              : "border-blue-400/10 dark:border-transparent"
          }
          `}
        > 
        
          <div className="flex items-center gap-2 truncate">
            <Upload className="w-5 h-5" />
            <span className="truncate">
              {fileName || "Clique para enviar arquivo"}
            </span>
          </div>

          {fileName && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
        </div>
        
      </div>
      {error && (
             <p className="text-red-500 text-sm -mt-1">{error}</p>
           )}
    </div>
  );
}