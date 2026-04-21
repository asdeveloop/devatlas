"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"
import {
  type ChevronProps,
  DayPicker,
  type DayPickerProps,
  type Formatters,
  type WeekNumberProps,
} from "react-day-picker"

import { cn } from "../lib/utils"

import type { Button } from "./button"
import { buttonVariants } from "./button"

type CalendarProps = Omit<DayPickerProps, "components" | "classNames" | "formatters"> & {
  className?: string
  classNames?: Partial<NonNullable<DayPickerProps["classNames"]>>
  formatters?: Partial<Formatters>
  components?: Partial<NonNullable<DayPickerProps["components"]>>
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

type CalendarClassNames = NonNullable<DayPickerProps["classNames"]>
const defaultClassNames = {} as CalendarClassNames

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  const mergedClassNames: CalendarClassNames = {
    ...defaultClassNames,
    nav_button_previous: buttonVariants({ variant: buttonVariant, size: "icon" }),
    nav_button_next: buttonVariants({ variant: buttonVariant, size: "icon" }),
    ...classNames,
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button_left>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_right>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthCaption: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={mergedClassNames}
      components={{
        Chevron: ({ className, orientation }: ChevronProps) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} />
          }

          return <ChevronRightIcon className={cn("size-4", className)} />
        },
        WeekNumber: ({ children, ...props }: React.ComponentProps<"td"> & WeekNumberProps) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...(props as DayPickerProps)}
    />
  )
}

export { Calendar }
