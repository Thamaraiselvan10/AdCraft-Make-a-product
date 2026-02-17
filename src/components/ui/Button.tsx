import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

// Define props based on motion.button
type MotionButtonProps = React.ComponentProps<typeof motion.button>

interface ButtonProps extends MotionButtonProps {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
    isLoading?: boolean
    children?: React.ReactNode
}

const MotionButton = motion.button

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        return (
            <MotionButton
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </MotionButton>
        )
    }
)
Button.displayName = "Button"

export { Button }
