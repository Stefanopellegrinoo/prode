"use client"

import { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { ChevronDown } from 'lucide-react'

const Dropdown = ({ trigger, children, align = "left", width = "auto", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  const widthClasses = {
    auto: "min-w-[10rem]",
    full: "w-full",
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {typeof trigger === "string" ? (
          <button className="flex items-center gap-1 text-sm font-medium">
            {trigger}
            <ChevronDown className="h-4 w-4" />
          </button>
        ) : (
          trigger
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 ${
            alignmentClasses[align]
          } ${widthClasses[width]}`}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  )
}

const DropdownItem = ({ children, onClick, disabled = false, className = "" }) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {children}
    </div>
  )
}

const DropdownDivider = ({ className = "" }) => {
  return <div className={`my-1 h-px bg-gray-200 dark:bg-gray-700 ${className}`} />
}

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right", "center"]),
  width: PropTypes.oneOf(["auto", "full", "sm", "md", "lg"]),
  className: PropTypes.string,
}

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

DropdownDivider.propTypes = {
  className: PropTypes.string,
}

export { Dropdown, DropdownItem, DropdownDivider }

