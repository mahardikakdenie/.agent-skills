import React, { useState } from "react";
import AppURL from "@/constants/app-url.const";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "react-feather";

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
    <div
      className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? "md:w-12" : "md:w-56"
      }`}
    >
      <div
        className="sticky flex flex-col bg-white border border-slate-200 rounded-md shadow-sm"
        style={{
          top: "calc(var(--fs-navbar-height, 64px) + 1rem)",
          maxHeight: "calc(100vh - var(--fs-navbar-height, 64px) - 2rem)",
        }}
      >
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          {!isCollapsed && (
            <p className="text-sm font-semibold text-gray-700">{title}</p>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        {!isCollapsed && (
          <nav className="flex flex-1 flex-col overflow-y-auto">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => router.push(item.url)}
                className={`text-left px-4 py-3 text-sm transition-colors border-b border-slate-200 last:border-b-0 ${
                  activeUrl === item.url
                    ? "bg-[#E8F4FB] text-primary font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default ExtendedSidemenu;
