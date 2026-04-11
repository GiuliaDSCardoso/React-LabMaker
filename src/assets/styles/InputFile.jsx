import { useRef } from "react";
import { Upload, X, Plus } from "lucide-react";

export default function InputFile({
  title,
  error,
  onChange,
  files = [],
  accept = "*",
  required = false,
}) {
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length > 0) {
      const updated = [...files, ...newFiles];
      onChange(updated);
    }

    e.target.value = "";
  }

  function removeFile(index) {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="flex flex-col gap-2 w-full">

      {title && (
        <label className="text-lg font-medium md:text-xl flex gap-1 text-gray-700 dark:text-white">
          {title}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple
        className="hidden"
      />

      {/* BOTÃO */}
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="
        w-full
        h-[50px]
        flex
        items-center
        justify-center
        gap-2
        rounded-lg
        border
        border-dashed
        border-blue-400
        bg-[#f4f8ff]
        hover:bg-blue-50
        text-blue-800
        "
      >
        <Upload className="w-5 h-5" />
        Adicionar arquivo
        <Plus className="w-4 h-4" />
      </button>

      {/* LISTA DE ARQUIVOS */}
      {files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">

            {files.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="
                  flex
                  items-center
                  justify-between
                  bg-gray-100
                  dark:bg-white/10
                  px-3
                  py-2
                  rounded
                  text-sm
                  "
                >
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-700 dark:text-white dark:hover:text-blue-300 underline hover:text-blue-900"
                  >
                    {file.name}
                  </a>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

          </div>
        )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}