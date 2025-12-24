import { forwardRef, useEffect, useRef, useState } from "react";
import { BranchSelector } from "./BranchSelector";
import { BranchSEO } from "./BranchSEO";

interface BranchSEOPageProps {
  branches: { id: number; name: string }[];
  selectedBranchId: number | null;
  initialData?: any[];          // ✅ ADD
  onSelectBranch: (id: number | null) => void;
  onChange: (seo: any[]) => void;
  category : string;
}

const BranchSEOPage = forwardRef<
  { validate: () => boolean },
  BranchSEOPageProps
>(function BranchSEOPage(
  {
    branches,
    selectedBranchId,
    initialData,
    onSelectBranch,
    onChange,
    category
  },
  ref
) {
   const isInitializingRef = useRef(true);
  const [seoMap, setSeoMap] = useState<Record<number, any>>({});
  console.log("initialData",initialData)
useEffect(() => {
  if (!initialData || initialData.length === 0) {
    isInitializingRef.current = false;
    return;
  }

  isInitializingRef.current = true;

  const map: Record<number, any> = {};

  initialData.forEach((item: any) => {
    map[item.location.id] = {
      analitycs: item.location.analitycs || "",
      seo_title: item.location.seo_title || "",
      meta_description: item.location.meta_description || "",
      seo_keyword: Array.isArray(item.location.seo_keyword)
        ? item.location.seo_keyword.map((k: any) =>
            typeof k === "string" ? k : k?.name
          )
        : [],
    };
  });

  setSeoMap(map);

  // 🔥 AFTER seoMap is ready → select branch
  if (selectedBranchId === null) {
    onSelectBranch(Number(Object.keys(map)[0]));
  }

  setTimeout(() => {
    isInitializingRef.current = false;
  }, 0);
}, [initialData]);


   return (
  <div className="space-y-6">
  {/* STEP 1: Branch select */}
  {selectedBranchId === null && (
    <BranchSelector
      branches={branches}
      selectedId={selectedBranchId}
      onSelect={onSelectBranch}
    />
  )}

  {/* STEP 2: SEO FORM */}
  {selectedBranchId !== null && (
    <div className="rounded-2xl border border-border bg-card p-6">
      <BranchSEO
        key={selectedBranchId}
        branchId={selectedBranchId}
        value={seoMap[selectedBranchId]}
        onChange={(data) => {
          setSeoMap((prev) => {
            const updated = {
              ...prev,
              [selectedBranchId]: data,
            };

            // ⛔ skip initial load
            if (isInitializingRef.current) return updated;

            const apiPayload = Object.entries(updated).map(
              ([branchId, seo]) => ({
                location: {
                  id: Number(branchId),
                  ...seo,
                },
              })
            );

            onChange(apiPayload);
            return updated;
          });
        }}
      />
    </div>
  )}
</div>

  );
})
export default BranchSEOPage;