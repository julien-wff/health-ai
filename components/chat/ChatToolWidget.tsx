import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import StepsChart from '@/components/chart/StepsChart';
import { tools } from '@/utils/ai';
import { ToolInvocation } from 'ai';

interface ChatToolWidgetProps {
    invocation: ToolInvocation;
}

export default function ChatToolWidget({ invocation }: ChatToolWidgetProps) {
    switch (invocation.toolName as keyof typeof tools) {
        case 'display-steps':
            return <StepsChart startDate={invocation.args.startDate} endDate={invocation.args.endDate}/>;
        case 'display-exercise':
            return <ExerciseChart startDate={invocation.args.startDate} endDate={invocation.args.endDate}/>;
        case 'display-sleep':
            return <SleepChart startDate={invocation.args.startDate} endDate={invocation.args.endDate}/>;
        default:
            return <></>;
    }
}
