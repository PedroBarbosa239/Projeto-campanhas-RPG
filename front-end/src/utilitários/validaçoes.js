import { estilizarErro } from "./estilos";
const ERRO_CAMPO_OBRIGATÓRIO = "Campo obrigatório não preenchido";
const ERRO_CONFIRMAÇÃO_SENHA = "Senha não confere";
const ERRO_FORMATO_INVÁLIDO = "Campo com formato inválido";
const ERRO_QUESTÃO = "Resposta sem questão";

export function validarCamposObrigatórios(campos) {
  let errosCamposObrigatórios = {};
  for (let nomeCampo in campos) {
    if (campos[nomeCampo] === "" || campos[nomeCampo] === null)
      errosCamposObrigatórios[nomeCampo] = ERRO_CAMPO_OBRIGATÓRIO;
  }
  return errosCamposObrigatórios;
}

export function validarConfirmaçãoSenha(senha, confirmação_senha) {
  let errosConfirmaçãoSenhaOpcional = {};
  if (senha !== confirmação_senha) {
    errosConfirmaçãoSenhaOpcional.confirmação_senha = ERRO_CONFIRMAÇÃO_SENHA;
  }
  return errosConfirmaçãoSenhaOpcional;
}

export function validarConfirmaçãoSenhaOpcional(senha, confirmação_senha) {
  let errosConfirmaçãoSenhaOpcional = {};
  if (senha && confirmação_senha && senha !== confirmação_senha) {
    errosConfirmaçãoSenhaOpcional.confirmaçãoSenha = ERRO_CONFIRMAÇÃO_SENHA;
  }
  return errosConfirmaçãoSenhaOpcional;
}

export function validarCampoEmail(email) {
  const FORMATO_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{3}(\.\w{2})?)$/;
  let erroEmail = {};
  if (!email) erroEmail.email = ERRO_CAMPO_OBRIGATÓRIO;
  else if (!FORMATO_EMAIL.test(email)) erroEmail.email = ERRO_FORMATO_INVÁLIDO;
  return erroEmail;
}

export function validarRecuperaçãoAcessoOpcional(questão, resposta) {
  let errosRecuperaçãoAcessoOpcional = {};
  if (resposta && !questão)
    errosRecuperaçãoAcessoOpcional.questão = ERRO_QUESTÃO;
  return errosRecuperaçãoAcessoOpcional;
}

export function checarListaVazia(listaErros) {
  return Object.keys(listaErros).length === 0;
}

export function MostrarMensagemErro({ mensagem }) {
  if (mensagem) return <small className={estilizarErro()}>{mensagem}</small>;
  else return null;
}

export function validarCpf(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");
  if (cpf.length === 11) return true;
  return false;
}
