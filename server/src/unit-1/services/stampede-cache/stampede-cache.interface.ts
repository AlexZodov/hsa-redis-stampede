export interface StampedeCacheInterface {
  getOrSet(key: string): Promise<any>;
  getMetrics(): Promise<{ hits: number; misses: number }>;
}
