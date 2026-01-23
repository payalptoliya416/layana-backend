export type PriceOption = {
  minutes: string;
  each: string;
  price: string;
  oldPrice: string;
};

export type MembershipPlan = {
  title: string;
  options: PriceOption[];
};

type Props = {
  plan: MembershipPlan;
};

export default function MembershipCard({ plan }: Props) {
  return (
    <div className="bg-white border-[4px] border-[#F6F6F6]">
      {/* Header */}
      <div className="bg-[#F7EFEC] border-[4px] border-[#F6F6F6] text-base leading-[16px] font-semibold py-[15px] text-center mb-2">
        {plan.title}
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#F1F1F1] p-2">
        {plan.options.map((item, i) => (
          <div key={i} className="flex justify-between items-center px-[17px] py-[10px] font-quattro">
            <div>
              <p className="text-sm mb-[10px] text-[#282828]">{item.minutes}</p>
              <p className="text-xs text-para text-[#666666]">{item.each}</p>
            </div>

            <div className="text-right">
              <p className="text-base font-bold mb-[10px] font-muli text-[#282828]">
                {item.price}
              </p>
              <p className="text-xs text-[#666666] line-through">
                {item.oldPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}