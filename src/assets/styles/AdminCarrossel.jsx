import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Plus, Pencil, X } from "lucide-react";

export default function AdminCarrossel() {
  const [imagens, setImagens] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const [fileLight, setFileLight] = useState(null);
  const [fileDark, setFileDark] = useState(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });

    setIsDark(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
    }, []);

  async function carregar() {
    const { data, error } = await supabase
      .from("carrossel_eventos")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setImagens(data);
    }
  }

  function abrirModal(item = null) {
    setEditando(item);
    setLink(item?.link || "");
    setFileLight(null);
    setFileDark(null);
    setModalAberto(true);
  }

  async function uploadImagem(file) {
    if (!file) return null;

    const nomeArquivo = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("carrossel")
      .upload(nomeArquivo, file, {
        contentType: file.type,
      });

    if (error) {
      console.error(error);
      alert("Erro ao enviar imagem");
      return null;
    }

    const { data } = supabase.storage
      .from("carrossel")
      .getPublicUrl(nomeArquivo);

    return data.publicUrl;
  }

  async function salvar() {
    let urlLight = editando?.img_light || null;
    let urlDark = editando?.img_dark || null;

    if (!editando && imagens.length >= 6) {
        alert("Máximo de 6 imagens");
        return;
    }

    // 🔹 NOVO REGISTRO → obrigar enviar as duas
    if (!editando) {
        if (!fileLight || !fileDark) {
        alert("Envie as duas imagens.");
        
        return;
        }
    }

    // 🔹 Upload apenas se tiver arquivo novo
    if (fileLight) {
        const upload = await uploadImagem(fileLight);
        if (!upload) return;
        urlLight = upload;
    }

    if (fileDark) {
        const upload = await uploadImagem(fileDark);
        if (!upload) return;
        urlDark = upload;
    }

    if (!urlLight || !urlDark) {
        alert("Erro ao gerar URLs das imagens.");
        return;
    }

    if (editando) {
        await supabase
        .from("carrossel_eventos")
        .update({
            img_light: urlLight,
            img_dark: urlDark,
            link,
        })
        .eq("id", editando.id);
    } else {
        await supabase.from("carrossel_eventos").insert([
        {
            img_light: urlLight,
            img_dark: urlDark,
            link,
        },
        ]);
    }

    setModalAberto(false);
    carregar();
  
    }

  async function excluir(id) {
    await supabase.from("carrossel_eventos").delete().eq("id", id);
    carregar();
  }

  return (
    <>
      {/* GRID */}
      <div className="flex-col max-w-6xl gap-4 flex">
        
        <div className="flex w-full gap-4 flex-wrap">
        {imagens.map((item) => (
          <div
            key={item.id}
            className="relative w-24 h-24 md:w-56 md:h-48 rounded-xl overflow-hidden border-2 shadow"
          >
            <img
              src={isDark ? item.img_dark : item.img_light}
              alt="preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => abrirModal(item)}
                className="bg-blue-600 p-1 rounded text-white"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => excluir(item.id)}
                className="bg-red-600 p-1 rounded text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        {imagens.length < 6 && (
          <button
            onClick={() => abrirModal()}
            className="md:w-56 md:h-48  text-textColor/40 dark:text-white/50 w-24 h-24 border-2 border-dashed rounded-xl dark:hover:bg-[#001438]  hover:bg-[#d3e3ff] flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
          >
            <Plus size={40} />
          </button>
        )}
        </div>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="bg-white dark:bg-[#0b1e3a] p-6 rounded-xl w-[90%] max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {editando ? "Editar Imagem" : "Adicionar Nova Imagem"}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-full">

                <label className="text-lg font-medium md:text-lg flex gap-1 text-gray-700 dark:text-white">
                    Imagem Light
                    <span className="text-red-600">*</span>
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileLight(file);
                    }}
                    className="
                    w-full
                    h-[50px]
                    
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
                
                    file:mr-4
                    file:h-[50px]
                    file:px-4
                    file:rounded-none
                    file:border-0
                    file:text-sm
                    file:font-semibold
                    file:bg-blue-600
                    file:text-white
                    hover:file:bg-blue-700
                    "
                />

                </div>

              <div className="flex flex-col gap-2 w-full">

                <label className="text-lg font-medium md:text-lg flex gap-1 text-gray-700 dark:text-white">
                    Imagem Dark
                    <span className="text-red-600">*</span>
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileDark(file);
                    }}
                    className="
                    w-full
                    h-[50px]
                    
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
                
                    file:mr-4
                    file:h-[50px]
                    file:px-4
                    file:rounded-none
                    file:border-0
                    file:text-sm
                    file:font-semibold
                    file:bg-blue-600
                    file:text-white
                    hover:file:bg-blue-700
                    "
                />

                </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold">
                  Link da Imagem
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="border h-[50px] bg-[#f4f8ff] dark:bg-textColor/20 border-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-[#001438] rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 mt-6">
              <button
                onClick={() => setModalAberto(false)}
                className="h-[48px] hover:bg-blue-500 w-full bg-blue-400 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="h-[50px] hover:bg-[#001438] w-full bg-[#0E4194] text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
        
      )}
    </>
  );
}