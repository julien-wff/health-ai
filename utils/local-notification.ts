import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import dayjs from 'dayjs';

interface ScheduleNotificationResponse {
    status: 'success' | 'error';
    message: string;
    notificationId?: string;
}

enum NotificationChannel {
    General = 'general',
}

export async function createNotificationChannels() {
    await Notifications.setNotificationChannelAsync(
        NotificationChannel.General,
        {
            name: 'General',
            description: 'General notification channel',
            importance: AndroidImportance.MAX,
            vibrationPattern: [ 0, 250, 250, 250 ],
            enableVibrate: true,
        },
    );
}

export async function onScheduleNotificationToolCall(title?: string, body?: string, date?: string, chatId?: string) {
    const result = await scheduleNotification(title, body, date, chatId);

    return result.status;
}

export async function scheduleNotification(title?: string, body?: string, date?: string, chatId?: string): Promise<ScheduleNotificationResponse> {
    const dayjsDate = dayjs(date);

    if (!title || !body || !date) {
        return { status: 'error', message: 'Missing title, body, or date.' };
    }

    if (!dayjsDate.isValid()) {
        return { status: 'error', message: 'Invalid date format.' };
    }

    const triggerDate = dayjsDate.toDate();

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: {
                chatId: chatId,
            },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: NotificationChannel.General,
            date: triggerDate,
        },
    });

    return { status: 'success', message: 'Notification scheduled successfully.', notificationId: notificationId };
}
