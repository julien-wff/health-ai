import { Text, View } from 'react-native';
import { CreateGoalsParams } from '@/utils/goals';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useMemo } from 'react';
import { Footprints, Medal, MoonStar, Trophy } from 'lucide-react-native';
import dayjs from 'dayjs';


interface GoalCreatedWidgetProps {
    toolParams: CreateGoalsParams;
}

export default function GoalCreatedWidget({ toolParams }: Readonly<GoalCreatedWidgetProps>) {
    const colors = useColors();
    const { description, type, mustBeCompletedBy } = toolParams;

    const [ iconColor, bgColor, Icon ] = useMemo(() => {
        switch (type) {
            case 'sleep':
                return [ colors.indigo, colors.indigoBackground, MoonStar ];
            case 'exercise':
                return [ colors.red, colors.redBackground, Medal ];
            case 'steps':
                return [ colors.green, colors.greenBackground, Footprints ];
            default:
                return [ colors.blue, colors.blueBackground, Trophy ];
        }
    }, [ type ]);

    return <View className="flex flex-row items-center justify-center gap-4 p-4 my-2">
        <LinearGradient colors={bgColor}
            // Tailwind doesn't seem to work, especially on iOS
                        style={{ borderRadius: 8, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        start={[ 0, 0 ]}
                        end={[ 1, 1 ]}/>

        <Icon color={iconColor} size={32} className="w-6 h-6"/>

        <View className="flex flex-1 justify-center">
            <Text className="text-slate-800 dark:text-slate-200" numberOfLines={1}>
                Goal: {description}
            </Text>

            {mustBeCompletedBy && <Text className="text-slate-500 dark:text-slate-400">
                Complete by {dayjs(mustBeCompletedBy).format('MMMM D')}
                {' '}
                ({dayjs(mustBeCompletedBy).fromNow()})
            </Text>}
        </View>
    </View>;
}
