import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoJogador from "../../contextos/contexto-jogador";
import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarFlex,
estilizarInlineFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";


export default function ConsultarOrganizador() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { organizadorProponente } = useContext(ContextoJogador);

    const dados = { nome_organizador: organizadorProponente?.usuário?.nome,
    avaliação: organizadorProponente?.avaliação,
    experiência: organizadorProponente?.experiência };

    const navegar = useNavigate();

    function retornarConsultarCampanha() { navegar("/consultar-campanha"); };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Organizador" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Organizador*:</label>
                    <InputText name="nome_organizador"
                    className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}

                    value={dados.nome_organizador} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>
                    Avaliação*:</label>
                    <InputNumber name="avaliação" size={5}
                    value={dados.avaliação}

                    inputClassName={estilizarInputText(null, usuárioLogado.cor_tema)}
                    mode="decimal" min={1} disabled/>
                </div>
               <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Experiência*:</label>
                    <InputText name="experiência"
                    className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}

                    value={dados.experiência} autoResize disabled/>
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)}/>
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarConsultarCampanha}/>
                </div>
            </Card>
        </div>
    );
};