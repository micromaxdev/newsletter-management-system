import React, { useMemo } from "react";
import {
  Folder,
  List,
  Inbox,
  Truck,
  Users,
  Briefcase,
  Archive,
  Newspaper,
  Mail,
  Megaphone,
  Tag,
  ShoppingCart,
  Settings,
  FileText,
  Bell,
  Star,
  Bookmark,
  FolderOpen,
  Package,
  Building2,
  Receipt,
  Send,
  MessageSquare,
} from "lucide-react";

const ICON_MAP = {
  inbox: Inbox,
  truck: Truck,
  users: Users,
  briefcase: Briefcase,
  archive: Archive,
  folder: Folder,
  folderopen: FolderOpen,
  "folder-open": FolderOpen,

  newspaper: Newspaper,
  mail: Mail,
  megaphone: Megaphone,
  tag: Tag,
  "shopping-cart": ShoppingCart,
  shoppingcart: ShoppingCart,
  settings: Settings,
  file: FileText,
  filetext: FileText,
  "file-text": FileText,
  bell: Bell,
  star: Star,
  bookmark: Bookmark,
  package: Package,
  building: Building2,
  building2: Building2,
  receipt: Receipt,
  send: Send,
  message: MessageSquare,
  "message-square": MessageSquare,
};

const FIRST_FOLDER = "uncategorised";
const LAST_FOLDER = "archive";
const middleSystemOrder = ["suppliers", "competitors", "customers"];

const sortFolders = (folders = []) => {
  return [...folders].sort((a, b) => {
    const aId = a.folderId?.toLowerCase() || "";
    const bId = b.folderId?.toLowerCase() || "";

    if (aId === FIRST_FOLDER) return -1;
    if (bId === FIRST_FOLDER) return 1;

    if (aId === LAST_FOLDER) return 1;
    if (bId === LAST_FOLDER) return -1;

    const aSystemIndex = middleSystemOrder.indexOf(aId);
    const bSystemIndex = middleSystemOrder.indexOf(bId);

    const aIsMiddleSystem = aSystemIndex !== -1;
    const bIsMiddleSystem = bSystemIndex !== -1;

    if (aIsMiddleSystem && bIsMiddleSystem) {
      return aSystemIndex - bSystemIndex;
    }

    if (aIsMiddleSystem) return -1;
    if (bIsMiddleSystem) return 1;

    return (a.name || "").localeCompare(b.name || "");
  });
};

const normalizeIconKey = (iconName = "") => {
  return String(iconName).toLowerCase().trim();
};

export default function FolderTree({
  folders = [],
  selectedFolder,
  onFolderSelect,
  unreadCounts = {},
}) {
  const totalUnread = unreadCounts.all || 0;

  const topLevelFolders = useMemo(() => {
    return folders.filter((folder) => !folder.parentFolderId);
  }, [folders]);

  const sortedFolders = useMemo(() => {
    return sortFolders(topLevelFolders);
  }, [topLevelFolders]);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        padding: "1rem",
      }}
    >
      <h3
        style={{
          margin: "0 0 1rem 0",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#1e293b",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Folder size={20} style={{ marginRight: "8px" }} />
        Email Folders
      </h3>

      <div
        onClick={() => onFolderSelect("all")}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          backgroundColor: selectedFolder === "all" ? "#e0e7ff" : "transparent",
          borderRadius: "6px",
          margin: "4px 0",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "8px",
        }}
      >
        <List size={16} color="#4f46e5" style={{ marginRight: "8px" }} />

        <span
          style={{
            flex: 1,
            fontSize: "14px",
            fontWeight: selectedFolder === "all" ? "600" : "500",
            color: selectedFolder === "all" ? "#4f46e5" : "#374151",
          }}
        >
          All Emails
        </span>

        {totalUnread > 0 && (
          <span
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              marginLeft: "8px",
            }}
          >
            {totalUnread}
          </span>
        )}
      </div>

      {sortedFolders.map((folder) => {
        const folderKey = folder.folderId;
        const unreadCount = unreadCounts[folderKey] || 0;
        const iconKey = normalizeIconKey(folder.icon);
        const IconComponent = ICON_MAP[iconKey] || Folder;

        return (
          <div
            key={folderKey}
            onClick={() => onFolderSelect(folderKey)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              cursor: "pointer",
              backgroundColor:
                selectedFolder === folderKey ? "#e0e7ff" : "transparent",
              borderRadius: "6px",
              margin: "4px 0",
            }}
          >
            <IconComponent
              size={16}
              color="#f59e0b"
              style={{ marginRight: "8px", flexShrink: 0 }}
            />

            <span
              style={{
                flex: 1,
                fontSize: "14px",
                fontWeight: selectedFolder === folderKey ? "600" : "400",
                color: selectedFolder === folderKey ? "#4f46e5" : "#374151",
              }}
            >
              {folder.name}
            </span>

            {unreadCount > 0 && (
              <span
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginLeft: "8px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}