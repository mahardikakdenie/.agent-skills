import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExtendedSidemenuShell, {
  type ExtendedSidemenuShellSubmenuItem,
} from "./extended-sidemenu-shell";

export interface SubmenuItem {
  url: string;
  label: string;
}
interface ExtendedSideMenuProps {
  title?: string;
  items: SubmenuItem[];
  activeUrl: string;
}

const ExtendedSidemenu: React.FC<ExtendedSideMenuProps> = ({
  title,
  items,
  activeUrl,
}) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ExtendedSidemenuShell
      title={title}
      items={items as ExtendedSidemenuShellSubmenuItem[]}
      activeUrl={activeUrl}
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      onItemClick={(url) => router.push(url)}
    />
  );
};

export default ExtendedSidemenu;
