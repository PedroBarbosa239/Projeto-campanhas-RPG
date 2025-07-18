import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ModalConfirmaçãoUsuário from "../../componentes/modais/modal-confirmaçao-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";
import { CPF_MÁSCARA } from "../../utilitários/máscaras";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCampoEmail,
  validarCamposObrigatórios,
  validarConfirmaçãoSenha,
  validarConfirmaçãoSenhaOpcional,
  validarRecuperaçãoAcessoOpcional,
} from "../../utilitários/validaçoes";

import {
  TAMANHOS,
  TEMA_PADRÃO,
  estilizarBotão,
  estilizarBotãoRemover,
  estilizarCard,
  estilizarDialog,
  estilizarDivBotõesAção,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarFooterDialog,
  estilizarInputMask,
  estilizarInputText,
  estilizarLabel,
  estilizarLink,
  estilizarPasswordInput,
  estilizarPasswordTextInputBorder,
  estilizarSubtítulo,
  opçõesCores,
} from "../../utilitários/estilos";

import { serviçoVerificarCpfExistente } from "../../serviços/serviços-usuário";

export default function CadastrarUsuário() {
  const referênciaToast = useRef(null);
  const {
    usuárioLogado,
    mostrarModalConfirmação,
    setMostrarModalConfirmação,
    setConfirmaçãoUsuário,
  } = useContext(ContextoUsuário);

  const [dados, setDados] = useState({
    cpf: usuárioLogado?.cpf || "",
    nome: usuárioLogado?.nome || "",
    perfil: usuárioLogado?.perfil || "",
    email: usuárioLogado?.email || "",
    senha: "",
    confirmação: "",
    questão: usuárioLogado?.questão || "",
    resposta: "",
    cor_tema: usuárioLogado?.cor_tema || TEMA_PADRÃO,
  });

  const [erros, setErros] = useState({});

  const opçõesPerfis = [
    { label: "Organizador", value: "organizador" },
    { label: "Jogador", value: "jogador" },
  ];

  function alterarEstado(event) {
    const chave = event.target.name;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }

  function validarCamposAdministrar() {
    const { email, senha, confirmação, questão, resposta } = dados;

    let errosCamposObrigatórios = validarCamposObrigatórios({ email });
    let errosValidaçãoEmail = validarCampoEmail(email);
    let errosConfirmaçãoSenhaOpcional = validarConfirmaçãoSenhaOpcional(
      senha,
      confirmação
    );

    let errosRecuperaçãoAcessoOpcional = validarRecuperaçãoAcessoOpcional(
      questão,
      resposta
    );

    setErros({
      ...errosCamposObrigatórios,
      ...errosConfirmaçãoSenhaOpcional,
      ...errosRecuperaçãoAcessoOpcional,
      ...errosValidaçãoEmail,
    });

    return (
      checarListaVazia(errosCamposObrigatórios) &&
      checarListaVazia(errosConfirmaçãoSenhaOpcional) &&
      checarListaVazia(errosValidaçãoEmail) &&
      checarListaVazia(errosRecuperaçãoAcessoOpcional)
    );
  }

  function validarCamposCadastrar() {
    const { perfil, cpf, nome, questão, resposta, senha, confirmação, email } =
      dados;

    console.log(
      "CadastrarUsuário.validarCamposCadastrar:dados.nome -- " + dados.nome
    );

    console.log(JSON.parse(JSON.stringify(dados)));

    if (!usuárioLogado?.perfil) {
      let errosCamposObrigatórios = validarCamposObrigatórios({
        perfil,
        cpf,
        nome,
        questão,
        resposta,
        senha,
        confirmação,
        email,
      });

      let errosValidaçãoEmail = validarCampoEmail(email);
      let errosConfirmaçãoSenha = validarConfirmaçãoSenha(senha, confirmação);

      setErros({
        ...errosCamposObrigatórios,
        ...errosConfirmaçãoSenha,
        ...errosValidaçãoEmail,
      });

      return (
        checarListaVazia(errosCamposObrigatórios) &&
        checarListaVazia(errosConfirmaçãoSenha) &&
        checarListaVazia(errosValidaçãoEmail)
      );
    }
  }

  function validarCampos() {
    if (!usuárioLogado?.perfil) return validarCamposCadastrar();
    else return validarCamposAdministrar();
  }

  function títuloFormulário() {
    if (!usuárioLogado?.perfil) return "Cadastrar Usuário";
    else return "Alterar Usuário";
  }

  function validarConfirmarAlteração() {
    const camposVálidos = validarCampos();
    if (camposVálidos) confirmarOperação("alterar");
  }

  function textoRetorno() {
    if (!usuárioLogado?.perfil) return "Retornar para login";
    else return "Retornar para página inicial";
  }

  function linkRetorno() {
    if (!usuárioLogado?.perfil) return "/";
    else return "/pagina-inicial";
  }

  function limparOcultar() {
    setConfirmaçãoUsuário(null);
    setMostrarModalConfirmação(false);
  }

  async function validarConfirmarCriação() {
    const camposVálidos = validarCampos();
    console.log("dados: ", dados);
    
    if (camposVálidos) {
      let response;
      try {
        response = await serviçoVerificarCpfExistente(dados.cpf);
        if (response) confirmarOperação("salvar");
      } catch (error) {
        console.log(error);
        //if (error.response.data.erro) {
     //    mostrarToast(referênciaToast, error.response.data.erro, "erro");
      //  }
      }
    }
  }

  function confirmarOperação(operação) {
    setConfirmaçãoUsuário({ ...dados, operação });
    setMostrarModalConfirmação(true);
  }

  function ComandosConfirmação() {
    if (!usuárioLogado?.perfil) {
      return (
        <Button
          className={estilizarBotão(dados.cor_tema)}
          label="Salvar"
          onClick={validarConfirmarCriação}
        />
      );
    } else {
      return (
        <div className={estilizarDivBotõesAção()}>
          <Button
            className={estilizarBotão(dados.cor_tema)}
            label="Alterar"
            onClick={() => validarConfirmarAlteração()}
          />
          <Button
            className={estilizarBotãoRemover(dados.cor_tema)}
            label="Remover"
            onClick={() => confirmarOperação("remover")}
          />
        </div>
      );
    }
  }

  function alinharCentro() {
    if (!usuárioLogado?.cadastrado) return "center";
  }

  return (
    <div className={estilizarFlex(alinharCentro())}>
      <Toast ref={referênciaToast} position="bottom-center" />

      <Dialog
        visible={mostrarModalConfirmação}
        className={estilizarDialog()}
        header="Confirme seus dados"
        onHide={limparOcultar}
        closable={false}
        footer={<div className={estilizarFooterDialog()}></div>}
      >
        <ModalConfirmaçãoUsuário />
      </Dialog>

      <Card
        title={títuloFormulário()}
        className={estilizarCard(dados.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Tipo de Perfil*:
          </label>
          <Dropdown
            name="perfil"
            className={estilizarDropdown(erros.perfil, dados.cor_tema)}
            value={dados.perfil}
            options={opçõesPerfis}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
            disabled={usuárioLogado?.perfil}
          />
          <MostrarMensagemErro mensagem={erros.perfil} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtítulo(dados.cor_tema)}>Dados Pessoais</h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>CPF*:</label>
          <InputMask
            name="cpf"
            autoClear
            className={estilizarInputMask(erros.cpf, dados.cor_tema)}
            mask={CPF_MÁSCARA}
            size={TAMANHOS.CPF}
            value={dados.cpf}
            onChange={alterarEstado}
            disabled={usuárioLogado?.perfil}
          />
          <MostrarMensagemErro mensagem={erros.cpf} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Nome Completo*:
          </label>
          <InputText
            name="nome"
            className={estilizarInputText(erros.nome, 400, dados.cor_tema)}
            value={dados.nome}
            onChange={alterarEstado}
            disabled={usuárioLogado?.perfil}
          />
          <MostrarMensagemErro mensagem={erros.nome} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>Email*:</label>
          <InputText
            name="email"
            className={estilizarInputText(erros.email, 400, dados.cor_tema)}
            value={dados.email}
            onChange={alterarEstado}
          />

          <MostrarMensagemErro mensagem={erros.email} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtítulo(dados.cor_tema)}>Dados de Login</h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Senha e Confirmação*:
          </label>
          <Password
            name="senha"
            inputClassName={estilizarPasswordTextInputBorder(
              erros.senha,
              dados.cor_tema
            )}
            className={estilizarPasswordInput(erros.senha)}
            toggleMask
            value={dados.senha}
            onChange={alterarEstado}
            size={TAMANHOS.SENHA}
            tooltip={
              usuárioLogado?.token &&
              "Será alterada somente se a senha e a confirmação forem informadas."
            }
          />
          <Password
            name="confirmação"
            className={estilizarPasswordInput(dados.cor_tema)}
            toggleMask
            inputClassName={estilizarPasswordTextInputBorder(
              erros.senha || erros.confirmação_senha,
              dados.cor_tema
            )}
            size={TAMANHOS.SENHA}
            feedback={false}
            value={dados.confirmação}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro
            mensagem={erros.senha || erros.confirmação_senha}
          />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtítulo(dados.cor_tema)}>
          Recuperação da conta
        </h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Questão de Segurança*:
          </label>
          <InputText
            name="questão"
            className={estilizarInputText(erros.questão, 400, dados.cor_tema)}
            placeholder="Ex: Qual era o nome do meu primeiro pet?"
            value={dados.questão}
            onChange={alterarEstado}
            tooltipOptions={{ position: "top" }}
            tooltip={
              usuárioLogado?.token &&
              "Se a resposta não for informada: a alteração de questão será ignorada."
            }
          />
          <MostrarMensagemErro mensagem={erros.questão} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>Resposta*:</label>
          <InputText
            name="resposta"
            className={estilizarInputText(erros.resposta, 400, dados.cor_tema)}
            value={dados.resposta}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.resposta} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtítulo(dados.cor_tema)}>Configurações*: </h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Cor do Tema*:
          </label>
          <Dropdown
            name="cor_tema"
            className={estilizarDropdown(erros.cor_tema, dados.cor_tema)}
            value={dados.cor_tema}
            options={opçõesCores}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.cor_tema} />
        </div>
        <ComandosConfirmação />
        <div className={estilizarFlex("center")}>
          <Link to={linkRetorno()} className={estilizarLink(dados.cor_tema)}>
            {textoRetorno()}
          </Link>
        </div>
      </Card>
    </div>
  );
}
