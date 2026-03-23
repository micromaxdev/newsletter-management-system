import React from "react";
import { FOLDER_ICON_OPTIONS } from "../constants/folderIcons";

export default function IconSelect({ value, onChange, style = {} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "0.75rem 0.875rem",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        backgroundColor: "#ffffff",
        outline: "none",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {FOLDER_ICON_OPTIONS.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}