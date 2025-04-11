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
        <section>
            <Card className=" group w-full p-10 hover:shadow-muted-foreground hover:shadow-md transition-all duration-500">
                <CardHeader>
                    <CardTitle className="text-3xl group-hover:text-primary">Dash Board</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 space-x-12 text-center">
                    {data.map((item) => {
                        return (
                            <Card
                                key={item.id}
                                className='border-none bg-muted-foreground/10 hover:shadow-muted-foreground hover:shadow-md transition-all duration-500'
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl">{item.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-xl">{item.value}</span>
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>
        </section>
    )
}
