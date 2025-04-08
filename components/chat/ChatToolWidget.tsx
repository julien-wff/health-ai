import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import StepsChart from '@/components/chart/StepsChart';
import { tools } from '@/utils/ai';
import { parseRange } from '@/utils/health';
import { ToolInvocation } from 'ai';
import { useMemo } from 'react';
import GoalCreatedWidget from '@/components/goals/GoalCreatedWidget';

interface ChatToolWidgetProps {
    invocation: ToolInvocation;
}

export default function ChatToolWidget({ invocation }: ChatToolWidgetProps) {
    const [ start, end ] = useMemo(
        () => parseRange(invocation.args.startDate, invocation.args.endDate),
        [ invocation.args.startDate, invocation.args.endDate ],
    );

    switch (invocation.toolName as keyof typeof tools) {
        case 'display-steps':
            return <StepsChart startDate={start} endDate={end}/>;
        case 'display-exercise':
            return <ExerciseChart startDate={start} endDate={end}/>;
        case 'display-sleep':
            return <SleepChart startDate={start} endDate={end}/>;
        case 'create-user-goal':
            return <GoalCreatedWidget toolParams={invocation.args}/>;
        default:
            return <></>;
    }
}
