export default function mostrarToast(referênciaToast, mensagem, tipo) {
  referênciaToast.current.show({
    severity: tipo === "sucesso" ? "success" : "error",
    summary: tipo === "sucesso" ? "Sucesso" : "Erro",
    detail: mensagem,
    life: 2000,
  });
}
