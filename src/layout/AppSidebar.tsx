"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useProjects } from "../context/ProjectContext";
import { useTenantAdmin } from "@/hooks/useTenantAdmin";
import { useAuth } from "@/context/AuthContext";
import {
  HorizontaLDots,
  TableIcon,
  UserCircleIcon,
  BoltIcon,
  FolderIcon,
  TaskIcon,
  PaperPlaneIcon,
  BoxCubeIcon,
  ListIcon,
  EyeIcon,
  ChatIcon,
  ShootingStarIcon,
  BuildingIcon,
} from "../icons/index";
import SidebarNavItem from "./SidebarNavItem";
import { ExtendedUserProfileResponse } from "@/services/api";

// Define SubItem type
export interface SubItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  new?: boolean;
  pro?: boolean;
}

export interface NavItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  subItems?: SubItem[];
  pro?: boolean;
  new?: boolean;
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { selectedProjectId } = useProjects();
  const { isTenantAdmin } = useTenantAdmin();
  const { user } = useAuth();
  const userRole = (user as ExtendedUserProfileResponse)?.role;

  // Define navItems based on user role
  const getNavItems = (): NavItem[] => {
    if (userRole === 'tenant_admin') {
      return [
        {
          icon: <UserCircleIcon />,
          name: "Control Center",
          path: "/management",
          subItems: [
            { name: "Users", path: "/users", icon: <UserCircleIcon /> },
            { icon: <FolderIcon />, name: "Projects", path: "/projects" },
            { icon: <BuildingIcon />, name: "Tenants", path: "/tenants" },
          ],
        }
      ];
    } else if (userRole === 'admin') {
      return [
        {
          icon: <UserCircleIcon />,
          name: "Control Center",
          path: "/management",
          subItems: [
            { name: "Users", path: "/users", icon: <UserCircleIcon /> },
            { icon: <FolderIcon />, name: "Projects", path: "/projects" },
          ],
        },
        {
          icon: <BoltIcon />,
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
          icon: <TaskIcon />,
          name: "My Prompts",
          path: selectedProjectId ? `/projects/${selectedProjectId}/prompts` : undefined,
        },
        {
          icon: <PaperPlaneIcon />,
          name: "Execute Prompt",
          path: "/serveprompt",
          new: true
        },
        {
          icon: <ShootingStarIcon />,
          name: "Magic Assistant",
          path: "/prompt-wizard",
          pro: true
        }
      ];
    }
    return [];
  };

  const navItems = getNavItems().filter(item => !(item.subItems && item.subItems.length === 0 && item.name === "Current Project"));

  // State for submenu toggle and height calculation
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Calculate the correct submenu index based on the current path
  const activeSubmenuIndexBasedOnPath = React.useMemo(() => {
    // Solo abrir el submenú si la ruta actual coincide exactamente con algún subítem
    for (let i = 0; i < navItems.length; i++) {
      const item = navItems[i];
      if (item.subItems?.some(subItem => subItem.path && pathname === subItem.path)) {
        return i;
      }
    }
    return -1;
  }, [pathname, navItems]);

  // Effect to synchronize the open submenu state with the calculated path index
  useEffect(() => {
    setOpenSubmenu(activeSubmenuIndexBasedOnPath);
  }, [activeSubmenuIndexBasedOnPath]);

  // Manual toggle handler
  const handleSubmenuToggle = (index: number) => {
    // Solo permitir toggle si el elemento tiene subítems
    if (navItems[index].subItems && navItems[index].subItems.length > 0) {
      setOpenSubmenu(prev => prev === index ? null : index);
    }
  };

  // useEffect para calcular altura del submenú
  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      const currentSubMenu = subMenuRefs.current[openSubmenu];
      if (currentSubMenu) {
        setTimeout(() => {
          setSubMenuHeight(prev => ({
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-8 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[350px]"
          : isHovered
            ? "w-[350px]"
            : "w-[120px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:left-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link href="/dashboard" className="group">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 className="dark:text-white text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent group-hover:from-brand-600 group-hover:to-purple-700 transition-all duration-300">japm.app</h1>
            </>
          ) : (
            <div className="relative">
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
                className="transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col duration-300 ease-linear no-scrollbar">
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
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
