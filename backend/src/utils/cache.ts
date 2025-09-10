// src/utils/cache.ts
type Entry<T> = { value: T; expiresAt: number };

export class MemoryCache {
  private store = new Map<string, Entry<any>>();

  constructor(private ttlMs: number) {}

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
