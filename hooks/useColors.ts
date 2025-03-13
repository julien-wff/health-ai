import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

const SLATE_50 = '#f8fafc';
const SLATE_200 = '#e2e8f0';
const SLATE_800 = '#1e293b';
const SLATE_950 = '#020617';

const LIME_100 = '#ecfccb';
const LIME_950 = '#1a2e05';
const EMERALD_100 = '#d1fae5';
const EMERALD_950 = '#022c22';
const GREEN_500 = '#22c55e';

const BLUE_100 = '#dbeafe';
const BLUE_950 = '#172554';
const VIOLET_100 = '#ede9fe';
const VIOLET_950 = '#2e1065';
const INDIGO_500 = '#6366f1';

const PINK_100 = '#fce7f3';
const PINK_950 = '#500724';
const ROSE_100 = '#ffe4e6';
const ROSE_950 = '#4c0519';
const RED_500 = '#ef4444';

const SKY_100 = '#e0f2fe';
const SKY_950 = '#082f49';
const INDIGO_100 = '#e0e7ff';
const INDIGO_950 = '#1e1b4b';
const BLUE_500 = '#3b82f6';

const ORANGE_400 = '#fb923c';
const ORANGE_500 = '#fb923c';

type Gradient = [ string, string ];


export function useColors() {
    const colorScheme = useColorScheme();

    return useMemo(() => ({
        background: colorScheme === 'light' ? SLATE_50 : SLATE_950,
        text: colorScheme === 'light' ? SLATE_800 : SLATE_200,
        green: GREEN_500,
        indigo: INDIGO_500,
        red: RED_500,
        blue: BLUE_500,
        orange: colorScheme === 'light' ? ORANGE_500 : ORANGE_400,
        greenBackground: (colorScheme === 'light' ? [ LIME_100, EMERALD_100 ] : [ LIME_950, EMERALD_950 ]) as Gradient,
        indigoBackground: (colorScheme === 'light' ? [ BLUE_100, VIOLET_100 ] : [ BLUE_950, VIOLET_950 ]) as Gradient,
        redBackground: (colorScheme === 'light' ? [ PINK_100, ROSE_100 ] : [ PINK_950, ROSE_950 ]) as Gradient,
        blueBackground: (colorScheme === 'light' ? [ SKY_100, INDIGO_100 ] : [ SKY_950, INDIGO_950 ]) as Gradient,
    }), [ colorScheme ]);
}
