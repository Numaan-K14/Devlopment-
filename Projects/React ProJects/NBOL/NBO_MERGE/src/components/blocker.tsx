import { useContext, useEffect, useState } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

type NavigationBlockerResult = {
  tabSwitchCount: number;
  routeChangeCount: number;
};

/**
 * useNavigationBlocker - Prevents route change, page reload, and tab switching
 * Tracks counts of tab switches and route change attempts
 *
 * @param shouldBlock boolean - whether to enable blocking
 */
export function useNavigationBlocker(
  shouldBlock: boolean,
): NavigationBlockerResult {
  const { navigator } = useContext(UNSAFE_NavigationContext);

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [routeChangeCount, setRouteChangeCount] = useState(0);

  useEffect(() => {
    if (!shouldBlock) return;

    // ---- 1. Block browser refresh / closing ----
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // ---- 2. Block internal React Router navigation ----
    const push = navigator.push;
    navigator.push = (...args: any[]) => {
      setRouteChangeCount((prev) => prev + 1);

      if (
        window.confirm("You have unsaved changes. Do you really want to leave?")
      ) {
        push(...(args as [any]));
      }
    };

    // ---- 3. Warn on tab change ----
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        alert("⚠️ Don't switch tabs while filling out this form!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.push = push; // restore original
    };
  }, [shouldBlock, navigator]);

  return { tabSwitchCount, routeChangeCount };
}
