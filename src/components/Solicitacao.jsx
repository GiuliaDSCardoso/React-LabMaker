import { useNavigate } from "react-router-dom";

export default function Solicitacao({ solicitacoes }) {
  const navigate = useNavigate();

  function onSeeDetailsClick(solicitacao) {
    const query = new URLSearchParams(solicitacao).toString();
    navigate(`/task?${query}`);
  }

  return (
    <ul className="space-y-3 bg-indigo-200 p-3 rounded-md shadow-md">
      {solicitacoes.map((solicitacao) => (
        <li
          key={solicitacao.id}
          className="flex justify-between items-center bg-white p-3 rounded-md"
        >
          <div>
            <p><strong>Solicitante:</strong> {solicitacao.solicitante}</p>
            <p><strong>Email:</strong> {solicitacao.email}</p>
            <p><strong>Curso/Turma:</strong> {solicitacao.cursoETurma}</p>
          </div>

          <button
            onClick={() => onSeeDetailsClick(solicitacao)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Ver Detalhes
          </button>
        </li>
      ))}
    </ul>
  );
}
