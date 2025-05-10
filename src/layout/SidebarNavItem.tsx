"use client";
import React, { memo } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  // Add other icons if they are directly used and not passed as nav.icon
} from "../icons/index"; // Adjust path as necessary
import type { NavItem, SubItem } from "./AppSidebar"; // Assuming NavItem is exported or defined here
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/Tooltip";

interface SidebarNavItemProps {
  nav: NavItem;
  index: number;
  openSubmenu: number | null;
  pathname: string;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  handleSubmenuToggle: (index: number) => void;
  subMenuHeight: Record<number, number>;
  subMenuRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  // currentProjectIndex might not be needed if logic is self-contained with nav.path
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = memo(({
  nav,
  index,
  openSubmenu,
  pathname,
  isExpanded,
  isHovered,
  isMobileOpen,
  handleSubmenuToggle,
  subMenuHeight,
  subMenuRefs,
}) => {
  const isActive = openSubmenu === index || pathname === nav.path;
  const showTooltip = !isExpanded && !isHovered && !isMobileOpen;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSubmenuToggle(index);
    }
  };

  return (
    <div className="group" role="none">
      <Tooltip
        content={nav.name}
        position="right"
        className={cn(
          "transition-opacity duration-200",
          showTooltip ? "opacity-100" : "opacity-0"
        )}
      >
        <Link
          href={nav.path || "#"}
          onClick={() => handleSubmenuToggle(index)}
          onKeyPress={handleKeyPress}
          className={cn(
            "menu-item transition-all duration-200",
            isActive ? "menu-item-active" : "menu-item-inactive",
            nav.pro && "menu-item-pro",
            nav.pro && !isActive && "menu-item-pro-inactive",
            "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          )}
          role="menuitem"
          aria-expanded={nav.subItems ? openSubmenu === index : undefined}
          aria-haspopup={nav.subItems ? "true" : undefined}
          tabIndex={0}
        >
          <div className={cn(
            "menu-item-icon transition-colors duration-200",
            isActive ? "menu-item-icon-active" : "menu-item-icon-inactive",
            nav.pro && "menu-item-icon-pro"
          )}>
            {nav.icon}
          </div>
          <span className="flex-1">{nav.name}</span>
          {nav.subItems && nav.subItems.length > 0 && (
            <div className={cn(
              "menu-item-arrow transition-transform duration-200",
              openSubmenu === index ? "rotate-180" : ""
            )}>
              <ChevronDownIcon />
            </div>
          )}
        </Link>
      </Tooltip>
      {nav.subItems && nav.subItems.length > 0 && openSubmenu === index && (
        <div
          ref={(el) => {
            if (subMenuRefs.current) {
              subMenuRefs.current[index] = el;
            }
          }}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            height: openSubmenu === index && subMenuHeight[index] ? `${subMenuHeight[index]}px` : "0px",
          }}
          role="menu"
        >
          <ul className="mt-2 space-y-1 ml-9">
            {nav.subItems.map((subItem: SubItem) => (
              <li key={subItem.name} role="none">
                <Link
                  href={subItem.path}
                  className={cn(
                    "menu-dropdown-item transition-all duration-200",
                    pathname === subItem.path ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive",
                    "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  )}
                  role="menuitem"
                  tabIndex={0}
                >
                  <div className={cn(
                    "menu-item-icon transition-colors duration-200",
                    pathname === subItem.path ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  )}>
                    {subItem.icon}
                  </div>
                  <span className="flex-1">{subItem.name}</span>
                  <span className="flex items-center gap-1 ml-auto">
                    {subItem.new && (
                      <span
                        className={cn(
                          "menu-dropdown-badge transition-colors duration-200",
                          pathname === subItem.path ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                        )}
                        role="status"
                        aria-label="New feature"
                      >
                        new
                      </span>
                    )}
                    {subItem.pro && (
                      <span
                        className={cn(
                          "menu-dropdown-badge transition-colors duration-200",
                          pathname === subItem.path ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                        )}
                        role="status"
                        aria-label="Pro feature"
                      >
                        pro
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

SidebarNavItem.displayName = 'SidebarNavItem';

export default SidebarNavItem; 