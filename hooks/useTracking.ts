import * as Sentry from '@sentry/react-native';
import { usePostHog } from 'posthog-react-native';

export function useTracking() {
    const posthog = usePostHog();

    /**
     * Captures an event with the specified name and optional properties in both PostHog and Sentry.
     * @param eventName - The name of the event to capture
     * @param properties - Optional additional properties to include with the event
     */
    const event = (eventName: string, properties?: Record<string, any>) => {
        try {
            setTimeout(() => {
                posthog?.capture(eventName, properties);
                Sentry.captureEvent({
                    event_id: eventName,
                    extra: properties,
                    level: 'info',
                });
            }, 0);
        } catch (e) {
            console.error(e);
        }
    };

    return { event };
}
