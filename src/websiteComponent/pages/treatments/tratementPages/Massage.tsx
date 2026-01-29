import { useEffect, useState } from "react";
import massage_bg from "@/assets/massage_bg.png";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import MassageCard from "@/websiteComponent/common/home/MasssageCard";
import { getTreatmentCategories, getTreatmentsByCategory } from "@/websiteComponent/api/treatments.api";
import Loader from "@/websiteComponent/common/Loader";
import { Breadcrumb } from "./Breadcrumb";
import { useLocation, useSearchParams } from "react-router-dom";

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
  const routerLocation = useLocation();
    const locationId = routerLocation.state?.locationId ?? 1;
    const categoryFromFooter = routerLocation.state?.categoryId;

const [categories, setCategories] = useState<any[]>([]);
const [activeCategory, setActiveCategory] = useState<number | null>(null);
const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

useEffect(() => {
  if (categoryFromFooter) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [categoryFromFooter]);
/* ================================
     1️⃣ Load Categories Only Once
  ================================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getTreatmentCategories();
        setCategories(res.data);
 if (categoryFromFooter) {
        setActiveCategory(categoryFromFooter);
      } 
        // ✅ Default active category
       else if (res.data.length > 0) {
          setActiveCategory(res.data[0].id);
        }
      } catch (err) {
        console.error("Category API Error", err);
      }
    };

    fetchCategories();
  }, []);

  /* ================================
     3️⃣ Load Treatments When Category Changes
  ================================= */
  useEffect(() => {
    if (!activeCategory) return;

    const fetchTreatments = async () => {
      setLoading(true);

      try {
        const res = await getTreatmentsByCategory(activeCategory, locationId);
        setTreatments(res.data.treatments || []);
      } catch (err) {
        console.error("Treatment API Error", err);
        setTreatments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [activeCategory, locationId]);

 
 if (loading) {
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
         breadcrumb={<Breadcrumb />}
      />

      <section id="treatment-tabs" className="py-12 lg:py-[110px]">
        <div className="container mx-auto">

          {/* Tabs */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-center sm:border-b pb-[10px] w-max mx-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="group relative w-full sm:w-auto text-center py-[10px] sm:py-0"
                  >
                    <span
                      className={`block text-base leading-[28px] tracking-[2px] transition  px-5
                        ${isActive ? "text-black  font-semibold" : "text-[#666] group-hover:text-black"}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[48px]">
               {treatments.map((item, index) => (
                    <MassageCard
                      key={item.id}
                      title={item.name}
                      slug={item.slug}
                      id={item.id}
                      image={item.thumbnail_image || massage_bg}
                      bgColor={CARD_COLORS[index % CARD_COLORS.length]}
                      locationId={locationId}
                    />
                  ))}
            </div>
        </div>
      </section>
    </>
  );
}

export default Massage;
