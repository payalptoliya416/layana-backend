    import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    } from "react";
    import { Check, GripVertical, Pencil, Trash2, X } from "lucide-react";
    import BranchGrid from "../branches/BranchGrid";

    import { DndContext, closestCenter } from "@dnd-kit/core";
    import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
    } from "@dnd-kit/sortable";
    import { CSS } from "@dnd-kit/utilities";
    import SwitchToggle from "../treatment/Toggle";

    /* ================= TYPES ================= */

    type ValidationError = {
    section: string;
    field: string;
    message: string;
    };

    type ValidationResult = {
    valid: boolean;
    errors: ValidationError[];
    };

    interface PricingItem {
    id: number;
    duration: number;
    price: number;
    bold: boolean;
    index: number;
    }

    interface PackagePricingProps {
    branches: { id: number; name: string }[];
    selectedBranchId: number | null;
    showGrid: boolean;
    onSelectBranch: (id: number | null) => void;
    initialData?: any[];
    onChange: (pricing: any[]) => void;
    }

    /* ================= SORTABLE ROW ================= */

function SortableRow({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  item: PricingItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updated: PricingItem) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
const minInputRef = useRef<HTMLInputElement>(null);
  const [duration, setDuration] = useState<string>(String(item.duration));
  const [price, setPrice] = useState<string>(String(item.price));
  const [bold, setBold] = useState(item.bold);

  useEffect(() => {
    if (isEditing) {
      setDuration(String(item.duration));
      setPrice(String(item.price));
      setBold(item.bold);
          setTimeout(() => {
       minInputRef.current?.focus();
     }, 0);
    }
  }, [isEditing, item]);

  const handleCancel = () => {
  // 🔥 restore original values
  setDuration(String(item.duration));
  setPrice(String(item.price));
  setBold(item.bold);
  
  // parent ne bolo edit bandh karo
  onCancel();
};
  return (
    <tr ref={setNodeRef} style={style}>
      {/* DRAG */}
      <td className="px-3 py-3 border-y border-border border-l rounded-tl-[10px] rounded-bl-[10px] w-1 pr-0">
        <GripVertical
          size={18}
          className="text-muted-foreground cursor-grab"
          {...attributes}
          {...listeners}
        />
      </td>

      {/* DURATION */}
      <td className="px-4 py-3 border-y border-border">
        <input
        ref={minInputRef}
          type="number"
          readOnly={!isEditing}
          value={duration}
          onChange={(e) => {
            if (!isEditing) return;
            const val = e.target.value;
            if (val === "") return setDuration("");
            if (/^\d+$/.test(val) && Number(val) > 0) setDuration(val);
          }}
          className="h-10 w-[180px] rounded-lg border px-3 bg-card focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </td>

      {/* PRICE */}
      <td className="px-4 py-3 border-y border-border">
        <input
          type="number"
          readOnly={!isEditing}
          value={price}
          onChange={(e) => {
            if (!isEditing) return;
            const val = e.target.value;
            if (val === "") return setPrice("");
            if (/^\d+$/.test(val) && Number(val) > 0) setPrice(val);
          }}
          className="h-10 w-[180px] rounded-lg border px-3 bg-card focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </td>

      {/* BOLD */}
      <td className="px-4 py-3 border-y border-border">
        <SwitchToggle
          value={bold}
          onChange={() => isEditing && setBold((b) => !b)}
        />
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-3 border-y border-border border-r rounded-tr-[10px] rounded-br-[10px] text-right">
        {isEditing ? (
          <div className="inline-flex gap-2">
            {/* SAVE */}
            <button
              onClick={() =>
                onSave({
                  ...item,
                  duration: Number(duration),
                  price: Number(price),
                  bold,
                })
              }
              className="border rounded-full p-2 text-primary hover:bg-primary/10"
              title="Save"
            >
              <Check size={14} />
            </button>

            {/* CANCEL */}
            <button
               onClick={handleCancel}
              className="border rounded-full p-2 text-muted-foreground hover:bg-muted"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="inline-flex gap-2">
            {/* EDIT */}
            <button
              onClick={onEdit}
              className="border rounded-full p-2 hover:bg-muted"
              title="Edit"
            >
              <Pencil size={14} />
            </button>

            {/* DELETE */}
            <button
              onClick={onDelete}
              className="border rounded-full p-2 text-destructive hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

    /* ================= MAIN COMPONENT ================= */

    export const PackagePricing = forwardRef<
    { validate: () => Promise<ValidationResult> },
    PackagePricingProps
    >(function PackagePricing(
    {
        branches,
        selectedBranchId,
        showGrid,
        onSelectBranch,
        initialData,
        onChange,
    },
    ref
    ) {
    const isInitRef = useRef(true);

    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [bold, setBold] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);

    const [pricingMap, setPricingMap] = useState<
        Record<number, PricingItem[]>
    >({});

    const selectedBranch = branches.find((b) => b.id === selectedBranchId);

    /* ============ VALIDATION ============ */
useImperativeHandle(ref, () => ({
  async validate(): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    if (!branches || branches.length === 0) {
      errors.push({
        section: "Pricing",
        field: "pricing",
        message: "Please select branch before adding pricing",
      });
      return { valid: false, errors };
    }

    const missing = branches.filter(
      (b) => !pricingMap[b.id] || pricingMap[b.id].length === 0
    );

    if (missing.length > 0) {
      errors.push({
        section: "Pricing",
        field: "pricing",
        message: `Please add pricing forall selected branches`,
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
}));

    /* ============ INIT DATA ============ */
    useEffect(() => {
        if (!initialData || initialData.length === 0) {
        isInitRef.current = false;
        return;
        }

        const map: Record<number, PricingItem[]> = {};

        initialData.forEach((p: any, idx: number) => {
        const branchId = p.location_id;

        if (!map[branchId]) map[branchId] = [];

        map[branchId].push({
            id: Date.now() + Math.random(),
              duration: Number(p.duration),
            price: p.price,
            bold: p.is_bold,
            index: idx + 1,
        });
        });

        setPricingMap(map);
        setTimeout(() => (isInitRef.current = false), 0);
    }, [initialData]);

    /* ============ SYNC TO API ============ */
    const syncToApi = (data: Record<number, PricingItem[]>) => {
        if (isInitRef.current) return;

        const payload = Object.entries(data).flatMap(([branchId, items]) =>
        items.map((i) => ({
            location_id: Number(branchId),
             duration: i.duration,
            price: i.price,
            is_bold: i.bold,
            index: i.index,
        }))
        );

        onChange(payload);
    };

    /* ============ SAVE ============ */
   const handleSave = () => {
  if (!selectedBranchId || !duration || !price) return;

  setPricingMap((prev) => {
    let list = [...(prev[selectedBranchId] || [])];

    if (editingId) {
      list = list.map((i, idx) =>
        i.id === editingId
          ? {
              ...i,
              duration: +duration,
              price: +price,
              bold,
              index: idx + 1,
            }
          : i
      );
    } else {
      list.push({
        id: Date.now(),
        duration: +duration,
        price: +price,
        bold,
        index: list.length + 1,
      });
    }

    const updated = { ...prev, [selectedBranchId]: list };
    syncToApi(updated);
    return updated;
  });

  setDuration("");
  setPrice("");
  setBold(false);
  setEditingId(null);
};


    /* ============ DRAG ============ */
    const onDragEnd = (e: any) => {
        if (!selectedBranchId || !e.over) return;

        setPricingMap((prev) => {
        const items = prev[selectedBranchId];
        const reordered = arrayMove(
            items,
            items.findIndex((i) => i.id === e.active.id),
            items.findIndex((i) => i.id === e.over.id)
        ).map((i, idx) => ({ ...i, index: idx + 1 }));

        const updated = { ...prev, [selectedBranchId]: reordered };
        syncToApi(updated);
        return updated;
        });
    };

    /* ============ UI ============ */
    return (
        <>
        {showGrid && (
            <BranchGrid
            branches={branches}
            selectedId={selectedBranchId}
            onSelect={onSelectBranch}
            />
        )}

        {!showGrid && selectedBranchId && (
            <div className="space-y-10">
              <div>
            <h3 className="text-xl font-semibold mb-[25px]">
                {selectedBranch?.name} Pricing
            </h3>

            {/* ADD FORM */}
         {/* ADD / EDIT FORM */}
                <h2 className="mb-4 text-lg font-semibold text-foreground">
            {editingId ? "Edit Pricing" : "Add Pricing"}   <sup className="text-destructive">*</sup>
          </h2>

                    <div className="grid grid-cols-12">
                    <div className="col-span-12">
                        <div className="w-full rounded-[10px] border border-border bg-card p-5 overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0">
                            <tbody>
                           <tr className="
                            grid grid-cols-1 sm:grid-cols-2 sm:gap-4
                            xl:table-row xl:grid-cols-none
                          " >
                                {/* MIN */}
                                <td className="px-4 py-3 border-input border-y xl:rounded-tl-[10px] xl:rounded-bl-[10px]">
                                <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
                                <span className="text-sm text-foreground">Duration</span>
                                        <input
                                        type="number"
                                        min={1}
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="00"
                                        className="h-10 w-full xl:w-[180px] rounded-lg border border-input bg-card px-3 text-sm  focus:outline-none focus:ring-2 focus:ring-ring/20"
                                        />

                                </div>
                                </td>

                                {/* PRICE */}
                                <td className="px-4 py-3 border-input border-y">
                                <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
                                    <span className="text-sm text-foreground">Price</span>
                                    <input
                                    type="number"
                                    min={1}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="£00"
                                    className="h-10 w-full xl:w-[180px] rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
                                    />
                                </div>
                                </td>

                                {/* BOLD */}
                                <td className="px-4 py-3 border-input border-y">
                                <div className="flex items-center justify-between xl:justify-start gap-3">
                                    <span className="text-sm text-foreground">Bold</span>
                                    <SwitchToggle
                                    value={bold}
                                    onChange={() => setBold(!bold)}
                                    />
                                </div>
                                </td>

                                {/* ACTION */}
                                <td className="px-4 py-3 border-input border-y xl:border-r xl:rounded-tr-[10px] xl:rounded-br-[10px]">
                                <div className="flex justify-end xl:justify-center">
                                    <button
                                    onClick={handleSave}
                                    className="inline-flex h-9 w-full xl:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button hover:opacity-90 transition"
                                    >
                                    <img src="/send.svg" alt="send" className="h-4 w-4" />
                                    </button>
                                </div>
                                </td>

                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
              </div>

        <h2 className="mb-4 text-lg font-semibold text-foreground">
            Pricing List
          </h2>
            {/* MOBILE / TABLET CARDS */}
        <div className="space-y-3 xl:hidden">
        {(pricingMap[selectedBranchId] || []).map((item) => (
            <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
          {/* DURATION */}
<div className="flex items-center justify-between">
  <span className="text-sm text-muted-foreground">Duration</span>

  {editingId === item.id ? (
    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      className="h-9 w-24 rounded-md border px-2 text-sm"
    />
  ) : (
    <span className="font-medium">{item.duration} min</span>
  )}
</div>

{/* PRICE */}
<div className="flex items-center justify-between">
  <span className="text-sm text-muted-foreground">Price</span>

  {editingId === item.id ? (
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="h-9 w-24 rounded-md border px-2 text-sm"
    />
  ) : (
    <span className="font-medium">£{item.price}</span>
  )}
</div>

{/* BOLD */}
<div className="flex items-center justify-between">
  <span className="text-sm text-muted-foreground">Bold</span>

  <SwitchToggle
    value={editingId === item.id ? bold : item.bold}
    onChange={() => editingId === item.id && setBold((b) => !b)}
  />
</div>

{/* ACTIONS */}
<div className="flex justify-end gap-2 pt-2">
  {editingId === item.id ? (
    <>
      {/* SAVE */}
      <button
        onClick={() => {
          setPricingMap((prev) => {
            const updated = {
              ...prev,
              [selectedBranchId]: prev[selectedBranchId].map((i, idx) =>
                i.id === item.id
                  ? {
                      ...i,
                      duration: Number(duration),
                      price: Number(price),
                      bold,
                      index: idx + 1,
                    }
                  : i
              ),
            };
            syncToApi(updated);
            return updated;
          });
          setEditingId(null);
        }}
        className="border rounded-full p-2 text-primary hover:bg-primary/10"
      >
        <Check size={16} />
      </button>

      {/* CANCEL */}
      <button
        onClick={() => {
          setDuration(String(item.duration));
          setPrice(String(item.price));
          setBold(item.bold);
          setEditingId(null);
        }}
        className="border rounded-full p-2 hover:bg-muted"
      >
        <X size={16} />
      </button>
    </>
  ) : (
    <>
      {/* EDIT */}
      <button
        onClick={() => {
          setDuration(String(item.duration));
          setPrice(String(item.price));
          setBold(item.bold);
          setEditingId(item.id);
        }}
        className="border rounded-full p-2 hover:bg-muted"
      >
        <Pencil size={16} />
      </button>

      {/* DELETE */}
      <button
        onClick={() =>
          setPricingMap((p) => {
            const updated = {
              ...p,
              [selectedBranchId]: p[selectedBranchId].filter(
                (i) => i.id !== item.id
              ),
            };
            syncToApi(updated);
            return updated;
          })
        }
        className="border rounded-full p-2 text-destructive hover:bg-destructive/10"
      >
        <Trash2 size={16} />
      </button>
    </>
  )}
</div>

            </div>
        ))}
        </div>

            <div className="hidden xl:block">
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext
                items={(pricingMap[selectedBranchId] || []).map((i) => i.id)}
                strategy={verticalListSortingStrategy}
                >
                <table className="w-full border-separate border-spacing-y-2">
                    <tbody>
                    {/* {(pricingMap[selectedBranchId] || []).map((item) => (
                        <SortableRow
                        key={item.id}
                        item={item}
                        onEdit={() => {
                            setDuration(String(item.duration));
                            setPrice(String(item.price));
                            setBold(item.bold);
                            setEditingId(item.id);
                        }}
                        onDelete={() =>
                            setPricingMap((p) => {
                            const updated = {
                                ...p,
                                [selectedBranchId]: p[selectedBranchId].filter(
                                (i) => i.id !== item.id
                                ),
                            };
                            syncToApi(updated);
                            return updated;
                            })
                        }
                        />
                    ))} */}
                    {(pricingMap[selectedBranchId] || []).map((item) => (
                      <SortableRow
                        key={item.id}
                        item={item}
                        isEditing={editingRowId === item.id}
                        onEdit={() => setEditingRowId(item.id)}
                        onCancel={() => setEditingRowId(null)}
                        onSave={(updated) => {
                          setPricingMap((prev) => {
                            const updatedMap = {
                              ...prev,
                              [selectedBranchId]: prev[selectedBranchId].map((i) =>
                                i.id === updated.id ? updated : i
                              ),
                            };
                            syncToApi(updatedMap);
                            return updatedMap;
                          });
                          setEditingRowId(null);
                        }}
                        onDelete={() => {
                          setPricingMap((prev) => {
                            const updated = {
                              ...prev,
                              [selectedBranchId]: prev[selectedBranchId].filter(
                                (i) => i.id !== item.id
                              ),
                            };
                            syncToApi(updated);
                            return updated;
                          });
                        }}
                      />
                    ))}
                    </tbody>
                </table>
                </SortableContext>
            </DndContext>
            </div>
            </div>
        )}
        </>
    );
    });
