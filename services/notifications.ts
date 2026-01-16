
import { LocalNotifications } from '@capacitor/local-notifications';
import { Loan, Contact } from '../types.ts';

export const NotificationService = {
  isAvailable: async () => {
    try {
      const status = await LocalNotifications.checkPermissions();
      return !!status;
    } catch (e) {
      console.warn('LocalNotifications no disponible en este entorno');
      return false;
    }
  },

  requestPermissions: async () => {
    try {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } catch (e) {
      console.error('Error al solicitar permisos de notificación', e);
      return false;
    }
  },

  scheduleLoanReminder: async (loan: Loan, contactName: string) => {
    if (!loan.dueDate) return;
    
    if (!(await NotificationService.isAvailable())) return;

    try {
      // Convertir loan.id (string) a un número para el ID de la notificación
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
            sound: 'default'
          }
        ]
      });
    } catch (e) {
      console.error('Error al programar notificación', e);
    }
  },

  cancelLoanReminder: async (loanId: string) => {
    try {
      if (!(await NotificationService.isAvailable())) return;

      const notificationId = Math.abs(loanId.split('-').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
      }, 0)) % 1000000;

      await LocalNotifications.cancel({
        notifications: [{ id: notificationId }]
      });
    } catch (e) {
      console.error('Error al cancelar notificación', e);
    }
  }
};
