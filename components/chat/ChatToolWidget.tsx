import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import StepsChart from '@/components/chart/StepsChart';
import { tools } from '@/utils/ai';
import { parseRange } from '@/utils/health';
import { ToolInvocation } from 'ai';
import { useMemo } from 'react';
import NotificationSuccessWidget from '@/components/chat/NotificationSuccessWidget';
import dayjs from 'dayjs';

interface ChatToolWidgetProps {
    invocation: ToolInvocation;
}

export default function ChatToolWidget({ invocation }: Readonly<ChatToolWidgetProps>) {
    const toolName = useMemo(
        () => invocation.toolName as keyof typeof tools,
        [ invocation.toolName ],
    );

    const [ start, end ] = useMemo(
        () => parseRange(invocation.args.startDate, invocation.args.endDate),
        [ invocation.args.startDate, invocation.args.endDate ],
    );

    const [ date, title ] = useMemo(
        () => [ dayjs(invocation.args.date), invocation.args.title ],
        [ invocation.args.date, invocation.args.title ],
    );

    if (invocation.state === 'result' && invocation.result === 'error') {
        return <></>;
    }

    switch (toolName) {
        case 'display-steps':
            return <StepsChart startDate={start} endDate={end}/>;
        case 'display-exercise':
            return <ExerciseChart startDate={start} endDate={end}/>;
        case 'display-sleep':
            return <SleepChart startDate={start} endDate={end}/>;
        case 'schedule-notification':
            return <NotificationSuccessWidget title={title} date={date}/>;
        default:
            return <></>;
    }
}
