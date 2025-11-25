'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Ignorar errores de React DevTools
    if (error.message?.includes('Invalid argument not valid semver')) {
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Ignorar errores de React DevTools
    if (error.message?.includes('Invalid argument not valid semver')) {
      return;
    }
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="w-screen h-screen bg-black flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-2xl mb-4">⚠️ Error</h1>
            <p className="text-gray-400">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

