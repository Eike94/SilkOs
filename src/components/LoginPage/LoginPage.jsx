import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../Backend/api";
import StyleLoginPage from "./LoginPage.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [text, setText] = useState("");

    const navigate = useNavigate();

    async function getUsers() {
        try {
            const response = await api.post(`/Users/autenticar`, {
                email,
                password,
            });

            return response;
        } catch (error) {
            if (error.response) return error.response;
        }
    }

    async function HandleLogin() {
        setText("");

        if (!email) return setText("Preencha o campo EMAIL!");
        if (!password) return setText("Preencha o campo SENHA!");

        const response = await getUsers();

        if (response?.status === 200) {
            console.log("Usuário autenticado!");
            navigate("/FormularioPage");
        } else if (response?.status === 403) {
            setText(response.data.message);
        } else {
            setText("Erro no servidor! Por favor tente mais tarde!");
        }
    }

    return (
        <div className={StyleLoginPage.body}>
            <div className={StyleLoginPage.titleLogin}>
                <p>Login</p>
            </div>
            <div className={StyleLoginPage.container}>
                <div className={StyleLoginPage.formLogin}>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className={StyleLoginPage.options}>
                    <Link to="/Cadastro">Cadastrar</Link>
                    <Link to="/EsqueceuSenha">Esqueceu a senha</Link>
                </div>
                <p>{text}</p>
                <button onClick={HandleLogin}>Entrar</button>
            </div>
        </div>
    );
}
