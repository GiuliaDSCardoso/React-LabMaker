import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import GraficoCategorias from "../../assets/styles/GraficoCategorias";
import InputRed from "../../assets/styles/InputRed";
import Body from "../../assets/styles/Body";
import MenuLateralAdmin from "../../assets/styles/MenuLateralAdmin";
import InputSelect from "../../assets/styles/InputSelect";


export default function CatalogoAdmin() {
  const [itens, setItens] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [imagem, setImagem] = useState("");

  async function carregarItens() {
    const { data } = await supabase.from("catalogo").select("*");
    setItens(data || []);
  }

  useEffect(() => {
    carregarItens();
  }, []);

 async function adicionarItem() {

  const { error } = await supabase
    .from("catalogo")
    .insert([
      {
        nome: nome,
        categoria: categoria,
        quantidade: Number(quantidade),
        imagem: imagem,
      }
    ]);

  if (error) {
    console.log("Erro:", error);
    alert("Erro ao inserir item");
    return;
  }

  carregarItens();

  setNome("");
  setCategoria("");
  setQuantidade(1);
  setImagem("");
}

  const categorias = {};

  itens.forEach((item) => {
    if (!categorias[item.categoria]) {
      categorias[item.categoria] = 0;
    }
    categorias[item.categoria] += item.quantidade;
  });

  const dataGrafico = Object.keys(categorias).map((cat) => ({
    categoria: cat,
    quantidade: categorias[cat],
  }));

  const itensFiltrados = categoriaAtiva
    ? itens.filter((i) => i.categoria === categoriaAtiva)
    : itens;

    async function excluirItem(id) {
        await supabase.from("catalogo").delete().eq("id", id);
        carregarItens();
        }

    function alterarItem(item) {
        setNome(item.nome);
        setCategoria(item.categoria);
        setQuantidade(item.quantidade);
        setImagem(item.imagem);
        }
  return (
    <Body>
    <MenuLateralAdmin/>
     <div className="flex flex-col md:mt-1 mt-24  p-6 sm:p-8 lg:p-10 gap-8 md:ml-20
                    max-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold">
        Catálogo de Equipamentos
      </h1>
      <div className="flex w-[100%] justify-center">
        <GraficoCategorias
        data={dataGrafico}
        onClick={(cat) => setCategoriaAtiva(cat)}
        />

      <div className="flex gap-4">
        {Object.keys(categorias).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6">

        {itensFiltrados.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 bg-white shadow"
          >
            <img
              src={item.imagem}
              className="w-full h-32 object-cover rounded"
            />

            <h2 className="font-bold mt-2">
              {item.nome}
            </h2>

            {item.quantidade > 0 ? (
              <p className="text-green-600">
                Restam {item.quantidade}
              </p>
            ) : (
              <p className="text-red-600">
                Item esgotado
              </p>
            )}
          </div>
        ))}

      </div>

      <div className="bg-white w-[100%] dark:bg-textColor/40 p-6 rounded-xl shadow space-y-4">

        <h2 className="text-xl font-bold">
          Adicionar Item
        </h2>

        <InputRed
          title="Nome do item:"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          
        />
       

        <InputRed
          title="Insira uma imagem do item:"
          placeholder="URL da imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <InputSelect
            title="Categoria do item:"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            options={[
            "IOT",
            "Ferramenta",
            "Chromebook",
            "Papelaria",
            ]}
            
        />

        <InputRed
          title="Quantidade:"
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          
        />

        <button
          onClick={adicionarItem}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>

      </div>
      </div>
      
      <div className="w-full overflow-x-auto bg-white dark:bg-black/10 rounded-xl shadow p-4">

        <table className="w-full border-collapse">

                <thead>
                <tr className="bg-blue-500 text-white">

                <th className="p-3">Imagem</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Quantidade</th>
                <th className="p-3">Último solicitante</th>
                <th className="p-3">Ações</th>

                </tr>
                </thead>

                <tbody>

                {itensFiltrados.map((item) => (

                <tr key={item.id} className="text-center border-b">

                <td className="p-3">
                <img
                src={item.imagem}
                className="w-16 h-16 object-cover rounded mx-auto"
                />
                </td>

                <td className="p-3 font-medium">
                {item.nome}
                </td>

                <td className="p-3">
                {item.quantidade}
                </td>

                <td className="p-3">
                {item.ultimo_solicitante || "-"}
                </td>

                <td className="p-3 flex flex-col gap-2 items-center">

                <button
                className="bg-blue-700 text-white px-3 py-1 rounded"
                >
                Histórico
                </button>

                <button
                onClick={() => excluirItem(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
                >
                Excluir
                </button>

                <button
                onClick={() => alterarItem(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                Alterar
                </button>

                </td>

                </tr>

                ))}

                </tbody>

        </table>

        </div>
      </div>
    </Body>
  );
}