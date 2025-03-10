import ExerciseChart from '@/components/chart/ExerciseChart';
import SleepChart from '@/components/chart/SleepChart';
import StepsChart from '@/components/chart/StepsChart';
import { tools } from '@/utils/ai';
import { parseRange } from '@/utils/health';
import { ToolInvocation } from 'ai';
import { useMemo } from 'react';

interface ChatToolWidgetProps {
    invocation: ToolInvocation;
}

/**
 * Renders a chart component based on the tool invocation configuration.
 *
 * This component extracts a date range from the invocation arguments and renders one of the following charts:
 * - A steps chart for displaying step count data when the tool is "display-steps".
 * - An exercise chart for illustrating exercise-related information when the tool is "display-exercise".
 * - A sleep chart for visualizing sleep patterns when the tool is "display-sleep".
 * If the tool name does not match any supported type, an empty element is returned.
 *
 * @param invocation - An object containing the tool name and associated date range arguments.
 * @returns A React element rendering the appropriate chart, or an empty fragment if unsupported.
 */
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
        default:
            return <></>;
    }
}
