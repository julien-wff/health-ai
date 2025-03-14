import { NativeModule, requireNativeModule } from 'expo';

declare class OpenAndroidApplicationModule extends NativeModule {
    open(packageName: string): boolean;
}

export default requireNativeModule<OpenAndroidApplicationModule>('OpenAndroidApplication');
