import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoJogador from "../../contextos/contexto-jogador";
import { serviçoCadastrarCandidatura, serviçoRemoverCandidatura } from "../../serviços/serviços-jogador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
from "../../utilitários/validaçoes";
import {estilizarCheckbox, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoRemover, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex,
estilizarInputText, estilizarInputTextarea, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarCandidatura() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { candidaturaConsultado, campanhaSelecionada, setCampanhaCandidatura, setCampanhaConsultada } = useContext(ContextoJogador);
    const [dados, setDados] = useState({ id_campanha: campanhaSelecionada?.id || "",
    descrição: candidaturaConsultado?.descrição || "",
    data_submissão: candidaturaConsultado?.data_submissão || "",
    carta: candidaturaConsultado?.carta || "",
    personagem_pronto: candidaturaConsultado?.personagem_pronto || ""});
    const [erros, setErros] = useState({});
    const navegar = useNavigate();

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value || event.checked;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        const { carta } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ carta });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function campanhaLabel() {
        if (candidaturaConsultado?.nome_campanha || campanhaSelecionada)
        return "Campanha Selecionada*:";
        else return "Selecione uma Campanha*:";
    };

    function consultarCampanhaCandidatura() {
        setCampanhaConsultada(null);
        setCampanhaCandidatura(candidaturaConsultado?.campanha);
        navegar("../consultar-campanha");
    };
    function pesquisarCampanhas() { navegar("../pesquisar-campanhas"); };
    function retornarAdministrarCandidaturas() { navegar("../administrar-candidaturas"); };

    async function cadastrarCandidatura() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarCandidatura({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Candidatura cadastrado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
        }
    };

    async function removerCandidatura() {
        try {
            await serviçoRemoverCandidatura(candidaturaConsultado.id);
            mostrarToast(referênciaToast, "Candidatura removido com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    };

    function BotõesAções() {    
        if (candidaturaConsultado) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarAdministrarCandidaturas}/>
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerCandidatura}/>
                    <Button className={estilizarBotão()} label="Campanha" onClick={consultarCampanhaCandidatura}/>
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarAdministrarCandidaturas}/>
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarCandidatura}/>
                </div>
            );
        }
    };

    function títuloFormulário() {
        if (candidaturaConsultado) return "Alterar Candidatura";
        else return "Cadastrar Candidatura";
    };

    function CampanhaInputText() {
        if (campanhaSelecionada?.nome) {
        return <InputText name="nome_campanha"
        className={estilizarInputText(erros.nome_campanha, 400, usuárioLogado.cor_tema)}
        value={campanhaSelecionada?.nome} disabled/>
        } else if (candidaturaConsultado?.campanha?.nome) {
        return <InputText name="nome_campanha"
        className={estilizarInputText(erros.nome_campanha, 400, usuárioLogado.cor_tema)}
        value={candidaturaConsultado?.campanha?.nome} disabled/>
        } else return null;
    };

    function BotãoSelecionar() {
        if (!campanhaSelecionada && !candidaturaConsultado) {
        return <Button className={estilizarBotão()} label="Selecionar" onClick={pesquisarCampanhas}/>
        } else if (campanhaSelecionada) {
        return <Button className={estilizarBotão()} label="Substituir" onClick={pesquisarCampanhas}/>;
        } else return null;
    };

    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarCandidaturas} position="bottom-center"/>
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>{campanhaLabel()}</label>
                    <BotãoSelecionar/>
                    <CampanhaInputText/>
                    <MostrarMensagemErro mensagem={erros.id}/>
                </div>
         
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                    className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                    onChange={alterarEstado} autoResize cols={40}/>
                    <MostrarMensagemErro mensagem={erros.descrição}/>
                </div>

                
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Carta*:</label>
                    <InputTextarea name="carta" value={dados.carta}
                    className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                    onChange={alterarEstado} autoResize cols={40}/>
                    <MostrarMensagemErro mensagem={erros.carta}/>
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data*:</label>
                    <InputText name="data_submissão" type="date" value={dados.data_submissão}
                    className={estilizarInputText(erros.data_submissão, usuárioLogado.cor_tema)}
                    onChange={alterarEstado}/>
                    <MostrarMensagemErro mensagem={erros.data_submissão}/>
                </div>

                <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(usuárioLogado.cor_tema)}>Personagem pronto*:</label>
                <Checkbox name="personagem_pronto" checked={dados.personagem_pronto}
                className={estilizarCheckbox()} onChange={alterarEstado} autoResize/>
                </div>
                <Divider className={estilizarDivider()}/>
                <BotõesAções/>
            </Card>
        </div>
    );
}