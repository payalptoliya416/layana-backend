"use client";

import { Copy } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/* ================= TYPES ================= */

type WorkingOutput = {
  opening_hours: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
};

type Props = {
  initialData?: Partial<WorkingOutput>;
  onChange?: (data: WorkingOutput) => void;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type DayState = {
  start: string;
  end: string;
};

/* ================= COMPONENT ================= */

const LocationWorkingHr = forwardRef<any, Props>(
  ({ initialData, onChange }, ref) => {
    /* ---------- STATE ---------- */

    const [times, setTimes] = useState<Record<string, DayState>>(() =>
      DAYS.reduce((acc, day) => {
        acc[day] = { start: "", end: "" };
        return acc;
      }, {} as Record<string, DayState>)
    );

    const [copyFromDay, setCopyFromDay] = useState<string | null>(null);
    const [copySelection, setCopySelection] = useState<Record<string, boolean>>(
      {}
    );

    /* ---------- EDIT MODE HYDRATION ---------- */

    useEffect(() => {
      if (!initialData?.opening_hours) return;

      const mapped: Record<string, DayState> = {};

      initialData.opening_hours.forEach((o) => {
        const day =
          o.day.charAt(0).toUpperCase() + o.day.slice(1).toLowerCase();

        mapped[day] = {
          start: o.start_time === "closed" ? "" : o.start_time,
          end: o.end_time === "closed" ? "" : o.end_time,
        };
      });

      setTimes((prev) => ({ ...prev, ...mapped }));
    }, [initialData]);

    /* ---------- EXPOSE VALIDATION ---------- */

 useImperativeHandle(ref, () => ({
  validate: async () => {
    const invalid = Object.values(times).some(
      (t) => !t.start || !t.end
    );

    return {
      valid: !invalid,
      errors: invalid
        ? [
            {
              section: "Working Hours",
              message: "All days must have start & end time",
            },
          ]
        : [],
    };
  },

  // ✅ ADD THIS
  setData: (data: WorkingOutput) => {
    if (!data?.opening_hours) return;

    const mapped: Record<string, DayState> = {};

    data.opening_hours.forEach((o) => {
      const day =
        o.day.charAt(0).toUpperCase() + o.day.slice(1).toLowerCase();

      mapped[day] = {
        start: o.start_time === "closed" ? "" : o.start_time,
        end: o.end_time === "closed" ? "" : o.end_time,
      };
    });

    setTimes((prev) => ({ ...prev, ...mapped }));
  },
}));


    /* ---------- SEND DATA TO PARENT ---------- */

 const firstRender = useRef(true);

useEffect(() => {
  if (firstRender.current) {
    firstRender.current = false;
    return;
  }

  onChange?.({
    opening_hours: DAYS.map((day) => {
      const t = times[day];
      return {
        day: day.toLowerCase(),
        start_time: t.start || "closed",
        end_time: t.end || "closed",
      };
    }),
  });
}, [times]);

    /* ---------- HELPERS ---------- */

    const updateTime = (
      day: string,
      field: "start" | "end",
      value: string
    ) => {
      setTimes((p) => ({
        ...p,
        [day]: { ...p[day], [field]: value },
      }));
    };

    const openCopyPopup = (day: string) => {
      setCopyFromDay(day);

      const init: Record<string, boolean> = {};
      DAYS.forEach((d) => (init[d] = false));
      setCopySelection(init);
    };

    /* ================= UI ================= */

    return (
      <div className="grid grid-cols-12">
      <div className="space-y-6 col-span-7">
        <div className="rounded-[20px] bg-card overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <tbody>
              {DAYS.map((day) => {
                const d = times[day];

                return (
                  <tr
                    key={day}
                    className="rounded-[20px] border border-[#E5E7EB] bg-card"
                  >
                    {/* DAY */}
                    <td className="px-4 py-3 border border-r-0 rounded-tl-[10px] rounded-bl-[10px]">
                      <div className="min-w-[140px] rounded-[10px] bg-[#EEF6F6] px-4 py-3 text-sm text-center font-semibold text-[#0F5D5D]">
                        {day}
                      </div>
                    </td>

                    {/* START TIME */}
                    <td className="px-3 py-4 text-center border-t border-b">
                      <input
                        type="time"
                        value={d.start}
                        onChange={(e) =>
                          updateTime(day, "start", e.target.value)
                        }
                        className="rounded-[10px] bg-[#F3F4F6] px-6 py-3 text-sm font-semibold outline-none"
                      />
                    </td>

                    {/* DASH */}
                    <td className="px-2 py-4 text-center text-lg text-[#9CA3AF] border-t border-b">
                      –
                    </td>

                    {/* END TIME */}
                    <td className="px-3 py-4 text-center border-t border-b">
                      <input
                        type="time"
                        value={d.end}
                        onChange={(e) =>
                          updateTime(day, "end", e.target.value)
                        }
                        className="rounded-[10px] bg-[#F3F4F6] px-6 py-3 text-sm font-semibold outline-none"
                      />
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-3 text-right border border-l-0 rounded-br-[10px] rounded-tr-[10px]">
                      <button
                        onClick={() => openCopyPopup(day)}
                        className="text-[#6B7280] hover:text-[#0F5D5D]"
                      >
                        <Copy size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* COPY POPUP */}
        {copyFromDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
              <h3 className="text-lg font-semibold mb-4">
                Copy timing from{" "}
                <span className="text-[#0F5D5D]">{copyFromDay}</span>
              </h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {DAYS.filter((d) => d !== copyFromDay).map((day) => (
                  <label
                    key={day}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer"
                  >
                    <span className="font-medium">{day}</span>
                    <input
                      type="checkbox"
                      checked={copySelection[day] || false}
                      onChange={() =>
                        setCopySelection((p) => ({
                          ...p,
                          [day]: !p[day],
                        }))
                      }
                      className="h-4 w-4 text-[#0F5D5D]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setCopyFromDay(null)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    const source = times[copyFromDay];

                    setTimes((prev) => {
                      const updated = { ...prev };
                      Object.entries(copySelection).forEach(
                        ([day, checked]) => {
                          if (checked) {
                            updated[day] = {
                              start: source.start,
                              end: source.end,
                            };
                          }
                        }
                      );
                      return updated;
                    });

                    setCopyFromDay(null);
                  }}
                  className="rounded-lg bg-[#0F5D5D] px-5 py-2 text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    );
  }
);

LocationWorkingHr.displayName = "LocationWorkingHr";
export default LocationWorkingHr;
