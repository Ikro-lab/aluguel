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

export const STATUS_BIKE = [
  { value: 'disponivel', label: 'Disponível', color: 'green' },
  { value: 'alugada', label: 'Alugada', color: 'blue' },
  { value: 'manutencao', label: 'Em manutenção', color: 'amber' },
  { value: 'vendida', label: 'Vendida', color: 'gray' },
  { value: 'inativa', label: 'Inativa', color: 'red' },
];

export const STATUS_AGENDAMENTO = [
  { value: 'agendado', label: 'Agendado', color: 'blue' },
  { value: 'confirmado', label: 'Confirmado', color: 'green' },
  { value: 'concluido', label: 'Concluído', color: 'gray' },
  { value: 'cancelado', label: 'Cancelado', color: 'red' },
];

export const TIPO_AGENDAMENTO = [
  { value: 'retirada', label: 'Retirada' },
  { value: 'devolucao', label: 'Devolução' },
  { value: 'entrega', label: 'Entrega' },
  { value: 'manutencao', label: 'Manutenção' },
];

export const STATUS_OS = [
  { value: 'aberta', label: 'Aberta', color: 'amber' },
  { value: 'em_andamento', label: 'Em andamento', color: 'blue' },
  { value: 'concluida', label: 'Concluída', color: 'green' },
];

export const PERIODOS = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mês' },
  { value: 'tudo', label: 'Tudo' },
];

export function labelDe(lista, value) {
  return lista.find((i) => i.value === value)?.label || value;
}

export function corDe(lista, value) {
  return lista.find((i) => i.value === value)?.color || 'gray';
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date) {
  const d = startOfDay(date);
  const diffSegunda = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diffSegunda);
  return d;
}

export function isHoje(dateStr) {
  const d = new Date(dateStr);
  const agora = new Date();
  return d.toDateString() === agora.toDateString();
}

export function isAtrasado(dateStr, status) {
  if (status === 'concluido' || status === 'cancelado') return false;
  return new Date(dateStr) < new Date();
}

export function filtrarPorPeriodo(items, periodo, dateField = 'created_at') {
  if (periodo === 'tudo' || !periodo) return items;
  const agora = new Date();
  let inicio;
  if (periodo === 'hoje') inicio = startOfDay(agora);
  else if (periodo === 'semana') inicio = startOfWeek(agora);
  else if (periodo === 'mes') inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
  else return items;
  return items.filter((it) => new Date(it[dateField]) >= inicio);
}
