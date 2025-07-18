import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarOrganizador from "../páginas/organizador/cadastrar-organizador";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarJogador from "../páginas/jogador/cadastrar-jogador";

import { ProvedorOrganizador } from "../contextos/contexto-organizador";
import { ProvedorJogador } from "../contextos/contexto-jogador";
import RotasOrganizador from "./rotas-organizador"
import RotasJogador from "./rotas-jogador"
import AdministrarCampanhas from "../páginas/organizador/administrar-campanhas";
import CadastrarCampanha from "../páginas/organizador/cadastrar-campanha";
import AdministrarCandidaturas from "../páginas/jogador/administrar-candidaturas";
import CadastrarCandidatura from "../páginas/jogador/cadastrar-candidatura";
import PesquisarCampanhas from "../páginas/jogador/pesquisar-campanhas";
import ConsultarCampanha from "../páginas/jogador/consultar-campanha";

import PesquisarCandidaturas from "../páginas/organizador/pesquisar-candidaturas";
import ConsultarCandidatura from "../páginas/organizador/consultar-candidatura";
import ConsultarJogador from "../páginas/organizador/consultar-jogador";
import ConsultarOrganizador from "../páginas/jogador/consultar-organizador";

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário />} path="/" />
        <Route element={<CadastrarUsuário />} path="criar-usuario" />
        <Route element={<RecuperarAcesso />} path="recuperar-acesso" />

        <Route element={<RotasUsuárioLogado />}>
          <Route element={<PáginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuário />} path="atualizar-usuario" />

         <Route element={<ProvedorOrganizador><RotasOrganizador/></ProvedorOrganizador>}>
            <Route element={<CadastrarOrganizador/>} path="cadastrar-organizador"/>
            <Route element={<AdministrarCampanhas/>} path="administrar-campanhas"/>
            <Route element={<CadastrarCampanha/>} path="cadastrar-campanha"/>

            <Route element={<PesquisarCandidaturas/>} path="pesquisar-candidaturas"/>
            <Route element={<ConsultarCandidatura/>} path="consultar-candidatura"/>
            <Route element={<ConsultarJogador/>} path="consultar-jogador-interessado"/>
        </Route>
          <Route element={<ProvedorJogador><RotasJogador/></ProvedorJogador>}>
            <Route element={<CadastrarJogador/>} path="cadastrar-jogador"/>
            <Route element={<AdministrarCandidaturas/>} path="administrar-candidaturas"/>
            <Route element={<CadastrarCandidatura/>} path="cadastrar-candidatura"/>
            <Route element={<PesquisarCampanhas/>} path="pesquisar-campanhas"/>
            <Route element={<ConsultarCampanha/>} path="consultar-campanha"/>
            
            <Route element={<ConsultarOrganizador/>} path="consultar-organizador-proponente"/>
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
