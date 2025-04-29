import ChatDrawer from '@/components/chat-drawer/ChatDrawer';
import ChatEmptyMessages from '@/components/chat/ChatEmptyMessages';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatTopBar from '@/components/chat/ChatTopBar';
import PromptInput from '@/components/chat/PromptInput';
import { useAppState } from '@/hooks/useAppState';
import { useHealthData } from '@/hooks/useHealthData';
import {
    generateConversationSuggestions,
    generateConversationSummary,
    generateConversationTitle,
    ToolParameters,
    tools,
} from '@/utils/ai';
import { type ChatRequestBody, getStorageChat, saveStorageChat } from '@/utils/chat';
import { getExtrovertFirstMessagePrompt, isChatSystemPrompt } from '@/utils/prompts';
import { generateAPIUrl } from '@/utils/endpoints';
import { filterCollectionRange, formatCollection } from '@/utils/health';
import { useChat } from '@ai-sdk/react';
import * as Sentry from '@sentry/react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { fetch as expoFetch } from 'expo/fetch';
import { useCallback, useEffect, useState } from 'react';
import { InteractionManager, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import HealthDataFoundNotification from '@/components/notification/HealthDataFoundNotification';
import EmptyHealthNotification from '@/components/notification/EmptyHealthNotification';
import { useTracking } from '@/hooks/useTracking';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { scheduleNotification } from '@/utils/local-notification';
import { createGoalAndSave, formatGoalForAI, updateGoalAndSave } from '@/utils/goals';

export default function Chat() {
    const {
        addOrUpdateChat,
        requireNewChat,
        setRequireNewChat,
        goals,
        setGoals,
        addGoal,
        notificationClickPrompt,
        setNotificationClickPrompt,
    } = useAppState();
    const {
        steps,
        exercise,
        sleep,
        loaded: healthLoaded,
        empty: healthEmpty,
        warningNotificationStatus,
    } = useHealthData();
    const router = useRouter();
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const tracking = useTracking();
    const { agentMode } = useFeatureFlags();

    const [ responseStreamed, setResponseStreamed ] = useState(false);
    const [ chatAgentMode, setChatAgentMode ] = useState(agentMode);
    const [ suggestions, setSuggestions ] = useState<string[]>([]);

    const { messages, setInput, input, handleSubmit, setMessages, stop, status } = useChat({
        id: chatId,
        fetch: expoFetch as unknown as typeof globalThis.fetch,
        api: generateAPIUrl(`/api/chat`),
        experimental_prepareRequestBody(options) {
            options.requestBody = {
                agentMode: chatAgentMode ?? 'introvert',
                goals: goals.map(formatGoalForAI),
            } satisfies ChatRequestBody;
            return options;
        },
        maxSteps: 5,
        onError: error => {
            Sentry.captureException(error);
            console.error(error, 'ERROR');
        },
        async onToolCall({ toolCall }) {
            switch (toolCall.toolName as keyof typeof tools) {
                case 'get-health-data-and-visualize': {
                    const {
                        dataType,
                        display,
                        startDate,
                        endDate,
                    } = toolCall.args as ToolParameters<'get-health-data-and-visualize'>;
                    tracking.event('chat_get_health_data', { dataType, display });
                    const data = filterCollectionRange({ steps, exercise, sleep }[dataType], startDate, endDate);
                    return formatCollection(data, dataType);
                }
                case 'schedule-notification': {
                    const { title, body, date, userPrompt } = toolCall.args as ToolParameters<'schedule-notification'>;
                    const notificationResponse = await scheduleNotification(title, body, date, chatId, userPrompt);
                    tracking.event('chat_schedule_notification', { status: notificationResponse.status });
                    return notificationResponse.status;
                }
                case 'create-user-goal': {
                    const goal = await createGoalAndSave(toolCall.args as ToolParameters<'create-user-goal'>);
                    addGoal(goal);
                    tracking.event('chat_create_user_goal');
                    return formatGoalForAI(goal);
                }
                case 'update-user-goal': {
                    const args = toolCall.args as ToolParameters<'update-user-goal'>;
                    const updatedGoals = await updateGoalAndSave(args.id, args);
                    if (!updatedGoals) {
                        return `Goal #${args.id} not found. Max ID: ${goals.length}.`;
                    } else {
                        setGoals(updatedGoals);
                        tracking.event('chat_update_user_goal');
                        return formatGoalForAI(updatedGoals.find(g => g.id === args.id)!);
                    }
                }
                case 'display-user-goal': {
                    tracking.event('chat_display_user_goals');
                    const goalId = (toolCall.args as ToolParameters<'display-user-goal'>).id;
                    const goal = goals.find(g => g.id === goalId);
                    if (!goal) {
                        return `Goal #${goalId} not found. Max ID: ${goals.length}.`;
                    } else {
                        return formatGoalForAI(goal);
                    }
                }
            }
        },
        onResponse() {
            tracking.event('chat_response');
            setResponseStreamed(true);
        },
    });

    const [ drawerOpened, setDrawerOpened ] = useState(false);
    const [ title, setTitle ] = useState<string | null>(null);

    useEffect(() => {
        if (chatAgentMode === undefined && agentMode)
            setChatAgentMode(agentMode);

        if (chatAgentMode !== agentMode)
            onNewChat();
    }, [ agentMode ]);

    useFocusEffect(
        useCallback(() => {
            if (messages.length > 0 && requireNewChat) {
                setRequireNewChat(false);
                router.replace('/chat');
            }
        }, [ requireNewChat ]),
    );

    useEffect(() => {
        if (isChatSystemPrompt(input))
            handleSubmit();
    }, [ input ]);

    useEffect(() => {
        (async () => {
            const chat = await getStorageChat(chatId);
            if (!chat) {
                if (chatAgentMode === 'extrovert')
                    setInput(getExtrovertFirstMessagePrompt(notificationClickPrompt));
                else
                    setInput(notificationClickPrompt ?? '');

                if (notificationClickPrompt) {
                    tracking.event('notification_click');
                    setNotificationClickPrompt(null);
                }

                return;
            }

            tracking.event('chat_reopen');
            setMessages(chat.messages);
            setTitle(chat.title);
            setChatAgentMode(chat.agentMode);
        })();
    }, []);

    useEffect(() => {
        /**
         * Early return if:
         * - Chat is streaming a response
         * - Only user message is present, AI hasn't answered yet
         * - AI message is not the last one
         * - The chat has been loaded from storage, no messages have been sent yet
         * - Agent mode is undefined
         */
        if (status !== 'ready' || messages.length < 2 || messages.length % 2 === 1 || !responseStreamed || !chatAgentMode)
            return;

        // Save chat if more than 2 messages and title is set
        InteractionManager.runAfterInteractions(async () => {
            if (!title)
                return;
            const chat = {
                id: chatId,
                messages,
                title,
                agentMode: chatAgentMode,
                summary: await generateConversationSummary(messages),
            };
            addOrUpdateChat(chat);
            void saveStorageChat(chat);
            void generateConversationSuggestions(messages).then(setSuggestions);
        });

        // Register new message to Posthog and Sentry
        if (title)
            tracking.event('chat_new_message', { messageCount: messages.length });

        // Generate title if exactly 2 messages and no title
        if (messages.length === 2 || title === null) {
            InteractionManager.runAfterInteractions(() => {
                generateConversationTitle(messages)
                    .then(setTitle)
                    .then(() => tracking.event('chat_title_generated', { length: messages.length }));
            });
        }
    }, [ messages.length, status, title, responseStreamed, chatAgentMode ]);

    // Slight vibration each time a part of a message is received
    useEffect(() => {
        if (!responseStreamed || messages.length % 2 === 1)
            return;

        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, [ messages ]);

    // Report drawer status
    useEffect(() => {
        if (drawerOpened)
            tracking.event('chat_drawer_open');
        else
            tracking.event('chat_drawer_close');
    }, [ drawerOpened ]);

    /**
     * Stop current message streaming (if any) and navigate to new chat screen
     */
    function onNewChat() {
        tracking.event('chat_new_click');
        stop();
        router.replace('/chat');
    }

    return <View className="relative h-full">
        <SafeAreaView className="h-full">
            <Drawer open={drawerOpened}
                    onOpen={() => setDrawerOpened(true)}
                    onClose={() => setDrawerOpened(false)}
                    renderDrawerContent={() => <ChatDrawer/>}>
                <KeyboardAvoidingView className="flex flex-1"
                                      keyboardVerticalOffset={insets.top}
                                      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ChatTopBar onOpen={() => setDrawerOpened(true)} onNew={onNewChat} text={title}/>

                    {messages.length === 0
                        ? <ChatEmptyMessages onPromptClick={p => setInput(p)}/>
                        : <ChatMessages messages={messages}/>
                    }

                    <PromptInput input={input}
                                 setInput={setInput}
                                 handleSubmit={handleSubmit}
                                 chatAgentMode={chatAgentMode}
                                 suggestions={suggestions}
                                 setSuggestions={setSuggestions}
                                 isLoading={status === 'streaming' || status === 'submitted'}/>
                </KeyboardAvoidingView>

                {healthLoaded && healthEmpty && <EmptyHealthNotification/>}
                {healthLoaded && !healthEmpty && warningNotificationStatus && <HealthDataFoundNotification/>}
            </Drawer>
        </SafeAreaView>

        <View className="absolute bottom-0 w-full bg-slate-50 dark:bg-slate-900"
              style={{ height: insets.bottom }}/>
    </View>;
}
