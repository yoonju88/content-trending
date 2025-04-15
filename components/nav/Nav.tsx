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
            return pathname === '/';
        }
        // pathname이 href로 시작하는지 확인 (서브 경로도 포함)
        return pathname.startsWith(href);
    };

    return (
        <header className="container mx-auto">
            <div className="flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                <h1 className="flex title-font font-medium items-center text-3xl text-foreground hover:text-primary transition-all duration-500">
                    <Link href='/'>
                        Tasty Auto System
                    </Link>
                </h1>
                <div className="flex items-center space-x-4">
                    <AuthButtons />
                    <DarkMode />
                </div>
            </div>
            <nav className="relative flex items-center justify-center mt-10 p-6 bg-muted-foreground/10">
                {/* Underline */}
                <div
                    className='absolute bottom-5 h-[2px] bg-primary/80 transition-all duration-500 ease-in-out'
                    style={{
                        width: `${underline.width}px`,
                        left: `${underline.left}px`,
                    }}
                />
                <div className="flex items-center space-x-6"> {/* 링크들을 감싸는 컨테이너 추가 */}
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-foreground text-opacity-80 text-lg p-1 cursor-pointer hover:font-bold uppercase transition-all duration-500  hover:text-primary ${isActive(link.href) ? "font-bold text-primary" : "font-medium"
                                }`}
                            data-active={isActive(link.href)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    )
}