import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoAlterarUsuário } from "../../serviços/serviços-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
  validarConfirmaçãoSenha,
} from "../../utilitários/validaçoes";
import {
  TAMANHOS,
  estilizarBotão,
  estilizarDivCampo,
  estilizarLabel,
  estilizarModal,
  estilizarPasswordInput,
  estilizarPasswordTextInputBorder,
} from "../../utilitários/estilos";
export default function ModalRecuperarAcesso() {
  const referênciaToast = useRef(null);
  const {
    cpfVerificado,
    setCpfVerificado,
    novaSenha,
    setNovaSenha,
    tokenRecuperação,
    setTokenRecuperação,
  } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    senha: novaSenha?.senha || "",
    confirmação: novaSenha?.confirmação || "",
  });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();
  function validarCampos() {
    let errosCamposObrigatórios = validarCamposObrigatórios(dados);
    let errosSenhasDiferentes = validarConfirmaçãoSenha(
      dados.senha,
      dados.confirmação
    );
    setErros({ ...errosCamposObrigatórios, ...errosSenhasDiferentes });
    return (
      checarListaVazia(errosCamposObrigatórios) &&
      checarListaVazia(errosSenhasDiferentes)
    );
  }
  async function alterarSenha() {
    if (validarCampos()) {
      await serviçoAlterarUsuário({
        cpf: cpfVerificado,
        senha: dados.senha,
        tokenRecuperação,
      });
      setTokenRecuperação(null);
      mostrarToast(
        referênciaToast,
        "Senha redefinida com sucesso! Redirecionando ao Login...",
        "sucesso"
      );
    }
  }
  function navegarLogarUsuário() {
    setCpfVerificado("");
    setNovaSenha({});
    navegar("/");
  }
  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }
  return (
    <div className={estilizarModal()}>
      <Toast
        ref={referênciaToast}
        onHide={navegarLogarUsuário}
        position="bottom-center"
      />
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel()}>Senha e Confirmar Senha*:</label>
        <Password
          name="senha"
          inputClassName={estilizarPasswordTextInputBorder()}
          toggleMask
          className={estilizarPasswordInput(erros.senha)}
          size={TAMANHOS.SENHA}
          value={dados.senha}
          onChange={alterarEstado}
        />
        <Password
          name="confirmação"
          inputClassName={estilizarPasswordTextInputBorder()}
          toggleMask
          className={estilizarPasswordInput(
            erros.senha || erros.confirmação_senha
          )}
          size={TAMANHOS.SENHA}
          feedback={false}
          value={dados.confirmação}
          onChange={alterarEstado}
        />
        <MostrarMensagemErro mensagem={erros.senha || erros.confirmação} />
      </div>
      <Button
        className={estilizarBotão()}
        label="Salvar"
        onClick={alterarSenha}
      />
    </div>
  );
}
