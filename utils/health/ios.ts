import BrokenHealthKit from 'react-native-health';

// React-native-health is not yet compatible with React Native 0.76
// See https://github.com/agencyenterprise/react-native-health/issues/399#issuecomment-2612353058
const AppleHealthKit = require('react-native').NativeModules.AppleHealthKit as typeof BrokenHealthKit;
AppleHealthKit.Constants = BrokenHealthKit.Constants;

export { AppleHealthKit };

export const REQUIRED_PERMISSIONS = [
    AppleHealthKit.Constants.Permissions.StepCount,
    AppleHealthKit.Constants.Permissions.Workout,
    AppleHealthKit.Constants.Permissions.SleepAnalysis,
];
