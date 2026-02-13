export function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) return data;

  // Date to string
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Array to map recursively
  if (Array.isArray(data)) {
    return data.map(item => serializePrisma(item)) as unknown as T;
  }

  // Object to map recursively
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      result[key] = serializePrisma((data as any)[key]);
    }
    return result;
  }

  // Primitive → unchanged
  return data;
}

//still working on this file !