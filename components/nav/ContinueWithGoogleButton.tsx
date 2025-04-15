'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from "@/context/auth"
import { useRouter } from 'next/navigation'

export default function ContinueWithGoogleButton() {
    const auth = useAuth()
    const router = useRouter()
    return (
        <Button
            variant="outline"
            onClick={async () => {
                try {
                    await auth?.loginWithGoogle();
                    router.refresh();
                } catch (e) {
                    console.log(e)
                }
            }}
            className="w-full"
        >
            Login with Google
        </Button>
    )
}
