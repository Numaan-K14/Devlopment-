import { useMemo } from "react";
export const useGetDataRef = (...args: Array<string | undefined>): string => {
  return useMemo(
    () =>
      args.reduce((prev, curr) =>
        curr ? `${prev ? prev + "." : ""}${curr}` : prev
      ) as string,
    [args]
  );
};
