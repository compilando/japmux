"use client";
import React from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  // Add other icons if they are directly used and not passed as nav.icon
} from "../icons/index"; // Adjust path as necessary
import type { NavItem, SubItem } from "./AppSidebar"; // Assuming NavItem is exported or defined here

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

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
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
  // Special handling for /current-project if needed, or rely on pathname === nav.path
  // const isCurrentProjectActive = nav.name === "Current Project" && pathname === "/current-project";
  // const finalIsActive = isActive || isCurrentProjectActive;

  return (
    <li key={`${nav.name}-${index}`}>
      {nav.subItems && nav.subItems.length > 0 ? (
        <>
          <div
            className={`menu-item-container group flex items-center w-full ${isActive ? "menu-item-active" : "menu-item-inactive"
              } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
          >
            <span
              className={`${isActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
                } flex-shrink-0`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                {nav.path ? (
                  <Link href={nav.path} className="menu-item-text flex-grow truncate cursor-pointer">
                    {nav.name}
                  </Link>
                ) : (
                  <span className="menu-item-text flex-grow truncate">{nav.name}</span>
                )}
                <button
                  onClick={() => handleSubmenuToggle(index)}
                  className="ml-auto flex-shrink-0 p-1"
                  aria-label={`Toggle ${nav.name} submenu`}
                >
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-200 ${openSubmenu === index ? "rotate-180 text-brand-500" : ""
                      }`}
                  />
                </button>
              </>
            )}
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                if (subMenuRefs.current) { // Ensure subMenuRefs.current is defined
                  subMenuRefs.current[index] = el;
                }
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu === index && subMenuHeight[index] ? `${subMenuHeight[index]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem: SubItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item flex items-center gap-2 ${pathname === subItem.path
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.icon && (
                        <span className="inline-block w-5 h-5">
                          {subItem.icon}
                        </span>
                      )}
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${pathname === subItem.path
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${pathname === subItem.path
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
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
        </>
      ) : (
        nav.path && (
          <Link
            href={nav.path}
            className={`menu-item group ${pathname === nav.path ? "menu-item-active" : "menu-item-inactive"
              }`}
          >
            <span
              className={`${pathname === nav.path
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className={`menu-item-text`}>{nav.name}</span>
            )}
          </Link>
        )
      )}
    </li>
  );
};

export default SidebarNavItem; 