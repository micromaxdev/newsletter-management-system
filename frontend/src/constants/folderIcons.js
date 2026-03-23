import {
  Folder,
  Inbox,
  Truck,
  Users,
  Briefcase,
  Archive,
  Megaphone,
  Mail,
  Tag,
  FileText,
  Bell,
  Star,
  ShoppingBag,
  Receipt,
  Send,
} from "lucide-react";

export const FOLDER_ICON_OPTIONS = [
  { value: "folder", label: "Folder", icon: Folder },
  { value: "inbox", label: "Inbox", icon: Inbox },
  { value: "truck", label: "Truck", icon: Truck },
  { value: "users", label: "Users", icon: Users },
  { value: "briefcase", label: "Briefcase", icon: Briefcase },
  { value: "archive", label: "Archive", icon: Archive },
  { value: "megaphone", label: "Megaphone", icon: Megaphone },
  { value: "mail", label: "Mail", icon: Mail },
  { value: "tag", label: "Tag", icon: Tag },
  { value: "file-text", label: "File Text", icon: FileText },
  { value: "bell", label: "Bell", icon: Bell },
  { value: "star", label: "Star", icon: Star },
  { value: "shopping-bag", label: "Shopping Bag", icon: ShoppingBag },
  { value: "receipt", label: "Receipt", icon: Receipt },
  { value: "send", label: "Send", icon: Send },
];

export const FOLDER_ICON_MAP = Object.fromEntries(
  FOLDER_ICON_OPTIONS.map((item) => [item.value, item.icon])
);