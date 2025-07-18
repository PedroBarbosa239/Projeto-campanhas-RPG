import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoJogador from "../../contextos/contexto-jogador";
import { serviçoBuscarCampanhas } from "../../serviços/serviços-jogador";
import mostrarToast from "../../utilitários/mostrar-toast";

import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";

export default function PesquisarCampanhas() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    campanhaConsultada,
    setCampanhaConsultada,
    setCampanhaSelecionada,
  } = useContext(ContextoJogador);
  const [listaCampanhas, setListaCampanhas] = useState([]);
  const navegar = useNavigate();

    const opçõesSistema = [{ label: "DED", value: "ded" },
    { label: "Ordem", value: "ordem" }];
    const opçõesStatus = [{ label: "Aberto", value: "aberto" },
    { label: "Fechado", value: "fechado" }];

  function retornarCadastrarCandidatura() {
    setCampanhaSelecionada(campanhaConsultada);
    setCampanhaConsultada(null);
    navegar("../cadastrar-candidatura");
  }

  function ConsultarTemplate(campanha) {
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          campanhaConsultada?.id === campanha.id
        )}
        tooltip="Consultar Campanha"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setCampanhaConsultada(campanha);
          navegar("../consultar-campanha");
        }}
      />
    );
  }

  function DropdownÁreaTemplate(opções) {
    function alterarFiltroDropdown(event) {
      return opções.filterCallback(event.value, opções.index);
    }

    return (
      <Dropdown
        value={opções.value}
        options={opçõesSistema}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }

  function DropdownÁreaTemplateS(opções) {
    function alterarFiltroDropdown(event) {
      return opções.filterCallback(event.value, opções.index);
    }

    return (
      <Dropdown
        value={opções.value}
        options={opçõesStatus}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }

  function BooleanBodyTemplate(campanha) {
    return campanha.urgente ? "Sim" : "Não";
  }

  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) {
      return opções.filterCallback(event.value);
    }

    return (
      <div>
        <label>Urgnente:</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)}
          value={opções.value}
          onChange={alterarFiltroTriState}
        />
      </div>
    );
  }

  useEffect(() => {
    let desmontado = false;

    async function buscarCampanhas() {
      try {
        const response = await serviçoBuscarCampanhas();
        if (!desmontado && response.data) {
          setListaCampanhas(response.data);
        }
      } catch (error) {
        mostrarToast(
          referênciaToast,
          error.response.data.erro,
          "error"
        );
      }
    }

    buscarCampanhas();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Pesquisar Campanhas"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma campanha encontrada."
          value={listaCampanhas}
          responsiveLayout="scroll"
          breakpoint="490px"
          removableSort
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(
            usuárioLogado.cor_tema
          )}
        >
          <Column
            bodyClassName={estilizarColunaConsultar()}
            body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
          />
          <Column
            field="organizador.usuário.nome"
            header="Nome do Organizador"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="nome"
            header="Nome"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="sistema"
            header="Sistema"
            filter
            filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />

             <Column
            field="status"
            header="Status"
            filter
            filterMatchMode="equals"
            filterElement={DropdownÁreaTemplateS}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />

          <Column field="urgente" header="urgente" dataType="boolean" filter
            showFilterOperator={false}

            body={BooleanBodyTemplate} filterElement={BooleanFilterTemplate}
            filterMatchMode="equals" showClearButton={false} showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()}

            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
         
        </DataTable>
        <Divider className={estilizarDivider()} />
        <Button
          className={estilizarBotãoRetornar()}
          label="Retornar"
          onClick={retornarCadastrarCandidatura}
        />
      </Card>
    </div>
  );
}
