import termbg from "@/assets/termbg.png";
import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import { Breadcrumb } from "../../treatments/tratementPages/Breadcrumb";
import { useEffect, useState } from "react";
import { getTermsAndConditions } from "@/websiteComponent/api/cms.api";
import Loader from "@/websiteComponent/common/Loader";

function TermCondition() {
   const [termsHtml, setTermsHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);

        const res = await getTermsAndConditions();
        if (res.status === "success") {
          setTermsHtml(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

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
        background={termbg}
        title="Terms & Conditions"
         breadcrumb={<Breadcrumb />}
      />
     <section className="py-12 lg:py-[110px]">
      <div className="container mx-auto">
        <div className="border-8 border-[#F6F6F6] p-[30px]">
           <div
              className="prose prose-lg max-w-none text-[#666]"
              dangerouslySetInnerHTML={{ __html: termsHtml }}
            />
          {/* {termsData.map((item, index) => (
            <div key={index} className="mb-[26px] sm:mb-[35px]">
              {item.title && (
                <h3 className="text-lg sm:text-[28px] sm:leading-[46px] mb-2 sm:mb-[15px] font-mulish">
                  {item.title}
                </h3>
              )}

              {item.highlight && typeof item.description === "string" && (
                <h2 className="text-lg sm:text-[28px] sm:leading-[46px] font-muli italic">
                  {item.description}
                </h2>
              )}

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
          ))} */}
        </div>
      </div>
    </section>
    </>
  )
}

export default TermCondition
