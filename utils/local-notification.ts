import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';


export async function scheduleNotification(title?: string, body?: string, date?: string) {
    const dayjsDate = dayjs(date);

    if (!dayjsDate.isValid()) {
        return 'Error: Invalid date.';
    }

    if (!title) {
        return 'Error: Invalid title (undefined).';
    }

    if (!body) {
        return 'Error: Invalid body (undefined).';
    }

    if (!date) {
        return 'Error: Invalid date (undefined).';
    }

    const triggerDate = dayjsDate.toDate();

    let responseText = '';
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: 'default',
            date: triggerDate,
        },
    })
        .then((value) => {
            responseText = 'Successfully scheduled notification.';
            console.log('Notification scheduled');
        })
        .catch((e) => {
            responseText = 'Error while scheduling notification: ' + e.message;
            console.log('Error: ', e?.message);
        });

    return responseText;
}
