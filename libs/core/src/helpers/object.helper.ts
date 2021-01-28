export function objectsToArray(importObject: any) {
  const objectArray: any[] = [];
  for (const attribute in importObject) {
    if (typeof importObject[attribute] === 'function') {
      objectArray.push(importObject[attribute]);
    }
  }
  return objectArray;
}
