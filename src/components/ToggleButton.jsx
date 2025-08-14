import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function ToggleButton({ label, featureKey }) {
  const [isEnabled, setIsEnabled] = useLocalStorage(featureKey, false);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          isEnabled ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
        role="switch"
        aria-checked={isEnabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            isEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}