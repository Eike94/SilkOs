import express from "express";
import cors from "cors";
import routerUsersAPI from "./routes/Users.js";
import routerServicos from "./routes/Servicos.js";
import routerClientes from "./routes/Clientes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/Users", routerUsersAPI);
app.use("/Servicos", routerServicos);
app.use("/Clientes", routerClientes);
// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo deu errado!");
});
// Middleware para tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).send("Rota não encontrada!");
});
app.listen(3000, () => {
    console.log("Rodando na porta 3000");
});
