import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function ToggleButton({ label, featureKey }) {
  const [enabled, setEnabled] = useLocalStorage(featureKey, false);

  const handleToggle = () => {
    setEnabled(!enabled);
    chrome.storage.sync.set({ [featureKey]: !enabled });
  };

  useEffect(() => {
    chrome.storage.sync.get(featureKey, (result) => {
      if (result[featureKey] !== undefined) {
        setEnabled(result[featureKey]);
      }
    });
  }, []);

  return (
    <button
      onClick={handleToggle}
      className={`w-full py-2 px-3 rounded-lg mb-2 text-left ${
        enabled ? "bg-green-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      {label}
    </button>
  );
}
