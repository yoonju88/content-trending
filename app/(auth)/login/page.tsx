
import ContinueWithGoogleButton from '@/components/nav/ContinueWithGoogleButton'
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Login() {
    return (
        <div>
            <Card className="w-[500px]">
                <CardHeader >
                    <CardTitle className='text-3xl font-bold'>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContinueWithGoogleButton />
                </CardContent>
            </Card>
        </div>
    )
}