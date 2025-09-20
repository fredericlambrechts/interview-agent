declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': {
      'agent-id': string;
      style?: React.CSSProperties;
      class?: string;
      children?: React.ReactNode;
    };
  }
}