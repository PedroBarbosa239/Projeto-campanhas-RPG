export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "organizador":
      return "Organizador";
    case "jogador":
      return "Jogador";
    default:
      return;
  }
}
