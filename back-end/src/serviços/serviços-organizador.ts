import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import ServiçosUsuário from "./serviços-usuário";
import Organizador from "../entidades/organizador";
import Campanha from "../entidades/campanha";
import Candidatura from "src/entidades/candidatura";

export default class ServiçosOrganizador {
  constructor() {}
  static async cadastrarOrganizador(request, response) {
    try {
      const { usuário_info, sistema, avaliação, experiência } =
        request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(
        usuário_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const organizador = Organizador.create({
          usuário,
          sistema,
          avaliação,
          experiência,
        });
        await transactionManager.save(organizador);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }
  static async atualizarOrganizador(request, response) {
    try {
      const { cpf, sistema, avaliação, experiência } = request.body;
      const cpf_encriptado = md5(cpf);
      await Organizador.update(
        { usuário: { cpf: cpf_encriptado } },
        { sistema, avaliação, experiência }
      );
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : atualizarOrganizador" });
    }
  }

  static async buscarOrganizador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const organizador = await Organizador.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      if (!organizador)
        return response.status(404).json({ erro: "Organizador não encontrado." });
      return response.json({
        nome: organizador.usuário.nome,
        email: organizador.usuário.email,
        sistema: organizador.sistema,
        avaliação: organizador.avaliação,
        experiência: organizador.experiência,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : buscarOrganizador" });
    }
  }

  static async cadastrarCampanha(request, response) {
  try {
    const {
      nome,
      sistema,
      descrição,
      status,
      limite_jogadores,
      urgente,
      cpf
    } = request.body;

    const cpf_encriptado = md5(cpf);
    const organizador = await Organizador.findOne({
      where: { usuário: cpf_encriptado },
      relations: ["usuário"]
    });

  
    await Campanha.create({
      nome,
      sistema,
      descrição,
      status,
      limite_jogadores,
      urgente,
      organizador
    }).save();


    return response.json();
  } catch (error) {
  console.error("Erro ao cadastrar campanha:", error); 
  return response.status(500).json({ erro: "Erro BD : cadastrarCampanha" });
}
}

static async alterarCampanha(request, response) {
  try {
    const {
      id,
      nome,
      sistema,
      descrição,
      status,
      urgente,
      limite_jogadores
    } = request.body;

    console.log("Body recebido:", request.body);

    const resultado = await Campanha.update(id, {
      nome,
      sistema,
      descrição,
      status,
      limite_jogadores,
      urgente,
    });

    console.log("Resultado do update:", resultado);

    return response.json({ mensagem: "Campanha atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao alterar campanha:", error);
    return response.status(500).json({ erro: "Erro BD : alterarCampanha" });
  }
}


static async removerCampanha(request, response) {
  try {
    const id_campanha = request.params.id;
    const campanha = await Campanha.findOne(id_campanha);

    await Campanha.remove(campanha);

    return response.json();
  } catch (error) {
    return response.status(500).json({ erro: "Erro BD : removerCampanha" });
  }
}

static async buscarCampanhasOrganizador(request, response) {
  try {
    const cpf_encriptado = md5(request.params.cpf);

    const campanhas = await Campanha.find({
      where: { organizador: { usuário: cpf_encriptado } },
      relations: ["organizador", "organizador.usuário"]
    });

    return response.json(campanhas);
  } catch (error) {
    return response.status(500).json({ erro: "Erro BD : buscarCampanhasOrganizador" });
  }
}

  static async buscarCandidaturasCampanha(request, response) {
    try {
    const id_campanha = request.params.id_campanha;
    const candidaturas = await Candidatura.find({ where: { campanha: { id: id_campanha } },
    relations: ["jogador", "jogador.usuário", "campanha"]});
    return response.json(candidaturas);
    } catch (error) { return response.status(500).json(
    { erro: "Erro BD : buscarCandidaturasCampanha" }); }
  };


}

