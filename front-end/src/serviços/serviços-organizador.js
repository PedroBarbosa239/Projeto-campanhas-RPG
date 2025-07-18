import servidor from "./servidor";

export function serviçoCadastrarOrganizador(organizador) {
  return servidor.post("/organizadores", organizador);
}

export function serviçoBuscarOrganizador(cpf) {
  return servidor.get(`/organizadores/${cpf}`);
}


export function serviçoAtualizarOrganizador(organizador) {
  return servidor.patch("/organizadores", organizador);
}

export function serviçoCadastrarCampanha(campanha) {
return servidor.post("/organizadores/campanhas", campanha); };
export function serviçoAlterarCampanha(campanha) {
return servidor.patch("/organizadores/campanhas", campanha); };
export function serviçoRemoverCampanha(id) {
return servidor.delete(`/organizadores/campanhas/${id}`); };
export function serviçoBuscarCampanhasOrganizador(cpf) {
return servidor.get(`/organizadores/campanhas/organizador/${cpf}`); };
export function serviçoBuscarÁreasAtuaçãoCampanhas() {
return servidor.get("/organizadores/campanhas/areas"); };
export function serviçoBuscarCandidaturasCampanha(id_campanha) {
return servidor.get(`/organizadores/candidaturas/${id_campanha}`); };