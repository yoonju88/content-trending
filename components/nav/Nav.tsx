'use client'

import Link from 'next/link'
import DarkMode from './DarkMode'
import { links } from '@/utils/links'
import { usePathname } from 'next/navigation'
import AuthButtons from './auth-button'
import React, { useState, useEffect } from 'react'

interface UnderlineState {
    width: number;
    left: number;
}

interface LinkItem {
    href: string;
}

export default function NavBar() {
    const pathname = usePathname() // Current page path
    const [underline, setUnderline] = useState<UnderlineState>({ width: 0, left: 0 })

    useEffect(() => {
        const activeLink = document.querySelector<HTMLElement>(`[data-active="true"]`);
        if (activeLink) {
            setUnderline({
                width: activeLink.offsetWidth,
                left: activeLink.offsetLeft,
            });
        } else {
            setUnderline({ width: 0, left: 0 });
        }
    }, [pathname]);
    //handle mouse enter to set underline position
    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        setUnderline({
            width: target.offsetWidth,
            left: target.offsetLeft,
        })
    }
    //reset underline on mouse leave
    const handleMouseLeave = () => {
        const activeLink = document.querySelector<HTMLElement>(`[data-active="true"]`);
        if (activeLink) {
            setUnderline({
                width: activeLink.offsetWidth,
                left: activeLink.offsetLeft,
            });
        } else {
            setUnderline({ width: 0, left: 0 });
        }
    }
    //check if the given link is the active page
    const isActive = (href: string): boolean => {
        if (href === '/') {
            return pathname === '/';  // 루트 경로의 경우 정확히 일치해야 활성화
        }
        return pathname === href || pathname.startsWith(href + '/')
    };
    console.log("isActive:", isActive)
    // check if any of the links in a dropdown are active
    const isDropDownActive = (links: LinkItem[]) => {
        return links.some(link => pathname.startsWith(link.href));
    };

    return (
        <header className="container mx-auto">
            <div className="flex flex-wrap p-5 flex-col md:flex-row items-center mt-2 justify-between">
                <Link href='/' className="flex title-font font-medium items-center mb-6 md:mb-0" >
                    <span className="ml-3 text-3xl text-foreground " >Tasty Auto System
                    </span>
                </Link>
                <div className="flex gap-5">
                    <AuthButtons />
                    <div className="md:mt-0 mt-6 md:ml-3 ml-0">
                        <DarkMode />
                    </div>
                </div>
            </div>
            <nav className="relative md:ml-auto flex flex-wrap items-center text-base justify-center gap-6 mt-10 p-6">
                <div
                    className='absolute bottom-0 h-[2px] bg-foreground transition-all duration-500'
                    style={{
                        width: underline.width,
                        left: underline.left,
                    }}
                />
                {links.map((link) => {
                    //console.log('link.href:', link.href);
                    console.log('isActive result:', isActive(link.href));
                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-foreground text-opacity-80 text-lg relative mr-2 p-1 cursor-pointer hover:font-bold uppercase ${isActive(link.href) ? "font-bold" : "font-medium"}`}
                            data-active={isActive(link.href) ? "true" : "false"}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </header>
    )
}