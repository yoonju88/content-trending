import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { links } from '@/utils/links'
import { LinkIcon } from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-4xl"> 쇼핑몰 주문서 관리</h1>
      <div className="grid grid-cols-4 gap-10 mt-10">
        {links.map((link, index) => {
          if (index === 0) return null
          return (
            <Card
              key={`${link.label}+i`}
              className="mt-5"
            >
              <CardHeader>
                <CardTitle className="uppercase text-xl">
                  {link.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{link.label} 주문서 관리</p>
                <Button
                  variant="default"
                  size="lg"
                  className="group"
                  asChild
                >
                  <Link
                    href={link.href}
                    className="text-sm font-light hover:text-amber-500"
                  >
                    <LinkIcon
                      className="group-hover:text-amber-500"
                    />
                    Open
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
