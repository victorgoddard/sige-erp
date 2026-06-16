export const Status = {
  Pending: 'Pendente',
  Processing: 'Processando',
  AwaitingAproval: 'Aguardando aprovação',
  Approved: 'Aprovado',
} as const;

export type StatusType = typeof Status[keyof typeof Status];
