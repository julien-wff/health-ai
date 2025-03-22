import * as Sentry from '@sentry/react-native';
import { usePostHog } from 'posthog-react-native';

export function useTracking() {
    const posthog = usePostHog();

    const event = (eventName: string, properties?: Record<string, any>) => {
        try {
            (() => {
                posthog?.capture(eventName, properties);
                Sentry.captureEvent({
                    event_id: eventName,
                    extra: properties,
                    level: 'info',
                });
            })();
        } catch (e) {
            console.error(e);
        }
    };

    return { event };
}
