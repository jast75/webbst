import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-[#4CAF50] text-white hover:bg-[#388E3C]",
                destructive:
                    "bg-[#F44336] text-white hover:bg-[#D32F2F]",
                outline:
                    "border border-[#4CAF50] bg-transparent text-[#4CAF50] hover:bg-[#C8E6C9]",
                secondary:
                    "bg-[#2196F3] text-white hover:bg-[#1976D2]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                disabled: "bg-[#E0E0E0] text-[#757575]",
            },
            size: {
                default: "h-12 px-6 py-3 text-base", // match existing medium
                sm: "h-9 rounded-md px-3",
                lg: "h-14 rounded-md px-8",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, loading = false, children, ...props }, ref) => {
        if (asChild) {
            return (
                <Slot
                    className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Slot>
            )
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={props.disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
