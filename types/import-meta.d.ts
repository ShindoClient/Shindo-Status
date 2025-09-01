// Extend the ImportMeta interface to include the handlers property
declare global {
  interface ImportMeta {
    handlers?: {
      options?: (event: any) => any;
    };
  }
}

// This file doesn't need to export anything since we're extending a global interface
export {};
