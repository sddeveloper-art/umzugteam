import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Keep console error for debugging in production/preview builds
    console.error("Unhandled UI error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-xl border border-border bg-card p-6">
            <h1 className="text-xl font-semibold">Etwas ist schiefgelaufen</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ein Fehler hat die Seite am Rendern gehindert. Bitte laden Sie die Seite neu.
            </p>
            <pre className="mt-4 text-xs overflow-auto rounded-lg bg-muted p-4">
              {this.state.error.message}
            </pre>
            <a
              className="mt-4 inline-flex text-sm text-primary underline hover:text-primary/90"
              href="/"
            >
              Neu laden
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
