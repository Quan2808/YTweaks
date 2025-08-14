import React, { useState } from "react";
import ToggleButton from "../components/ToggleButton";

export default function Popup() {
  const [isDark, setIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="w-80 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.14 3.14A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10a9.94 9.94 0 0 0-2.86-6.86zm-7.86 13.72V7.14l6.43 4.86-6.43 4.86z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">YTweaks</h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.71-.71M6.34 6.34l-.71-.71M17.66 6.34l.71-.71M5.64 17.66l.71.71M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
      <div className="space-y-3">
        <ToggleButton label="Ẩn Shorts" featureKey="hideShorts" />
        <ToggleButton label="Tự động bỏ qua quảng cáo" featureKey="autoSkipAds" />
        <ToggleButton label="Tắt gợi ý video" featureKey="disableSuggestions" />
        <ToggleButton label="Chế độ tối tự động" featureKey="autoDarkMode" />
        <ToggleButton label="Enhance PiP Button" featureKey="enhancePipButton" />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          Reset Cài Đặt
        </button>
      </div>
    </div>
  );
}