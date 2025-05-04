import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";
import StyleNovaSenhaPage from "./NovaSenhaPage.module.css";

export default function NovaSenhaPage() {
    const [senha, setSenha] = useState("");
    const [senha2, setSenha2] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (senha !== senha2) {
            setMensagem("As senhas não coincidem!");
            return;
        }

        try {
            const response = await api.put("/Users/redefinirSenha", {
                email,
                token,
                novaSenha: senha,
            });

            if (response.status == 200) {
                setMensagem(response.data.message);
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMensagem("Erro na troca de senha, por favor tente mais tarde!");
            }

            
        } catch (error) {
            setMensagem(error.response?.data?.message || "Erro ao redefinir senha");
        }
    };
    return (
        <div className={StyleNovaSenhaPage.body}>
            <div className={StyleNovaSenhaPage.titleLogin}>
                <p>Nova Senha</p>
            </div>
            <div className={StyleNovaSenhaPage.container}>
                {mensagem && <p>{mensagem}</p>}
                <div className={StyleNovaSenhaPage.formLogin}>
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        value={senha2}
                        onChange={(e) => setSenha2(e.target.value)}
                        required
                    />
                    <button onClick={handleSubmit}>Enviar</button>
                </div>
            </div>
        </div>
    );
}
