import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format, addDays, isWeekend, startOfDay, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const timeSlots = [
  "9 AM - 10 AM",
  "10 AM - 11 AM",
  "11 AM - 12 AM",
  "12 PM - 1 PM",
  "1 PM - 2 PM",
  "2 PM - 3 PM",
  "3 PM - 4 PM",
  "4 PM - 5 PM",
  "5 PM - 6 PM",
];

// Calendar Component
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectedDates,
  onDayClick,
  disabledDays,
  ...props
}) {
  const today = startOfDay(new Date()); // Local timezone
  const fromMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      fromMonth={fromMonth}
      disabled={disabledDays}
      selected={selectedDates}
      onDayClick={onDayClick}
      classNames={{
        months: "flex flex-col",
        month: "space-y-6",
        caption: "flex items-center justify-between px-4",
        caption_label: "text-lg font-semibold relative -top-6",
        nav: "flex justify-between items-center space-x-4",
        nav_button:
          "h-10 w-10 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        head_row: "grid grid-cols-7 text-center",
        head_cell: "text-gray-500 text-sm font-semibold p-2",
        row: "grid grid-cols-7 text-center gap-1",
        cell: "flex items-center justify-center cursor-pointer transition-all duration-200",
        day: "text-center md:p-6 font-medium rounded-full",
        day_selected: "text-white font-bold shadow-md bg-blue-500",
        day_today:
          "border-2 border-blue-500 text-blue-600 font-semibold shadow-sm",
        day_outside: "text-gray-400 opacity-50",
        day_disabled:
          "text-gray-300 cursor-not-allowed opacity-50 pointer-events-none",
        day_range_middle: "bg-blue-100 text-blue-700",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export default function PreferredTimes({ form, nextStep }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [error, setError] = useState("");

  // Normalize dates to start of day in local timezone
  const normalizeDate = (date) => startOfDay(date);

  // Sync local state with form
  useEffect(() => {
    const formattedDates = selectedDates.map((date) =>
      format(normalizeDate(date), "yyyy-MM-dd")
    );
    form.setValue("preferredDates", formattedDates);
    form.setValue("preferredTimes", selectedTimes);
  }, [selectedDates, selectedTimes, form]);

  // Initialize form values
  useEffect(() => {
    setSelectedDates([]);
    setSelectedTimes({});
    form.setValue("preferredDates", []);
    form.setValue("preferredTimes", {});
  }, [form]);

  // Validation logic
  useEffect(() => {
    if (selectedDates.length === 0) {
      setError("Please select at least one date.");
    } else if (
      Object.values(selectedTimes).every((times) => times.length === 0)
    ) {
      setError("Please select at least one time slot.");
    } else {
      setError("");
    }
  }, [selectedDates, selectedTimes]);

  // Disable weekends and past dates in local timezone
  const disabledDays = (date) => {
    const normalizedDate = normalizeDate(date);
    const today = normalizeDate(new Date());
    return isWeekend(normalizedDate) || normalizedDate < today;
  };

  // Handle date selection/deselection
  const handleDateToggle = (date) => {
    const normalizedDate = normalizeDate(date);
    const isSelected = selectedDates.some((d) => isSameDay(d, normalizedDate));

    let newDates;
    if (isSelected) {
      // Deselect date
      newDates = selectedDates.filter((d) => !isSameDay(d, normalizedDate));
    } else {
      // Select date
      newDates = [...selectedDates, normalizedDate];
    }

    // Sort dates for consistent display
    newDates.sort((a, b) => a - b);

    // Update selectedTimes: remove times for deselected dates
    const newTimes = { ...selectedTimes };
    Object.keys(newTimes).forEach((dateKey) => {
      if (!newDates.some((d) => format(d, "yyyy-MM-dd") === dateKey)) {
        delete newTimes[dateKey];
      }
    });

    setSelectedDates(newDates);
    setSelectedTimes(newTimes);
  };

  // Handle time slot selection
  const handleTimeSelect = (dateKey, time) => {
    setSelectedTimes((prev) => {
      const newTimes = { ...prev };
      if (newTimes[dateKey]) {
        if (newTimes[dateKey].includes(time)) {
          newTimes[dateKey] = newTimes[dateKey].filter((t) => t !== time);
        } else {
          newTimes[dateKey] = [...newTimes[dateKey], time];
        }
      } else {
        newTimes[dateKey] = [time];
      }
      return newTimes;
    });
  };

  return (
    <div className="md:px-6 px-0">
      <h2 className="text-2xl font-bold text-gray-800">Your Preferred Times</h2>
      <p className="text-[16px] text-gray-600 mb-12 text-justify">
        Pick a few time slots that fit your schedule, and we’ll confirm the best
        one.
      </p>

      <Card>
        <CardContent className="p-8 space-y-8">
          <div className="text-center">
            <Calendar
              mode="multiple" // Support multiple date selections
              selectedDates={selectedDates}
              onDayClick={handleDateToggle}
              disabledDays={disabledDays}
            />
          </div>

          {selectedDates.length > 0 && (
            <div className="space-y-6">
              <p className="text-[16px] text-gray-600 mb-6 text-center">
                Please select at least <span className="font-bold">1 date</span>{" "}
                and
                <span className="font-bold"> 1 time</span> that fit your
                availability.
              </p>

              {selectedDates.map((date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                return (
                  <div
                    key={dateKey}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
                  >
                    <p className="text-[16px] text-gray-600 mb-6 text-center">
                      Select preferred times for{" "}
                      <span className="font-bold">
                        {format(date, "EEE, MMM do", { locale: enUS })}
                      </span>
                    </p>

                    <div className="grid md:grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
                      {timeSlots.map((time) => (
                        <label
                          key={time}
                          className="flex items-center space-x-3 border-[1px] border-gray-200 hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer"
                        >
                          <Checkbox
                            id={`${dateKey}-${time}`}
                            checked={
                              selectedTimes[dateKey]?.includes(time) || false
                            }
                            onCheckedChange={() =>
                              handleTimeSelect(dateKey, time)
                            }
                            className="w-5 h-5 transition-all duration-200"
                          />
                          <Label
                            htmlFor={`${dateKey}-${time}`}
                            className="text-xs font-medium text-gray-500"
                          >
                            {time}
                          </Label>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-start">
        <Button
          type="button"
          onClick={nextStep}
          disabled={!!error}
          className={`continue-button px-16 py-6 text-white ${
            error
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primaryHover"
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
