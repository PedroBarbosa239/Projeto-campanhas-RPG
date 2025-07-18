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
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarCandidaturasJogador } from "../../serviços/serviços-jogador";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard,
estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
from "../../utilitários/estilos";

export default function AdministrarCandidaturas() {
    const referênciaToast = useRef(null);
    const { usuárioLogado } = useContext(ContextoUsuário);
    const {candidaturaConsultado, setCandidaturaConsultado, setCampanhaSelecionada }
    = useContext(ContextoJogador);
    const [listaCandidaturas, setListaCandidaturas] = useState([]);
    const navegar = useNavigate();

    const opçõesSistema = [{ label: "DED", value: "ded" },
    { label: "Ordem", value: "ordem" }];

    function retornarPáginaInicial() { navegar("/pagina-inicial"); };
    function adicionarCandidatura() {
        setCandidaturaConsultado(null);
        setCampanhaSelecionada(null);
        navegar("../cadastrar-candidatura");
    };

    function ConsultarTemplate(candidatura) {
        function consultar() {
            setCandidaturaConsultado(candidatura);
            setCampanhaSelecionada(null);
            navegar("../cadastrar-candidatura");
        };
        return (
            <Button icon="pi pi-search"
            className={estilizarBotãoTabela(usuárioLogado.cor_tema,
          candidaturaConsultado?.id === candidatura.id)}
            tooltip="Consultar candidatura" tooltipOptions={{ position: 'top' }} onClick={consultar}/>
        );
    };

    function DropdownÁreaTemplate(opções) {
        function alterarFiltroDropdown(event) {
        return opções.filterCallback(event.value, opções.index);
        };
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
        async function buscarCandidaturasJogador() {
            try {
                const response = await serviçoBuscarCandidaturasJogador(usuárioLogado.cpf);
                if (!desmontado && response.data) setListaCandidaturas(response.data);
            } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
        };
        buscarCandidaturasJogador();
        return () => desmontado = true;
    }, [usuárioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
        <Toast ref={referênciaToast} position="bottom-center"/>
        <Card title="Administrar Candidaturas" className={estilizarCard(usuárioLogado.cor_tema)}>
            <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                emptyMessage="Nenhum candidatura encontrado." value={listaCandidaturas}
                responsiveLayout="scroll" breakpoint="490px" removableSort
                className={estilizarDataTable()}
                paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>

                <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>

                <Column field="campanha.organizador.usuário.nome" header="Organizador" filter
                showFilterOperator={false}
                headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>

                <Column field="campanha.nome" header="Campanha" filter showFilterOperator={false}
                headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>

            <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="campanha.sistema" header="Sistema" filter filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate} showClearButton={false}
            showFilterOperator={false} showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable/>

            <Column field="personagem_pronto" header="Personagem pronto" dataType="boolean" filter
            showFilterOperator={false} body={BooleanBodyTemplate}
            filterElement={BooleanFilterTemplate} filterMatchMode="equals" showClearButton={false}

            showAddButton={false} filterMenuClassName={estilizarFilterMenu()}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
    
            </DataTable>
            <Divider className={estilizarDivider()}/>
            <Button className={estilizarBotãoRetornar()} label="Retornar"
            onClick={retornarPáginaInicial}/>
            <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarCandidatura}/>
        </Card>
    </div>
    );
}