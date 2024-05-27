export type ToastData = {
    type: 'success' | 'failure';
    message: string;
    messageBody?: string;
    intent?: string;
    autoClose?: boolean;
};

export type ToastState = ToastData & { id: string; }

export type ToastsListContextType = {
    showToast: (data: ToastData) => void;
    clearFailureMessages: (intent: string) => void;
};

export type ToastRef = { hide: VoidFunction; resetAnimation: VoidFunction };

export type ToastListRef = Array<ToastData & ToastRef>;
