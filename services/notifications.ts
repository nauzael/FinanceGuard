
import { LocalNotifications } from '@capacitor/local-notifications';
import { Loan, Contact } from '../types.ts';

export const NotificationService = {
  requestPermissions: async () => {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
  },

  scheduleLoanReminder: async (loan: Loan, contactName: string) => {
    if (!loan.dueDate) return;

    // Convertir loan.id (string) a un número para el ID de la notificación
    // Usamos un hash simple o guardamos solo la parte numérica
    const notificationId = Math.abs(loan.id.split('-').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0)) % 1000000;

    const date = new Date(loan.dueDate);
    // Programar para las 9:00 AM del día del vencimiento
    date.setHours(9, 0, 0, 0);

    // Si la fecha ya pasó, no programar
    if (date.getTime() <= Date.now()) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Recordatorio de Pago 💸',
          body: `${loan.type === 'LENT' ? 'Hoy vence el préstamo de' : 'Hoy debes pagar el préstamo a'} ${contactName} por $${loan.remainingAmount.toLocaleString()}`,
          id: notificationId,
          schedule: { at: date },
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          extra: { loanId: loan.id }
        }
      ]
    });
  },

  cancelLoanReminder: async (loanId: string) => {
     const notificationId = Math.abs(loanId.split('-').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0)) % 1000000;

    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }]
    });
  }
};
