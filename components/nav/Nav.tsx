
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import DarkMode from './DarkMode'
import DropDownMenu from './DropDownMenu'
import { links } from '@/utils/links'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const path = usePathname() // Current page path
    //check if the given link is the active page
    const isActive = (href: string): boolean => {
        if (href === '/') {
            return path === '/'
        }
        return path.startsWith(href);
    };

    const linkStyle = "capitalize text-foreground/80 text-lg hover:font-semibold duration-500 relative mr-2 p-1 cursor-pointer"

    return (
        <header>
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center mt-2">
                <Link href='/' className="flex title-font font-medium items-center mb-6 md:mb-0" >
                    <span className="ml-3 text-3xl text-foreground uppercase " >Trend collective
                    </span>
                </Link>
                <nav className="relative md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`${linkStyle} ${isActive(link.label) ? "font-semibold" : "font-medium"}`}
                            data-active={isActive(link.href) ? "true" : "false"}
                        >
                            {link.label}
                        </Link>
                    )
                    )}
                </nav>
                <div className="md:mt-0 mt-6 md:ml-3 ml-0">
                    <DarkMode />
                </div>
            </div>
        </header>
    )
}