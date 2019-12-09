import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Text, View} from 'react-native';

export interface ToastTheme {
  default: {
    background: string;
    foreground: string;
  };
  error: {
    background: string;
    foreground: string;
  };
}

type PartialToastTheme = {[K in keyof ToastTheme]?: Partial<ToastTheme[K]>};

export interface ToastOptions {
  error?: boolean;
  message: ReactNode;
  timeout?: number;
  theme?: PartialToastTheme;
}

interface ToastContextType {
  showToast(options: ToastOptions | string): void;
  theme?: PartialToastTheme;
}

const defaultContext: ToastContextType = {
  showToast() {},
};

const ToastContext = createContext(defaultContext);

interface ToastMessageProps extends ToastOptions {
  clearToast(): void;
}

interface ToastProviderProps {
  theme?: PartialToastTheme;
  component?: ComponentType<ToastMessageProps>;
}

export function ToastProvider({children, component, theme}: PropsWithChildren<ToastProviderProps>) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);
  const toastId = useRef(1);
  const clearToast = useCallback(() => {
    setToasts((current) => current.slice(1));
  }, []);
  const showToast = useCallback((options: ToastOptions | string) => {
    setToasts((current) =>
      current.concat(
        typeof options === 'string' ? {message: options} : options,
      ),
    );
  }, []);

  const context = useRef<ToastContextType>({showToast, theme});

  const [toast = undefined] = toasts;

  const Component = component || ToastMessage;

  return (
    <ToastContext.Provider value={context.current}>
      {children}
      {toast && (
        <Component key={toastId.current++} {...toast} clearToast={clearToast} />
      )}
    </ToastContext.Provider>
  );
}

const defaultTheme: ToastTheme = {
  default: {
    background: 'dimgray',
    foreground: 'whitesmoke',
  },
  error: {
    background: 'lightcoral',
    foreground: 'whitesmoke',
  },
};

function ToastMessage({
  error,
  clearToast,
  message,
  timeout = 1000,
  theme: toastTheme = {},
}: ToastMessageProps) {
  const {theme: globalTheme = {}} = useContext(ToastContext);
  useEffect(() => {
    setTimeout(clearToast, timeout);
  }, [clearToast, timeout]);

  const theme: ToastTheme = {
    default: {
      ...defaultTheme.default,
      ...globalTheme.default,
      ...toastTheme.default,
    },
    error: {
      ...defaultTheme.error,
      ...globalTheme.error,
      ...toastTheme.error,
    },
  };

  const styles = themeStyles();

  return (
    <View style={{position: 'absolute', bottom: 20, left: 0, right: 0}}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            padding: 10,
            backgroundColor: styles.background,
            color: styles.foreground,
            borderRadius: 5,
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  );

  function themeStyles() {
    if (error) {
      return theme.error;
    }

    return theme.default;
  }
}

export function useToast() {
  return useContext(ToastContext);
}
