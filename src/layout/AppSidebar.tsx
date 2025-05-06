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

  // Define navItems first
  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Management",
      subItems: [
        { name: "Users", path: "/users", icon: <UserCircleIcon /> },
        { icon: <FolderIcon />, name: "Projects", path: "/projects" }
      ],
    },
    {
      icon: <GridIcon />,
      name: "Current Project",
      subItems: selectedProjectId ? [
        { name: "AI Models", path: "/ai-models", icon: <BoltIcon /> },
        { name: "Environments", path: "/environments", icon: <TableIcon /> },
        { name: "Regions", path: "/regions", icon: <ListIcon /> },
        { name: "Cultural Data", path: "/cultural-data", icon: <EyeIcon /> },
        { name: "Tags", path: "/tags", icon: <ChatIcon /> },
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
      name: "Serve Prompts",
      path: "/serveprompt",
    }
  ].filter(item => !(item.subItems && item.subItems.length === 0 && (item.name === "Current Project" || item.name === "Prompt Management")));

  // Now find the index
  const currentProjectIndex = navItems.findIndex(item => item.name === "Current Project");

  // State for submenu toggle and height calculation
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Calculate the correct submenu index based *only* on the current path
  const activeSubmenuIndexBasedOnPath = React.useMemo(() => {
    // Check specifically for /current-project
    if (pathname === '/current-project' && currentProjectIndex !== -1) {
      return currentProjectIndex;
    }
    // Find the index of the first nav item whose subitem path matches the current pathname
    const index = navItems.findIndex(nav =>
      nav.subItems && nav.subItems.some(subItem => subItem.path === pathname)
    );
    // Return the found index (-1 if not found)
    return index;
  }, [pathname, navItems, currentProjectIndex]);

  // Effect to synchronize the open submenu state with the calculated path index
  useEffect(() => {
    // Set the open submenu state to match the index derived from the path
    // If no match was found (index is -1), set it to null (no submenu open)
    setOpenSubmenu(activeSubmenuIndexBasedOnPath !== -1 ? activeSubmenuIndexBasedOnPath : null);
  }, [activeSubmenuIndexBasedOnPath]); // Depend only on the calculated index

  // Manual toggle handler
  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

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

  const renderMenuItems = (itemsToRender: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {itemsToRender.map((nav, index) => (
        <li key={`${nav.name}-${index}`}>
          {nav.subItems && nav.subItems.length > 0 ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group  ${(openSubmenu === index || (index === currentProjectIndex && pathname === '/current-project')) ? "menu-item-active" : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`${(openSubmenu === index || (index === currentProjectIndex && pathname === '/current-project'))
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
        </li>
      ))}
    </ul>
  );

  // useEffect para cerrar explícitamente el submenú si se deselecciona el proyecto
  useEffect(() => {
    if (!selectedProjectId) {
      setOpenSubmenu(null);
    }
  }, [selectedProjectId]);

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
