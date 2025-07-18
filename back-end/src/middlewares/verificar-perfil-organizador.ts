import { Perfil } from "../entidades/usuário";
export default function verificarPerfilOrganizador(request, response, next) {
  if (request.perfil === Perfil.ORGANIZADOR) return next();
  else return response.status(401).json({ erro: "Acesso não autorizado." });
}
