import * as Notifications from 'expo-notifications';
import { AndroidImportance, NotificationRequest, NotificationRequestInput } from 'expo-notifications';
import dayjs from 'dayjs';
import dedent from 'dedent';

export interface ScheduleNotificationResponse {
    status: 'success' | 'error';
    message: string;
    notificationId?: string;
}

export enum NotificationChannel {
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

export function formatScheduleNotificationResponseForAI(response: ScheduleNotificationResponse) {
    if (response.status === 'success') {
        return dedent`
            ${response.message}
            Notification id: ${response.notificationId}
        `;
    }

    return response.status;
}

function formatNotificationForAI(notification: NotificationRequest): string {
    const triggerInput = notification.trigger as Notifications.DateTriggerInput;

    return dedent`
        Notification ID: ${notification.identifier}
        Title: ${notification.content.title}
        Body: ${notification.content.body}
        Date: ${dayjs(triggerInput.date).toISOString()}
    `
}

function formatNotificationsForAI(notifications: NotificationRequest[]): string {
    return notifications.map(formatNotificationForAI).join('\n\n');
}

export async function getAllScheduledNotificationsForAI(): Promise<string> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();

    if (notifications.length === 0) {
        return 'There are no scheduled notifications yet.';
    }

    return formatNotificationsForAI(await Notifications.getAllScheduledNotificationsAsync());
}

export async function cancelScheduledNotification(identifier: string): Promise<boolean> {
    await Notifications.cancelScheduledNotificationAsync(identifier);

    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.filter(n => n.identifier === identifier).length === 0;
}

export async function rescheduleNotification(identifier: string, date: string): Promise<ScheduleNotificationResponse> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();

    const notification = notifications.filter(n => n.identifier === identifier).pop();

    if (!notification) {
        return { status: 'error', message: 'No such notification found.' };
    }

    const title = notification.content.title ?? undefined;
    const body = notification.content.body ?? undefined;
    const chatId = notification.content.data.chatId;

    return scheduleNotification(title, body, date, chatId, identifier);
}

export async function scheduleNotification(title?: string, body?: string, date?: string, chatId?: string, identifier?: string): Promise<ScheduleNotificationResponse> {
    const dayjsDate = dayjs(date);

    if (!title || !body || !date) {
        return { status: 'error', message: 'Missing title, body, or date.' };
    }

    if (!dayjsDate.isValid()) {
        return { status: 'error', message: 'Invalid date format.' };
    }

    if (dayjsDate.isBefore(dayjs())) {
        return { status: 'error', message: 'Cannot schedule notifications in the past.' };
    }

    const triggerDate = dayjsDate.toDate();

    let notificationRequestInput: NotificationRequestInput = {
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
    }

    if (identifier) {
        notificationRequestInput = {
            ...notificationRequestInput,
            identifier: identifier,
        }
    }

    let notificationId = null;
    try {
        notificationId = await Notifications.scheduleNotificationAsync(notificationRequestInput);
    } catch (error) {
        return {
            status: 'error',
            message: `Failed to schedule notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }

    return { status: 'success', message: 'Notification scheduled successfully.', notificationId: notificationId };
}
