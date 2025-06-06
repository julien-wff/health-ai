import {
    GRAPH_MARGIN,
    INDIVIDUAL_ANIMATIONS_DURATION,
    SCALE_WIDTH,
    ScaleUnit,
    TOTAL_ANIMATIONS_DURATION,
} from '@/components/chart/base/graph-values';
import { useColors } from '@/hooks/useColors';
import { formatScaleUnit } from '@/utils/format';
import {
    DashPathEffect,
    Group,
    Line,
    Mask,
    Paint,
    Paragraph,
    Rect,
    Skia,
    TextAlign,
    vec,
} from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

interface ScaleLineProps {
    value: number;
    lineY: number;
    canvasWidth: number;
    animationDelay: number; // Fraction of total animations duration
    scaleUnit?: ScaleUnit;
}

export default function ScaleLine({ value, lineY, canvasWidth, animationDelay, scaleUnit }: ScaleLineProps) {
    const colors = useColors();

    const paragraph = useMemo(() => {
        const p = Skia.ParagraphBuilder
            .Make({ textAlign: TextAlign.Center, maxLines: 1 })
            .pushStyle({ fontSize: 12, color: Skia.Color(colors.text) })
            .addText(formatScaleUnit(value, scaleUnit))
            .build();
        p.layout(SCALE_WIDTH);
        return p;
    }, [ value, colors.text, scaleUnit ]);

    const paragraphX = canvasWidth - GRAPH_MARGIN - SCALE_WIDTH;
    const lineX2 = canvasWidth - GRAPH_MARGIN - SCALE_WIDTH;

    const maskWidth = useSharedValue(0);
    const labelOpacity = useSharedValue(0);
    useEffect(() => {
        const realDelay = (TOTAL_ANIMATIONS_DURATION - INDIVIDUAL_ANIMATIONS_DURATION) * animationDelay / 2;
        maskWidth.value = withDelay(
            realDelay,
            withTiming(paragraphX, { duration: INDIVIDUAL_ANIMATIONS_DURATION }),
        );
        labelOpacity.value = withDelay(
            realDelay,
            withTiming(1, { duration: INDIVIDUAL_ANIMATIONS_DURATION }),
        );
    }, [ paragraphX, animationDelay ]);

    return <>
        <Group layer={<Paint opacity={labelOpacity}></Paint>}>
            <Paragraph paragraph={paragraph}
                       x={paragraphX}
                       y={lineY - paragraph.getHeight() / 2}
                       width={SCALE_WIDTH}/>
        </Group>

        <Mask mask={<Rect x={GRAPH_MARGIN} y={lineY - 2} width={maskWidth} height={4}/>}>
            <Line p1={vec(GRAPH_MARGIN, lineY)}
                  p2={vec(lineX2, lineY)}
                  color="#888"
                  strokeCap="round">
                <DashPathEffect intervals={[ 2, 2 ]}/>
            </Line>
        </Mask>
    </>;
}
