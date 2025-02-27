import { GRAPH_MARGIN, LABELS_HEIGHT, SCALE_WIDTH } from '@/components/chart/base/graph-values';
import { DiffRect, Line, rect, rrect, vec } from '@shopify/react-native-skia';

interface DebugLinesProps {
    canvasHeight: number;
    canvasWidth: number;
}

export default function DebugLines({ canvasHeight, canvasWidth }: DebugLinesProps) {
    return <>
        <DiffRect
            outer={rrect(rect(GRAPH_MARGIN, GRAPH_MARGIN, canvasWidth - GRAPH_MARGIN * 2, canvasHeight - GRAPH_MARGIN * 2), 0, 0)}
            inner={rrect(rect(GRAPH_MARGIN + 1, GRAPH_MARGIN + 1, canvasWidth - (GRAPH_MARGIN * 2 + 2), canvasHeight - (GRAPH_MARGIN * 2 + 2)), 0, 0)}
            color="red"/>

        <Line p1={vec(canvasWidth - GRAPH_MARGIN - SCALE_WIDTH, GRAPH_MARGIN)}
              p2={vec(canvasWidth - GRAPH_MARGIN - SCALE_WIDTH, canvasHeight - GRAPH_MARGIN)}
              color="red"
              strokeWidth={.8}/>

        <Line p1={vec(GRAPH_MARGIN, canvasHeight - GRAPH_MARGIN - LABELS_HEIGHT)}
              p2={vec(canvasWidth - GRAPH_MARGIN, canvasHeight - GRAPH_MARGIN - LABELS_HEIGHT)}
              color="red"
              strokeWidth={.8}/>
    </>;
}
