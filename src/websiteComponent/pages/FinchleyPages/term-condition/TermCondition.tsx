import termbg from "@/assets/termbg.png";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";
type TermItem = {
  title?: string;
  description?: string | string[];
  highlight?: boolean;
};

const termsData: TermItem[] = [
  {
    title: "Arrival",
    description:
      "Please arrive 5-10 minutes prior to your appointment. If you arrive late, the time of the appointment may be shortened to consider next appointment.",
  },
  {
    title: "Health Conditions",
    description:
      "When making your either on-line or phone booking please advise us of any health conditions and any medication usage. On the day of your treatment, our team will ask you to complete a health questionnaire to ensure we are providing you the very best service and results, while assuring your comfort and safety. Please note that for certain medical conditions we will require written permission from your doctor prior to appointment. Please speak to our Customer Care team for more information.",
  },
  {
    title: "Cancellations",
    description:
      "If you need to change or cancel an appointment, we ask that you give us 24 hours’ notice or the full cost of the treatment will be charged. Please note that we request credit card details to secure your booking.",
  },
  {
    title: "Massage Package / Course Offer",
    description:
      "Massage packages are available to purchase at reception or by telephone. Massage packages are valid for a six months from the date of purchase. Massage packages can be shared with family or friends. Massage package no show or cancellation must informed before 24 hours, otherwise session will be deducted accordingly from the package. Booking method of massage package sessions to be made by telephone or e-mail us at info@thaimanee.co.uk. Massage package appointments must match with package minutes.",
  },
  {
    description: "Massage packages are non-refundable or non-exchangeable.",
    highlight: true,
  },
  {
    title: "Dissatisfaction",
    description:
      "We always try to match clients with those therapists whose training and expertise is most suited to their treatment requirements. However, should you find yourselves dissatisfied with your treatment, please inform your therapist as soon as possible that you wish to end the session, and we will try to find a more suitable replacement. We will not charge you, provided you terminate the session within the first 15 minutes. however, there will be a charge if dissatisfaction not reported within initial 15 minutes.",
  },
  {
    title: "Gift Vouchers",
    description: [
      "Gift voucher and e-gift voucher are available for products and /or treatments. These are valid for six months from the date of purchase. Gift vouchers and e-gift vouchers are non-transferable and non-refundable.",
      "Any queries or for more information, please enquire at reception or e-mail us at info@thaimanee.co.uk",
    ],
  },
];

function TermCondition() {
  return (
    <>
       <SimpleHeroBanner
        background={termbg}
        title="Terms & Conditions"
         breadcrumb={<Breadcrumb />}
      />
     <section className="pt-12 lg:pt-[110px]">
      <div className="container mx-auto">
        <div className="border-8 border-[#F6F6F6] p-[30px]">
          {termsData.map((item, index) => (
            <div key={index} className="mb-[26px] sm:mb-[35px]">
              {/* Title */}
              {item.title && (
                <h3 className="text-lg sm:text-[28px] sm:leading-[46px] mb-2 sm:mb-[15px] font-mulish">
                  {item.title}
                </h3>
              )}

              {/* Highlight line */}
              {item.highlight && typeof item.description === "string" && (
                <h2 className="text-lg sm:text-[28px] sm:leading-[46px] font-muli italic">
                  {item.description}
                </h2>
              )}

              {/* Normal paragraph(s) */}
              {!item.highlight &&
                (Array.isArray(item.description) ? (
                  item.description.map((text, i) => (
                    <p
                      key={i}
                      className={`font-quattro text-sm sm:text-base font-normal text-[#666666] ${
                        i > 0 ? "mt-[15px]" : ""
                      }`}
                    >
                      {text}
                    </p>
                  ))
                ) : (
                  <p className="font-quattro text-sm sm:text-base font-normal text-para">
                    {item.description}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}

export default TermCondition
