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
            Notification ids: ${response.notificationIds?.length ? response.notificationIds.join(', ') : ''}
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
        Date: ${dayjs(triggerInput.date).format('YYYY-MM-DD HH:mm')}
    `;
}

function formatNotificationsForAI(notifications: NotificationRequest[]): string {
    return notifications.map(formatNotificationForAI).join('\n\n');
}

/**
 * Get all active scheduled notifications details concatenated for the AI agent.
 */
export async function getAllScheduledNotificationsForAI(): Promise<string> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();

    if (notifications.length === 0) {
        return 'There are no scheduled notifications yet.';
    }

    return formatNotificationsForAI(notifications);
}

/**
 * Cancel one or more scheduled notifications.
 * @param identifiers An array of notifications identifiers.
 */
export async function cancelScheduledNotifications(identifiers: string[]): Promise<void> {
    for (const identifier of identifiers) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
    }
}

/**
 * Reschedule one local notification for a different time in the future.
 * @param identifier The notification identifier (id).
 * @param date The notification's new delivery date
 */
export async function rescheduleNotification(identifier: string, date: string): Promise<ScheduleNotificationResponse> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();

    const notification = notifications.filter(n => n.identifier === identifier).pop();

    if (!notification) {
        return { status: 'error', message: 'No such notification found.' };
    }

    const title = notification.content.title ?? '';
    const body = notification.content.body ?? '';
    const { chatId, userPrompt } = notification.content.data;
    const parsedDate = dayjs(date).toDate();

    await scheduleNotification(title, body, parsedDate, chatId, userPrompt, identifier);
    return { status: 'success', message: 'Notification scheduled successfully.', notificationIds: [ identifier ] };
}

/**
 * Schedule one local notification.
 * @param title Notification title.
 * @param body Notification body.
 * @param date The date when the notification will be triggered.
 * @param chatId The id of the chat that will be stored in the notification.
 * @param userPrompt Optional user prompt to use when starting a chat from the notification.
 * @param identifier Optional identifier (id) to edit an existing notification.
 * @return Notification identifier.
 */
async function scheduleNotification(title: string, body: string, date: Date, chatId: string, userPrompt?: string, identifier?: string): Promise<string> {
    let notificationRequestInput: NotificationRequestInput = {
        content: {
            title: title,
            body: body,
            data: {
                chatId,
                userPrompt,
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

    return await Notifications.scheduleNotificationAsync(notificationRequestInput);
}

/**
 * Schedule one or more local notifications with the same title and body but at different dates.
 * @param title Notification title.
 * @param body Notification body.
 * @param dates An array of the dates when the notification will be triggered.
 * @param chatId The id of the chat that will be stored in the notification.
 * @param userPrompt Optional user prompt to use when starting a chat from the notification.
 * @return An object containing details about the success of the notification scheduling.
 */
export async function scheduleNotifications(title: string, body: string, dates: string[], chatId: string, userPrompt?: string): Promise<ScheduleNotificationResponse> {
    const parsedDates = dates
        .map(dayjs)
        .filter(date => date.isValid() && !date.isBefore(dayjs()))
        .map(date => date.toDate());

    if (parsedDates.length !== dates.length) {
        return { status: 'error', message: 'One or more dates are invalid.' };
    }

    const notificationIds: string[] = [];
    for (const date of parsedDates) {
        const notificationId = await scheduleNotification(title, body, date, chatId, userPrompt);
        notificationIds.push(notificationId);
    }

    return { status: 'success', message: 'Notification scheduled successfully.', notificationIds: notificationIds };
}
