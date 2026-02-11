export function getValueByKey(obj: any, key: string) {
  if (!obj || !key) return undefined;

  return key.split(".").reduce((acc, part) => {
    if (acc && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
}
