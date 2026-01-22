  import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
  import { Check, GripVertical, Pencil, Send, Trash2, X } from "lucide-react";
  import SwitchToggle from "./Toggle";
  import ActionsDropdown from "./ActionsDropdown";
  import BranchGrid from "../branches/BranchGrid";
import { arrayMove } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ValidationError = {
  section: string;
  field: string;
  message: string;
};

type ValidationResult = {
  valid: boolean;
   errors: { section: string; field: string; message: string }[];
};

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

 const [min, setMin] = useState<string>(String(item.min));
const [price, setPrice] = useState<string>(String(item.price));
  const [bold, setBold] = useState(item.bold);

useEffect(() => {
  if (isEditing) {
    setMin(String(item.min));
    setPrice(String(item.price));
    setBold(item.bold);
  }
}, [isEditing, item]);

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

      {/* MIN */}
      <td className="px-4 py-3 border-y border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            Min
          </span>

          <input
            type="number"
            readOnly={!isEditing}
            value={min}
             onChange={(e) => {
    if (!isEditing) return;
    const val = e.target.value;
    if (val === "") return setMin("");
    if (/^\d+$/.test(val) && Number(val) > 0) {
      setMin(val);
    }
  }}
            className="
              h-10 w-[180px]
              rounded-lg
              border border-input
              bg-card
              px-3
              text-sm
              text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20
            "
          />
        </div>
      </td>

      {/* PRICE */}
      <td className="px-4 py-3 border-y border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            Price
          </span>

          <input
            type="number"
            readOnly={!isEditing}
            value={price}
            onChange={(e) => {
    if (!isEditing) return;
    const val = e.target.value;
    if (val === "") return setPrice("");
    if (/^\d+$/.test(val) && Number(val) > 0) {
      setPrice(val);
    }
  }}
            className="
              h-10 w-[180px]
              rounded-lg
              border border-input
              bg-card
              px-3
              text-sm
              text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring/20
            "
          />
        </div>
      </td>

      {/* BOLD */}
      <td className="px-4 py-3 border-y border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            Bold
          </span>

          <SwitchToggle
            value={bold}
              onChange={() => {
    if (!isEditing) return;
    setBold((prev) => !prev);
  }}
          />
        </div>
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-3 border-y border-border border-r rounded-tr-[10px] rounded-br-[10px] text-right">
  {isEditing ? (
    <div className="inline-flex gap-2">
      {/* SAVE */}
      <button
        onClick={() => onSave({ ...item,  min: Number(min),
      price: Number(price), bold })}
        className="border rounded-full p-2 text-primary hover:bg-primary/10"
        title="Save"
      >
        <Check size={14} />
      </button>

      {/* CANCEL */}
      <button
        onClick={onCancel}
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
  interface PricingItem {
  id: number;
  min: number;
  price: number;
  bold: boolean;
   index: number; 
}
 interface PricingProps {
  branches: { id: number; name: string }[];
  selectedBranchId: number | null;
    showGrid: boolean;  
  onSelectBranch: (id: number | null) => void;
  initialData?: any[]; // ✅ ADD
  onChange: (pricing: any[]) => void;
  category: string;
}

export const Pricing = forwardRef<
  { validate: () => Promise<ValidationResult> },
  PricingProps
>(function Pricing(
  {
    branches,
    selectedBranchId,
    onSelectBranch,
    onChange,
    initialData,
    showGrid,
    category
  },
  ref
) {
    const isInitializingRef = useRef(true);
    /* ---------- ADD FORM STATES ---------- */
    const [minute, setMinute] = useState("");
    const [price, setPrice] = useState("");
    const [bold, setBold] = useState(false);

    /* ---------- EDIT STATE ---------- */
    const [editingId, setEditingId] = useState<number | null>(null);
const [editingRowId, setEditingRowId] = useState<number | null>(null);

// }));
useImperativeHandle(ref, () => ({
  async validate(): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // 🔴 No branches at all
    if (!branches || branches.length === 0) {
      errors.push({
        section: "Pricing",
        field: "branch",
        message: "No branches available",
      });
    }

    // 🔴 Check EACH branch has pricing
    const branchesWithoutPricing = branches.filter((branch) => {
      const items = pricingMap[branch.id];
      return !items || items.length === 0;
    });

    if (branchesWithoutPricing.length > 0) {
      errors.push({
        section: "Pricing",
        field: "pricing",
        message: `Please add pricing for all branches (${branchesWithoutPricing
          .map((b) => b.name)
          .join(", ")})`,
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
}));

    /* ---------- BRANCH WISE PRICING ---------- */
    const [pricingMap, setPricingMap] = useState<
      Record<number, PricingItem[]>
    >({});
    const selectedBranch = branches.find(
      (b) => b.id === selectedBranchId
    );

  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      isInitializingRef.current = false;
      return;
    }

    isInitializingRef.current = true;

    const map: Record<number, PricingItem[]> = {};

    initialData.forEach((p: any, idx: number) => {
      const branchId = p.location.id;

      if (!map[branchId]) map[branchId] = [];

      map[branchId].push({
        id: Date.now() + Math.random(),
        min: p.location.minute,
        price: p.location.price,
        bold: p.location.is_bold,
        index: p.index ?? idx + 1, // ✅ FIX
      });
    });

    setPricingMap(map);

    setTimeout(() => {
      isInitializingRef.current = false;
    }, 0);
  }, [initialData]);

    /* ---------- BUILD API PAYLOAD ---------- */
 const syncToApi = (data: Record<number, PricingItem[]>) => {
  if (isInitializingRef.current) return;

  const apiPricing = Object.entries(data).flatMap(
    ([branchId, items]) =>
      items.map((i) => ({
        location: {
          id: Number(branchId),
          minute: i.min,
          price: i.price,
          is_bold: i.bold,
        },
        index: i.index, // ✅ correct
      }))
  );

  onChange(apiPricing);
};

    /* ---------- ADD / UPDATE ---------- */
    const handleSave = () => {
        if (!selectedBranchId) return;
  if (!minute || Number(minute) <= 0) return;
  if (!price || Number(price) <= 0) return;

      setPricingMap((prev) => {
        let updatedItems = [...(prev[selectedBranchId] || [])];

        if (editingId) {
          // ✏️ UPDATE
         updatedItems = updatedItems.map((i, idx) =>
  i.id === editingId
    ? {
        ...i,
        min: Number(minute),
        price: Number(price),
        bold,
        index: idx + 1, // ✅ FIX
      }
    : i
);

        } else {
          // ➕ ADD
          updatedItems.push({
  id: Date.now(),
  min: Number(minute),
  price: Number(price),
  bold,
  index: updatedItems.length + 1, // ✅ FIX
});
        }

        const updated = {
          ...prev,
          [selectedBranchId]: updatedItems,
        };

        syncToApi(updated);
        return updated;
      });

      // reset
      setMinute("");
      setPrice("");
      setBold(false);
      setEditingId(null);
    };

    const handleInlineSave = (updatedItem: PricingItem) => {
  if (!selectedBranchId) return;

  setPricingMap((prev) => {
    const updated = {
        ...prev,
        [selectedBranchId]: prev[selectedBranchId].map((i) =>
          i.id === updatedItem.id ? updatedItem : i
        ),
      };

      syncToApi(updated);
      return updated;
    });

    setEditingRowId(null);
  };

    /* ---------- EDIT ---------- */
    const handleEdit = (item: PricingItem) => {
      setMinute(String(item.min));
      setPrice(String(item.price));
      setBold(item.bold);
      setEditingId(item.id);
    };

    /* ---------- DELETE ---------- */
    const handleDelete = (id: number) => {
      if (!selectedBranchId) return;

      setPricingMap((prev) => {
        const updated = {
          ...prev,
          [selectedBranchId]: prev[selectedBranchId]?.filter(
            (i) => i.id !== id
          ),
        };

        syncToApi(updated);
        return updated;
      });
    };
const handleDragEnd = (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;
  if (!selectedBranchId) return;

  setPricingMap((prev) => {
    const items = prev[selectedBranchId] || [];

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex).map(
      (item, idx) => ({
        ...item,
        index: idx + 1,
      })
    );

    const updated = {
      ...prev,
      [selectedBranchId]: reordered,
    };

    syncToApi(updated);
    return updated;
  });
};

    /* =================================================== */
    return (
      <>
        {/* STEP 1: BRANCH SELECT */}
        {showGrid && (
          <BranchGrid
            branches={branches}
            selectedId={selectedBranchId}
            onSelect={onSelectBranch}
          />
        )}

        {/* STEP 2: PRICING */}
     {!showGrid && selectedBranchId !== null && (
         <div className="space-y-10">
  {/* HEADER */}
  <div>
    <h3 className="font-medium text-xl mb-[25px] text-foreground">
      {selectedBranch?.name} Pricing
    </h3>

    <h2 className="mb-4 text-lg font-semibold text-foreground">
      {editingId ? "Edit Pricing" : "Add Pricing"}   <sup className="text-destructive">*</sup>
    </h2>
          <div className="grid grid-cols-12">
  <div className="col-span-12">
    <div className="w-full rounded-[10px] border border-border bg-card p-5 overflow-hidden">
      <table className="w-full border-separate border-spacing-0">
        <tbody>
          <tr className="grid grid-cols-1 gap-4 xl:table-row">

            {/* MIN */}
            <td className="px-4 py-3  border-input border-y 
              xl:rounded-tl-[10px] xl:rounded-bl-[10px]">
              <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
                <span className="text-sm text-foreground">Min</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={minute}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setMinute("");
                      return;
                    }
                    if (/^\d+$/.test(val) && Number(val) > 0) {
                      setMinute(val);
                    }
                  }}
                  placeholder="00"
                  className="h-10 w-full xl:w-[180px] rounded-lg
                    border border-input bg-card px-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-ring/20"
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
                  step={1}
                  value={price}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setPrice("");
                      return;
                    }
                    if (/^\d+$/.test(val) && Number(val) > 0) {
                      setPrice(val);
                    }
                  }}
                  placeholder="£00"
                  className="h-10 w-full xl:w-[180px] rounded-lg
                    border border-input bg-card px-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-ring/20"
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
            <td className="px-4 py-3 border-input border-y xl:border-r
              xl:rounded-tr-[10px] xl:rounded-br-[10px]">
              <div className="flex justify-end xl:justify-center">
                <button
                  onClick={handleSave}
                  className="inline-flex h-9 w-full xl:w-12 items-center justify-center
                    rounded-full bg-primary text-primary-foreground
                    shadow-button hover:opacity-90 transition"
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

  {/* LIST */}
  <div>
    <h2 className="mb-4 text-lg font-semibold text-foreground">
      Pricing List
    </h2>
    <div className="space-y-3 xl:hidden">
  {(pricingMap[selectedBranchId] || []).map((item) => {
    const isEditing = editingRowId === item.id;

    return (
      <div
        key={item.id}
        className="rounded-xl border border-border bg-card p-4 space-y-3"
      >
          {/* MIN */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Min</span>

            {isEditing ? (
             <input
            type="number"
            value={item.min === 0 ? "" : item.min}
            onChange={(e) => {
              const val = e.target.value;

              setPricingMap((prev) => ({
                ...prev,
                [selectedBranchId!]: prev[selectedBranchId!].map((i) => {
                  if (i.id !== item.id) return i;

                  // ✅ allow clear
                  if (val === "") {
                    return { ...i, min: 0 };
                  }

                  // ✅ allow only > 0
                  if (/^\d+$/.test(val) && Number(val) > 0) {
                    return { ...i, min: Number(val) };
                  }

                  return i;
                }),
              }));
            }}
            className="h-9 w-[120px] rounded-lg border border-input px-2 text-sm"
          />

            ) : (
              <span className="font-medium">{item.min}</span>
            )}
          </div>

          {/* PRICE */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>

            {isEditing ? (
             <input
                type="number"
                value={item.price === 0 ? "" : item.price}
                onChange={(e) => {
                  const val = e.target.value;

                  setPricingMap((prev) => ({
                    ...prev,
                    [selectedBranchId!]: prev[selectedBranchId!].map((i) => {
                      if (i.id !== item.id) return i;

                      if (val === "") {
                        return { ...i, price: 0 };
                      }

                      if (/^\d+$/.test(val) && Number(val) > 0) {
                        return { ...i, price: Number(val) };
                      }

                      return i;
                    }),
                  }));
                }}
                className="h-9 w-[120px] rounded-lg border border-input px-2 text-sm"
              />

            ) : (
              <span className="font-medium">£{item.price}</span>
            )}
          </div>

        {/* BOLD */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Bold</span>
          <SwitchToggle
            value={item.bold}
            onChange={() =>
              isEditing &&
              setPricingMap((prev) => ({
                ...prev,
                [selectedBranchId!]: prev[selectedBranchId!].map((i) =>
                  i.id === item.id ? { ...i, bold: !i.bold } : i
                ),
              }))
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          {isEditing ? (
            <>
              {/* SAVE */}
              <button
                onClick={() => {
                  handleInlineSave(item);
                  setEditingRowId(null);
                }}
                className="border rounded-full p-2 text-primary hover:bg-primary/10"
              >
                <Check size={16} />
              </button>

              {/* CANCEL */}
              <button
                onClick={() => setEditingRowId(null)}
                className="border rounded-full p-2 hover:bg-muted"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              {/* EDIT */}
              <button
                onClick={() => setEditingRowId(item.id)}
                className="border rounded-full p-2 hover:bg-muted"
              >
                <Pencil size={16} />
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(item.id)}
                className="border rounded-full p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  })}
</div>

  <div className="hidden xl:block">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(pricingMap[selectedBranchId] || []).map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="w-full overflow-x-auto overflow-y-visible relative z-10 min-h-[300px]">
                    <table className="w-full border-separate border-spacing-y-3">
                      <tbody>
                        {(pricingMap[selectedBranchId] || []).map((item) => (
                       <SortableRow
                          item={item}
                          isEditing={editingRowId === item.id}
                          onEdit={() => setEditingRowId(item.id)}
                          onCancel={() => setEditingRowId(null)}
                          onSave={handleInlineSave}
                          onDelete={() => handleDelete(item.id)}
                        />
                        ))}
                      </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </SortableContext>
      </DndContext>
  </div>
  
    </div>
</div>
        )}
      </>
    );
  })
