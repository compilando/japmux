"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useProjects } from "../context/ProjectContext";
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
} from "../icons/index";
import SidebarNavItem from "./SidebarNavItem";

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
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { selectedProjectId } = useProjects();

  // Define navItems first
  const navItems: NavItem[] = [
    {
      icon: <UserCircleIcon />,
      name: "Management",
      path: "/management",
      subItems: [
        { name: "Users", path: "/users", icon: <UserCircleIcon /> },
        { icon: <FolderIcon />, name: "Projects", path: "/projects" }
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
      name: "Prompt Management",
      path: selectedProjectId ? `/projects/${selectedProjectId}/prompts` : undefined,
      subItems: selectedProjectId ? [
        { name: "Prompts", path: `/projects/${selectedProjectId}/prompts`, icon: <TaskIcon /> },
      ] : [],
    },
    {
      icon: <PaperPlaneIcon />,
      name: "Prompt Execution",
      path: "/serveprompt",
      pro: true
    },
    {
      icon: <ShootingStarIcon />,
      name: "Prompt Wizard",
      path: "/prompt-wizard",
    }
  ].filter(item => !(item.subItems && item.subItems.length === 0 && (item.name === "Current Project" || item.name === "Prompt Management")));

  // Índice removido por no ser utilizado

  // State for submenu toggle and height calculation
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Calculate the correct submenu index based on the current path
  const activeSubmenuIndexBasedOnPath = React.useMemo(() => {
    let bestMatchIndex = -1;
    let longestMatchPathLength = 0;

    navItems.forEach((navItem, index) => {
      if (navItem.subItems && navItem.subItems.length > 0) {
        navItem.subItems.forEach(subItem => {
          if (subItem.path && pathname.startsWith(subItem.path)) {
            if (subItem.path.length > longestMatchPathLength) {
              longestMatchPathLength = subItem.path.length;
              bestMatchIndex = index;
            }
          }
        });
        // Si la ruta del navItem padre (que tiene subítems) coincide directamente
        // y es una coincidencia más larga/específica que cualquier subítem encontrado hasta ahora,
        // ese navItem debería tener su submenú abierto.
        // Esto es útil si el padre es un enlace en sí mismo y queremos que se expanda.
        if (navItem.path && pathname === navItem.path) {
          if (navItem.path.length >= longestMatchPathLength) {
            longestMatchPathLength = navItem.path.length; // Actualizar por si este es el más largo
            bestMatchIndex = index;
          }
        }
      }
    });
    return bestMatchIndex;
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
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 style={{ fontSize: "24px", fontWeight: "bold" }} className="dark:text-white">japm.app</h1>
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
