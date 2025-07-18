import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoJogador from "../../contextos/contexto-jogador";
import {
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
  estilizarBotão
} from "../../utilitários/estilos";

export default function ConsultarCampanha() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { campanhaConsultada, campanhaCandidatura, setOrganizadorProponente } = useContext(ContextoJogador);

  const dados = {
    nome_organizador:
      campanhaConsultada?.organizador?.usuário?.nome ||
      campanhaCandidatura?.organizador?.usuário?.nome,
      //terminar por aqui
    nome: campanhaConsultada?.nome || campanhaCandidatura?.nome,
    sistema: campanhaConsultada?.sistema || campanhaCandidatura?.sistema,
    descrição: campanhaConsultada?.descrição || campanhaCandidatura?.descrição,
    status: campanhaConsultada?.status || campanhaCandidatura?.status,
    limite_jogadores: campanhaConsultada?.limite_jogadores || campanhaCandidatura?.limite_jogadores,
    urgente: campanhaConsultada?.urgente || campanhaCandidatura?.urgente
  };

  const navegar = useNavigate();

  function retornar() {
    if (campanhaConsultada) navegar("../pesquisar-campanhas");
    else if (campanhaCandidatura) navegar("../cadastrar-candidatura");
  }

  function consultarOrganizadorProponente() {
    if (campanhaConsultada) setOrganizadorProponente(campanhaConsultada.organizador);
    else setOrganizadorProponente(campanhaCandidatura.organizador);
    navegar("../consultar-organizador-proponente");
  };

  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Campanha"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Organizador*:
          </label>
          <InputText
            name="nome_organizador"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_organizador}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome*:
          </label>
          <InputText
            name="nome"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            sistema*:
          </label>
          <InputText
            name="sistema"
            className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
            value={dados.sistema}
            disabled
          />
        </div>



        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Descrição*:
          </label>
          <InputTextarea
            name="descrição"
            value={dados.descrição}
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            autoResize
            disabled
          />
        </div>

                <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Status*:
          </label>
          <InputText
            name="status"
            className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
            value={dados.status}
            disabled
          />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            limite jogadores*:
          </label>
          <InputTextarea
            name="limite_jogadores"
            value={dados.limite_jogadores}
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            autoResize
            disabled
          />
        </div>

      <div className={estilizarDivCampo()}>
      <label className={estilizarLabel(usuárioLogado.cor_tema)}>Urgente*:</label>
      <Checkbox name="urgente" checked={dados.urgente}
      className={estilizarCheckbox(null)} autoResize disabled/>
      </div>
  

        <Divider className={estilizarDivider()} />

        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornar}
          />

          <Button className={estilizarBotão()} label="Organizador" onClick={consultarOrganizadorProponente}/>
        </div>
      </Card>
    </div>
  );
}
