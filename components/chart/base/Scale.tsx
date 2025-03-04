import { GRAPH_MARGIN, LABELS_HEIGHT, ScaleUnit } from '@/components/chart/base/graph-values';
import ScaleLine from '@/components/chart/base/ScaleLine';
import { useMemo } from 'react';

interface ScaleProps {
    values: number[];
    canvasHeight: number;
    canvasWidth: number;
    scaleUnit?: ScaleUnit;
    scaleValueOffset?: number;
    reverse?: boolean;
}

export default function Scale({ values, canvasWidth, canvasHeight, scaleUnit, scaleValueOffset, reverse }: ScaleProps) {
    const valueOffset = useMemo(() => scaleValueOffset ?? 0, [ scaleValueOffset ]);
    const maxValue = useMemo(() => Math.max(...values) + valueOffset, [ values, valueOffset ]);

    return <>
        <ScaleLine value={reverse ? valueOffset : maxValue}
                   scaleUnit={scaleUnit}
                   lineY={GRAPH_MARGIN}
                   canvasWidth={canvasWidth}
                   animationDelay={reverse ? 0 : 1}/>

        <ScaleLine value={(maxValue - valueOffset) / 2}
                   scaleUnit={scaleUnit}
                   lineY={(canvasHeight - LABELS_HEIGHT) / 2}
                   canvasWidth={canvasWidth}
                   animationDelay={1 / 2}/>

        <ScaleLine value={reverse ? maxValue : valueOffset}
                   scaleUnit={scaleUnit}
                   lineY={canvasHeight - GRAPH_MARGIN - LABELS_HEIGHT}
                   canvasWidth={canvasWidth}
                   animationDelay={reverse ? 1 : 0}/>
    </>;
}
