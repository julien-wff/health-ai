import ChartBar from '@/components/chart/base/ChartBar';
import DebugLines from '@/components/chart/base/DebugLines';
import { ScaleUnit } from '@/components/chart/base/graph-values';
import Scale from '@/components/chart/base/Scale';
import { Canvas, LinearGradient, Paragraph, RoundedRect, Skia, TextAlign, vec } from '@shopify/react-native-skia';
import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useColors } from '@/hooks/useColors';


interface BaseChartProps {
    barColor: string;
    backgroundColor: [ string, string ];
    values: (number | number[])[];
    valuesOffset?: (number | number[])[];
    labels: string[];
    /** Offset to add to the lowest value (0) of the scale */
    scaleValueOffset?: number;
    debug?: boolean;
    scaleUnit?: ScaleUnit;
    /** If `true`, 0 is on top and highest value on the bottom of the scale */
    reverse?: boolean;
    noMargin?: boolean;
}

export default React.memo(function BaseChart({
                                                 barColor,
                                                 backgroundColor,
                                                 values,
                                                 valuesOffset,
                                                 labels,
                                                 scaleValueOffset,
                                                 debug,
                                                 scaleUnit,
                                                 reverse,
                                                 noMargin,
                                             }: BaseChartProps) {
    const colors = useColors();

    const [ height, setHeight ] = useState(0);
    const [ width, setWidth ] = useState(0);

    const areValuesEmpty = useMemo(
        () => values.length === 0 || values.flat().every(value => value === 0),
        [ values ],
    );

    // Convert 1D arrays to 2D arrays with one element per item
    const values2D: number[][] = useMemo(
        () => values.map(value => Array.isArray(value) ? value : [ value ]),
        [ values ],
    );

    const valuesOffset2D: number[][] | undefined = useMemo(
        () => valuesOffset?.map(value => Array.isArray(value) ? value : [ value ]),
        [ valuesOffset ],
    );

    // Calculate maxValue and flatValues using flat()
    const { maxValue, flatValues } = useMemo(() => {
        // Create array of total values (value + offset)
        const totals = values2D.map((valueRow, rowIndex) =>
            valueRow.map((value, colIndex) => {
                const offset = valuesOffset2D?.[rowIndex]?.[colIndex] ?? 0;
                return value + offset;
            }),
        );

        const flat = totals.flat();
        const max = Math.max(...flat);

        return { maxValue: max, flatValues: flat };
    }, [ values2D, valuesOffset2D ]);

    function onLayout(ev: LayoutChangeEvent) {
        setHeight(ev.nativeEvent.layout.height);
        setWidth(ev.nativeEvent.layout.width);
    }

    const emptyDataParagraph = useMemo(() => {
        const p = Skia.ParagraphBuilder
            .Make({ textAlign: TextAlign.Center })
            .pushStyle({ fontSize: 14, color: Skia.Color(colors.text) })
            .addText('No data found for the selected period.\nCheck your health provider.')
            .build();
        p.layout(width);
        return p;
    }, [ areValuesEmpty, colors.text, width ]);

    return <View className={`w-full h-48 ${noMargin ? '' : 'my-2'}`} onLayout={onLayout}>
        <Canvas style={{ width, height }}>
            <RoundedRect width={width} height={height} r={12}>
                <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={backgroundColor}/>
            </RoundedRect>

            {areValuesEmpty &&
                <Paragraph paragraph={emptyDataParagraph}
                           width={width}
                           x={0}
                           y={height / 2 - emptyDataParagraph.getHeight() / 2}/>
            }

            {!areValuesEmpty &&
                <Scale values={flatValues}
                       canvasHeight={height}
                       canvasWidth={width}
                       scaleUnit={scaleUnit}
                       scaleValueOffset={scaleValueOffset}
                       reverse={reverse}/>
            }

            {!areValuesEmpty && values2D.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                    <ChartBar key={`${rowIndex}-${colIndex}`}
                              value={value / maxValue * 100}
                              offset={(valuesOffset2D?.[rowIndex]?.[colIndex] ?? 0) / maxValue * 100}
                              index={rowIndex}
                              label={labels[rowIndex]}
                              barsCount={values2D.length}
                              color={barColor}
                              reverse={reverse}
                              canvasHeight={height}
                              canvasWidth={width}/>
                )),
            )}

            {debug && <DebugLines canvasHeight={height} canvasWidth={width}/>}
        </Canvas>
    </View>;
});

