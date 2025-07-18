import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoOrganizador from "../../contextos/contexto-organizador";
import { estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarCheckbox,
estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText,
estilizarLabel } from "../../utilitários/estilos";


export default function ConsultarCandidatura() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { candidaturaConsultado, setJogadorInteressado } = useContext(ContextoOrganizador);
    const dados = { nome_jogador: candidaturaConsultado?.jogador?.usuário?.nome,
    personagem_pronto: candidaturaConsultado?.personagem_pronto,
    carta: candidaturaConsultado?.carta,
    nome_campanha: candidaturaConsultado?.campanha.nome };

    const navegar = useNavigate();
    function retornarPesquisarCandidaturas() { navegar("../pesquisar-candidaturas"); };
    function consultarJogadorInteressado() {
    setJogadorInteressado(candidaturaConsultado.jogador);
    navegar("../consultar-jogador-interessado");
    };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Candidatura" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Jogador*:</label>
                    <InputText name="nome_jogador"
                    className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}

                    value={dados.nome_jogador} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Personagem pronto*:</label>
                    <Checkbox name="personagem_pronto" checked={dados.personagem_pronto}
                    className={estilizarCheckbox()} autoResize disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Carta*:</label>
                    <InputTextarea name="carta"
                    className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}

                    value={dados.carta} disabled/>
                </div>
                    <div className={estilizarDivCampo()}>
                        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Campanha*</label>
                        <InputText name="nome_campanha"
                        className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}

                        value={dados.nome_campanha} disabled/>
                </div>
                <Divider className={estilizarDivider()}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarPesquisarCandidaturas}/>
                    <Button className={estilizarBotão()} label="Jogador" onClick={consultarJogadorInteressado}/>
                </div>
            </Card>
        </div>
        );
}