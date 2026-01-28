import AddSolicitacao from "../components/AddSolicitacao";
import Nav from "../assets/styles/Nav.jsx";
import Body from "../assets/styles/Body.jsx";

export default function Emprestimo() {
  return (
    <Body>
      <Nav />

      <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-[20%] px-6">
        <h1 className="sm:text-3xl text-2xl text-white font-bold text-center w-full">
          Solicitação de empréstimo <br /> de componentes
        </h1>
      </header>

      <div className="mt-10 mb-10 flex px-4 justify-center">
        <AddSolicitacao />
      </div>
    </Body>
  );
}
