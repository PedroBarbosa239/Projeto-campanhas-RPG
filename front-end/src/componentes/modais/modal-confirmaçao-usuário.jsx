import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  estilizarBotão,
  estilizarBotãoRemover,
  estilizarDivCampo,
  estilizarInlineFlex,
  estilizarLabel,
  estilizarModal,
} from "../../utilitários/estilos";
import {
  serviçoAlterarUsuário,
  serviçoRemoverUsuário,
} from "../../serviços/serviços-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";

export default function ModalConfirmaçãoUsuário() {
  const referênciaToast = useRef(null);
  const {
    setUsuárioLogado,
    confirmaçãoUsuário,
    setConfirmaçãoUsuário,
    setMostrarModalConfirmação,
    usuárioLogado,
  } = useContext(ContextoUsuário);
  const dados = {
    cpf: confirmaçãoUsuário?.cpf,
    perfil: confirmaçãoUsuário?.perfil,
    nome: confirmaçãoUsuário?.nome,
    senha: confirmaçãoUsuário?.senha,
    email: confirmaçãoUsuário?.email,
    questão: confirmaçãoUsuário?.questão,
    resposta: confirmaçãoUsuário?.resposta,
    cor_tema: confirmaçãoUsuário?.cor_tema,
  };
  const [redirecionar, setRedirecionar] = useState(false);

  const navegar = useNavigate();
  function labelOperação() {
    switch (confirmaçãoUsuário?.operação) {
      case "salvar":
        return "Salvar";
      case "alterar":
        return "Alterar";
      case "remover":
        return "Remover";
      default:
        return;
    }
  }

  function exibirPerfilFormatado() {
    switch (dados.perfil) {
      case "organizador":
        return "Organizador";
      case "jogador":
        return "Jogador";
      default:
        return "";
    }
  }
  function fecharToast() {
    if (redirecionar) {
      setMostrarModalConfirmação(false);
      setConfirmaçãoUsuário({});
      if (confirmaçãoUsuário?.operação) setUsuárioLogado({}); 
      navegar("../pagina-inicial");
    }
  }
  function finalizarCadastro() {
    if (dados.perfil === "organizador") {
      setUsuárioLogado({ ...dados, cadastrado: false });
      setMostrarModalConfirmação(false);
      navegar("../cadastrar-organizador");
    } else if (dados.perfil === "jogador") {
      setUsuárioLogado({ ...dados, cadastrado: false });
      setMostrarModalConfirmação(false);
      navegar("../cadastrar-jogador");
    }
  }
  async function alterarUsuário(dadosAlterados) {
    try {
      const response = await serviçoAlterarUsuário({
        ...dadosAlterados,
        cpf: usuárioLogado.cpf,
      });
      setUsuárioLogado({ ...usuárioLogado, ...response.data });
      setRedirecionar(true);
      mostrarToast(
        referênciaToast,
        "Alterado com sucesso! Redirecionando à Página Inicial...",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referênciaToast, error.response.data.erro, "erro");
    }
  }
  async function removerUsuário() {
    try {
      await serviçoRemoverUsuário(usuárioLogado.cpf);
      setRedirecionar(true);
      mostrarToast(
        referênciaToast,
        "Removido com sucesso! Redirecionando ao Login.",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referênciaToast, error.response.data.erro, "erro");
    }
  }

  function executarOperação() {
    switch (confirmaçãoUsuário.operação) {
      case "salvar":
        finalizarCadastro();
        break;
      case "alterar":
        alterarUsuário({
          email: dados.email,
          senha: dados.senha,
          questão: dados.questão,
          resposta: dados.resposta,
          cor_tema: dados.cor_tema,
        });
        break;
      case "remover":
        removerUsuário();
        break;
      default:
        break;
    }
  }

  function ocultar() {
    if (!redirecionar) {
      setConfirmaçãoUsuário({});
      setMostrarModalConfirmação(false);
    }
  }
  return (
    <div className={estilizarModal()}>
      <Toast
        ref={referênciaToast}
        onHide={fecharToast}
        position="bottom-center"
      />
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Tipo de Perfil:
        </label>
        <label>{exibirPerfilFormatado()}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          CPF -- nome de usuário:
        </label>
        <label>{dados.cpf}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Nome Completo:
        </label>
        <label>{dados.nome}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Email:
        </label>
        <label>{dados.email}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Questão de Segurança:
        </label>
        <label>{dados.questão}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmaçãoUsuário?.cor_tema)}>
          Resposta:
        </label>
        <label>{dados.resposta}</label>
      </div>
      <div className={estilizarInlineFlex()}>
        <Button
          label={labelOperação()}
          onClick={executarOperação}
          className={estilizarBotão(confirmaçãoUsuário?.cor_tema)}
        />
        <Button
          label="Corrigir"
          onClick={ocultar}
          className={estilizarBotãoRemover(confirmaçãoUsuário?.cor_tema)}
        />
      </div>
    </div>
  );
}
