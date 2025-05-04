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
                subject: "Confirmação de Email - SilkOS",
                html: `
                  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                      <h2 style="color: #333;">Olá, ${req.body.nome}!</h2>
                      <p style="font-size: 16px; color: #555;">
                        Obrigado por se registrar no <strong>SilkOS</strong>. Para ativar sua conta, clique no botão abaixo:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://silkos.onrender.com/Users/validarEmail?token=${tokenUser}&email=${req.body.email}"
                           style="background-color: #28a745; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                          Validar Conta
                        </a>
                      </div>
                      <p style="font-size: 14px; color: #999;">Se você não realizou este cadastro, ignore este e-mail.</p>
                      <hr style="margin-top: 40px;" />
                      <p style="font-size: 12px; color: #aaa;">SilkOS - Todos os direitos reservados.</p>
                    </div>
                  </div>
                `,
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
            subject: "Recuperação de Senha - SilkOS",
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Recuperação de Senha</h2>
        <p style="font-size: 16px; color: #555;">
          Foi solicitada a recuperação de senha para sua conta. Se você fez isso, clique no botão abaixo para redefinir:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://silkos.onrender.com/EsqueceuSenha?token=${RecToken}&email=${email}"
             style="background-color: #007bff; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Redefinir Senha
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">Se você não solicitou isso, apenas ignore este e-mail.</p>
        <hr style="margin-top: 40px;" />
        <p style="font-size: 12px; color: #aaa;">SilkOS - Todos os direitos reservados.</p>
      </div>
    </div>
  `,
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
