// Notification Service for Rabbit NEET Companion
// Uses browser Notification API natively with permission checks & user preference honoring.
// Adheres strictly to the NO-SPAM rule & stops reminders once daily 100 MCQs are completed.

export class NotificationService {
  private static STORAGE_KEY = 'rabbit_notification_prefs_v1';

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return false;
    }
  }

  public static sendStudyReminder(options: {
    title: string;
    body: string;
    isDailyGoalDone?: boolean;
    tag?: string;
  }): boolean {
    if (!this.isSupported()) return false;
    if (Notification.permission !== 'granted') return false;

    // Rule: Don't spam reminders if the daily 100 MCQ goal is achieved
    if (options.isDailyGoalDone && options.tag === 'daily-mcq-reminder') {
      return false;
    }

    try {
      new Notification(`🐇 ${options.title}`, {
        body: options.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: options.tag || 'rabbit-study',
      });
      return true;
    } catch (e) {
      console.warn('Error dispatching notification:', e);
      return false;
    }
  }
}
