import ChartBar from '@/components/chart/base/ChartBar';
import DebugLines from '@/components/chart/base/DebugLines';
import { ScaleUnit } from '@/components/chart/base/graph-values';
import Scale from '@/components/chart/base/Scale';
import { Canvas, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';


interface BaseChartProps {
    barColor: string;
    backgroundColor: [ string, string ];
    values: number[];
    valuesOffset?: number[];
    labels: string[];
    /** Offset to add to the lowest value (0) of the scale */
    scaleValueOffset?: number;
    debug?: boolean;
    scaleUnit?: ScaleUnit;
    /** If `true`, 0 is on top and highest value on the bottom of the scale */
    reverse?: boolean;
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
                                             }: BaseChartProps) {
    const [ height, setHeight ] = useState(0);
    const [ width, setWidth ] = useState(0);

    const maxValue = useMemo(
        () => Math.max(
            ...values.map((value, index) => value + (valuesOffset?.[index] ?? 0)),
        ),
        [ values, valuesOffset ],
    );

    function onLayout(ev: LayoutChangeEvent) {
        setHeight(ev.nativeEvent.layout.height);
        setWidth(ev.nativeEvent.layout.width);
    }

    return <View className="w-full h-48 my-2" onLayout={onLayout}>
        <Canvas style={{ width, height }}>
            <RoundedRect width={width} height={height} r={12}>
                <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={backgroundColor}/>
            </RoundedRect>

            <Scale values={values}
                   canvasHeight={height}
                   canvasWidth={width}
                   scaleUnit={scaleUnit}
                   scaleValueOffset={scaleValueOffset}
                   reverse={reverse}/>

            {values.map((value, index) => (
                <ChartBar key={index}
                          value={value / maxValue * 100}
                          offset={(valuesOffset?.[index] ?? 0) / maxValue * 100}
                          index={index}
                          label={labels[index]}
                          barsCount={values.length}
                          color={barColor}
                          reverse={reverse}
                          canvasHeight={height}
                          canvasWidth={width}/>
            ))}

            {debug && <DebugLines canvasHeight={height} canvasWidth={width}/>}
        </Canvas>
    </View>;
});
