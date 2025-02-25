import { LinearGradient } from 'expo-linear-gradient';
import { LucideProps } from 'lucide-react-native';
import { ForwardRefExoticComponent } from 'react';
import { Text, View } from 'react-native';

interface HealthRecordProps {
    icon: ForwardRefExoticComponent<LucideProps>;
    label: string;
    color: string;
    background: [ string, string ];
}

export default function HealthRecord({ icon: Icon, label, color, background }: HealthRecordProps) {
    return <View className="flex flex-1 items-center gap-2 p-4">
        <LinearGradient colors={background}
                        style={{ borderRadius: 8 }}
                        className="absolute inset-0 rounded-lg"
                        start={[ 0, 0 ]}
                        end={[ 1, 1 ]}/>
        <Icon color={color}/>
        <Text className="text-lg text-slate-800 dark:text-slate-200">
            {label}
        </Text>
    </View>;
}
