import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AgendaUso from "./pages/AgendaUso";

import Admin from "./pages/Admin";
import AgendaAdmin from "./pages/pagesadmin/AgendaAdmin";

import PrivateRoute from "./components/PrivateRoute";
import Pedidos from "./pages/Pedidos";
import GuardarProjetos from "./pages/GuardarProjetos";
import Emprestimo from "./pages/Emprestimo";
import GuardarAdmin from "./pages/pagesadmin/GuardarAdmin";
import PedidosAdmin from "./pages/pagesadmin/PedidosAdmin";
import EmprestimoAdmin from "./pages/pagesadmin/EmprestimoAdmin";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendauso" element={<AgendaUso />} />
        <Route path="/emprestimo" element={<Emprestimo/>} />
        <Route path="/guardarprojetos" element={<GuardarProjetos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/contact" element={<Contact />} />
        {/* Admin protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />

        <Route
          path="/agendaadmin"
          element={
            <PrivateRoute>
              <AgendaAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/guardaradmin"
          element={
            <PrivateRoute>
              <GuardarAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidosadmin"
          element={
            <PrivateRoute>
              <PedidosAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/emprestimoadmin"
          element={
            <PrivateRoute>
              < EmprestimoAdmin />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
