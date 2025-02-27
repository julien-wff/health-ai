import { GRAPH_MARGIN, LABELS_HEIGHT, ScaleUnit } from '@/components/chart/base/graph-values';
import ScaleLine from '@/components/chart/base/ScaleLine';
import { useMemo } from 'react';

interface ScaleProps {
    values: number[];
    canvasHeight: number;
    canvasWidth: number;
    scaleUnit?: ScaleUnit;
}

export default function Scale({ values, canvasWidth, canvasHeight, scaleUnit }: ScaleProps) {
    const maxValue = useMemo(() => Math.max(...values), [ values ]);

    return <>
        <ScaleLine value={maxValue}
                   scaleUnit={scaleUnit}
                   lineY={GRAPH_MARGIN}
                   canvasWidth={canvasWidth}
                   animationDelay={1}/>

        <ScaleLine value={maxValue / 2}
                   scaleUnit={scaleUnit}
                   lineY={(canvasHeight - LABELS_HEIGHT) / 2}
                   canvasWidth={canvasWidth}
                   animationDelay={1 / 2}/>

        <ScaleLine value={0}
                   scaleUnit={scaleUnit}
                   lineY={canvasHeight - GRAPH_MARGIN - LABELS_HEIGHT}
                   canvasWidth={canvasWidth}
                   animationDelay={0}/>
    </>;
}
