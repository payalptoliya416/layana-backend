  import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
  import { GripVertical, Send } from "lucide-react";
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

function SortableRow({
  item,
  onEdit,
  onDelete,
}: {
  item: PricingItem;
  onEdit: () => void;
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
        readOnly
        value={item.min}
        className="
          h-10 w-[180px]
          rounded-lg
          border border-input
          bg-card
          px-3
          text-sm
          text-foreground
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
        readOnly
        value={`£${item.price}`}
        className="
          h-10 w-[180px]
          rounded-lg
          border border-input
          bg-card
          px-3
          text-sm
          text-foreground
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

      <SwitchToggle value={item.bold} onChange={() => {}} />
    </div>
  </td>

  {/* ACTIONS */}
  <td className="px-4 py-3 border-y border-border border-r rounded-tr-[10px] rounded-br-[10px] text-right">
    <ActionsDropdown onEdit={onEdit} onDelete={onDelete} />
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
  onSelectBranch: (id: number | null) => void;
  initialData?: any[]; // ✅ ADD
  onChange: (pricing: any[]) => void;
}

export const Pricing = forwardRef<
  { validate: () => boolean },
  PricingProps
>(function Pricing(
  {
    branches,
    selectedBranchId,
    onSelectBranch,
    onChange,
    initialData,
  },
  ref
) {

    const isInitializingRef = useRef(true);
    /* ---------- ADD FORM STATES ---------- */
    const [minute, setMinute] = useState("");
    const [price, setPrice] = useState("");
    const [bold, setBold] = useState(false);
const [errors, setErrors] = useState<{
  branch?: string;
  pricing?: string;
}>({});

    /* ---------- EDIT STATE ---------- */
    const [editingId, setEditingId] = useState<number | null>(null);
useImperativeHandle(ref, () => ({
  validate() {
    const newErrors: {
      branch?: string;
      pricing?: string;
    } = {};

    if (!selectedBranchId) {
      newErrors.branch = "Please select a branch";
    }

    const hasAnyPricing =
      Object.values(pricingMap).some(
        (items) => items.length > 0
      );

    if (!hasAnyPricing) {
      newErrors.pricing = "Please add at least one pricing";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
      if (!selectedBranchId || !minute || !price) return;

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
        {selectedBranchId === null && (
          <BranchGrid
            branches={branches}
            selectedId={selectedBranchId}
            onSelect={onSelectBranch}
          />
        )}

        {/* STEP 2: PRICING */}
        {selectedBranchId !== null && (
         <div className="space-y-10">
  {/* HEADER */}
  <div>
    <h3 className="font-medium text-xl mb-[25px] text-foreground">
      {selectedBranch?.name} Pricing
    </h3>

    <h2 className="mb-4 text-lg font-semibold text-foreground">
      {editingId ? "Edit Pricing" : "Add Pricing"}
      <sup className="text-destructive">*</sup>
    </h2>

    {/* FORM */}
    <div className="rounded-[10px] border border-border bg-card p-5 overflow-x-auto">
      <table className="w-full border-separate">
        <tbody>
          <tr className="rounded-[10px]">
            {/* MIN */}
            <td className="px-4 py-3 border-y border-input border-l rounded-tl-[10px] rounded-bl-[10px]">
              <div className="flex items-center gap-3">
                <span className="text-sm whitespace-nowrap text-foreground">
                  Min
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={minute}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setMinute(val);
                  }}
                  placeholder="00"
                  className="
                    h-10 w-[180px] rounded-lg
                    border border-input
                    bg-card
                    px-3 text-sm text-foreground
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring/20
                  "
                />
              </div>
            </td>

            {/* PRICE */}
            <td className="px-4 py-3 border-y border-input">
              <div className="flex items-center gap-3">
                <span className="text-sm whitespace-nowrap text-foreground">
                  Price
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setPrice(val);
                  }}
                  placeholder="£00"
                  className="
                    h-10 w-[180px] rounded-lg
                    border border-input
                    bg-card
                    px-3 text-sm text-foreground
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring/20
                  "
                />
              </div>
            </td>

            {/* BOLD */}
            <td className="px-4 py-3 border-y border-input">
              <div className="flex items-center gap-3">
                <span className="text-sm whitespace-nowrap text-foreground">
                  Bold
                </span>
                <SwitchToggle
                  value={bold}
                  onChange={() => setBold(!bold)}
                />
              </div>
            </td>

            {/* ACTION */}
            <td className="px-4 py-3 text-right border-y border-input border-r rounded-tr-[10px] rounded-br-[10px]">
              <button
                onClick={handleSave}
                className="
                  inline-flex h-9 w-12 items-center justify-center
                  rounded-full
                  bg-primary text-primary-foreground
                  shadow-button
                  hover:opacity-90
                  transition
                "
              >
                <img src="/send.svg" alt="send" className="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  {errors.branch && (
    <p className="text-sm text-destructive mt-2">
      {errors.branch}
    </p>
  )}

  {/* LIST */}
  <div>
    <h2 className="mb-4 text-lg font-semibold text-foreground">
      Pricing List
    </h2>

    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={(pricingMap[selectedBranchId] || []).map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className="w-full border-separate border-spacing-y-3">
          <tbody>
            {(pricingMap[selectedBranchId] || []).map((item) => (
              <SortableRow
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>

    {errors.pricing && (
      <p className="text-sm text-destructive mb-2">
        {errors.pricing}
      </p>
    )}
  </div>
</div>

        )}
      </>
    );
  })
