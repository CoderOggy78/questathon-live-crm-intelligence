"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel p-8 bg-white border-4 border-riskRed shadow-retroLg max-w-3xl mx-auto my-12 font-mono">
          <div className="flex items-center gap-3 border-b-2 border-ink pb-4 text-riskRed">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-extrabold uppercase">
                Component Rendering Exception Caught
              </h2>
              <p className="text-xs text-zinc-600">
                The CRM client caught a runtime exception. Data has been preserved.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 text-xs space-y-2">
            <div className="font-bold text-red-950">
              Error: {this.state.error?.message || "Unknown error"}
            </div>
            {this.state.error?.stack && (
              <pre className="text-[10px] text-zinc-700 overflow-x-auto p-2 bg-white border border-zinc-300">
                {this.state.error.stack}
              </pre>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Questathon Safe Recovery Mode
            </span>
            <button
              onClick={this.handleReset}
              className="btn-pixel text-xs py-2 px-4 flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RELOAD CRM WORKSPACE</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
