    import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    } from "react";
    import { GripVertical } from "lucide-react";
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
    import ActionsDropdown from "../treatment/ActionsDropdown";

  
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
  treatment: string;
  price: number;
  offerPrice: number;
  bold: boolean;
  index: number;
}

interface PromotionItem {
  id: number;
  treatment: string;
  label: string;
  offerPrice: number;
}

interface PricesPriceProps {
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
  onEdit,
  onDelete,
}: {
  item: PricingItem;
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
    <tr ref={setNodeRef} style={style}>
      <td className="px-3 py-3 border-y border-border border-l rounded-tl-[10px] rounded-bl-[10px] w-1 pr-0">
        <GripVertical
          size={18}
          className="text-muted-foreground cursor-grab"
          {...attributes}
          {...listeners}
        />
      </td>

      <td className="px-4 py-3 border-y border-border">
        <input
          readOnly
          value={item.treatment}
          className="h-10 w-[220px] rounded-lg border border-input bg-card px-3 text-sm"
        />
      </td>

      <td className="px-4 py-3 border-y border-border">
        <input
          readOnly
          value={`£${item.price}`}
          className="h-10 w-[160px] rounded-lg border border-input bg-card px-3 text-sm"
        />
      </td>

      <td className="px-4 py-3 border-y border-border">
        <input
          readOnly
          value={`£${item.offerPrice}`}
          className="h-10 w-[160px] rounded-lg border border-input bg-card px-3 text-sm"
        />
      </td>

      {/* <td className="px-4 py-3 border-y border-border">
        <SwitchToggle value={item.bold} onChange={() => {}} />
      </td> */}

      <td className="px-4 py-3 border-y border-border border-r rounded-tr-[10px] rounded-br-[10px] text-right">
        <ActionsDropdown onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

    /* ================= MAIN COMPONENT ================= */

    export const PricesPrice = forwardRef<
    { validate: () => Promise<ValidationResult> },
    PricesPriceProps
    >(function PricesPrice(
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

  const [treatment, setTreatment] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [bold, setBold] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [pricingMap, setPricingMap] = useState<Record<number, PricingItem[]>>({});

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
const [promotionMap, setPromotionMap] = useState<Record<number, PromotionItem[]>>(
  {}
);
  useImperativeHandle(ref, () => ({
    async validate() {
      const errors: ValidationError[] = [];

      const missing = branches.filter(
        (b) => !pricingMap[b.id] || pricingMap[b.id].length === 0
      );

      if (missing.length > 0) {
        errors.push({
          section: "Pricing",
          field: "pricing",
          message: "Please add pricing for all branches",
        });
      }

      return { valid: errors.length === 0, errors };
    },
  }));

  useEffect(() => {
    if (!initialData) {
      isInitRef.current = false;
      return;
    }

    const map: Record<number, PricingItem[]> = {};
    initialData.forEach((p: any, idx: number) => {
      const branchId = p.location_id;
      if (!map[branchId]) map[branchId] = [];

      map[branchId].push({
        id: Date.now() + Math.random(),
        treatment: p.treatment_name,
        price: p.original_price,
        offerPrice: p.offer_price,
        bold: p.is_bold,
        index: idx + 1,
      });
    });

    setPricingMap(map);
    isInitRef.current = false;
  }, [initialData]);

  const syncToApi = (data: Record<number, PricingItem[]>) => {
    if (isInitRef.current) return;

    const payload = Object.entries(data).flatMap(([branchId, items]) =>
      items.map((i) => ({
        location_id: Number(branchId),
        treatment_name: i.treatment,
        original_price: i.price,
        offer_price: i.offerPrice,
        is_bold: i.bold,
        index: i.index,
      }))
    );

    onChange(payload);
  };

  const handleSave = () => {
    if (!selectedBranchId || !treatment || !price || !offerPrice) return;

    setPricingMap((prev) => {
      let list = [...(prev[selectedBranchId] || [])];

      if (editingId) {
        list = list.map((i, idx) =>
          i.id === editingId
            ? { ...i, treatment, price: +price, offerPrice: +offerPrice, bold, index: idx + 1 }
            : i
        );
      } else {
        list.push({
          id: Date.now(),
          treatment,
          price: +price,
          offerPrice: +offerPrice,
          bold,
          index: list.length + 1,
        });
      }

      const updated = { ...prev, [selectedBranchId]: list };
      syncToApi(updated);
      return updated;
    });

    setTreatment("");
    setPrice("");
    setOfferPrice("");
    setBold(false);
    setEditingId(null);
  };
const availableTreatments = useMemo(() => {
  if (!selectedBranchId) return [];
  return (pricingMap[selectedBranchId] || []).map((p) => p.treatment);
}, [pricingMap, selectedBranchId]);
const [showPromoPopup, setShowPromoPopup] = useState(false);
const [promoTreatment, setPromoTreatment] = useState("");
const [promoLabel, setPromoLabel] = useState("");
const [promoPrice, setPromoPrice] = useState("");
const addPromotion = () => {
  if (!selectedBranchId || !promoTreatment || !promoLabel || !promoPrice) return;

  setPromotionMap((prev) => {
    const list = prev[selectedBranchId] || [];

    const updated = {
      ...prev,
      [selectedBranchId]: [
        ...list,
        {
          id: Date.now(),
          treatment: promoTreatment,
          label: promoLabel,
          offerPrice: +promoPrice,
        },
      ],
    };

    return updated;
  });

  setPromoTreatment("");
  setPromoLabel("");
  setPromoPrice("");
  setShowPromoPopup(false);
};

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
                        <div className="w-full rounded-[10px] border border-border bg-card p-5 overflow-hidden">
                        <table className="w-full border-separate border-spacing-0">
                             <tbody>
                  <tr className="grid grid-cols-1 gap-4 xl:table-row">

                    {/* TREATMENT */}
                    <td className="px-4 py-3 border-input border-y xl:rounded-tl-[10px] xl:rounded-bl-[10px]">
                      <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
                        <span className="text-sm text-foreground">
                          Treatment
                        </span>
                        <input
                          value={treatment}
                          onChange={(e) => setTreatment(e.target.value)}
                          placeholder="Treatment name"
                          className="h-10 w-full xl:w-[220px] rounded-lg border border-input bg-card px-3 text-sm"
                        />
                      </div>
                    </td>

                    {/* ORIGINAL PRICE */}
                    <td className="px-4 py-3 border-input border-y">
                      <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
                        <span className="text-sm text-foreground">
                          Original Price
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="£00"
                          className="h-10 w-full xl:w-[160px] rounded-lg border border-input bg-card px-3 text-sm"
                        />
                      </div>
                    </td>

                    {/* OFFER PRICE */}
                    <td className="px-4 py-3 border-input border-y">
                      <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
                        <span className="text-sm text-foreground">
                          Offer Price
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                          placeholder="£00"
                          className="h-10 w-full xl:w-[160px] rounded-lg border border-input bg-card px-3 text-sm"
                        />
                      </div>
                    </td>

                    {/* BOLD */}
                    {/* <td className="px-4 py-3 border-input border-y">
                      <div className="flex items-center justify-between xl:justify-start gap-3">
                        <span className="text-sm text-foreground">Bold</span>
                        <SwitchToggle
                          value={bold}
                          onChange={() => setBold(!bold)}
                        />
                      </div>
                    </td> */}

                    {/* ACTION */}
                    <td className="px-4 py-3 border-input border-y xl:border-r xl:rounded-tr-[10px] xl:rounded-br-[10px]">
                      <div className="flex justify-end xl:justify-center">
                        <button
                          onClick={handleSave}
                          className="inline-flex h-9 w-full xl:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button hover:opacity-90 transition"
                        >
                          <img
                            src="/send.svg"
                            alt="send"
                            className="h-4 w-4"
                          />
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
{pricingMap[selectedBranchId] && 
        <h2 className="mb-4 text-lg font-semibold text-foreground">
            Pricing List
          </h2>
}
            {/* MOBILE / TABLET CARDS */}
     <div className="space-y-3 xl:hidden">
        {(pricingMap[selectedBranchId] || []).map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Treatment</span>
              <span className="font-medium">{item.treatment}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Original Price
              </span>
              <span className="font-medium">£{item.price}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Offer Price
              </span>
              <span className="font-medium">£{item.offerPrice}</span>
            </div>

            {/* <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bold</span>
              <SwitchToggle value={item.bold} onChange={() => {}} />
            </div> */}
          </div>
        ))}
      </div>

            <div className="hidden xl:block">
            <DndContext collisionDetection={closestCenter}>
                <SortableContext
                items={(pricingMap[selectedBranchId] || []).map((i) => i.id)}
                strategy={verticalListSortingStrategy}
                >
                <table className="w-full border-separate border-spacing-y-2">
                    <tbody>
                    {(pricingMap[selectedBranchId] || []).map((item) => (
                        <SortableRow
                        key={item.id}
                        item={item}
                        onEdit={() => {
                            // setDuration(String(item.duration));
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
                    ))}
                    </tbody>
                </table>
                </SortableContext>
            </DndContext>
            </div>
            <div className="flex justify-between">

            <h2 className="text-lg font-semibold">
  Promotions
</h2>


  <div className="flex justify-end xl:justify-center">
                        <button
                    onClick={() => setShowPromoPopup(true)}
                          className="inline-flex h-9 w-full px-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button hover:opacity-90 transition"
                        >
                          {/* <img
                            src="/send.svg"
                            alt="send"
                            className="h-4 w-4"
                          /> */}
                          Add Promotion
                        </button>
                      </div>
            </div>

<div className="space-y-3">
  {(promotionMap[selectedBranchId!] || []).map((p) => (
    <div
      key={p.id}
      className="flex justify-between items-center rounded-lg border border-border bg-card p-4"
    >
      <div>
        <p className="font-medium">{p.label}</p>
        <p className="text-sm text-muted-foreground">{p.treatment}</p>
      </div>
      <span className="font-semibold">£{p.offerPrice}</span>
    </div>
  ))}
</div>
{showPromoPopup && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center !mt-0">
    <div className="relative w-full max-w-[720px] bg-card rounded-xl p-6 space-y-4">

      <h3 className="text-lg font-semibold">Add Promotion</h3>

      <select
        value={promoTreatment}
        onChange={(e) => setPromoTreatment(e.target.value)}
        className="form-input"
      >
        <option value="">Select Treatment</option>
        {availableTreatments.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <input
        value={promoLabel}
        onChange={(e) => setPromoLabel(e.target.value)}
        placeholder="Promotion label"
        className="form-input"
      />

      <input
        type="number"
        value={promoPrice}
        onChange={(e) => setPromoPrice(e.target.value)}
        placeholder="Offer price"
        className="form-input"
      />
     <div className="flex justify-center gap-3 pt-4">
        <button
          type="button"
           onClick={() => setShowPromoPopup(false)}
          className="rounded-full px-6 py-2 border"
        >
          Cancel
        </button>
        <button
          type="submit"
           onClick={addPromotion}
          className="rounded-full bg-primary px-6 py-2 text-primary-foreground shadow-button hover:opacity-90 transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

            </div>
        )}
        </>
    );
    });
