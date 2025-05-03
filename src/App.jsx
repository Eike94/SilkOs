import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import CadastrarPage from "./components/CadastrarPage/CadastrarPage";
import NovaSenhaPage from "./components/NovaSenhaPage/NovaSenhaPage";
import EsqueceuSenhaPage from "./components/EsqueceuSenhaPage/EsqueceuSenhaPage";
import FormularioPage from "./components/FormularioPage/FormularioPage";
import EditarValoresPage from "./components/EditarValoresPage/EditarValoresPage";
import ReciboPage from "./components/ReciboPage/ReciboPage";
import OrcamentosPage from "./components/OrcamentosPage/OrcamentosPage";
import ClientePage from "./components/ClientePage/ClientePage";
import ServicosPage from "./components/ServicosPage/ServicosPage";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Cadastro" element={<CadastrarPage />} />
              <Route path="/EsqueceuSenha" element={<EsqueceuSenhaPage />} />
              <Route path="/NovaSenha" element={<NovaSenhaPage />} />
              <Route path="/FormularioPage" element={<FormularioPage />} />
              <Route path="/EditarValoresPage" element={<EditarValoresPage />} />
              <Route path="/ReciboPage" element={<ReciboPage />} />
              <Route path="/OrcamentosPage" element={<OrcamentosPage />} />
              <Route path="/ClientePage" element={<ClientePage />} />
              <Route path="/ServicosPage" element={<ServicosPage />} />
              
          </Routes>
      </Router>

      
  );
}

export default App
