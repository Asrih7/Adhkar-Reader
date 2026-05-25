import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback onReset={this.handleReset} error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorBoundaryFallback({
  onReset,
  error,
}: {
  onReset: () => void;
  error?: Error;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ background: "hsl(var(--background))" }}>
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16" style={{ color: "var(--text-gold)" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          {t("error") || "Error"}
        </h1>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          style={{
            background: "var(--gold-muted)",
            border: "1px solid var(--gold-border)",
            color: "var(--text-gold)",
          }}
        >
          <Home className="w-4 h-4" />
          {t("home") || "Go Home"}
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
