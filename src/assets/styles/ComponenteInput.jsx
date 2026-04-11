import { PlusIcon, X, Minus } from "lucide-react";

export default function ComponenteInput({
  value,
  onChange,
  onAdd,
  items,
  onRemove,
  onUpdateQuantidade,
  catalogo = [],
  title,
  error,
  descricao,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-lg  font-medium md:text-xl text-gray-700 dark:text-white">
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

      <div className="flex gap-2">
        <input
          list="catalogo-list"
          value={value}
          placeholder={descricao}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full
            h-[50px]
            px-3
            rounded-lg
            border-2
            outline-none
            transition-all
            bg-transparent
            hover:bg-[#e5eeff]
            dark:bg-textColor/20
            dark:hover:bg-textColor/40
            ${
              error
                ? "border-red-500"
                : "border-blue-400/10 dark:border-transparent"
            }
          `}
        />

        <datalist id="catalogo-list">
          {catalogo.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome} ({item.quantidade} disponíveis)
            </option>
          ))}
        </datalist>

        <button
          type="button"
          onClick={onAdd}
          className="
            w-[55px]
            bg-[#0062c4]
            text-white
            rounded-lg
            flex justify-center items-center
            transition-all
            hover:scale-105
            active:scale-95
          "
        >
          <PlusIcon />
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {items.map((item, index) => (
        <div
          key={index}
          className="
            flex justify-between items-center
            bg-blue-50 dark:bg-textColor/10
            px-3 py-2
            rounded-lg
            gap-3
          "
        >
          <span className="flex-1">{item.nome}</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantidade(index, Math.max(1, item.quantidade - 1))
              }
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-textColor/30 rounded hover:bg-gray-300 dark:hover:bg-textColor/50 transition"
            >
              <Minus size={16} />
            </button>

            <input
              type="number"
              min={1}
              max={100}
              value={item.quantidade}
              onChange={(e) =>
                onUpdateQuantidade(index, Number(e.target.value))
              }
              className="w-14 h-8 text-center border-2 rounded-lg px-1 outline-none bg-white dark:bg-textColor/20 border-blue-400/10 dark:border-transparent"
            />

            <button
              type="button"
              onClick={() =>
                onUpdateQuantidade(index, Math.min(100, item.quantidade + 1))
              }
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-textColor/30 rounded hover:bg-gray-300 dark:hover:bg-textColor/50 transition"
            >
              <PlusIcon size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:scale-110 transition"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}