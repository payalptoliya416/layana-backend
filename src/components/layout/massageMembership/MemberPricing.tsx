"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import MemberSHipGrid from "./MemberSHipGrid";
import ActionsDropdown from "@/components/treatment/ActionsDropdown";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

export interface MembershipPricingItem {
  duration: number;
  offer_price: number;
  each_price: number;
  price: number;
  index: number;
  location_id: number;
}

interface UIPricing extends MembershipPricingItem {
  id: string;
}

interface Branch {
  id: number;
  name: string;
}

type ValidationResult = {
  valid: boolean;
  errors: { section: string; field: string; message: string }[];
};

/* ================= SORTABLE ROW ================= */

function PricingSortableRow({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: UIPricing;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* ================= DESKTOP ROW ================= */}
      <div
        className={cn(
          "hidden xl:flex items-center px-4 py-3 mx-4 my-1 rounded-xl",
          index % 2 === 0 ? "bg-card" : "bg-muted",
          "hover:bg-muted/70"
        )}
      >
        <div className="w-[20%]">{item.duration} min</div>
        <div className="w-[20%]">£{item.offer_price}</div>
        <div className="w-[20%]">£{item.each_price}</div>
        <div className="w-[20%]">£{item.price}</div>

        {/* ACTIONS */}
        <div className="w-[120px] flex justify-end">
           <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="h-7 w-7 rounded-full border flex items-center justify-center"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              className="h-7 w-7 rounded-full border flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="xl:hidden mx-3 my-2 rounded-xl border bg-card p-4 space-y-2">
        <div className="flex justify-between items-start">

          <div className="flex-1 ml-3 space-y-1">
            <p className="font-medium">
              {item.duration} min
            </p>
            <p className="text-sm text-muted-foreground">
              Offer: £{item.offer_price}
            </p>
            <p className="text-sm text-muted-foreground">
              Each: £{item.each_price}
            </p>
            <p className="text-sm text-muted-foreground">
              Price: £{item.price}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="h-7 w-7 rounded-full border flex items-center justify-center"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              className="h-7 w-7 rounded-full border flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ================= MAIN COMPONENT ================= */

const MemberPricing = forwardRef<
  { validate: () => Promise<ValidationResult> },
  {
    branches: Branch[];
    selectedBranchId: number | null;
    onSelectBranch: (id: number | null) => void;
    value: MembershipPricingItem[];
    onChange: (v: MembershipPricingItem[]) => void;
  }
>(function MemberPricing(
  { branches, selectedBranchId, onSelectBranch, value, onChange },
  ref
) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const [duration, setDuration] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [eachPrice, setEachPrice] = useState("");
  const [price, setPrice] = useState("");

  /* ---------- UI DATA ---------- */
  const filteredPricing = value.filter(
  (p) => p.location_id === selectedBranchId
);

//   const uiPricing: UIPricing[] = filteredPricing.map((p, i) => ({
//     ...p,
//     id: i,
//   }));
const uiPricing: UIPricing[] = filteredPricing.map((p, i) => ({
  ...p,
  id: `${p.location_id}-${i}`,
}));

  /* ---------- VALIDATION ---------- */
 useImperativeHandle(ref, () => ({
  async validate() {
    const errors: ValidationResult["errors"] = [];

    // 🟥 No branch selected at all
    if (!branches || branches.length === 0) {
      errors.push({
        section: "Pricing",
        field: "branch",
        message: "Please select at least one branch",
      });
      return { valid: false, errors };
    }

    // 🧠 All selected branch ids
    const selectedBranchIds = branches.map((b) => b.id);

    // 🧠 Branches which have pricing
    const branchIdsWithPricing = Array.from(
      new Set(value.map((p) => p.location_id))
    );

    // 🟥 Find missing pricing branches
    const missingBranches = selectedBranchIds.filter(
      (id) => !branchIdsWithPricing.includes(id)
    );

    if (missingBranches.length > 0) {
      errors.push({
        section: "Pricing",
        field: "pricing",
        message: "Please add pricing for all selected branches",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
}));

  /* ---------- ADD / UPDATE ---------- */
  const handleSave = () => {
    if (!duration || !offerPrice || !eachPrice || !price) return;

    const newItem: MembershipPricingItem = {
      duration: Number(duration),
      offer_price: Number(offerPrice),
      each_price: Number(eachPrice),
      price: Number(price),
      index: editingId ?? value.length + 1,
       location_id: selectedBranchId,  
    };

    if (editingId !== null) {
      onChange(value.map((v, i) => (i === editingId ? newItem : v)));
    } else {
      onChange([...value, newItem]);
    }

    setEditingId(null);
    setDuration("");
    setOfferPrice("");
    setEachPrice("");
    setPrice("");
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (index: number) => {
  const p = filteredPricing[index];
  if (!p) return;

  setDuration(String(p.duration));
  setOfferPrice(String(p.offer_price));
  setEachPrice(String(p.each_price));
  setPrice(String(p.price));

  const globalIndex = value.findIndex(
    (x) => x === p
  );
  setEditingId(globalIndex);
};

  /* ---------- DELETE ---------- */
  const handleDelete = (index: number) => {
  const item = filteredPricing[index];
  onChange(value.filter((v) => v !== item));
};

  /* ---------- REORDER ---------- */
const handleDragEnd = (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const updated = arrayMove(
    filteredPricing,
    Number(active.id.split("-")[1]),
    Number(over.id.split("-")[1])
  );

  const others = value.filter(
    (v) => v.location_id !== selectedBranchId
  );

  onChange([...others, ...updated]);
};

  const selectedBranch = branches.find(
    (b) => b.id === selectedBranchId
  );

  /* ================= UI ================= */

  return (
    <>
      {/* STEP 1: BRANCH SELECT */}
      {selectedBranchId === null && (
        <MemberSHipGrid
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
        {editingId !== null ? "Edit Pricing" : "Add Pricing"}
        <sup className="text-destructive">*</sup>
      </h2>

      {/* FORM */}
      <div className="grid grid-cols-12">
        <div className="col-span-12">
        <div className="w-full rounded-[10px] border border-border bg-card p-5 overflow-x-hidden">
  <table className="w-full table-fixed border-separate border-spacing-0">
    <tbody>
      <tr className="grid grid-cols-2 gap-3 xl:table-row">

        {/* DURATION */}
        <td className="xl:table-cell border-y border-input xl:border-l xl:rounded-tl-[10px] xl:rounded-bl-[10px] p-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-foreground">Duration</span>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Min"
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
            />
          </div>
        </td>

        {/* OFFER */}
        <td className="xl:table-cell border-y border-input p-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-foreground">Offer</span>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="£00"
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
            />
          </div>
        </td>

        {/* EACH */}
        <td className="xl:table-cell border-y border-input p-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-foreground">Each</span>
            <input
              type="number"
              value={eachPrice}
              onChange={(e) => setEachPrice(e.target.value)}
              placeholder="£00"
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
            />
          </div>
        </td>

        {/* PRICE */}
        <td className="xl:table-cell border-y border-input p-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-foreground">Price</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="£00"
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
            />
          </div>
        </td>

        {/* ACTION */}
        <td className="xl:table-cell border-y border-input xl:border-r xl:rounded-tr-[10px] xl:rounded-br-[10px] p-3 col-span-2 xl:col-span-1">
          <div className="flex justify-end xl:justify-center h-full items-end">
            <button
              onClick={handleSave}
              className="inline-flex h-10 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <img src="/send.svg" className="h-4 w-4" />
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
{ uiPricing.length > 0 && (

     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext
    items={uiPricing.map((i) => i.id)}
    strategy={verticalListSortingStrategy}
  >
    <div className="grid grid-cols-12">
      <div className="col-span-12">

        {/* ===== HEADER (DESKTOP) ===== */}
        <div className="sticky top-0 z-[9] bg-card border-b hidden xl:flex items-center h-[52px] px-4 text-sm font-medium text-primary mx-3">
              {/* <div className="w-10" ></div> */}
          <div className="w-[20%]">Duration</div>
          <div className="w-[20%]">Offer</div>
          <div className="w-[20%]">Each</div>
          <div className="w-[20%]">Price</div>
          <div className="w-[120px] text-right pr-4">Actions</div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {uiPricing.map((item, index) => (
            <PricingSortableRow
              key={item.id}
              item={item}
              index={index}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>

      </div>
    </div>
  </SortableContext>
</DndContext>
)}

    </div>
  </div>
)}

    </>
  );
});

MemberPricing.displayName = "MemberPricing";
export default MemberPricing;
