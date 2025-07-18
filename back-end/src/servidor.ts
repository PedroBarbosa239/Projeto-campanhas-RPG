import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuário from "./rotas/rotas-usuário";
import RotasOrganizador from "./rotas/rotas-organizador";
import RotasJogador from "./rotas/rotas-jogador";

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use("/usuarios", RotasUsuário);
app.use("/organizadores", RotasOrganizador);
app.use("/jogadores", RotasJogador);

app.listen(PORT || 3333);
const conexão = createConnection();
export default conexão;
