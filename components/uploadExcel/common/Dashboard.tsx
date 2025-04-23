import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DashboardItem } from '@/utils/dash-board';

type DashboardProps = {
    data: DashboardItem[]
}

export default function Dashboard({ data }: DashboardProps) {
    return (
        <section className="flex items-center justify-center">
            <Card className="group w-full px-3 sm:px-10 py-10 hover:shadow-muted-foreground hover:shadow-md transition-all duration-500">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl group-hover:text-primary">Dash Board</CardTitle>
                </CardHeader>
                <CardContent className="grid lg:grid-cols-4 space-x-12 text-center grid-cols-2 gap-6">
                    {data.map((item) => {
                        return (
                            <Card
                                key={item.id}
                                className='border-none w-full bg-muted-foreground/10 hover:shadow-muted-foreground hover:shadow-md transition-all duration-500'
                            >
                                <CardHeader>
                                    <CardTitle className=" text-lg sm:text-2xl">{item.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-lg sm:text-xl">{item.value}</span>
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>
        </section>
    )
}
