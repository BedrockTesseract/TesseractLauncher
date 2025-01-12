import { Logger } from "@renderer/utils/Logger";
import { Component, ReactNode, useEffect, useState } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        Logger.error(error, errorInfo);
    }

    render() {
        return this.props.children;
    }
}