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
import ContextoOrganizador from "../../contextos/contexto-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarCandidaturasCampanha } from "../../serviços/serviços-organizador";
import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";


export default function PesquisarCandidaturas() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { candidaturaConsultado, setCandidaturaConsultado,
    campanhaConsultada } = useContext(ContextoOrganizador);
    const [listaCandidaturas, setListaCandidaturas] = useState([]);
    const navegar = useNavigate();

     const opçõesSistema = [{ label: "DED", value: "ded" },
    { label: "Ordem", value: "ordem" }];
    function retornarCadastrarCampanha() {
    setCandidaturaConsultado(null);
    navegar("../cadastrar-campanha");
    };

    function ConsultarTemplate(candidatura) {
        return (
            <Button icon="pi pi-search"
            className={estilizarBotãoTabela(usuárioLogado.cor_tema,
            candidaturaConsultado?.id === candidatura.id)}
            tooltip="Consultar candidatura" tooltipOptions={{ position: 'top' }}
            onClick={() => {
            setCandidaturaConsultado(candidatura);
            navegar("../consultar-candidatura");;
            }}/>
        );
    };

    function DropdownÁreaTemplate(opções) {
        function alterarFiltroDropdown(event) { return opções.filterCallback(event.value, opções.index); };
        return <Dropdown value={opções.value} options={opçõesSistema} placeholder="Selecione"
        onChange={alterarFiltroDropdown} showClear />;
    };

    function BooleanBodyTemplate(candidatura) {
        if (candidatura.personagem_pronto) return "Sim";
        else return "Não";
    };

    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
            <div>
                <label>Personagem pronto:</label>
                <TriStateCheckbox
                className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                onChange={alterarFiltroTriState}/>
            </div>
        );
    };

  useEffect(() => {
  let desmontado = false;
  async function buscarCandidaturasCampanha() {
    try {
      const response = await serviçoBuscarCandidaturasCampanha(campanhaConsultada?.id);
      if (!desmontado && response.data) {
        setListaCandidaturas(response.data);
      
      }
    } catch (error) {
      
      mostrarToast(referênciaToast, error.response?.data?.erro || "Erro desconhecido", "error");
    }
  }
 
  buscarCandidaturasCampanha();

  return () => { desmontado = true; };
}, [campanhaConsultada?.id]);


    return (
        <div className={estilizarFlex()}>
            <Toast ref={referênciaToast} position="bottom-center"/>
            <Card title="Candidaturas Cadastrados" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhum candidatura encontrado." value={listaCandidaturas}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>

                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                    headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>

                    <Column field="jogador.usuário.nome" header="Jogador" filter showFilterOperator={false}
                    headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>

                    <Column field="campanha.nome" header="Campanha" filter showFilterOperator={false}
                    headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>

                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                    field="campanha.categoria" header="Categoria" filter filterMatchMode="equals"
                    filterElement={DropdownÁreaTemplate} showClearButton={false}
                    showFilterOperator={false} showFilterMatchModes={false}
                    filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />

                    <Column field="personagem_pronto" header="Personagem pronto" dataType="boolean" filter
                    showFilterOperator={false} body={BooleanBodyTemplate}
                    filterElement={BooleanFilterTemplate} filterMatchMode="equals"
                    showClearButton={false} showAddButton={false}
                    filterMenuClassName={estilizarFilterMenu()}
                    headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>

                </DataTable>
                <Divider className={estilizarDivider()}/>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                onClick={retornarCadastrarCampanha}/>
            </Card>
        </div>
    );
}