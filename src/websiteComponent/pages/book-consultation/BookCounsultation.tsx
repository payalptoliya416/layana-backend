import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import book from "@/assets/book.png";
import { Breadcrumb } from "../treatments/tratementPages/Breadcrumb";

function BookCounsultation() {
  return (
    <>
      <SimpleHeroBanner
        background={book}
        title="Book a Skin Consultation"
        breadcrumb={<Breadcrumb />}
      />
      {/* ------- */}
      <section className="">
        <div className="container mx-auto">

        </div>
      </section>
    </>
  );
}

export default BookCounsultation;
