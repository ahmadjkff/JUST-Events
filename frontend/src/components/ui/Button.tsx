"use client"
import React from "react"
import "../styles/Button.css"

type ButtonProps = {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger" | string
  size?: "default" | "small" | "large" | string
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: "button" | "submit" | "reset"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "default",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const getButtonClasses = () => {
    const classes = ["button"]

    // Add variant class
    classes.push(`button-${variant}`)

    // Add size class
    classes.push(`button-${size}`)

    // Add modifiers
    if (fullWidth) classes.push("button-full")
    if (loading) classes.push("button-loading")

    return classes.join(" ")
  }

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
