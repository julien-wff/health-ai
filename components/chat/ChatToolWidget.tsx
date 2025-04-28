import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import StepsChart from '@/components/chart/StepsChart';
import type { ToolParameters, tools } from '@/utils/ai';
import { parseRange } from '@/utils/health';
import { ToolInvocation } from 'ai';
import { useMemo } from 'react';
import NotificationSuccessWidget from '@/components/chat/NotificationSuccessWidget';
import dayjs from 'dayjs';
import GoalWidget from '@/components/goals/GoalWidget';
import { useAppState } from '@/hooks/useAppState';

interface ChatToolWidgetProps {
    invocation: ToolInvocation;
}

export default function ChatToolWidget({ invocation }: Readonly<ChatToolWidgetProps>) {
    const { goals } = useAppState();

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
        case 'get-health-data-and-visualize':
            return <Chart {...invocation.args}/>;
        case 'schedule-notification':
            return <NotificationSuccessWidget title={title} date={date}/>;
        case 'create-user-goal':
            return <GoalWidget goal={invocation.args}/>;
        case 'update-user-goal':
        case 'display-user-goal': {
            const goalId = invocation.args.id as number;
            const goal = goals.find(g => g.id === goalId);
            if (!goal) {
                return <></>;
            }
            return <GoalWidget goal={goal}/>;
        }
        default:
            return <></>;
    }
}


function Chart({ dataType, startDate, endDate, display }: Readonly<ToolParameters<'get-health-data-and-visualize'>>) {
    const [ start, end ] = useMemo(
        () => parseRange(startDate, endDate),
        [ startDate, endDate ],
    );

    if (!display) {
        return <></>;
    }

    switch (dataType) {
        case 'steps':
            return <StepsChart startDate={start} endDate={end}/>;
        case 'exercise':
            return <ExerciseChart startDate={start} endDate={end}/>;
        case 'sleep':
            return <SleepChart startDate={start} endDate={end}/>;
    }

}
