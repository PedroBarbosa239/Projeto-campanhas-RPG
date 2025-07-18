import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarOrganizador,
  serviçoBuscarOrganizador,
  serviçoAtualizarOrganizador,
} from "../../serviços/serviços-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validaçoes";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarOrganizador() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    sistema: "",
    avaliação: "",
    experiência: "",
  });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();

  const opçõesSistema = [
    { label: "D&D", value: "ded" },
    { label: "Ordem Paranormal", value: "ordem" },
  ];

  const opçõesExperiência = [
    { label: "Novato", value: "novato" },
    { label: "Veterano", value: "veterano" },
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }

  function validarCampos() {
    let errosCamposObrigatórios;
    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Organizador";
  }

  async function cadastrarOrganizador() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarOrganizador({
          ...dados,
          usuário_info: usuárioLogado,
          sistema: dados.sistema,
          avaliação: dados.avaliação,
          experiência: dados.experiência,
        });

        if (response.data)
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));

        mostrarToast(
          referênciaToast,
          "Organizador cadastrado com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  async function atualizarOrganizador() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarOrganizador({
          ...dados,
          cpf: usuárioLogado.cpf,
        });
        if (response)
          mostrarToast(
            referênciaToast,
            "Organizador atualizado com sucesso!",
            "sucesso"
          );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  }

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarOrganizador();
    else cadastrarOrganizador();
  }

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado((usuárioLogado) => ({
        ...usuárioLogado,
        cadastrado: true,
      }));
      navegar("/pagina-inicial");
    }
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosOrganizador() {
      try {
        const response = await serviçoBuscarOrganizador(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            sistema: response.data.sistema,
            avaliação: response.data.avaliação,
            experiência: response.data.experiência,
          }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }

    if (usuárioLogado?.cadastrado) buscarDadosOrganizador();
    return () => (desmontado = true);
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Sistema*:
          </label>
          <Dropdown
            name="sistema"
            className={estilizarDropdown(erros.sistema, usuárioLogado.cor_tema)}
            value={dados.sistema}
            options={opçõesSistema}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />

          <MostrarMensagemErro mensagem={erros.sistema} />
        </div>
        <br />
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
          Experiência*:
          </label>
          <Dropdown
            name="experiência"
            className={estilizarDropdown(
              erros.experiência,
              usuárioLogado.cor_tema
            )}
            value={dados.experiência}
            options={opçõesExperiência}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.experiência} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
           Auto-Avaliação do organizador*:
          </label>
          <InputNumber
            name="avaliação"
            size={5}
            value={dados.avaliação}
            onValueChange={alterarEstado}
            mode="decimal"
            inputClassName={estilizarInputNumber(
              erros.avaliação,
              usuárioLogado.cor_tema
            )}
          />
          <MostrarMensagemErro mensagem={erros.avaliação} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={redirecionar}
          />
          <Button
            className={estilizarBotão()}
            label={labelBotãoSalvar()}
            onClick={açãoBotãoSalvar}
          />
        </div>
      </Card>
    </div>
  );
}
