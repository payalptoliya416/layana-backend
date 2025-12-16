import { cn } from "@/lib/utils";

interface Branch {
  id: number;
  name: string;
}

interface BranchSelectorProps {
  branches: Branch[];        // ✅ ADD THIS
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function BranchSelector({
  branches,
  selectedId,
  onSelect,
}: BranchSelectorProps) {
  console.log("branches",branches)
  return (
    <> 
    {branches.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {branches.map((branch) => {
          const active = selectedId === branch.id;

          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => onSelect(branch.id)}
              className={cn(
                "rounded-[10px] border px-6 py-5 text-left text-xl leading-[20px] font-medium transition-all bg-white text-[#121419]",
                active
                  ? "border-[#035865] shadow-[0_0_0_1px_#035865]"
                  : "border-[#E7E8E8] hover:border-[#CFE6EA]"
              )}
            >
              {branch.name}
            </button>
          );
        })}
      </div>
    )}
    </>
  );
}
