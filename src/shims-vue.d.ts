import {NotificationOptions} from '@/types/NotificationOptions';

declare module '@vue/runtime-core' {

    export default interface ComponentCustomProperties {
        notify: (options: NotificationOptions) => void;
    }
}