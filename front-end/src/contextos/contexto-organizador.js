import { createContext, useState } from "react";

const ContextoOrganizador = createContext();
export default ContextoOrganizador;

export function ProvedorOrganizador({ children }) {
    const [campanhaConsultada, setCampanhaConsultada] = useState({});
    const [candidaturaConsultado, setCandidaturaConsultado] = useState(null);
    const [jogadorInteressado, setJogadorInteressado] = useState(null);
    return (
        <ContextoOrganizador.Provider value={{ campanhaConsultada, setCampanhaConsultada, candidaturaConsultado, 
                                                setCandidaturaConsultado, jogadorInteressado, setJogadorInteressado
        }}>{children}</ContextoOrganizador.Provider>
    );
}