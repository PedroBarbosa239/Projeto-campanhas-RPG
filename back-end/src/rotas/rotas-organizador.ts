import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import ServiçosOrganizador from "src/serviços/serviços-organizador";
import verificarPerfilOrganizador from "../middlewares/verificar-perfil-organizador";

const RotasOrganizador = Router();
export default RotasOrganizador;

RotasOrganizador.post("/", ServiçosOrganizador.cadastrarOrganizador);
RotasOrganizador.get(
  "/:cpf",
  verificarToken,
  verificarPerfilOrganizador,
  ServiçosOrganizador.buscarOrganizador
);

RotasOrganizador.patch(
  "/",
  verificarToken,
  verificarPerfilOrganizador,
  ServiçosOrganizador.atualizarOrganizador
);

RotasOrganizador.post("/campanhas", verificarToken, verificarPerfilOrganizador,
ServiçosOrganizador.cadastrarCampanha);
RotasOrganizador.patch("/campanhas", verificarToken, verificarPerfilOrganizador,
ServiçosOrganizador.alterarCampanha);
RotasOrganizador.delete("/campanhas/:id", verificarToken, verificarPerfilOrganizador,
ServiçosOrganizador.removerCampanha);
RotasOrganizador.get("/campanhas/organizador/:cpf", verificarToken, verificarPerfilOrganizador,
verificarErroConteúdoToken, ServiçosOrganizador.buscarCampanhasOrganizador);

RotasOrganizador.get("/candidaturas/:id_campanha", verificarToken, verificarPerfilOrganizador,
ServiçosOrganizador.buscarCandidaturasCampanha);
