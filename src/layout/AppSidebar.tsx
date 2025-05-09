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
import SidebarNavItem from "./SidebarNavItem";

// Define SubItem type
export type SubItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
  pro?: boolean;
  new?: boolean;
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[]; // Use SubItem type here
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
      path: "/management",
      subItems: [
        { name: "Users", path: "/users", icon: <UserCircleIcon /> },
        { icon: <FolderIcon />, name: "Projects", path: "/projects" }
      ],
    },
    {
      icon: <GridIcon />,
      name: "Current Project",
      path: "/current-project",
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
      path: selectedProjectId ? `/projects/${selectedProjectId}/prompts` : undefined,
      subItems: selectedProjectId ? [
        { name: "Prompts", path: `/projects/${selectedProjectId}/prompts`, icon: <TaskIcon /> },
        { name: "Assets", path: `/projects/${selectedProjectId}/prompt-assets`, icon: <BoxCubeIcon /> },
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

  // Calculate the correct submenu index based on the current path
  const activeSubmenuIndexBasedOnPath = React.useMemo(() => {
    // 1. Check if the current pathname matches the path of a parent item that has subItems
    let parentIndex = navItems.findIndex(nav => nav.path === pathname && nav.subItems && nav.subItems.length > 0);
    if (parentIndex !== -1) {
      return parentIndex;
    }

    // 2. If not, check if the current pathname matches any subItem's path
    parentIndex = navItems.findIndex(nav =>
      nav.subItems && nav.subItems.some(subItem => subItem.path === pathname)
    );
    return parentIndex; // -1 if no match
  }, [pathname, navItems]);

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
        <SidebarNavItem
          key={`${nav.name}-${index}`}
          nav={nav}
          index={index}
          openSubmenu={openSubmenu}
          pathname={pathname}
          isExpanded={isExpanded}
          isHovered={isHovered}
          isMobileOpen={isMobileOpen}
          handleSubmenuToggle={handleSubmenuToggle}
          subMenuHeight={subMenuHeight}
          subMenuRefs={subMenuRefs}
        />
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
              <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>japm.app</h1>
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
