import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface SubMenuState {
    openSubmenu: number | null;
    subMenuHeight: Record<number, number>;
    subMenuRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

export const useSidebarMenu = () => {
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
    const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const handleSubmenuToggle = useCallback((index: number) => {
        setOpenSubmenu(prev => prev === index ? null : index);
    }, []);

    const calculateSubmenuHeight = useCallback((index: number) => {
        if (openSubmenu !== null && subMenuRefs.current[index]) {
            const currentSubMenu = subMenuRefs.current[index];
            if (currentSubMenu) {
                setTimeout(() => {
                    setSubMenuHeight(prev => ({
                        ...prev,
                        [index]: currentSubMenu.scrollHeight,
                    }));
                }, 0);
            }
        }
    }, [openSubmenu]);

    useEffect(() => {
        calculateSubmenuHeight(openSubmenu as number);
    }, [openSubmenu, calculateSubmenuHeight]);

    return {
        openSubmenu,
        subMenuHeight,
        subMenuRefs,
        handleSubmenuToggle,
        pathname,
    };
}; 