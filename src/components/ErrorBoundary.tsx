import { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  reset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center"
        >
          <div className="w-16 h-16 bg-ivory-300 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-marigold-600" aria-hidden="true" />
          </div>
          <h2 className="font-fraunces text-2xl text-ink-800 mb-2">
            The city is quiet right now.
          </h2>
          <p className="font-work-sans text-sm text-ink-400 mb-6 max-w-sm">
            Something unexpected happened. The stories are still here — try refreshing.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-work-sans font-600 hover:bg-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-marigold-500"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
