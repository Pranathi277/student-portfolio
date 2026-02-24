import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2 style={{ color: '#b91c1c' }}>Something went wrong</h2>
          <p style={{ color: '#374151' }}>The application encountered an error while rendering this page.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12, background: '#fff', padding: 12, borderRadius: 8 }}>
            <summary style={{ cursor: 'pointer' }}>Show error details</summary>
            <div style={{ marginTop: 8 }}>
              <strong>Error:</strong>
              <pre style={{ color: '#111827' }}>{String(this.state.error)}</pre>
              {this.state.info && (
                <>
                  <strong>Component stack:</strong>
                  <pre style={{ color: '#111827' }}>{this.state.info.componentStack}</pre>
                </>
              )}
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
