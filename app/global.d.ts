// Global type declarations

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        send_to?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};