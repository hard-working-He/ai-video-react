import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary-container" style={{
          padding: '20px',
          margin: '20px',
          borderRadius: '8px',
          backgroundColor: '#fff8f8',
          border: '1px solid #ffcdd2',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ color: '#d32f2f' }}>Something went wrong</h2>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ fontWeight: 'bold' }}>Error: {this.state.error && this.state.error.toString()}</p>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', color: '#555' }}>Show error details</summary>
              <p style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </p>
            </details>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 