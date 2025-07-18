import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Jogador from "../entidades/jogador";
import ServiçosUsuário from "./serviços-usuário";
import Campanha from "../entidades/campanha";
import Candidatura from "../entidades/candidatura";

export default class ServiçosJogador {
  constructor() {}
  static async cadastrarJogador(request, response) {
    try {
      const { usuário_info, texto_descritivo, anos_experiência } = request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(
        usuário_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const jogador = Jogador.create({ usuário, texto_descritivo, anos_experiência });
        await transactionManager.save(jogador);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }
  static async atualizarJogador(request, response) {
    try {
      const { cpf, texto_descritivo, anos_experiência } = request.body;
      const cpf_encriptado = md5(cpf);
      await Jogador.update(
        { usuário: { cpf: cpf_encriptado } },
        { texto_descritivo, anos_experiência }
      );
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : atualizarJogador" });
    }
  }
  static async buscarJogador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const jogador = await Jogador.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      if (!jogador)
        return response
          .status(404)
          .json({ erro: "Jogador não encontrado." });
      return response.json({
        nome: jogador.usuário.nome,
        texto_descritivo: jogador.texto_descritivo,

        anos_experiência: jogador.anos_experiência,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarJogador" });
    }
  }

static async cadastrarCandidatura(request, response) {
  try {
    const { id_campanha, data_submissão, descrição,carta,personagem_pronto, cpf } = request.body;

    const cpf_encriptado = md5(cpf);

    const jogador = await Jogador.findOne({ where: { usuário: cpf_encriptado } });
    const campanha = await Campanha.findOne(id_campanha);

    const candidaturas = await Candidatura.find({ where: { jogador, campanha } });

    if (candidaturas.length > 0) {
      return response.status(404).json({
        erro: "O jogador já cadastrou candidatura para a campanha."
      });
    }

    await Candidatura.create({
      data_submissão,
      descrição,
      carta,
      jogador,
      personagem_pronto,
      campanha
    }).save();

    return response.json();
  } catch (error) {
    return response.status(500).json({ erro: "Erro BD : cadastrarCandidatura" });
  }
}

static async removerCandidatura(request, response) {
  try {
    const id = request.params.id;

    await Candidatura.delete(id);

    return response.json();
  } catch (error) {
    return response.status(500).json({ erro: "Erro BD : removerCandidatura" });
  }
}

static async buscarCandidaturasJogador(request, response) {
  try {
    const cpf_encriptado = md5(request.params.cpf);

    const candidaturas = await Candidatura.find({
      where: { jogador: { usuário: cpf_encriptado } },
      relations: [
        "jogador",
        "jogador.usuário",
        "campanha",
        "campanha.organizador",
        "campanha.organizador.usuário"
      ]
    });

    return response.json(candidaturas);
  } catch (error) {
    return response.status(500).json({ erro: "Erro BD : buscarCandidaturasJogador" });
  }
}

static async buscarCampanhas(request, response) {
  try {
    const campanhas = await Campanha.find({
      relations: ["organizador", "organizador.usuário"]
    });

    return response.json(campanhas);
  } catch (error) {
    console.error("Erro buscarCampanhas:", error);
    return response.status(500).json({ erro: error.message, detalhes: error });
  }
}



}
