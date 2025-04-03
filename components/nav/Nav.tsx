'use client'

import Link from 'next/link'
import DarkMode from './DarkMode'
import DropDownMenu from './DropDownMenu'
import { links } from '@/utils/links'
import { usePathname } from 'next/navigation'
import AuthButtons from './auth-button'

export default function NavBar() {
    const pathname = usePathname() // Current page path
    //check if the given link is the active page
    const isActive = (href: string): boolean => {
        if (href === '/') {
            return pathname === '/';  // 루트 경로의 경우 정확히 일치해야 활성화
        }
        return pathname.startsWith(href);
    };
    console.log('pathname:', pathname);


    const linkStyle = "capitalize text-foreground/80 text-lg hover:font-semibold duration-500 relative mr-2 p-1 cursor-pointer"

    return (
        <header>
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center mt-2 justify-between">
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
            <nav className="relative md:ml-auto flex flex-wrap items-center text-base justify-center gap-6 mt-10 bg-gray-100 p-6">
                {links.map((link) => {
                    //console.log('link.href:', link.href);
                    //console.log('isActive result:', isActive(link.href));
                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`${linkStyle} ${isActive(link.href) ? "font-semibold" : "font-light"}`}
                            data-active={isActive(link.href) ? "true" : "false"}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </header>
    )
}