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


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-4xl text-primary font-bold tracking-wide"> 쇼핑몰 주문서 관리</h1>
      <div className="grid grid-cols-4 gap-10 mt-10">
        {links.map((link, index) => {
          if (index === 0) return null
          return (
            <Card
              key={`${link.label}+i`}
              className="mt-10 p-10 text-center hover:shadow-lg hover:shadow-muted-foreground/50 transition-shadow duration-500"
            >
              <CardHeader>
                <CardTitle className="uppercase text-xl tracking-wide">
                  {link.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-5">
                <p>{link.label} 주문서 관리</p>
                <Button
                  variant="default"
                  size="default"
                  className="group"
                >
                  <Link
                    href={link.href}
                    className="text-base font-light text-white group-hover:font-semibold transition-all duration-300"
                  >
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
