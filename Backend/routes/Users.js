import { PrismaClient } from "../prisma/generated/client1/index.js";
import express from "express";
import nodemailer from "nodemailer";

const routerUsersAPI = express.Router();
const prisma = new PrismaClient();

async function GenerateToken(email) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";

    for (let i = 0; i <= 32; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    token += email;

    return token;
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "cesartakahashi24@gmail.com",
        pass: "noin idwp ipfx dgbv",
    },
});

routerUsersAPI.post("/cadastrar", async (req, res) => {
    try {
        let tokenUser = await GenerateToken(req.body.email);

        const novoUsuario = await prisma.user.create({
            data: {
                nome: req.body.nome,
                email: req.body.email,
                password: req.body.password,
                token: tokenUser,
                verificado: false,
            },
        });

        if (novoUsuario) {
            await transporter.sendMail({
                from: '"SilkOS Systems" <email>',
                to: req.body.email,
                subject: "Confirmação de email",
                html: `Clique nesse link para validar sua conta: 
                <a href="http://localhost:3000/Users/validarEmail?token=${tokenUser}&email=${req.body.email}">Validar Conta</a>`,
            });
        }

        res.status(201).json({ message: "Usuário criado!", user: novoUsuario });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: error.message });
    }
});

routerUsersAPI.get("/validarEmail", async (req, res) => {
    const { email, token } = req.query;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user || user.token !== token) {
            return res.status(400).json({ message: "Token inválido ou usuário não encontrado." });
        }

        await prisma.user.update({
            where: { email: email },
            data: {
                token: null,
                verificado: true,
            },
        });

        return res.status(200).json({ message: "Email validado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao validar email." });
    }
});

routerUsersAPI.post("/recuperarSenhaEmail", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(200).json({ message: "Usuário não existe" });
        }

        let RecToken = await GenerateToken(email);

        await prisma.user.update({
            where: { email: email },
            data: {
                token: RecToken,
            },
        });

        await transporter.sendMail({
            from: '"SilkOS Systems" <email>',
            to: email,
            subject: "Recuperção de senha",
            html: `Clique nesse link para redefinir sua senha: 
            <a href="http://localhost:5173/NovaSenha?token=${RecToken}&email=${email}">Alterar senha</a>`,
        });

        res.status(200).json({ message: "Email enviado com sucesso!" });
    } catch (e) {
        res.status(500).json({ error: "Erro ao enviar email: " + e.message });
    }
});

routerUsersAPI.put("/redefinirSenha", async (req, res) => {
    const { email, token, novaSenha } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.token !== token) {
            return res.status(400).json({ message: "Token inválido ou expirado" });
        }

        await prisma.user.update({
            where: { email },
            data: {
                password: novaSenha,
                token: null,
            },
        });

        res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (e) {
        res.status(500).json({ error: "Erro ao redefinir senha: " + e.message });
    }
});

routerUsersAPI.post("/autenticar", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios!" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Usuaário não encontrado!" });
        }

        if (!user.verificado) {
            return res.status(403).json({ message: "Usuário não verificado!" });
        }

        return res.status(200).json({ message: "Usuário autenticado!" });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: error.message });
    }
});

export default routerUsersAPI;
