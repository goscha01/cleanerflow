import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format, addDays, isWeekend } from "date-fns";
import { enUS } from "date-fns/locale";

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

export default function PreferredTimes({ form }) {
  const selectedDate = form.watch("preferredDate");
  const selectedTimes = form.watch("preferredTime") || [];

  // Validation state
  const [error, setError] = useState("");

  // Disable weekends and past dates
  const disabledDays = (date) =>
    isWeekend(date) || date < addDays(new Date(), -1);

  // Reset time when date changes
  useEffect(() => {
    form.setValue("preferredTime", []);
  }, [selectedDate]);

  // Validation logic (runs whenever date or time changes)
  useEffect(() => {
    if (!selectedDate) {
      setError("Please select a date.");
    } else if (selectedTimes.length === 0) {
      setError("Please select at least one time slot.");
    } else {
      setError(""); // Clear error if valid
    }
  }, [selectedDate, selectedTimes]);

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
              mode="single"
              selected={selectedDate}
              onSelect={(date) => form.setValue("preferredDate", date)}
              disabled={disabledDays}
            />
          </div>

          {selectedDate && (
            <div className="space-y-6">
              <p className="text-[16px] text-gray-600 mb-6 text-center">
                Please select at least <span className="font-bold">1 date</span>{" "}
                and
                <span className="font-bold"> 1 time</span> that fit your
                availability.
              </p>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <p className="text-[16px] text-gray-600 mb-6 text-center">
                  Select preferred times for{" "}
                  <span className="font-bold">
                    {format(selectedDate, "EEE, MMM do", { locale: enUS })}
                  </span>
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {timeSlots.map((time) => (
                    <label
                      key={time}
                      className="flex items-center space-x-3 border-[1px] border-gray-200 hover:bg-gray-100 transition-all p-3 rounded-md cursor-pointer"
                    >
                      <Checkbox
                        id={`time-${time}`}
                        checked={selectedTimes.includes(time)}
                        onCheckedChange={(checked) => {
                          const newTimes = checked
                            ? [...selectedTimes, time]
                            : selectedTimes.filter((t) => t !== time);
                          form.setValue("preferredTime", newTimes);
                        }}
                        className="w-5 h-5 transition-all duration-200"
                      />
                      <Label
                        htmlFor={`time-${time}`}
                        className="text-xs font-medium text-gray-500"
                      >
                        {time}
                      </Label>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Validation Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
