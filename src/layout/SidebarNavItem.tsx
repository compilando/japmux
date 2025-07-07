"use client";
import React, { memo } from "react";
import Link from "next/link";
import ChevronDownIcon from "../icons/chevron-down.svg";
import { ChevronDownIcon as HeroChevronDownIcon } from '@heroicons/react/24/outline';
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
  const isActive = React.useMemo(() => {
    if (!nav.path) return false;

    if (!nav.subItems?.length) {
      return pathname === nav.path;
    }

    return nav.subItems.some(subItem =>
      subItem.path && pathname === subItem.path
    );
  }, [nav.path, nav.subItems, pathname]);

  const isSubmenuOpen = openSubmenu === index;
  const showTooltip = !isExpanded && !isHovered && !isMobileOpen;
  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (nav.subItems && nav.subItems.length > 0) {
        handleSubmenuToggle(index);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (nav.subItems && nav.subItems.length > 0) {
      e.preventDefault();
      handleSubmenuToggle(index);
    }
  };

  // Render collapsed state with icon only
  if (isCollapsed) {
    return (
      <div className="group relative" role="none">
        <Tooltip
          content={nav.name}
          position="right"
          className="transition-opacity duration-200"
        >
          <Link
            href={nav.path || "#"}
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            className={cn(
              "relative flex items-center justify-center w-full p-2 mx-1 my-0.5 transition-all duration-300",
              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2",
              "group"
            )}
            role="menuitem"
            aria-expanded={nav.subItems ? openSubmenu === index : undefined}
            aria-haspopup={nav.subItems ? "true" : undefined}
            tabIndex={0}
          >
            {/* Glassmorphism background */}
            <div className={cn(
              "absolute inset-0 rounded-xl transition-all duration-300",
              "bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm",
              "border border-white/30 dark:border-gray-700/40",
              "shadow-lg group-hover:shadow-xl",
              "opacity-0 group-hover:opacity-100",
              isActive && "opacity-100 bg-gradient-to-br from-brand-500/20 to-purple-500/20 dark:from-brand-400/20 dark:to-purple-400/20 border-brand-300/40 dark:border-brand-600/40"
            )} />

            {/* Icon container */}
            <div className={cn(
              "relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
              "group-hover:scale-110",
              isActive
                ? "bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400"
            )}>
              <div className="w-5 h-5 flex items-center justify-center">
                {nav.icon}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-500 to-purple-500 rounded-full shadow-lg" />
            )}

            {/* Badges for collapsed state */}
            {(nav.new || nav.pro) && (
              <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                {nav.new && (
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm" />
                )}
                {nav.pro && (
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full animate-pulse shadow-sm" />
                )}
              </div>
            )}

            {/* Hover glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "bg-gradient-to-br from-brand-200/30 to-purple-200/30 dark:from-brand-800/20 dark:to-purple-800/20 blur-xl"
            )} />
          </Link>
        </Tooltip>
      </div>
    );
  }

  // Render expanded state
  return (
    <div className="group relative" role="none">
      <Link
        href={nav.path || "#"}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        className={cn(
          "relative flex items-center w-full px-3 py-2 mx-1 my-0.5 rounded-xl transition-all duration-300",
          "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2",
          "group/item"
        )}
        role="menuitem"
        aria-expanded={nav.subItems ? openSubmenu === index : undefined}
        aria-haspopup={nav.subItems ? "true" : undefined}
        tabIndex={0}
      >
        {/* Background with glassmorphism */}
        <div className={cn(
          "absolute inset-0 rounded-xl transition-all duration-300",
          "bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm",
          "border border-white/30 dark:border-gray-700/40",
          "shadow-lg group-hover/item:shadow-xl",
          "opacity-0 group-hover/item:opacity-100",
          isActive && "opacity-100 bg-gradient-to-br from-brand-50/80 to-purple-50/80 dark:from-brand-950/40 dark:to-purple-950/40 border-brand-300/40 dark:border-brand-600/40"
        )} />

        {/* Icon */}
        <div className={cn(
          "relative z-10 flex items-center justify-center w-10 h-10 rounded-lg mr-2 transition-all duration-300",
          "group-hover/item:scale-110",
          isActive
            ? "bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg"
            : "bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400 group-hover/item:bg-brand-100/80 dark:group-hover/item:bg-brand-900/80 group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400"
        )}>
          <div className="w-5 h-5 flex items-center justify-center">
            {nav.icon}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-between">
          <span className={cn(
            "font-medium transition-colors duration-300",
            isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white"
          )}>
            {nav.name}
          </span>

          <div className="flex items-center gap-2 ml-3">
            {/* Badges */}
            {nav.new && (
              <span className={cn(
                "px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300",
                "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50",
                "text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-700/50",
                "group-hover/item:shadow-sm"
              )}>
                new
              </span>
            )}
            {nav.pro && (
              <span className={cn(
                "px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300",
                "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50",
                "text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50",
                "group-hover/item:shadow-sm"
              )}>
                pro
              </span>
            )}

            {/* Dropdown arrow */}
            {nav.subItems && nav.subItems.length > 0 && (
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300",
                "bg-gray-100/80 dark:bg-gray-700/80 group-hover/item:bg-brand-100/80 dark:group-hover/item:bg-brand-900/80",
                openSubmenu === index ? "rotate-180" : "",
                "text-gray-500 dark:text-gray-400 group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400"
              )}>
                <HeroChevronDownIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-500 to-purple-500 rounded-l-full shadow-lg" />
        )}

        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br from-brand-200/20 to-purple-200/20 dark:from-brand-800/10 dark:to-purple-800/10 blur-xl"
        )} />
      </Link>

      {/* Submenu */}
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
          <ul className="mt-2 space-y-1 ml-14">
            {nav.subItems.map((subItem: SubItem) => {
              const isSubActive = subItem.path && pathname === subItem.path;
              return (
                <li key={subItem.name} role="none">
                  <Link
                    href={subItem.path}
                    className={cn(
                      "relative flex items-center px-3 py-2 mx-1 my-0.5 rounded-lg transition-all duration-300",
                      "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2",
                      "group/subitem"
                    )}
                    role="menuitem"
                    tabIndex={0}
                  >
                    {/* Background */}
                    <div className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      "bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm",
                      "border border-white/25 dark:border-gray-700/35",
                      "opacity-0 group-hover/subitem:opacity-100",
                      isSubActive && "opacity-100 bg-gradient-to-br from-brand-50/60 to-purple-50/60 dark:from-brand-950/30 dark:to-purple-950/30 border-brand-300/30 dark:border-brand-600/30"
                    )} />

                    {/* Icon */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-8 h-8 rounded-md mr-2 transition-all duration-300",
                      isSubActive
                        ? "bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-md"
                        : "bg-gray-100/60 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 group-hover/subitem:bg-brand-100/60 dark:group-hover/subitem:bg-brand-900/60 group-hover/subitem:text-brand-600 dark:group-hover/subitem:text-brand-400"
                    )}>
                      <div className="flex items-center justify-center">
                        {subItem.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex items-center justify-between">
                      <span className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        isSubActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400 group-hover/subitem:text-gray-900 dark:group-hover/subitem:text-white"
                      )}>
                        {subItem.name}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {subItem.new && (
                          <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300">
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 text-purple-700 dark:text-purple-300">
                            pro
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active indicator */}
                    {isSubActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-brand-500 to-purple-500 rounded-l-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
});

SidebarNavItem.displayName = 'SidebarNavItem';

export default SidebarNavItem; 