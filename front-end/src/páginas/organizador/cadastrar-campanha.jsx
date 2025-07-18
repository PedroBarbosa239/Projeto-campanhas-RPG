import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoOrganizador from "../../contextos/contexto-organizador";
import { serviçoAlterarCampanha, serviçoCadastrarCampanha, serviçoRemoverCampanha } from "../../serviços/serviços-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
from "../../utilitários/validaçoes";

import { estilizarCheckbox,estilizarBotão, estilizarBotãoRemover, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex,
estilizarInlineFlex, estilizarInputText, estilizarInputTextarea, estilizarLabel }
from "../../utilitários/estilos";

export default function CadastrarCampanha() {

    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { campanhaConsultada } = useContext(ContextoOrganizador);
    const [dados, setDados] = useState({ nome:campanhaConsultada?.nome || "",
    sistema: campanhaConsultada?.sistema || "",
    limite_jogadores : campanhaConsultada?.limite_jogadores || "",
    descrição: campanhaConsultada?.descrição || "",
    status: campanhaConsultada?.status || "",
    urgente: campanhaConsultada?.urgente || "", });
   
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    const opçõesSistema = [{ label: "DED", value: "ded" },
    { label: "Ordem", value: "ordem" }];
    const opçõesStatus = [{ label: "Aberto", value: "aberto" },
    { label: "Fechado", value: "fechado" }];

    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value || event.checked;
        setDados({ ...dados, [chave]: valor });
    };

    function validarCampos() {
        const { nome, sistema, descrição } = dados;
        let errosCamposObrigatórios = validarCamposObrigatórios({ nome, sistema, descrição });
        setErros(errosCamposObrigatórios);
        return checarListaVazia(errosCamposObrigatórios);
    };

    function retornarAdministrarCampanhas() { navegar("../administrar-campanhas"); };
    function mostrarCandidaturas() { navegar("../pesquisar-candidaturas"); };

    

    async function cadastrarCampanha() {
        if (validarCampos()) {
            try {
                await serviçoCadastrarCampanha({ ...dados, cpf: usuárioLogado.cpf });
                mostrarToast(referênciaToast, "Campanha cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };

    async function alterarCampanha() {
        if (validarCampos()) {
            try {
                await serviçoAlterarCampanha({ ...dados, id: campanhaConsultada.id });
                mostrarToast(referênciaToast, "Campanha alterada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        }
    };

    async function removerCampanha() {
        try {
            await serviçoRemoverCampanha(campanhaConsultada.id);
            mostrarToast(referênciaToast, "Campanha excluída com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    };

    function BotõesAções() {
        if (campanhaConsultada) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                         onClick={retornarAdministrarCampanhas}/>
                    <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerCampanha}/>
                    <Button className={estilizarBotão()} label="Alterar" onClick={alterarCampanha}/>
                    <Button className={estilizarBotão()} label="Candidaturas" onClick={mostrarCandidaturas}/>
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                        onClick={retornarAdministrarCampanhas}/>
                    <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarCampanha}/>
                </div>
            );
        }
    };

    function títuloFormulário() {
        if (campanhaConsultada) return "Alterar Campanha";
        else return "Cadastrar Campanha";
    };


    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} onHide={retornarAdministrarCampanhas} position="bottom-center"/>
            <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nome*:</label>
                    <InputText name="nome"
                    className={estilizarInputText(erros.nome, 400, usuárioLogado.cor_tema)}
                    value={dados.nome} onChange={alterarEstado}/>
                    <MostrarMensagemErro mensagem={erros.nome}/>
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Sistema*:</label>
                    <Dropdown name="sistema"
                    className={estilizarDropdown(erros.sistema, usuárioLogado.cor_tema)}
                    value={dados.sistema} options={opçõesSistema} onChange={alterarEstado}
                    placeholder="-- Selecione --"/>
                    <MostrarMensagemErro mensagem={erros.sistema}/>
                </div>

                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descrição" value={dados.descrição}
                    className={estilizarInputTextarea(erros.descrição, usuárioLogado.cor_tema)}
                    onChange={alterarEstado} autoResize cols={40}/>
                    <MostrarMensagemErro mensagem={erros.descrição}/>
                </div>

                 <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Status*:</label>
                    <Dropdown name="status"
                    className={estilizarDropdown(erros.status, usuárioLogado.cor_tema)}
                    value={dados.status} options={opçõesStatus} onChange={alterarEstado}
                    placeholder="-- Selecione --"/>
                    <MostrarMensagemErro mensagem={erros.status}/>
                </div>
                    <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Limite de Jogadores*:</label>
                    <InputNumber
                        name="limite_jogadores"
                        value={dados.limite_jogadores}
                        onValueChange={(e) => alterarEstado({ target: { name: "limite_jogadores", value: e.value } })}
                        className={estilizarInputText(erros.limite_jogadores, 400, usuárioLogado.cor_tema)}
                        mode="decimal"
                        min={1}
                    />
                    <MostrarMensagemErro mensagem={erros.limite_jogadores} />
                    </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Urgente*:</label>
                    <Checkbox name="urgente" checked={dados.urgente}
                    className={estilizarCheckbox()} onChange={alterarEstado} autoResize/>
                </div>
                        
                <Divider className={estilizarDivider()}/>
                <BotõesAções/>
            </Card>
        </div>
    );
}