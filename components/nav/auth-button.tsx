'use client'
import { useAuth } from "@/context/auth";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { Button } from "../ui/button";

export default function AuthButtons() {
    const router = useRouter();
    const auth = useAuth();
    //두 번의 부정(!)을 통해 값을 명시적으로 boolean으로 변환
    //값이 존재한다면 true, 값이 없으면 false.
    const user = auth.currentUser
    return (
        <>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <Image
                                src={user.photoURL ? user.photoURL : "/default-avatar.jpg"}
                                alt="User avatar"
                                width={70}
                                height={70}
                            />
                            <AvatarFallback className="text-sky-950">
                                {(user.displayName || user.email || "U")?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            <div> {user.displayName}</div>
                            <div className='font-normal text-xs'>
                                {user.email}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account" >
                                My Account
                            </Link>
                        </DropdownMenuItem>
                        {!!auth.customClaims?.admin && (
                            <DropdownMenuItem asChild>
                                <Link href="/admin-dashboard" >
                                    Admin Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {!auth.customClaims?.admin && (
                            <DropdownMenuItem asChild>
                                <Link href="/account/my-favourites" >
                                    My Favourites
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={async () => {
                                await auth.logout()
                                router.refresh()
                            }}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex gap-2 items-center">
                    <Button variant="outline">
                        <Link href="/login" className="tracking-widest hover:text-primary">
                            LogIn
                        </Link>
                    </Button>
                    <Button variant="outline" >
                        <Link href="/register" className="tracking-widest hover:text-primary">
                            SignUp
                        </Link>
                    </Button>
                </div>
            )}
        </>
    )
}