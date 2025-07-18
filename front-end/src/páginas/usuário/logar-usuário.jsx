import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoLogarUsuário } from "../../serviços/serviços-usuário";
import mostrarToast from "../../utilitários/mostrar-toast";
import { CPF_MÁSCARA } from "../../utilitários/máscaras";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validaçoes";

import {
  TAMANHOS,
  estilizarBotão,
  estilizarCard,
  estilizarDivCampo,
  estilizarFlex,
  estilizarInputMask,
  estilizarLabel,
  estilizarLink,
  estilizarLogo,
  estilizarPasswordInput,
  estilizarPasswordTextInputBorder,
  estilizarPáginaÚnica,
} from "../../utilitários/estilos";

export default function LogarUsuário() {
  const referênciaToast = useRef(null);
  const { setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ nome_login: "", senha: "" });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();

  function validarCampos() {
    const erros = validarCamposObrigatórios(dados);
    setErros(erros);
    return checarListaVazia(erros);
  }

  async function logarUsuário() {
    if (validarCampos()) {
      try {
        const response = await serviçoLogarUsuário(dados);
        setUsuárioLogado({
          ...response.data?.usuárioLogado,
          cpf: dados.nome_login,
          cadastrado: true,
        });
        navegar("/pagina-inicial");
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
  }

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }

  return (
    <div className={estilizarPáginaÚnica()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <h1 className={estilizarLogo()}>Campanhas de RPG</h1>
      <Card title="Login" className={estilizarCard()}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Usuário</label>
          <InputMask
            name="nome_login"
            size={TAMANHOS.CPF}
            className={estilizarInputMask(erros.nome_login)}
            autoClear
            mask={CPF_MÁSCARA}
            value={dados.nome_login}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.nome_login} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Senha</label>
          <Password
            name="senha"
            inputClassName={estilizarPasswordTextInputBorder()}
            className={estilizarPasswordInput(erros.senha)}
            size={TAMANHOS.SENHA}
            value={dados.senha}
            feedback={false}
            toggleMask
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.senha} />
        </div>
        <div className={estilizarFlex("center")}>
          <Button
            className={estilizarBotão()}
            label="Login"
            onClick={logarUsuário}
          />
          <Link className={estilizarLink()} to="/recuperar-acesso">
            Recuperar Acesso de Usuário
          </Link>
          <Link className={estilizarLink()} to="/criar-usuario">
            Cadastrar Usuário
          </Link>
        </div>
      </Card>
    </div>
  );
}
