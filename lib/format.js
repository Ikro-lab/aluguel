export function fmtMoney(v) {
  return 'R$' + (Number(v) || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const FORMAS_PAGAMENTO = ['Dinheiro', 'PIX', 'Cartão de Débito', 'Cartão de Crédito', 'Outro'];

export const CATEGORIAS_DESPESA = ['Manutenção', 'Combustível', 'Aluguel do ponto', 'Salários', 'Outro'];

export function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
}
