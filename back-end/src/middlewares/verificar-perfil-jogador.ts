import { Perfil } from "../entidades/usuário";
export default function verificarPerfilJogador(request, response, next) {
  if (request.perfil === Perfil.JOGADOR) return next();
  else return response.status(401).json({ erro: "Acesso não autorizado." });
}
