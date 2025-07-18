import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoOrganizador from "../../contextos/contexto-organizador";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoBuscarCampanhasOrganizador } from "../../serviços/serviços-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator,
estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";

export default function AdministrarCampanhas() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const { campanhaConsultada, setCampanhaConsultada } = useContext(ContextoOrganizador);
    const [listaCampanhas, setListaCampanhas] = useState([]);
    const navegar = useNavigate();
      const opçõesSistema = [{ label: "DED", value: "ded" },
    { label: "Ordem", value: "ordem" }];
    const opçõesStatus = [{ label: "Aberto", value: "aberto" },
    { label: "Fechado", value: "fechado" }];

    function retornarPáginaInicial() { navegar("/pagina-inicial"); };
    function adicionarCampanha() {
    setCampanhaConsultada(null);
    navegar("../cadastrar-campanha");
    }
    ;
    function ConsultarTemplate(campanha) {
        function consultar() {
            setCampanhaConsultada(campanha);
            navegar("../cadastrar-campanha");
        };
        return (
            <Button icon="pi pi-search"
            className={estilizarBotãoTabela(usuárioLogado.cor_tema,
           campanhaConsultada?.id === campanha.id)}
            tooltip="Consultar Campanha" tooltipOptions={{ position: 'top' }} onClick={consultar}/>
        );
    };

    function DropdownÁreaTemplate(opções) {
        function alterarFiltroDropdown(event)
        { return opções.filterCallback(event.value, opções.index); };
        return <Dropdown value={opções.value} options={opçõesSistema} placeholder="Selecione"
        onChange={alterarFiltroDropdown} showClear />;
    };

       function DropdownÁreaTemplate2(opções) {
        function alterarFiltroDropdown(event)
        { return opções.filterCallback(event.value, opções.index); };
        return <Dropdown value={opções.value} options={opçõesStatus} placeholder="Selecione"
        onChange={alterarFiltroDropdown} showClear />;
    };

    function BooleanBodyTemplate(campanha) {
        if (campanha.urgente) return "Sim";
        else return "Não";
    };

    function BooleanFilterTemplate(opções) {
        function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
        return (
            <div>
                <label>Urgente:</label>
                <TriStateCheckbox
                className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
                onChange={alterarFiltroTriState}/>
            </div>
        );
    };

    useEffect(() => {
        let desmontado = false;
        async function buscarCampanhasOrganizador() {
        try {
            const response = await serviçoBuscarCampanhasOrganizador(usuárioLogado.cpf);
            if (!desmontado && response.data) { setListaCampanhas(response.data); }
        } catch (error) {
            const erro = error.response.data.erro;
            if (erro) mostrarToast(referênciaToast, erro, "error");
        }
        };
        buscarCampanhasOrganizador();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Card title="Administrar Campanhas" className={estilizarCard(usuárioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma campanha encontrada." value={listaCampanhas}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>  
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
                    <Column field="nome" header="Nome" filter showFilterOperator={false}
                    headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column field="limite_jogadores" header="Limite jogadores" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="sistema" header="Sistema" filter filterMatchMode="equals"
                        filterElement={DropdownÁreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
                        field="status" header="Status" filter filterMatchMode="equals"
                        filterElement={DropdownÁreaTemplate2} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />

                    <Column field="urgente" header="Urgente" filter
                        showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable
                        filterMatchMode="equals" filterElement={BooleanFilterTemplate}
                        body={BooleanBodyTemplate} showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()} dataType="boolean"/>
                </DataTable>

                <Divider className={estilizarDivider()}/>
                <Button className={estilizarBotãoRetornar()} label="Retornar"
                    onClick={retornarPáginaInicial}/>
                <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarCampanha}/>
            </Card>
        </div>
    );
}