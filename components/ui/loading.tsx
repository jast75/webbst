import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    className?: string
    size?: number
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
    return (
        <Loader2
            className={cn("animate-spin text-green-600", className)}
            size={size}
        />
    )
}

export function LoadingPage() {
    return (
        <div className="flex h-[400px] w-full items-center justify-center">
            <LoadingSpinner size={32} />
        </div>
    )
}

export function LoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <LoadingSpinner size={40} />
        </div>
    )
}
