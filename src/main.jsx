import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Contact from './pages/Contact.jsx';
import Emprestimo from './pages/Emprestimo.jsx';
import Pedidos from './pages/Pedidos.jsx';
import AgendaUso from './pages/AgendaUso.jsx';
import GuardarProjetos from './pages/GuardarProjetos.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import EmprestimoAdmin from './pages/pagesadmin/EmprestimoAdmin.jsx';
import GuardarAdmin from './pages/pagesadmin/GuardarAdmin.jsx';
import PedidosAdmin from './pages/pagesadmin/PedidosAdmin.jsx';
import AgendaAdmin from './pages/pagesadmin/AgendaAdmin.jsx';

const router = createBrowserRouter([
  {
    path: "/home",
    element: <App />,
  },{
    path: "/contact",
    element: <Contact />,
  },{
    path: "/emprestimo",
    element: <Emprestimo />,
  },{
    path: "/login",
    element: <Login />,
  },{
    path: "/admin",
    element: <Admin />,
  },{
    path: "/emprestimoadmin",
    element: <EmprestimoAdmin />,
  },{
    path: "/pedidos",
    element: <Pedidos />,
  },{
    path: "/pedidosadmin",
    element: <PedidosAdmin />,
  },{
    path: "/agendaadmin",
    element: <AgendaAdmin />,
  },{
    path: "/agendauso",
    element: <AgendaUso />,
  },{
    path: "/guardaradmin",
    element: <GuardarAdmin />,
  },{
    path: "/guardarprojetos",
    element: <GuardarProjetos />,
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
