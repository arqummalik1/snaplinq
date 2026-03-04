import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // In production, send to Sentry here
    }

    public resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return <ErrorScreen error={this.state.error} resetError={this.resetError} />;
        }

        return this.props.children;
    }
}
