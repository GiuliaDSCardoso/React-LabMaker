import AddSolicitacao from "../components/AddSolicitacao";

import Body from "../assets/styles/Body.jsx";
import MenuLateral from "../assets/styles/MenuLateral.jsx";
import Header from "../assets/styles/Header.jsx";

export default function Emprestimo() {
  
  return (
    <Body>
      <MenuLateral />

      <Header
      title="Empréstimo de Componentes"
      />

      <div className="mt-16 mb-10 flex px-4 justify-center">
        <AddSolicitacao />
      </div>
    </Body>
  );
}