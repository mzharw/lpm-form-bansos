export interface NotificationOptions {
    title: string;
    desc: string;
    context?: 'primary' | 'success' | 'error' | 'warning' | 'info';
    icon?: string;
    timeout?: number;
    createdAt?: number;
    visible?: boolean;
}