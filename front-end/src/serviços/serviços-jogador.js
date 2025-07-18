import servidor from "./servidor";
export function serviçoCadastrarJogador(jogador) {
  return servidor.post("/jogadores", jogador);
}
export function serviçoAtualizarJogador(jogador) {
  return servidor.patch("/jogadores", jogador);
}
export function serviçoBuscarJogador(cpf) {
  return servidor.get(`/jogadores/${cpf}`);
}

export function serviçoCadastrarCandidatura(candidatura) {
return servidor.post("/jogadores/candidaturas", candidatura); };
export function serviçoRemoverCandidatura(id) { return servidor.delete(`/jogadores/candidaturas/${id}`); };
export function serviçoBuscarCandidaturasJogador(cpf) {
return servidor.get(`/jogadores/candidaturas/jogador/${cpf}`); };
export function serviçoBuscarCampanhas() { return servidor.get("/jogadores/candidaturas/campanhas"); };