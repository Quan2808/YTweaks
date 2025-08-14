import React from "react";
import ToggleButton from "../components/ToggleButton";

export default function Popup() {
  return (
    <div className="p-4 w-64">
      <h1 className="text-lg font-bold mb-3">YTweaks</h1>
      <ToggleButton label="Ẩn Shorts" featureKey="hideShorts" />
      <ToggleButton label="Tự bỏ qua quảng cáo" featureKey="autoSkipAds" />
    </div>
  );
}
