import servidor from "./servidor";

export function serviçoLogarUsuário(login) {
  return servidor.post("usuarios/login", login);
}

export function serviçoVerificarCpfExistente(cpf) {
  return servidor.post(`/usuarios/verificar-cpf/${cpf}`);
}

export function serviçoAlterarUsuário(usuário) {
  return servidor.patch("/usuarios/alterar-usuario", usuário, {
    headers: { Authorization: `Bearer ${usuário.tokenRecuperação}` },
  });
}
export function serviçoRemoverUsuário(cpf) {
  return servidor.delete(`/usuarios/${cpf}`);
}
export function serviçoBuscarQuestãoSegurança(cpf) {
  return servidor.get(`/usuarios/questao/${cpf}`);
}
export function serviçoVerificarRespostaCorreta(resposta) {
  return servidor.post("/usuarios/verificar-resposta", resposta);
}
