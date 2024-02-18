interface Memory {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  }
  
  interface Window {
    performance: Performance & {
      memory?: Memory;
    };
  }