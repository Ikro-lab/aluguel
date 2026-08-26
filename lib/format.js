export function fmtMoney(v) {
  return 'R$' + (Number(v) || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const FORMAS_PAGAMENTO = ['Dinheiro', 'PIX', 'Cartão de Débito', 'Cartão de Crédito', 'Outro'];
