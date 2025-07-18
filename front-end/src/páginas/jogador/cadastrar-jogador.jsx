import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarJogador,
  serviçoAtualizarJogador,
  serviçoBuscarJogador,
} from "../../serviços/serviços-jogador";
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
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function CadastrarJogador() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    texto_descritivo: "",
    anos_experiência: "",
  });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
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
    if (usuárioLogado?.cadastrado) return "Alterar Jogador";
    else return "Cadastrar Jogador";
  }
  async function cadastrarJogador() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarJogador({
          ...dados,
          usuário_info: usuárioLogado,
          texto_descritivo: dados.texto_descritivo,
          anos_experiência: dados.anos_experiência,
        });
        if (response.data)
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));
        mostrarToast(
          referênciaToast,
          "Jogador cadastrado com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }
  async function atualizarJogador() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarJogador({
          ...dados,
          cpf: usuárioLogado.cpf,
        });
        if (response)
          mostrarToast(
            referênciaToast,
            "Jogador atualizado com sucesso!",
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
    if (usuárioLogado?.cadastrado) atualizarJogador();
    else cadastrarJogador();
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
    async function buscarDadosJogador() {
      try {
        const response = await serviçoBuscarJogador(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            texto_descritivo: response.data.texto_descritivo,
            anos_experiência: response.data.anos_experiência,
          }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosJogador();
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
          <label className={estilizarLabel(dados.cor_tema)}>Descrição*:</label>
          <InputText
            name="texto_descritivo"
            className={estilizarInputText(erros.texto_descritivo, 400, dados.cor_tema)}
            value={dados.texto_descritivo}
            onChange={alterarEstado}
          />

          <MostrarMensagemErro mensagem={erros.texto_descritivo} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Experiência*:
          </label>
          <InputNumber
             name="anos_experiência"
             size={5}
            value={dados.anos_experiência}
             onValueChange={alterarEstado}
              mode="decimal"
              inputClassName={estilizarInputNumber(
                           erros.anos_experiência,
                           usuárioLogado.cor_tema
                         )}
           
          />
          <MostrarMensagemErro mensagem={erros.anos_experiência} />
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
