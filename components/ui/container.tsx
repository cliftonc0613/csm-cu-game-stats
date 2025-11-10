import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width variant
   * @default "xl"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  /**
   * Whether to center the container
   * @default true
   */
  centered?: boolean
  /**
   * Custom padding
   * @default "md"
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      maxWidth = "xl",
      centered = true,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const maxWidthClasses = {
      sm: "max-w-[var(--container-sm)]",
      md: "max-w-[var(--container-md)]",
      lg: "max-w-[var(--container-lg)]",
      xl: "max-w-[var(--container-xl)]",
      "2xl": "max-w-[var(--container-2xl)]",
      full: "max-w-full",
    }

    const paddingClasses = {
      none: "",
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
      xl: "px-12",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          centered && "mx-auto",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"

export { Container }
