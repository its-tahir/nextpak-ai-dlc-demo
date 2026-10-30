import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { failed: boolean };

// Shows a message instead of a blank page when a component crashes.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p role="alert">
          Something went wrong. <button onClick={() => location.reload()}>Reload</button>
        </p>
      );
    }
    return this.props.children;
  }
}
