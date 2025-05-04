import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import StyleCadastrarPage from "./CadastrarPage.module.css";

export default function CadastrarPage() {
    const navigate = useNavigate();

    const initialState = {
        nome: "",
        email: "",
        email2: "",
        password: "",
        password2: "",
        text: "",
    };

    function Reducer(state, action) {
        switch (action.type) {
            case "SET_FIELD":
                return { ...state, [action.field]: action.value };
            case "RESET":
                return initialState;
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(Reducer, initialState);

    async function HandleChangeState(field, value) {
        dispatch({
            type: "SET_FIELD",
            field,
            value,
        });
    }

    async function getUsers() {
        try {
            const response = await api.get(`/Users/`, {
                params: {
                    email: state.email,
                },
            });

            return response;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return error.response;
            }
        }
    }

    async function postUsers() {
        await api.post("/Users/cadastrar", {
            nome: state.nome,
            email: state.email,
            password: state.password,
        });
    }

    async function HandleCadastro() {
        HandleChangeState("text", "");

        if (state.email != state.email2) {
            HandleChangeState("text", "O campo email deve ser igual ");
            return;
        } else if (state.password !== state.passwor2) {
            HandleChangeState("text", "O campo senha deve ser igual");
            return;
        }

        if (!state.email || !state.email2 || !state.password || !state.passwor2 || !state.nome) {
            HandleChangeState("text", "preencha todos os campos corretamente.");
        }

        console.log("rodou");

        const response = await getUsers();

        if (!response.status.ok) {
            await postUsers();
            navigate("/Login");
        } else {
            dispatch("text", "Erro no servidor, por favor tente mais tarde!");
        }
    }

    return (
        <div>
            <div className={StyleCadastrarPage.body}>
                <div className={StyleCadastrarPage.titleCadastrar}>
                    <p>Cadastrar</p>
                </div>
                <div className={StyleCadastrarPage.container}>
                    <div className={StyleCadastrarPage.formCadastrar}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={state.value}
                            onChange={(e) => HandleChangeState("nome", e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={state.value}
                            onChange={(e) => HandleChangeState("email", e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email novamente"
                            value={state.value}
                            onChange={(e) => HandleChangeState("email2", e.target.value)}
                        />
                        <input type="password" placeholder="Senha" onChange={(e) => HandleChangeState("password", e.target.value)} />
                        <input
                            type="password"
                            placeholder="Senha Novamente"
                            onChange={(e) => HandleChangeState("passwor2", e.target.value)}
                        />
                        <p>{state.text}</p>
                        <button onClick={() => HandleCadastro()}>CADASTRAR</button>
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
        </div>
    );
}
