import { Treemap, ResponsiveContainer } from "recharts";

export default function GraficoCategorias({ data, onClick }) {
  return (
    <div className="w-full h-60 bg-white dark:bg-black/10 rounded-xl p-4 shadow">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="quantidade"
          nameKey="categoria"
          stroke="#fff"
          fill="#3b82f6"
          onClick={(e) => onClick(e.categoria)}
        />
      </ResponsiveContainer>
    </div>
  );
}