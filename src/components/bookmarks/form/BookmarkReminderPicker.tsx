
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, InfoIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(reminderDate);
  const [time, setTime] = useState(
    reminderDate 
      ? format(reminderDate, "HH:mm") 
      : format(new Date(new Date().setMinutes(0)), "HH:mm")
  );

  // Update the parent component with both date and time
  const handleDateTimeChange = (date: Date | undefined) => {
    if (!date) {
      onDateChange(undefined);
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const newDateTime = new Date(date);
    newDateTime.setHours(hours, minutes, 0, 0);
    
    onDateChange(newDateTime);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    handleDateTimeChange(date);
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    
    if (selectedDate) {
      const [hours, minutes] = e.target.value.split(':').map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      
      onDateChange(newDateTime);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Set Reminder (Optional)</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px] text-xs">Set a date and time to receive a reminder to revisit this bookmark</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex space-x-2">
        {/* Date Picker */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time Picker */}
        <div className="w-1/3">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              disabled={disabled || !selectedDate}
              className="pl-10"
              min="00:00"
              max="23:59"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
