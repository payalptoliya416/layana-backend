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

export const membershipPlans: MembershipPlan[] = [
  {
    title: "5 Massage",
    options: [
      { minutes: "30' minutes", each: "£31 each", price: "£155", oldPrice: "£175" },
      { minutes: "45' minutes", each: "£41 each", price: "£205", oldPrice: "£225" },
      { minutes: "60' minutes", each: "£55 each", price: "£275", oldPrice: "£300" },
      { minutes: "90' minutes", each: "£75 each", price: "£375", oldPrice: "£400" },
      { minutes: "120' minutes", each: "£95 each", price: "£475", oldPrice: "£500" },
    ],
  },
  {
    title: "10 Massage",
    options: [
      { minutes: "30' minutes", each: "£28 each", price: "£196", oldPrice: "£245" },
      { minutes: "45' minutes", each: "£38 each", price: "£266", oldPrice: "£315" },
      { minutes: "60' minutes", each: "£52 each", price: "£364", oldPrice: "£420" },
      { minutes: "90' minutes", each: "£72 each", price: "£504", oldPrice: "£560" },
      { minutes: "120' minutes", each: "£82 each", price: "£602", oldPrice: "£660" },
    ],
  },
  {
    title: "15 Massage",
    options: [
      { minutes: "30' minutes", each: "£25 each", price: "£250", oldPrice: "£350" },
      { minutes: "45' minutes", each: "£35 each", price: "£350", oldPrice: "£450" },
      { minutes: "60' minutes", each: "£50 each", price: "£500", oldPrice: "£600" },
      { minutes: "90' minutes", each: "£70 each", price: "£700", oldPrice: "£800" },
      { minutes: "120' minutes", each: "£80 each", price: "£800", oldPrice: "£900" },
    ],
  },
];


type Props = {
  plan: MembershipPlan;
};

export default function MembershipCard({ plan }: Props) {
  return (
    <div className="bg-white border-[4px] border-[#F6F6F6]">
      {/* Header */}
      <div className="bg-[#F7EFEC] border-[4px] border-[#F6F6F6] text-base py-[17px] text-center">
        {plan.title}
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#F1F1F1] p-2 py-[18px]">
        {plan.options.map((item, i) => (
          <div key={i} className="flex justify-between items-center px-6 py-[10px] font-quattro">
            <div>
              <p className="text-sm mb-[11px]">{item.minutes}</p>
              <p className="text-xs text-para">{item.each}</p>
            </div>

            <div className="text-right">
              <p className="text-base font-bold mb-[11px]">
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