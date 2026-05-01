import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6 text-center">
          <h1 className="font-[family-name:'Cormorant_Garamond',serif] text-4xl italic text-black/80 mb-4">Something went wrong.</h1>
          <p className="font-[family-name:'DM_Sans',sans-serif] text-sm text-black/40 mb-8 max-w-md">
            An unexpected error occurred. Please try refreshing the page or return to the home page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all"
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
