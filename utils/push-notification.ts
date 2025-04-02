import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';


export async function scheduleNotification(title?: string, body?: string, date?: string) {
    const triggerDate = dayjs(date).toDate();

    if (!title || !body || !date) {
        return 'Error: Invalid parameters.';
    }

    // First, set the handler that will cause the notification
    // to show the alert
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: '0', // TODO: Check this
            date: triggerDate,
        },
    }).then(
        (value) => {
            console.log('Notification scheduled');
        },
        (error) => {
            console.log('Notification error', error);
        },
    );

    return 'Successfully scheduled notification';
}
