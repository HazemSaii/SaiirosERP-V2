function getCommonKeys<T extends object>(obj1: T, obj2: T): (keyof T)[] {
  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];
  return keys1.filter((key) => keys2.includes(key));
}

function normalizeData<T extends object>(data: T, keysToKeep: (keyof T)[]): Partial<T> {
  return keysToKeep.reduce((acc, key) => {
    if (key in data) {
      acc[key] = data[key];
    }
    return acc;
  }, {} as Partial<any>);
}

export default function hasFormChanges<T extends object>(
  originalData: T[],
  currentData: T[]
): boolean {
  if (originalData.length !== currentData.length) {
    return true; // Arrays have different lengths, so they are different
  }

  for (let i = 0; i < originalData.length; i += 1) {
    const original = originalData[i];
    const current = currentData[i];
    console.log("original",original);
    console.log("current",current);

    const commonKeys = getCommonKeys(original, current);
    const normalizedOriginal = normalizeData(original, commonKeys);
    const normalizedCurrent = normalizeData(current, commonKeys);

    if (JSON.stringify(normalizedOriginal) !== JSON.stringify(normalizedCurrent)) {
      return true; // Found a difference
    }
  }

  return false; // No differences found
}
