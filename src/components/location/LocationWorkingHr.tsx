"use client";

import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
/* ================= TYPES ================= */

type WorkingOutput = {
  opening_hours: {
    day: string;
    start_time: string;
    end_time: string;
    is_closed: "0" | "1";
  }[];
};

type Props = {
  initialData?: Partial<WorkingOutput>;
  onChange?: (data: WorkingOutput) => void;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
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
    
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>(() =>
    DAYS.reduce((acc, day) => {
      acc[day] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const isEndBeforeStart = (start: string, end: string) => {
    if (!start || !end) return false;
    return end <= start;
  };

    /* ---------- EDIT MODE HYDRATION ---------- */

    useEffect(() => {
      if (!initialData?.opening_hours) return;
      const mapped: Record<string, DayState> = {};
       const closedMap: Record<string, boolean> = {};

      initialData.opening_hours.forEach((o) => {
        const day =
          o.day.charAt(0).toUpperCase() + o.day.slice(1).toLowerCase();

           const isClosed =
        o.is_closed === "1" ||
      o.start_time === "closed" ||
       o.end_time === "closed";
    closedMap[day] = isClosed;

        mapped[day] = {
          start: o.start_time === "" ? "" : o.start_time,
          end: o.end_time === "" ? "" : o.end_time,
        };
      });

      setTimes((prev) => ({ ...prev, ...mapped }));
       setClosedDays((p) => ({ ...p, ...closedMap }));
    }, [initialData]);

    useEffect(() => {
  setTimes((prev) => {
    const updated = { ...prev };
    DAYS.forEach((day) => {
      if (closedDays[day]) {
        updated[day] = { start: "", end: "" };
      }
    });

    return updated;
  });
}, [closedDays]);

    /* ---------- EXPOSE VALIDATION ---------- */

//  useImperativeHandle(ref, () => ({
//   validate: async () => {
//   const invalid = DAYS.some((day) => {
//     if (closedDays[day]) return false;
//     const t = times[day];
//     return !t.start || !t.end;
//   });

//   return {
//     valid: !invalid,
//     errors: invalid
//       ? [
//           {
//             section: "Working Hours",
//             message: "All open days must have start & end time",
//           },
//         ]
//       : [],
//   };
// },
//   setData: (data: WorkingOutput) => {
//     console.log("data",data.opening_hours)
//     if (!data?.opening_hours) return;

//     const mapped: Record<string, DayState> = {};

//     data.opening_hours.forEach((o) => {
//       const day =
//         o.day.charAt(0).toUpperCase() + o.day.slice(1).toLowerCase();

//       mapped[day] = {
//         start: o.start_time === "closed" ? "" : o.start_time,
//         end: o.end_time === "closed" ? "" : o.end_time,
//       };
//     });

//     setTimes((prev) => ({ ...prev, ...mapped }));
//   },
// }));
useImperativeHandle(ref, () => ({
  /* ---------- VALIDATE ---------- */
  validate: async () => {
    const invalid = DAYS.some((day) => {
      if (closedDays[day]) return false;

      const t = times[day];
      return !t.start || !t.end;
    });

    return {
      valid: !invalid,
      errors: invalid
        ? [
            {
              section: "Working Hours",
              message: "All open days must have start & end time",
            },
          ]
        : [],
    };
  },

  /* ---------- SET DATA ---------- */
  setData: (data: WorkingOutput) => {
    if (!data?.opening_hours) return;

    const mappedTimes: Record<string, DayState> = {};
    const mappedClosed: Record<string, boolean> = {};

    data.opening_hours.forEach((o) => {
      const day =
        o.day.charAt(0).toUpperCase() + o.day.slice(1).toLowerCase();

      const isClosed =
        o.is_closed === "1" ||
        o.start_time === "closed" ||
        o.end_time === "closed";

      mappedClosed[day] = isClosed;

      mappedTimes[day] = {
        start: isClosed ? "" : o.start_time,
        end: isClosed ? "" : o.end_time,
      };
    });

    setTimes((prev) => ({ ...prev, ...mappedTimes }));
    setClosedDays((prev) => ({ ...prev, ...mappedClosed }));
  },

  /* ---------- GET DATA ---------- */
  getData: (): WorkingOutput => ({
    opening_hours: DAYS.map((day) => ({
      day,
      start_time: closedDays[day] ? "closed" : times[day].start,
      end_time: closedDays[day] ? "closed" : times[day].end,
      is_closed: closedDays[day] ? "1" : "0",
    })),
  }),
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
    if (closedDays[day]) {
      return {
        day: day.toLowerCase(),
        start_time: "",
        end_time: "",
        is_closed: "0"
      };
    }

    const t = times[day];
    return {
      day: day.toLowerCase(),
      start_time: t.start,
      end_time: t.end,
      is_closed: "1"
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
  setActiveDay(day);

  setTimes((prev) => {
    const current = prev[day];

    if (field === "start" && current.end && current.end <= value) {
      return {
        ...prev,
        [day]: { start: value, end: "" }, // ❗ reset invalid end
      };
    }

    return {
      ...prev,
      [day]: { ...current, [field]: value },
    };
  });
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
    
      <div className="space-y-6 col-span-12 2xl:col-span-7">
        <div className="rounded-[12px] bg-card overflow-x-auto ">
          <table className="w-full border-separate border-spacing-y-3">
            <tbody>
            {DAYS.map((day) => {
                const d = times[day];
                console.log("d",d)
                const isEmpty = !d?.start && !d?.end;
                return (
                  <tr
                    key={day}
                    className="rounded-[12px] border border-border bg-card"
                  >
                    {/* DAY */}
                    <td className="py-[15px] px-[15px]  border border-r-0 rounded-tl-[10px] rounded-bl-[10px]">
                      <div className="min-w-[140px] rounded-[10px]  bg-muted dark:bg-muted/4  text-base leading-[16px] py-[11px] h-[38px] text-center font-semibold text-primary text-green">
                        {day}
                      </div>
                    </td>

                    {/* START TIME */}
                   <td className="py-[15px] px-[15px] text-center border-t border-b">
                        {closedDays[day] ? (
                        <span className="text-sm text-muted-foreground italic">
                          
                        </span>
                      ) : (
                        <div className="flex justify-center items-center gap-[5px]">
                          <input
                            type="time"
                            value={d.start}
                            onChange={(e) => updateTime(day, "start", e.target.value)}
                            className="rounded-[10px] bg-muted dark:bg-muted/40 text-foreground py-[11px] h-[38px] px-2 text-[16px] font-semibold outline-none"
                          />
                          <span className="text-muted-foreground">–</span>
                          <input
                          type="time"
                          value={d.end}
                          min={d.start || undefined}   // 👈 MAIN MAGIC
                          onChange={(e) => {
                            if (isEndBeforeStart(d.start, e.target.value)) {
                              return; // block invalid selection
                            }
                            updateTime(day, "end", e.target.value);
                          }}
                          className="rounded-[10px] bg-muted dark:bg-muted/40 text-foreground py-[11px] h-[38px] px-2 text-[16px] font-semibold outline-none"
                        />
                        </div>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className={`px-[15px] py-[15px] text-right border-y`}>
                      <label className="flex items-center gap-2 text-sm cursor-pointer mb-0">
                        <Checkbox
                          checked={closedDays[day]}  
                          onCheckedChange={(v) =>
                            setClosedDays((p) => ({
                              ...p,
                              [day]: Boolean(v),
                            }))
                          }
                            className="h-5 w-5 border border-muted-foreground/40"
                        />
                        Closed
                      </label>
                    </td>
                    <td className={`${activeDay === day ? "px-[15px] py-[15px]" : "px-1 py-1"} text-right border border-l-0 rounded-br-[10px] rounded-tr-[10px]`}>
                      {activeDay === day && (
                      <button
                        onClick={() => openCopyPopup(day)}
                        className=" text-muted-foreground hover:text-primary">
                        <Copy size={18} />
                      </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {copyFromDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 !mt-0">
            <div className="w-full max-w-md rounded-2xl bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                Copy from{" "}
                <span className="text-primary]">{copyFromDay}</span>
              </h3>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {DAYS.filter((d) => d !== copyFromDay).map((day) => {
              const checked = copySelection[day] || false;

              return (
                <label
                  key={day}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition",
                    checked
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/40"
                  )}
                >
                  <span className="font-medium text-sm text-foreground">
                    {day}
                  </span>

                  <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                      setCopySelection((p) => ({
                        ...p,
                        [day]: !p[day],
                      }))
                    }
                    className="h-5 w-5 border border-muted-foreground/40"
                  />
                </label>
              );
            })}
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
