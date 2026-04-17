"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  DayPicker,
  type DayContentProps,
  type DayPickerProps,
  type DayProps,
  type Formatters,
  type StyledComponent,
  type WeekNumberProps,
} from "react-day-picker"

import { cn } from "../lib/utils"
import { Button, buttonVariants } from "./button"

type CalendarProps = Omit<DayPickerProps, "components" | "classNames" | "formatters"> & {
  className?: string
  classNames?: Partial<NonNullable<DayPickerProps["classNames"]>>
  formatters?: Partial<Formatters>
  components?: Partial<NonNullable<DayPickerProps["components"]>>
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

type CalendarClassNames = NonNullable<DayPickerProps["classNames"]>
type CalendarComponents = NonNullable<DayPickerProps["components"]>

const defaultClassNames = {} as CalendarClassNames

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "buttons",
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
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
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
        IconLeft: (props: StyledComponent) => {
          return <ChevronLeftIcon className={cn("size-4", props.className)} />
        },
        IconRight: (props: StyledComponent) => {
          return <ChevronRightIcon className={cn("size-4", props.className)} />
        },
        Day: CalendarDayButton as unknown as CalendarComponents["Day"],
        WeekNumber: ({ children, ...props }: React.ComponentProps<"td"> & WeekNumberProps) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        DayContent: ({ date }: DayContentProps) => <span>{date.getDate()}</span>,
        ...components,
      }}
      {...(props as DayPickerProps)}
    />
  )
}

function CalendarDayButton({
  className,
  date,
  displayMonth,
  ...props
}: React.ComponentProps<"button"> & Partial<Pick<DayProps, "date" | "displayMonth">>) {
  return (
    <Button
      {...(props as React.ComponentPropsWithoutRef<"button">)}
      ref={(props as { ref?: React.Ref<HTMLButtonElement> }).ref}
      variant="ghost"
      size="icon"
      data-day={date ? date.toLocaleDateString() : undefined}
      data-display-month={displayMonth?.toISOString()}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        className,
      )}
    />
  )
}

export { Calendar, CalendarDayButton }
