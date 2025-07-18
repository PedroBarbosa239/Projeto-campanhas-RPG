import { Router } from "express";
import ServiçosUsuário from "src/serviços/serviços-usuário";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";

const RotasUsuário = Router();
export default RotasUsuário;
RotasUsuário.post("/login", ServiçosUsuário.logarUsuário);
RotasUsuário.post("/verificar-cpf/:cpf", ServiçosUsuário.verificarCpfExistente);
RotasUsuário.patch(
  "/alterar-usuario",
  verificarToken,
  ServiçosUsuário.alterarUsuário
);
RotasUsuário.delete(
  "/:cpf",
  verificarToken,
  verificarErroConteúdoToken,
  ServiçosUsuário.removerUsuário
);
RotasUsuário.get("/questao/:cpf", ServiçosUsuário.buscarQuestãoSegurança);
RotasUsuário.post(
  "/verificar-resposta",
  ServiçosUsuário.verificarRespostaCorreta
);
