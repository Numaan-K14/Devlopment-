import { useEffect, useState } from "react";

export default function useBlockRefresh() {
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Detect F5 / Ctrl+R refresh attempt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        setShowPopup(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const confirmExit = async () => {
    try {
      setIsProcessing(true);
      window.location.reload();
    } catch (error) {
      console.error("API failed → not refreshing", error);
    } finally {
      setIsProcessing(false);
      setShowPopup(false);
    }
  };

  const cancelExit = () => {
    setShowPopup(false);
  };

  return { showPopup, confirmExit, cancelExit, isProcessing };
}
