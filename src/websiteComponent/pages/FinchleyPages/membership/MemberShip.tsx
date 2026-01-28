import membership_bg from "@/assets/membership_bg.png";
import membership_bg1 from "@/assets/membership_bg1.png";
import MembershipCard, { MembershipPlan } from "./MembershipPricing";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";
import { IoCall } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getMemberships, Membership } from "@/websiteComponent/api/membershipsApi";
import { useLocation, useParams } from "react-router-dom";
import { getLocations, getMembershipLandingPage, MembershipLandingPageData } from "@/websiteComponent/api/webLocationService";
import { IoIosMail } from "react-icons/io";
import Loader from "@/websiteComponent/common/Loader";
import "react-quill/dist/quill.snow.css";

function MemberShip() {
    const location = useLocation();
  const locationId = location.state?.locationId;
  const { locationSlug } = useParams();
  const [resolvedLocationId, setResolvedLocationId] = useState<number | null>(null);
const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
const [selectedLocation, setSelectedLocation] = useState<any>(null);
const [landingData, setLandingData] =
  useState<MembershipLandingPageData | null>(null);
const [loading, setLoading] = useState(true);
console.log("landingData",landingData)
  // 👉 final usable locationId
  const finalLocationId = locationId ?? resolvedLocationId;
const mapMembershipsToPlans = (memberships: Membership[]): MembershipPlan[] => {
  return memberships.map((membership) => ({
    title: membership.name,
    options: membership.pricing.map((p) => ({
      minutes: `${p.duration}' minutes`,
      each: `£${p.each_price} each`,
      price: `£${p.offer_price}`,
      oldPrice: `£${p.price}`,
    })),
  }));
};

useEffect(() => {
  getMembershipLandingPage().then((res) => {
    if (res.status === "success") {
      setLandingData(res.data);
    }
  });
}, []);

   useEffect(() => {
    // jo state mathi locationId already hoy
    if (locationId) {
      setResolvedLocationId(locationId);
      return;
    }

    // jo slug nathi to kai karvanu nathi
    if (!locationSlug) return;

    // slug thi location id find karo
    getLocations().then((res) => {
      const locations = res.data ?? [];
console.log("locations",locations)
      const matched = locations.find(
        (loc: any) => loc.slug === locationSlug
      );

      if (matched) {
        setResolvedLocationId(matched.id);
        setSelectedLocation(matched);
      }
    });
  }, [locationId, locationSlug]);

  useEffect(() => {
  if (!locationId) return;

  getLocations().then((res) => {
    const locations = res.data ?? [];

    const matched = locations.find(
      (loc: any) => loc.id === locationId
    );

    if (matched) {
      setSelectedLocation(matched);
    }
  });
}, [locationId]);


   useEffect(() => {
    if (!finalLocationId) return;
  setLoading(true);
    getMemberships(finalLocationId).then((res) => {
      if (res.status === "success") {
        const plans = mapMembershipsToPlans(res.data.memberships);
      setMembershipPlans(plans);
      }
        setLoading(false); 
    });
  }, [finalLocationId]);

const membershipBackground =
  locationSlug === "finchley" || locationSlug === "finchley-central"
    ? membership_bg
    : membership_bg1;

if (loading || !landingData) {
  return (
    <div className="py-20 flex justify-center">
      <Loader />
    </div>
  );
}
  return (
    <>
     
      <SimpleHeroBanner
        background={membershipBackground}
        title="Memberships"
       breadcrumb={<Breadcrumb />}
      />

      {/* ---- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="border-[10px] border-[#F6F6F6] py-[60px] px-5 md:px-10 lg:px-[55px]">
         <div
  className="quill-content mb-5 text-[#282828]"
  dangerouslySetInnerHTML={{
    __html: landingData?.description || "",
  }}
/>
             {/* <div className="text-center">
              <span className="inline-block bg-[#F7EFEC] text-base lg:text-[22px] leading-[24px] mb-5 py-[10px] px-5 lg:px-[35px] text-[#282828]">
                Join The Discounted Massage Membership
              </span>
            </div>

            <h2 className="text-xl lg:text-[28px] lg:leading-[28px] mb-[25px] text-center font-bold">
              Massage Subscription
            </h2>

            <p className="text-center mb-[5px] font-quattro text-xl font-bold  text-[#282828]">
              Flexible Annual Memberships
            </p>

            <p className="text-center font-light text-base mb-[25px]  text-[#282828]">
              Make restorative massage part of your regular self-care routine.
            </p>

            <p className="text-center italic font-muli text-[22px] leading-[24px] mb-[30px]  text-[#282828]">
              Invest in me time, “it is all about you”.
            </p>

            <p className=" text-[#666666] text-base font-normal mb-[25px] leading-[26px] text-justify font-quattro">
              Sign up to invest in your wellbeing with our incredible value
              massage & sauna memberships, it takes few seconds to set up and
              benefit over 12 months from the date of purchase.
            </p>

            <div className="">
              <h4 className="mb-[15px] text-base text-justify">
                How does it work?
              </h4>

              <ul className="space-y-3 list-disc pl-5 text-justify text-[#666666] font-quattro text-base">
                <li>
                  Select desired annual membership option, pay & activate, start
                  the programme.
                </li>
                <li>
                  It is your membership but share the love with your family and
                  friends.
                </li>
                <li>
                  Book in advanced appointments for any day, 10 am to 9 pm by
                  e-mail, telephone or by on-line that suit your schedule.
                </li>
                <li>Valid memberships protected from price increase.</li>
                <li>
                  Treatments must be used within 12 months from the date of
                  purchase.
                </li>
              </ul>
            </div>  */}
          </div>
        </div>
      </section>
      {/* ----- */}

      <section className="pb-12 lg:pb-[110px]">
        <div className="container mx-auto">
          <h2 className="text-center text-[28px] font-muli mb-7 sm:mb-10 font-light">
            Memberships Price List
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {membershipPlans.map((plan, index) => (
              <MembershipCard key={index} plan={plan} />
            ))}
          </div>

          <div className="pt-10 max-w-3xl mx-auto">
            <h2 className="text-[#282828] text-lg md:text-[22px] mb-5 sm:mb-10 font-muli italic">
              Schedule a massage.. Get a massage.. Schedule next massage.
            </h2>
            <div className="flex justify-between items-center flex-wrap gap-5">
              <div>
                <p className="text-sm text-[#666666] mb-[5px] sm:mb-[10px] font-quattro">
                  Please call us or book online
                </p>
                <div className="flex items-center gap-[15px] flex-wrap">
                  <div className="flex gap-[10px] items-center">
                    <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                      <IoCall size={16} />
                    </div>
                    <span className="text-base md:text-base text-[#666666] font-quattro">
                   {selectedLocation?.phone || ""}
                    </span>
                  </div>
                  <div className="h-8 w-px sm:bg-[#F7EFEC]" />
                  <div className="flex gap-[10px] items-center">
                    <div className="w-9 h-9 rounded-full flex justify-center items-center bg-[#F7EFEC] ">
                      <IoIosMail size={18} />
                    </div>
                    <span className="text-base md:text-base text-[#666666] font-quattro">
                      {selectedLocation?.email || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mx-auto sm:mx-0">
              <CommonButton href="https://www.fresha.com/providers/rmxjfmmk">Buy Now</CommonButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----- */}
       <section className="bg-[#F6F6F6] py-[50px]">
      <div className="container mx-auto">

        {/* Top */}
        <div className="sm:text-center max-w-3xl mx-auto mb-[50px]">
          <h2 className="text-lg mb-[15px] font-bold font-mulish">
            TERMS & CONDITIONS
          </h2>

          <ul className="text-base leading-[26px] text-[#666666] font-quattro">
            <li> 1 year from the date of purchase.</li>
            <li>
               Massage packages are not valid for Hot stone massage, Pregnancy
              massage &amp; Sport’s massage.
            </li>
            <li> Massage Package prices are valid at Finchley branch.</li>
          </ul>
          <div
  className="quill-content text-[#666666]"
  dangerouslySetInnerHTML={{
    __html: landingData?.terms_condition || "",
  }}
/>
        </div>

        {/* Bottom grid */}
        <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 sm:gap-y-10 md:gap-y-10 gap-x-40  max-w-4xl w-full">
   {landingData?.policy?.map((item, index) => (
      <div key={index}>
        <h3 className="text-base sm:text-lg font-bold uppercase mb-2 font-mulish">
          {item.title}
        </h3>

        <p className="text-[#666666] font-quattro text-sm sm:text-base">
          {item.content}
        </p>
      </div>
    ))}
          {/* <div>
            <h3 className="text-base sm:text-lg font-bold uppercase mb-2 font-mulish">
              SESSION MINUTES
            </h3>
            <p className="text-[#666666] font-quattro text-sm sm:text-base">
              Appointments must match with package session minutes.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold uppercase mb-2 font-mulish">
              PACKAGE
            </h3>
            <p className="text-[#666666] font-quattro text-sm sm:text-base">
              Share your love with family &amp; friends
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold uppercase mb-2 font-mulish">
              REFUND / EXCHANGE
            </h3>
            <p className="text-[#666666] font-quattro text-sm sm:text-base">
              Non – refundable or Non – exchanged
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold uppercase mb-2 font-mulish">
              NO SHOW OR CANCELLATION
            </h3>
            <p className="text-[#666666] font-quattro text-sm sm:text-base">
              Must before 24 hrs prior to appointment.
            </p>
          </div> */}

        </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default MemberShip;
