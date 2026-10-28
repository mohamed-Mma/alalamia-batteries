import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0c',
          color: '#fff',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'center',
          padding: 24,
          direction: 'rtl'
        }}>
          <div>
            <h1 style={{ color: '#e11d48', marginBottom: 12 }}>حدث خطأ غير متوقع</h1>
            <p style={{ color: '#a1a1aa', marginBottom: 20 }}>
              نعتذر، حدثت مشكلة في تحميل الصفحة. حاول تحديث الصفحة أو العودة لاحقاً.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#e11d48',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600
              }}
            >
              إعادة تحميل الصفحة
            </button>
            {this.state.error && (
              <pre style={{
                marginTop: 24,
                background: '#18181b',
                padding: 16,
                borderRadius: 8,
                fontSize: 12,
                textAlign: 'left',
                maxWidth: 500,
                overflow: 'auto',
                color: '#f87171'
              }}>
                {String(this.state.error.message || this.state.error)}
              </pre>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
