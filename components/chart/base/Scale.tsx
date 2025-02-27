import { GRAPH_MARGIN, LABELS_HEIGHT } from '@/components/chart/base/graph-values';
import ScaleLine from '@/components/chart/base/ScaleLine';
import { useMemo } from 'react';

interface ScaleProps {
    values: number[];
    canvasHeight: number;
    canvasWidth: number;
}

export default function Scale({ values, canvasWidth, canvasHeight }: ScaleProps) {
    const maxValue = useMemo(() => Math.max(...values), [ values ]);

    return <>
        <ScaleLine value={maxValue}
                   lineY={GRAPH_MARGIN}
                   canvasWidth={canvasWidth}
                   animationDelay={1}/>

        <ScaleLine value={maxValue / 2} lineY={(canvasHeight - LABELS_HEIGHT) / 2}
                   canvasWidth={canvasWidth}
                   animationDelay={1 / 2}/>

        <ScaleLine value={0} lineY={canvasHeight - GRAPH_MARGIN - LABELS_HEIGHT}
                   canvasWidth={canvasWidth}
                   animationDelay={0}/>
    </>;
}
