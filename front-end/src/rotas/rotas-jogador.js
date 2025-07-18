import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuárioContext from "../contextos/contexto-usuário";

export default function RotasJogador() {
    const { usuárioLogado } = useContext(UsuárioContext);
    if (usuárioLogado.perfil === "jogador") return <Outlet/>
    else return <Navigate to="/"/>;
}