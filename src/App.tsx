import React, { Component, ReactNode, ErrorInfo } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme/theme';

import { RootNavigator } from './components/layouts/RootNavigator';
import { ErrorState } from './components/shared/ErrorState';
import { Loading } from './components/shared/Loading';
import { Provider } from 'react-redux';
import { store } from './stores';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Global Error Caught:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false });
    }

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaProvider>
                    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                        <ErrorState 
                            title="Aplikasi Bermasalah"
                            message="Maaf, terjadi kesalahan yang tidak terduga pada aplikasi. Silakan coba muat ulang."
                            onRetry={this.handleRetry}
                            fullScreen
                        />
                    </View>
                </SafeAreaProvider>
            );
        }
        return this.props.children;
    }
}

export default function App() {
    return (
        <Provider store={store}>
            <ErrorBoundary>
                <SafeAreaProvider>
                    <NavigationContainer theme={theme} fallback={<Loading fullScreen message="Memuat aplikasi..." />}>
                        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                        <RootNavigator />
                    </NavigationContainer>
                </SafeAreaProvider>
            </ErrorBoundary>
        </Provider>
    );
}
