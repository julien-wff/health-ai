import { ScaleUnit } from '@/components/chart/base/graph-values';

export function formatScaleUnit(value: number, scaleUnit: ScaleUnit = 'none') {
    switch (scaleUnit) {
        case 'duration':
            return Math.floor(value / 60) + ':' + Math.floor(value % 60 / 10) + '0';
        case 'time':
            return String(value); // TODO
        default:
            // Round to 2 significant digits
            const roundMultiplier = Math.pow(10, Math.max(String(Math.round(value)).length - 2, 0));
            return String(Math.round(value / roundMultiplier) * roundMultiplier).trim();
    }
}
