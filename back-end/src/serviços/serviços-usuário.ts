import bcrypt from "bcrypt";
import dotenv from "dotenv";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuário, { Perfil } from "../entidades/usuário";
import Organizador from "../entidades/organizador";
import Jogador from "../entidades/jogador";
import { getManager } from "typeorm";

dotenv.config();

const SALT = 10;
const SENHA_JWT = process.env.SENHA_JWT;

export default class ServiçosUsuário {
  constructor() {}

  static async verificarCpfExistente(request, response) {
    
      await ServiçosUsuário.listarTodosUsuários();
      try {
        const cpf_encriptado = md5(request.params.cpf);
        const usuário = await Usuário.findOne(cpf_encriptado);
        console.log("cpf", cpf_encriptado);
        if (usuário)
          return response.status(400).json({ erro: "CPF já cadastrado." });
        else return response.json();
      } catch (error) {
        return response
          .status(500)
          .json({ erro: "Erro BD: verificarCpfCadastrado" });
      }
  }



  static async listarTodosUsuários() {
    try {
      const usuários = await Usuário.find();
      console.log("users:", usuários);
      console.log("=== Lista de Todos os Usuários ===");
      return usuários;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw new Error("Erro ao buscar usuários no banco de dados");
    }
  }

  static async verificarCadastroCompleto(usuário: Usuário) {
    switch (usuário.perfil) {
      case Perfil.ORGANIZADOR:
        const organizador = await Organizador.findOne({
          where: { usuário: usuário.cpf },
          relations: ["usuário"],
        });
        if (!organizador) return false;
        return true;
      case Perfil.JOGADOR:
        const jogador = await Jogador.findOne({
          where: { usuário: usuário.cpf },
          relations: ["usuário"],
        });
        if (!jogador) return false;
        return true;
      default:
        return;
    }
  }

  static async logarUsuário(request, response) {
    try {
      const { nome_login, senha } = request.body;
      const cpf_encriptado = md5(nome_login);
      const usuário = await Usuário.findOne(cpf_encriptado);
      if (!usuário)
        return response
          .status(404)
          .json({ erro: "Nome de usuário não cadastrado." });
      const cadastro_completo = await ServiçosUsuário.verificarCadastroCompleto(
        usuário
      );
      if (!cadastro_completo) {
        await Usuário.remove(usuário);
        return response.status(400).json({
          erro: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
        });
      }

      const senha_correta = await bcrypt.compare(senha, usuário.senha);
      if (!senha_correta)
        return response.status(401).json({ erro: "Senha incorreta." });
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        SENHA_JWT,
        { subject: usuário.nome, expiresIn: "1d" }
      );
      return response.json({
        usuárioLogado: {
          nome: usuário.nome,
          perfil: usuário.perfil,
          email: usuário.email,
          questão: usuário.questão,
          status: usuário.status,
          cor_tema: usuário.cor_tema,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: logarUsuário" });
    }
  }

  static async cadastrarUsuário(usuário_informado) {
    try {
      const { cpf, nome, perfil, email, senha, questão, resposta, cor_tema } =
        usuário_informado;
      console.log("ServiçosUsuário.cadastrarUsuário:nome -- " + nome);
      // console.log(JSON.parse(JSON.stringify(usuário_informado)));
      const cpf_encriptado = md5(cpf);
      const senha_encriptada = await bcrypt.hash(senha, SALT);
      const resposta_encriptada = await bcrypt.hash(resposta, SALT);
      const usuário = Usuário.create({
        cpf: cpf_encriptado,
        nome,
        perfil,
        email,
        senha: senha_encriptada,
        questão,
        resposta: resposta_encriptada,
        cor_tema,
      });
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        SENHA_JWT,
        { subject: usuário.nome, expiresIn: "1d" }
      );
      return { usuário, senha, token };
    } catch (error) {
      throw new Error("Erro BD: cadastrarUsuário");
    }
  }

  static async alterarUsuário(request, response) {
    try {
      const { cpf, senha, questão, resposta, cor_tema, email } = request.body;
      const cpf_encriptado = md5(cpf);
      let senha_encriptada: string, resposta_encriptada: string;
      let token: string;
      const usuário = await Usuário.findOne(cpf_encriptado);
      if (email) {
        usuário.email = email;
        token = sign({ perfil: usuário.perfil, email }, SENHA_JWT, {
          subject: usuário.nome,
          expiresIn: "1d",
        });
      }
      if (cor_tema) usuário.cor_tema = cor_tema;
      if (senha) {
        senha_encriptada = await bcrypt.hash(senha, SALT);
        usuário.senha = senha_encriptada;
      }
      if (resposta) {
        resposta_encriptada = await bcrypt.hash(resposta, SALT);
        usuário.questão = questão;
        usuário.resposta = resposta_encriptada;
      }
      await Usuário.save(usuário);
      const usuário_info = {
        nome: usuário.nome,
        perfil: usuário.perfil,
        email: usuário.email,
        questão: usuário.questão,
        status: usuário.status,
        cor_tema: usuário.cor_tema,
        token: null,
      };
      if (token) usuário_info.token = token;
      return response.json(usuário_info);
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: alterarUsuário" });
    }
  }

  static async removerUsuário(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        const usuário = await transactionManager.findOne(
          Usuário,
          cpf_encriptado
        );
        await transactionManager.remove(usuário);
        return response.json();
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: removerUsuário" });
    }
  }
  static async buscarQuestãoSegurança(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuário = await Usuário.findOne(cpf_encriptado);
      if (usuário) return response.json({ questão: usuário.questão });
      else return response.status(404).json({ mensagem: "CPF não cadastrado" });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarQuestãoSegurança" });
    }
  }
  static async verificarRespostaCorreta(request, response) {
    try {
      const { cpf, resposta } = request.body;
      const cpf_encriptado = md5(cpf);
      const usuário = await Usuário.findOne(cpf_encriptado);
      const resposta_correta = await bcrypt.compare(resposta, usuário.resposta);
      if (!resposta_correta)
        return response.status(401).json({ mensagem: "Resposta incorreta." });
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        process.env.SENHA_JWT,
        { subject: usuário.nome, expiresIn: "1h" }
      );
      return response.json({ token });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: verificarRespostaCorreta" });
    }
  }
}
