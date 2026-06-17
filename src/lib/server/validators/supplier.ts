export type SupplierFormValues = {
  name: string;
  telefone: string;
  condicaoPagamento: string;
  active: boolean;
};

export function validateSupplierForm(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const telefone = formData.get("telefone")?.toString().trim() ?? "";
  const condicaoPagamento = formData.get("condicaoPagamento")?.toString().trim() ?? "";
  const active = formData.get("active") === "on";
  const errors: Record<string, string> = {};

  if (!name || name.length < 4) errors.name = "Nome invalido";
  if (!telefone || telefone.length < 9) errors.telefone = "Telefone invalido";
  if (!condicaoPagamento || condicaoPagamento.length < 3) {
    errors.condicaoPagamento = "Condicao de pagamento invalida";
  }

  return {
    values: {
      name,
      telefone,
      condicaoPagamento,
      active,
    } satisfies SupplierFormValues,
    errors,
  };
}
