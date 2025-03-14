import OpenAndroidApplication from './src/OpenAndroidApplicationModule';
import { UnavailabilityError } from 'expo-modules-core';

/**
 * Open the given Android package.
 * @param packageName The package id of the application to open, e.g. `com.google.android.apps.fitness`.
 * @returns `true` if the application was opened successfully, otherwise throws.
 */
export function open(packageName: string): boolean {
    if (!OpenAndroidApplication.open) {
        throw new UnavailabilityError('open-android-application', 'open');
    }

    return OpenAndroidApplication.open(packageName);
}
