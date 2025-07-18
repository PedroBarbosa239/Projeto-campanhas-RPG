import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoOrganizador from "../../contextos/contexto-organizador";
import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel }
from "../../utilitários/estilos";

export default function ConsultarJogador() {
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { jogadorInteressado } = useContext(ContextoOrganizador);
    const dados = { nome: jogadorInteressado?.usuário?.nome, 
    texto_descritivo: jogadorInteressado?.texto_descritivo,
    anos_experiência: jogadorInteressado?.anos_experiência};
    const navegar = useNavigate();

    function retornarConsultarCandidatura() { navegar("../consultar-candidatura"); };

    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Jogador" className={estilizarCard(usuárioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nome*:</label>
                    <InputText name="nome" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
                    value={dados.nome} disabled/>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Texto descritivo*:</label>
                    <InputText name="texto_descritivo" className={estilizarInputText(null, 300, usuárioLogado.cor_tema)}
                    value={dados.texto_descritivo} disabled/>
                </div>
                 <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuárioLogado.cor_tema)}>Anos experiência*:</label>
                    <InputNumber name="anos_experiência" size={5}
                    value={dados.anos_experiência}
               
                    inputClassName={estilizarInputText(null, usuárioLogado.cor_tema)}
                    mode="decimal" min={1} disabled/>
                </div>

                
                    <Divider className={estilizarDivider(dados.cor_tema)}/>
                    <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarConsultarCandidatura}/>
                </div>
            </Card>
        </div>
    );
};