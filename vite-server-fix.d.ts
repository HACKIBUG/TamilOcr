import 'vite';

// This declaration file extends the Vite types to fix the allowedHosts type issue
declare module 'vite' {
  interface ServerOptions {
    allowedHosts?: boolean | string[] | 'all';
  }
}