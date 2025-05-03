"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useProjects } from "../context/ProjectContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  TableIcon,
  UserCircleIcon,
  DocsIcon,
  BoltIcon,
  FolderIcon,
  TaskIcon,
  PaperPlaneIcon,
  BoxCubeIcon,
  ListIcon,
  EyeIcon,
  ChatIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; icon?: React.ReactNode; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { selectedProjectId } = useProjects();

  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Management",
      subItems: [
        { name: "Users", path: "/users", icon: <UserCircleIcon /> },
        { icon: <FolderIcon />, name: "Projects", path: "/projects" },
        { icon: <BoltIcon />, name: "AI Models", path: "/ai-models" }
      ],
    },
    {
      icon: <GridIcon />,
      name: "Current Project",
      subItems: selectedProjectId ? [
        { name: "Environments", path: "/environments", icon: <TableIcon /> },
        { name: "Regions", path: "/regions", icon: <ListIcon /> },
        { name: "Cultural Data", path: "/cultural-data", icon: <EyeIcon /> },
        { name: "Tags", path: "/tags", icon: <ChatIcon /> },
        { name: "Tactics", path: "/tactics", icon: <PaperPlaneIcon /> }
      ] : [],
    },
    {
      icon: <GridIcon />,
      name: "Prompt Management",
      subItems: selectedProjectId ? [
        { name: "Prompts", path: `/projects/${selectedProjectId}/prompts`, icon: <TaskIcon /> },
      ] : [],
    },
    {
      icon: <BoltIcon />,
      name: "Serve (Test)",
      path: "/serveprompt",
    },
    {
      icon: <UserCircleIcon />,
      name: "User Profile",
      path: "/profile",
    }
  ].filter(item => !(item.subItems && item.subItems.length === 0 && (item.name === "Current Project" || item.name === "Prompt Management")));

  const renderMenuItems = (itemsToRender: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {itemsToRender.map((nav, index) => (
        <li key={`${nav.name}-${index}`}>
          {nav.subItems && nav.subItems.length > 0 ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group  ${openSubmenu === index ? "menu-item-active" : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`${openSubmenu === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu === index ? "rotate-180 text-brand-500" : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
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
          {nav.subItems && nav.subItems.length > 0 && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[index] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu === index ? `${subMenuHeight[index]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item flex items-center gap-2 ${isActive(subItem.path)
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
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
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
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => {
    if (!path) return false;
    if (path === pathname) {
      return true;
    }
    if (path === '/') {
      return false;
    }
    return pathname.startsWith(path + '/') || pathname === path;
  }, [pathname]);

  // useEffect(() => {
  //   // COMMENT OUT: Auto-open submenu based on initial path
  //   let submenuMatched = false;
  //   let activeSubmenuIndex: number | null = null;
  //
  //   navItems.forEach((nav, index) => {
  //     if (nav.subItems) {
  //       if (nav.subItems.some(subItem => isActive(subItem.path))) {
  //         activeSubmenuIndex = index;
  //         submenuMatched = true;
  //       }
  //     }
  //     else if (nav.path && isActive(nav.path)) {
  //       // Handle active main items if needed
  //     }
  //   });
  //
  //   setOpenSubmenu(activeSubmenuIndex);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname, navItems, isActive]);

  // useEffect para cerrar explícitamente el submenú si se deselecciona el proyecto
  useEffect(() => {
    if (!selectedProjectId) {
      setOpenSubmenu(null);
    }
  }, [selectedProjectId]);

  // useEffect para calcular altura del submenú (se mantiene)
  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      const currentSubMenu = subMenuRefs.current[openSubmenu];
      if (currentSubMenu) {
        setTimeout(() => {
          setSubMenuHeight((prev) => ({
            ...prev,
            [openSubmenu]: currentSubMenu.scrollHeight,
          }));
        }, 0);
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>JAPM</h1>
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
