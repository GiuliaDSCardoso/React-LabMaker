import { useState } from "react";
import Input from "../assets/styles/Input";
import InputDate from "../assets/styles/InputDate";
import Body from "../assets/styles/Body";
import { useNavigate } from "react-router-dom";
import { MoveLeftIcon } from "lucide-react";
import Nav from "../assets/styles/Nav";
  

export default function AgendaUso() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [motivo, setMotivo] = useState("");
  const [arrumacao, setArrumacao] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");
  const navigate = useNavigate();
 
  function enviar() {
    const bloqueios =
      JSON.parse(localStorage.getItem("agendamentos_admin")) || [];

    const conflito = bloqueios.some(
      (b) =>
        b.data === data &&
        (b.diaInteiro ||
          (horaInicio < b.horaFim && horaFim > b.horaInicio))
    );

    if (conflito) {
      alert("Laboratório indisponível nesse horário");
      return;

    }

    const solicitacao = {
      id: crypto.randomUUID(),
      tipo: "USUARIO",
      nome,
      email,
      telefone,
      motivo,
      arrumacaoSala: arrumacao,
      data,
      horaInicio,
      horaFim,
      status: "pendente",
      createdAt: Date.now()
    };

    const lista =
      JSON.parse(localStorage.getItem("solicitacoes_usuario")) || [];

    lista.push(solicitacao);
    localStorage.setItem(
      "solicitacoes_usuario",
      JSON.stringify(lista)
    );
    window.dispatchEvent(new Event("storage"));

    window.location.href = `mailto:giulia.cardoso@fbest.org.br,vsantana@fieb.org.br
    ?subject=Solicitação de Laboratório
    &body=${encodeURIComponent(
      `${nome} (${email}) deseja alocar o laboratório no dia ${data} no horário ${horaInicio} - ${horaFim} para realizar ${motivo}, com a arrumação da sala ${arrumacao}. Contato: ${telefone}`
    )}`;

    alert("Solicitação enviada!");
    
  
  }
  function onBackClick() {
    navigate(-1);
  }
 
  return (
    <Body>
      {/* Nav */}
       <Nav/>
      <header className="flex items-center bg-gradient-to-r mb-[2%] from-[#1976d2] to-blue-800 h-40 px-6">
        <button
          onClick={onBackClick}
          className="text-white bg-[#0062c4] p-2 rounded-full"
        >
          <MoveLeftIcon />
        </button>

        <h1 className="text-3xl text-white font-bold text-center w-full">
          Solicitação de empréstimo <br /> de componentes
        </h1>
      </header>

      <div className="  flex flex-col  justify-center items-center ">
        <div>
          <Input  title="Insira seu nome completo:" placeholder="Nome completo" onChange={e=>setNome(e.target.value)} />
          <Input title="Insira seu email:" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
          <Input  title="Insira seu telefone:" placeholder="Telefone" onChange={e=>setTelefone(e.target.value)} />
          
          <div className="w-full">
            <label className="text-lg font-medium text-gray-700 flex   gap-1">
                    Escolha a arrumação da sala:
                    <span className="relative group cursor-help text-red-600">
                      *
                      <span
                        className="
                          absolute left-1/2 -translate-x-1/2 top-6
                          hidden group-hover:block
                          bg-black text-white text-xs
                          px-2 py-1 rounded
                          whitespace-nowrap
                          z-50
                        "
                      >
                        item obrigatório
                      </span>
                    </span>
            </label>
            <select className="input w-[500px] h-[40px] px-3  text-[#2756ac] placeholder:text-[#2756ac] bg-[#e5eeff] outline-none focus:text-[#4c82e6] focus:outline-none focus:ring-1 focus:ring-none" onChange={e=>setArrumacao(e.target.value)}>
                    <option value="">Arrumação da sala</option>
                    <option>Mesas em formato reunião</option>
                    <option>Mesas em ilhas</option>
                    <option>Mesa em U</option>
              </select>

          </div>
          
          <Input type="date" title="Insira a data:"  className="input w-[500px]" onChange={e=>setData(e.target.value)} />

          <div className="flex w-[500px] justify-center gap-2 ">
            
            <InputDate type="time" title="Insira a hora de início:"  className="input" onChange={e=>setHoraInicio(e.target.value)} />
            <InputDate type="time" title="Insira a hora de fim:"  className="input " onChange={e=>setHoraFim(e.target.value)} />
          </div>
          <div>
             <label className="text-lg font-medium text-gray-700 flex   gap-1">
                    Qual o motivo da alocação?
                    <span className="relative group cursor-help text-red-600">
                      *
                      <span
                        className="
                          absolute left-1/2 -translate-x-1/2 top-6
                          hidden group-hover:block
                          bg-black text-white text-xs
                          px-2 py-1 rounded
                          whitespace-nowrap
                          z-50
                        "
                      >
                        item obrigatório
                      </span>
                    </span>
            </label>
           <textarea className="input  w-[500px] h-[40px] px-3  text-[#2756ac] placeholder:text-[#2756ac]
            bg-[#e5eeff] outline-none focus:text-[#4c82e6] focus:outline-none focus:ring-1 focus:ring-none"
            placeholder="Motivo" onChange={e=>setMotivo(e.target.value)} /> 
          </div>
          

          <button onClick={enviar} className="bg-[#2756ac] text-white h-[40px] rounded w-[500px]">
            Enviar solicitação
          </button>
        </div>
      </div>
      
    </Body>
    
  );
}
