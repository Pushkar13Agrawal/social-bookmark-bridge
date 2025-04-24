
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookmarkReminderPickerProps {
  reminderDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const BookmarkReminderPicker: React.FC<BookmarkReminderPickerProps> = ({
  reminderDate,
  onDateChange,
  disabled,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Set Reminder (Optional)</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px] text-xs">Set a date to receive a reminder to revisit this bookmark</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !reminderDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {reminderDate ? format(reminderDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={reminderDate}
            onSelect={onDateChange}
            disabled={(date) => date < new Date()}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
