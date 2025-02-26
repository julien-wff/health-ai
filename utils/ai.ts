import { generateAPIUrl } from '@/utils/endpoints';
import { UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

export async function generateConversationTitle(messages: UIMessage[]) {
    const response = await expoFetch(generateAPIUrl('/api/title'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages.map(({ role, content }) => ({ role, content })),
        }),
    });

    return response.text();
}
