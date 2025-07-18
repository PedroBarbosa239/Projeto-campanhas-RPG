import { createContext, useState } from "react";

const ContextoJogador = createContext();
export default ContextoJogador;

export function ProvedorJogador({ children }) {
    const [candidaturaConsultado, setCandidaturaConsultado] = useState({});
    const [campanhaConsultada, setCampanhaConsultada] = useState({});
    const [campanhaSelecionada, setCampanhaSelecionada] = useState({});
    const [campanhaCandidatura, setCampanhaCandidatura] = useState({});
    const [organizadorProponente, setOrganizadorProponente] = useState({});
    return (
        <ContextoJogador.Provider value={{
            candidaturaConsultado, setCandidaturaConsultado, campanhaConsultada, setCampanhaConsultada,
           campanhaSelecionada, setCampanhaSelecionada,campanhaCandidatura, setCampanhaCandidatura, organizadorProponente, setOrganizadorProponente
        }}>{children}</ContextoJogador.Provider>
    );
}