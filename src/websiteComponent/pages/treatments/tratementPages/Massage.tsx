import { useEffect, useState } from "react";
import massage_bg from "@/assets/massage_bg.png";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import MassageCard from "@/websiteComponent/common/home/MasssageCard";
import { getTreatmentCategories, getTreatmentsByCategory } from "@/websiteComponent/api/treatments.api";
import Loader from "@/websiteComponent/common/Loader";

const CARD_COLORS = [
  "#F5EEE9",
  "#FBF3EC",
  "#F9EEE7",
  "#FFF4E9",
  "#F5EEE9",
  "#FBF3EC",
  "#F9EEE7",
  "#FFF4E9",
  "#F5EEE9",
  "#FBF3EC",
  "#F9EEE7",
  "#FFF4E9",
];

function Massage() {
const [categories, setCategories] = useState<any[]>([]);
const [activeCategory, setActiveCategory] = useState<number | null>(null);
const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  /* Load categories */
  useEffect(() => {
    getTreatmentCategories().then((res) => {
      setCategories(res.data);

      if (res.data.length > 0) {
        setActiveCategory(res.data[0].id);
      }
    });
  }, []);

  /* Load treatments on tab change */
useEffect(() => {
  if (!activeCategory) return;

  setLoading(true);
  getTreatmentsByCategory(activeCategory)
    .then((res) => {
      setTreatments(res.data.treatments || []);
    })
    .catch((err) => {
      console.error("Treatment API error", err);
      setTreatments([]);
    })
    .finally(() => setLoading(false));
}, [activeCategory]);
 
  if (loading || !treatments) {
  return (
    <div className="py-20 text-center">
      <Loader />
    </div>
  );
}
  return (
    <>
      <SimpleHeroBanner
        background={massage_bg}
        title="Treatment"
        subtitle="Finchley Central"
      />

      <section className="pt-12 lg:pt-[110px]">
        <div className="container mx-auto">

          {/* Tabs */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-14 border-b pb-2 sm:w-max mx-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="group relative w-full sm:w-auto text-center py-4 sm:py-0"
                  >
                    <span
                      className={`block text-sm tracking-widest uppercase transition
                        ${isActive ? "text-black" : "text-[#666] group-hover:text-black"}
                      `}
                    >
                      {cat.name}
                    </span>

                    {/* mobile divider */}
                    <span
                      className={`absolute left-0 bottom-0 w-full h-[1px] sm:hidden
                        ${isActive ? "bg-black" : "bg-gray-200"}
                      `}
                    />

                    {/* desktop underline */}
                    {isActive && (
                      <span className="hidden sm:block absolute left-0 -bottom-[10px] w-full h-[2px] bg-black" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20"></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {treatments.map((item, index) => (
                    <MassageCard
                      key={item.id}
                      title={item.name}
                      slug={item.slug}
                      id={item.id}
                      image={item.thumbnail_image || massage_bg}
                      bgColor={CARD_COLORS[index % CARD_COLORS.length]}
                    />
                  ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Massage;
