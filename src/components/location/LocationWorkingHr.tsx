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
const [activeDay, setActiveDay] = useState<string | null>(null);
const [closedDays, setClosedDays] = useState<Record<string, boolean>>(() =>
  DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {} as Record<string, boolean>)
);

    /* ---------- EDIT MODE HYDRATION ---------- */

    useEffect(() => {
      if (!initialData?.opening_hours) return;

      const mapped: Record<string, DayState> = {};
       const closedMap: Record<string, boolean> = {};

      initialData.opening_hours.forEach((o) => {
        const day =
          o.day.charAt(0).toUpperCase() + o.day.slice(1).toLowerCase();

           const isClosed =
      o.start_time === "closed" || o.end_time === "closed";

    closedMap[day] = isClosed;

        mapped[day] = {
          start: o.start_time === "closed" ? "" : o.start_time,
          end: o.end_time === "closed" ? "" : o.end_time,
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

 useImperativeHandle(ref, () => ({
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
  // validate: async () => {
  //   const invalid = Object.values(times).some(
  //     (t) => !t.start || !t.end
  //   );

  //   return {
  //     valid: !invalid,
  //     errors: invalid
  //       ? [
  //           {
  //             section: "Working Hours",
  //             message: "All days must have start & end time",
  //           },
  //         ]
  //       : [],
  //   };
  // },

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

  // onChange?.({
  //   opening_hours: DAYS.map((day) => {
  //     const t = times[day];
  //     return {
  //       day: day.toLowerCase(),
  //       start_time: t.start || "closed",
  //       end_time: t.end || "closed",
  //     };
  //   }),
  // });
  onChange?.({
  opening_hours: DAYS.map((day) => {
    if (closedDays[day]) {
      return {
        day: day.toLowerCase(),
        start_time: "closed",
        end_time: "closed",
      };
    }

    const t = times[day];
    return {
      day: day.toLowerCase(),
      start_time: t.start,
      end_time: t.end,
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
        {/* <div className="mb-4 col-span-2 flex flex-col gap-5 pl-5 mt-3">
  {DAYS.map((day) => (
    <label
      key={day}
      className="flex items-center gap-2 text-sm cursor-pointer"
    >
      <Checkbox
        checked={closedDays[day]}
        onCheckedChange={(v) =>
          setClosedDays((p) => ({
            ...p,
            [day]: Boolean(v),
          }))
        }
        className=" h-5 w-5 border border-muted-foreground/40"
      />
      <span className="font-medium">{day}</span>
    </label>
  ))}
</div> */}

      <div className="space-y-6 col-span-12 2xl:col-span-6">
        <div className="rounded-[12px] bg-card overflow-x-auto ">
          <table className="w-full border-separate border-spacing-y-3">
            <tbody>
             {DAYS.filter((day) => !closedDays[day]).map((day) => {
                const d = times[day];

                return (
                  <tr
                    key={day}
                    className="rounded-[12px] border border-border bg-card"
                  >
                    {/* <td className="py-[15px] px-[15px] border border-r-0 rounded-tl-[10px] rounded-bl-[10px]">
                       <label className="flex items-center gap-2 text-sm cursor-pointer mb-0">
                        <Checkbox
                          checked={closedDays[day]}
                          onCheckedChange={(v) =>
                            setClosedDays((p) => ({
                              ...p,
                              [day]: Boolean(v),
                            }))
                          }
                            className="rounded-none h-4 w-4 border border-muted-foreground/40"
                        />
                        Closed
                      </label>
                    </td> */}
                    {/* DAY */}
                    <td className="py-[15px] px-[15px]  border border-r-0 rounded-tl-[10px] rounded-bl-[10px]">
                      <div className="min-w-[140px] rounded-[10px]  bg-muted dark:bg-muted/4  text-base leading-[16px] py-[11px] h-[38px] text-center font-semibold text-primary text-green">
                        {day}
                      </div>
                    </td>

                    {/* START TIME */}
                    <td className="py-[15px] px-[15px] text-center border-t border-b">
                      <div className="flex justify-center items-center gap-[5px]">
                      <input
                        type="time"
                        value={d.start}
                        onChange={(e) => {
                        setActiveDay(day);
                        updateTime(day, "start", e.target.value);
                      }}
                        className="rounded-[10px] bg-muted dark:bg-muted/40 text-foreground py-[11px] h-[38px] px-2 text-[16px] leading-[16px] font-semibold outline-none "
                      />
                      <span className="text-muted-foreground">–</span>
                      <input
                        type="time"
                        value={d.end}
                        onChange={(e) => {
                        setActiveDay(day);
                        updateTime(day, "end", e.target.value);
                      }}
                        className="rounded-[10px] bg-muted dark:bg-muted/40 text-foreground py-[11px] h-[38px] px-2 text-[16px] leading-[16px] font-semibold outline-none"
                      />
                      </div>
                    </td>

                    {/* ACTION */}
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
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
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
