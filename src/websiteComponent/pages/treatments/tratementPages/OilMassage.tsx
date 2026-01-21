import { Phone } from "lucide-react";
import {
  massageTreatmentsData,
  type MassageTreatmentTabs,
} from "./massageTreatmentsData";

import img1 from "@/assets/slider1.png";
import img2 from "@/assets/slider2.png";
import img3 from "@/assets/slider3.png";
import img4 from "@/assets/slider4.png";
import Faq from "@/websiteComponent/common/massage/FAQ";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import MassageGallery from "@/websiteComponent/common/massage/MassageGallery";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import MassageCard from "@/websiteComponent/common/home/MasssageCard";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getTreatmentById, getViewTreatmentById, TreatmentView } from "@/websiteComponent/api/treatments.api";
import Loader from "@/websiteComponent/common/Loader";
import { Breadcrumb } from "./Breadcrumb";
import { IoCall } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

export const images = [img1, img2, img3, img4];

const CARD_COLORS = ["#FBF3EC", "#F9EEE7", "#FFF4E9"];

function OilMassage() {
  const location = useLocation();
  const treatmentId = location.state?.treatmentId;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const storedIds = localStorage.getItem("activeTreatmentIds");

const treatmentsBaseUrl = useMemo(() => {
  const parts = location.pathname.split("/").filter(Boolean);
  // last slug remove
  parts.pop();
  return "/" + parts.join("/");
}, [location.pathname]);

const treatmentViewIds = useMemo<number[]>(() => {
  return storedIds
    ? JSON.parse(storedIds)
        .map((id: any) => Number(id))
        .filter(Boolean)
    : [];
}, [storedIds]);

const [viewData, setviewData] = useState<TreatmentView[]>([]);
useEffect(() => {
 if (!treatmentViewIds.length) return;

  setLoading(true);

  getViewTreatmentById(treatmentViewIds)
    .then((res) => {
      setviewData(res.data ?? []);
    })
    .finally(() => setLoading(false));
}, [treatmentViewIds]);

   useEffect(() => {
    if (!treatmentId) return;

    getTreatmentById(treatmentId)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, [treatmentId]);


  // --view data---

  const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
};
const filteredTreatments = viewData.filter(
  (item) => item.id !== treatmentId  
);

const treatmentsToShow =
  filteredTreatments.length > 3
    ? getRandomItems(filteredTreatments, 3)
    : filteredTreatments;

  if (loading) return <div className="py-20 text-center"><Loader/></div>;
  if (!data) return <div className="py-20 text-center"></div>;

 const treatment = data.treatment;
  const faqItems =
  data?.faqs?.map((faq: any) => ({
    question: faq.question,
    answer: faq.answer,
  })) || [];

  return (
    <>
    {data?.seo && (
              <Helmet>
            
                <meta
                  name="description"
                  content={data?.seo.meta_description}
                />
            
                {data?.seo.seo_keyword?.length > 0 && (
                  <meta
                    name="keywords"
                    content={data?.seo.seo_keyword.join(", ")}
                  />
                )}
            
        
                 {/* {landingData.seo.analytics && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: landingData.seo.analytics,
                }}
              />
            )} */}
              </Helmet>
            )}
    
      <SimpleHeroBanner
          background={data.visuals?.banners?.[0]}
         title={treatment.name}
        breadcrumb={<Breadcrumb />}
      />
      {/* ----- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto !px-0 lg:px-4">
          <div className="grid grid-cols-12 lg:gap-10">
            <div className="col-span-12 lg:col-span-6 mb-6 lg:mb-0  px-3">
               <MassageGallery images={images} />
            </div>
            <div className="col-span-12 lg:col-span-6 px-4">
              <div className="mb-7 lg:mb-[42px]">
                <h3 className="text-[26px] md:text-4xl mb-[15px] md:mb-5 leading-[36px] font-light">
                  {treatment.name}
                </h3>
                 <div
              className="text-xs sm:text-base leading-[26px] font-normal text-[#666666] mb-[15px] font-quattro text-justify"
              dangerouslySetInnerHTML={{ __html: treatment.content }}
            />
              </div>
               {data.benefits?.length > 0 && (
              <div className="mb-[30px]">
                <h3 className="text-[#282828] text-xl md:text-[22px] leading-[36px] md:leading-[24px] mb-[15px] md:mb-5">
                  Benefits of {treatment.name}
                </h3>
                <ul className="list-disc list-outside pl-5">
                   {data.benefits.map((b: any) => (
                  <li className="font-quattro text-[#666666] text-xs sm:text-base mb-[10px]">
                    {b.title}
                  </li> ))}
                </ul>
              </div>
             )}
              <div>
                {treatment.slogan && <h3 className="text-[#282828] text-lg sm:text-[22px] leading-[24px] italic font-muli mb-[15px] sm:mb-[30px]">
                  "{treatment.slogan}"
                </h3>}
                
                <p className="text-sm text-[#666666] sm:text-base mb-[5px] sm:mb-[16px] font-quattro">
                  Please call us or book online
                </p>
                <div className="flex gap-[10px] items-center mb-[30px]">
                  <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                    <IoCall size={16} />
                  </div>
                  <span className="text-lg text-[#282828] font-quattro">0208 371 6922</span>
                </div>
                 {data.pricing?.length > 0 && (
                <div className="flex items-center text-[18px] font-quattro text-[#666666] tracking-wide mb-[37px] justify-center">
                  {data.pricing.map((p: any, i: number) => (
                    <>
                  <div className="px-[10px]">
                    {p.minute} min:{" "}
                    <span className="font-semibold text-black mt-5 sm:mt-0">£{p.price}</span>
                  </div>
                   {i !== data.pricing.length - 1 && (
                     <div className="h-6 w-px bg-gray-300" />
                    )}
                    </>
                  ))}
                  
                </div>
                )} 
                {data.buttons?.length > 0 && (
                  <div className="flex gap-3 md:gap-10 flex-wrap justify-center">
                     {data.buttons.map((btn: any) => (
              <a
                key={btn.id}
                href={btn.button_link}
                target="_blank"
                className=" border border-black px-5 sm:px-[50px] py-[15px] sm:py-[23px]
                  flex items-center justify-center
                  font-mulish text-[13px]
                  tracking-[0.25em] uppercase
                  transition
                  hover:bg-black hover:text-white cursor-pointer"
              >
                {btn.button_text}
              </a>
            ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- */}
      {faqItems.length > 0 && (
      <section className="bg-[#F3F3F3] py-[50px] mb-12 lg:mb-[110px]">
        <div className="container mx-auto">
              <Faq
        items={faqItems}
        title="Frequently Asked Questions"
      />
        </div>
      </section> )}

      {/* ----- */}
      {treatmentsToShow.length > 0 && (
      <section className="pb-12 lg:pb-[110px]">
        <div className="container mx-auto">
          <h3 className="text-[26px] sm:text-[28px] sm:text-4xl mb-5 sm:mb-[35px] text-center font-muli">
            You might also like...
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[48px] mb-16">
             {treatmentsToShow.map((item, index) => (
              <MassageCard
              id={item.id}
                key={item.id}
                title={item.name}
                slug={item.slug}
                image={item.thumbnail_image}
                bgColor={CARD_COLORS[index % CARD_COLORS.length]}
              />
            ))}
          </div>

          {/* Browse all button */}
          <div className="flex justify-center">
            <CommonButton to={treatmentsBaseUrl}>
              Browse All Treatments
            </CommonButton>
          </div>
        </div>
      </section>
        )}
    </>
  );
}

export default OilMassage;
