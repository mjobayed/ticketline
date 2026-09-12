export const getTicketHistoryKey = (phone?: string | null): string => {
  if (!phone) return "ticket_history";

  const normalizedPhone = phone.replace(/\D/g, "");
  return `ticket_history_${normalizedPhone}`;
};
