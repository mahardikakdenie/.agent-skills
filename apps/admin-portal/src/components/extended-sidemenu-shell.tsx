import React from 'react';
import { ChevronDown, ChevronRight } from 'react-feather';

import { Box } from '@repo/ui';

export interface ExtendedSidemenuShellSubmenuItem {
  url: string;
  label: string;
}

interface ExtendedSidemenuShellProps {
  title?: string;
  items: ExtendedSidemenuShellSubmenuItem[];
  activeUrl: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onItemClick: (url: string) => void;
}

const ExtendedSidemenuShell: React.FC<ExtendedSidemenuShellProps> = ({
  title,
  items,
  activeUrl,
  isCollapsed,
  onToggleCollapse,
  onItemClick,
}) => {
  return (
    <Box
      className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'md:w-12' : 'md:w-56'
      }`}
    >
      <Box
        className="sticky flex flex-col bg-white border border-slate-200 rounded-md shadow-sm"
        style={{
          top: 'calc(var(--fs-navbar-height, 64px) + 1rem)',
          maxHeight: 'calc(100vh - var(--fs-navbar-height, 64px) - 2rem)',
        }}
      >
        <Box className="p-3 border-b border-slate-200 flex items-center justify-between">
          {!isCollapsed && (
            <Box as="p" className="text-sm font-semibold text-gray-700">
              {title}
            </Box>
          )}
          <Box
            as="button"
            type="button"
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 rounded transition-colors ml-auto"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </Box>
        </Box>
        {!isCollapsed && (
          <Box as="nav" className="flex flex-1 flex-col overflow-y-auto">
            {items.map((item, index) => (
              <Box
                as="button"
                key={index}
                type="button"
                onClick={() => onItemClick(item.url)}
                className={`text-left px-4 py-3 text-sm transition-colors border-b border-slate-200 last:border-b-0 ${
                  activeUrl === item.url
                    ? 'bg-[#E8F4FB] text-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExtendedSidemenuShell;
