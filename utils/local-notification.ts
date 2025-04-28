import * as Notifications from 'expo-notifications';
import { AndroidImportance, NotificationRequest, NotificationRequestInput } from 'expo-notifications';
import dayjs from 'dayjs';
import dedent from 'dedent';

export interface ScheduleNotificationResponse {
    status: 'success' | 'error';
    message: string;
    notificationIds?: string[];
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
            Notification ids: ${response.notificationIds?.join(', ')}
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
    `;
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

    const title = notification.content.title ?? '';
    const body = notification.content.body ?? '';
    const chatId = notification.content.data.chatId;

    return scheduleNotification(title, body, [ date ], chatId, identifier);
}

function buildNoficationRequestInput(title: string, body: string, date: Date, chatId: string, identifier?: string): NotificationRequestInput {
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
            date: date,
        },
    };

    if (identifier) {
        notificationRequestInput = {
            ...notificationRequestInput,
            identifier: identifier,
        };
    }

    return notificationRequestInput;
}

export async function scheduleNotification(title: string, body: string, dates: string[], chatId: string, identifier?: string): Promise<ScheduleNotificationResponse> {
    const dayjsDates = dates.map(dayjs).filter(date => date.isValid() && !date.isBefore(dayjs()));

    // if (dayjsDates?.length != dates?.length) {
    //     return { status: 'error', message: 'One or more dates were invalid.' };
    // }

    let notificationIds: string[] = [];

    for (const dayjsDate of dayjsDates) {
        const notificationRequestInput = buildNoficationRequestInput(title, body, dayjsDate.toDate(), chatId, identifier);

        const notificationId = await Notifications.scheduleNotificationAsync(notificationRequestInput);
        notificationIds.push(notificationId);
    }

    return { status: 'success', message: 'Notification scheduled successfully.', notificationIds: notificationIds };
}
