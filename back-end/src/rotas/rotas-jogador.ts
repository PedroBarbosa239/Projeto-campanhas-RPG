import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import verificarPerfilJogador from "../middlewares/verificar-perfil-jogador";
import ServiçosJogador from "../serviços/serviços-jogador";

const RotasJogador = Router();
export default RotasJogador;
RotasJogador.post("/", ServiçosJogador.cadastrarJogador);
RotasJogador.patch(
  "/",
  verificarToken,
  verificarPerfilJogador,
  ServiçosJogador.atualizarJogador
);
RotasJogador.get(
  "/:cpf",
  verificarToken,
  verificarPerfilJogador,
  ServiçosJogador.buscarJogador
);

RotasJogador.post("/candidaturas/", verificarToken, verificarPerfilJogador,
ServiçosJogador.cadastrarCandidatura);
RotasJogador.delete("/candidaturas/:id", verificarToken, verificarPerfilJogador,
ServiçosJogador.removerCandidatura);
RotasJogador.get("/candidaturas/jogador/:cpf", verificarToken, verificarPerfilJogador,
verificarErroConteúdoToken, ServiçosJogador.buscarCandidaturasJogador);
RotasJogador.get("/candidaturas/campanhas/", verificarToken, verificarPerfilJogador,
ServiçosJogador.buscarCampanhas);