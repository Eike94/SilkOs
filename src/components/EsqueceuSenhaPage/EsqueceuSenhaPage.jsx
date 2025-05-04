import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import StyleEsqueceuSenhaPage from "./EsqueceuSenhaPage.module.css";

export default function EsqueceuSenhaPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [text, setText] = useState("");

    async function SendEmailToken() {
        const response = await api.post("/Users/recuperarSenhaEmail", {
            email: email,
        });

        return response;
    }

    async function SendRecPassword() {
        const res = await SendEmailToken();

        if (res.status == 200) {
            setText("Email enviado!");
        } else {
            setText("Erro no servidor, por favor tente novamente mais tarde!");
        }
    }

    return (
        <div className={StyleEsqueceuSenhaPage.body}>
            <div className={StyleEsqueceuSenhaPage.titleEsqueceuSenha}>
                <p>Esqueceu a senha</p>
            </div>
            <div className={StyleEsqueceuSenhaPage.container}>
                <div className={StyleEsqueceuSenhaPage.formEsqueceuSenha}>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={() => SendRecPassword()}>Enviar</button>
                    {text}
                    <button
                        onClick={() => {
                            navigate("/Login");
                        }}
                    >
                        Voltar para login
                    </button>
                </div>
            </div>
        </div>
    );
}
