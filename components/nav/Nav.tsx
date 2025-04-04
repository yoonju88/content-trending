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
    console.log("isActive:", isActive)


    return (
        <header className="container mx-auto">
            <div className="flex flex-wrap p-5 flex-col md:flex-row items-center mt-2 justify-between">
                <Link href='/' className="flex title-font font-medium items-center mb-6 md:mb-0" >
                    <span className="ml-3 text-3xl text-foreground " >Tasty Auto System
                    </span>
                </Link>
                <div className="flex">
                    <AuthButtons />
                    <div className="md:mt-0 mt-6 md:ml-3 ml-0">
                        <DarkMode />
                    </div>
                </div>
            </div>
            <nav className="relative flex items-center justify-center mt-10 p-6">
                {/* Underline */}
                <div
                    className='absolute bottom-5 h-[2px] bg-primary/80'
                    style={{
                        width: `${underline.width}px`,
                        left: `${underline.left}px`,
                        transition: 'all 0.3s ease',
                    }}
                />
                <div className="flex items-center space-x-6"> {/* 링크들을 감싸는 컨테이너 추가 */}
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-foreground text-opacity-80 text-lg p-1 cursor-pointer hover:font-bold uppercase  hover:text-primary ${isActive(link.href) ? "font-bold text-primary" : "font-medium"
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