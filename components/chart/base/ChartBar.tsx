import {
    BAR_SPACE_RATIO,
    GRAPH_MARGIN,
    INDIVIDUAL_ANIMATIONS_DURATION,
    LABELS_HEIGHT,
    SCALE_WIDTH,
    TOTAL_ANIMATIONS_DURATION,
} from '@/components/chart/base/graph-values';
import { useColors } from '@/hooks/useColors';
import { Group, Paint, Paragraph, RoundedRect, Skia, TextAlign } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

interface ChartBarProps {
    canvasHeight: number;
    canvasWidth: number;
    value: number; // 0-100
    index: number;
    label: string;
    barsCount: number;
    color: string;
}

export default function ChartBar({ color, label, canvasHeight, canvasWidth, value, index, barsCount }: ChartBarProps) {
    const colors = useColors();
    const [ labelTextHeight, setLabelTextHeight ] = useState(0);

    const barWidth = (canvasWidth - SCALE_WIDTH - GRAPH_MARGIN * 2) / barsCount * BAR_SPACE_RATIO;
    const finalBarHeight = (canvasHeight - GRAPH_MARGIN * 2 - LABELS_HEIGHT) * value / 100;
    const barX = GRAPH_MARGIN + index * barWidth / BAR_SPACE_RATIO; // TODO: remove last bar spacing
    const finalBarY = canvasHeight - GRAPH_MARGIN - finalBarHeight - LABELS_HEIGHT;

    const barHeight = useSharedValue(0);
    const barY = useDerivedValue(() => finalBarY + (finalBarHeight - barHeight.value));
    const labelOpacity = useSharedValue(0);
    useEffect(() => {
        const animationDelay = (TOTAL_ANIMATIONS_DURATION - INDIVIDUAL_ANIMATIONS_DURATION) / barsCount * index;
        barHeight.value = withDelay(
            animationDelay,
            withTiming(finalBarHeight, { duration: INDIVIDUAL_ANIMATIONS_DURATION }),
        );
        labelOpacity.value = withDelay(
            animationDelay,
            withTiming(1, { duration: INDIVIDUAL_ANIMATIONS_DURATION }),
        );
    }, [ finalBarHeight ]);

    const paragraph = useMemo(
        () => {
            const p = Skia
                .ParagraphBuilder
                .Make({ textAlign: TextAlign.Center })
                .pushStyle({ fontSize: 12, color: Skia.Color(colors.text) })
                .addText(label)
                .build();
            p.layout(barWidth);
            setLabelTextHeight(p.getHeight());
            return p;
        },
        [ label, colors.text, barWidth ],
    );

    return <>
        <RoundedRect x={barX}
                     y={barY}
                     width={barWidth}
                     height={barHeight}
                     r={8}
                     color={color}/>
        <Group layer={<Paint opacity={labelOpacity}></Paint>}>
            <Paragraph paragraph={paragraph}
                       x={barX}
                       y={canvasHeight - GRAPH_MARGIN - LABELS_HEIGHT + (LABELS_HEIGHT - labelTextHeight)}
                       width={barWidth}/>
        </Group>
    </>;
}
