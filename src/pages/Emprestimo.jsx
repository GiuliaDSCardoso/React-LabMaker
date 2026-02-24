import AddSolicitacao from "../components/AddSolicitacao";

import Body from "../assets/styles/Body.jsx";
import MenuLateral from "../assets/styles/MenuLateral.jsx";
<<<<<<< Updated upstream
=======
import Header from "../assets/styles/Header.jsx";
>>>>>>> Stashed changes

export default function Emprestimo() {
  return (
    <Body>
      <MenuLateral />

<<<<<<< Updated upstream
      <header
        className="
            w-full
            max-w-7xl
            mx-auto
            mt-24
            md:mt-5
            rounded-xl
            flex justify-center items-center
            h-[18vh]
            bg-[#0E4194]
            dark:bg-[#001941]
            bg-cover bg-center
          "
       
      >
        <h1 className="sm:text-3xl text-2xl text-white font-bold text-center w-full">
          Solicitação de empréstimo <br /> de componentes
        </h1>
      </header>
=======
      <Header
      title="Empréstimo de Componentes"
      />
>>>>>>> Stashed changes

      <div className="mt-16 mb-10 flex px-4 justify-center">
        <AddSolicitacao />
      </div>
    </Body>
  );
}