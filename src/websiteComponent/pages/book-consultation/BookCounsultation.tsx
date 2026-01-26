import SimpleHeroBanner from "@/websiteComponent/common/home/SimpleHeroBanner";
import book from "@/assets/book.png";
import { Breadcrumb } from "../treatments/tratementPages/Breadcrumb";
import PhoneInput from "react-phone-input-2";
import CommonButton from "@/websiteComponent/common/home/CommonButton";
import { IoMdSunny } from "react-icons/io";
import { BsMoonFill } from "react-icons/bs";
import { TbSunMoon } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";
import { LuMoveLeft, LuMoveRight } from "react-icons/lu";
import { useState } from "react";
import { FaPumpSoap } from "react-icons/fa6";
import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d3 from "@/assets/d3.png";
import de1 from "@/assets/de1.png";
import de2 from "@/assets/de2.png";
import de3 from "@/assets/de3.png";
import de4 from "@/assets/de4.png";
import { submitBookedConsultation } from "@/websiteComponent/api/bookConsultationService";
import ThankYouPopup from "./ThankYouPopup";

function BookCounsultation() {
  const [step, setStep] = useState(1);
  const [routineChoice, setRoutineChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stepError, setStepError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    treatments: "",
    day: "",
    start_time: "",
    end_time: "",
    message: "",
    skincare: "",
    skin_type: "",
    skin_type_second: "",
    skin_goal: "",
    skin_care_products: "",
    type: "offline",
  });
  const handleNext = () => {
    setStepError("");
    setStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setStepError("");
    setStep((prev) => prev - 1);
  };
const [showPopup, setShowPopup] = useState(false);
  const [skinType, setSkinType] = useState("");
  const [sensitiveType, setSensitiveType] = useState("");
  const [skincareTime, setSkincareTime] = useState("");
  const [goal, setGoal] = useState("");
  const [productUse, setProductUse] = useState("");
  const goals = [
    "Increase skin hydration",
    "Treat hyperpigmentation and discoloration",
    "Treat acne and breakouts",
    "Increase skin brightness",
    "Reduce fine lines and wrinkles",
    "Control oiliness & shine",
  ];
  const skincareOptions = [
    { label: "Morning", value: "morning", icon: de1 },
    { label: "Night", value: "night", icon: de2 },
    { label: "Morning & Night", value: "both", icon: de3 },
    { label: "Never", value: "never", icon: de4 },
  ];
  const options = [
    "Very Dry",
    "Dry",
    "Normal",
    "Combination",
    "Oily",
    "Don’t know",
  ];
  const productOptions = [
    {
      label: "Moisturiser",
      value: "moisturiser",
      icon: d1,
    },
    {
      label: "SPF",
      value: "spf",
      icon: d2,
    },
    {
      label: "Other",
      value: "other",
      icon: d3,
    },
  ];
  const sensitivity = ["Very Sensitive", "Quite Sensitive", "Not Sensitive"];

  const handleStep2Next = () => {
    if (!skincareTime) {
      setStepError("Please select skincare time");
      return;
    }

    setStepError("");

    setFormData((prev) => ({
      ...prev,
      skincare: skincareTime,
    }));

    handleNext();
  };

  const handleStep1Submit = async () => {
    setSubmitted(true);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.treatments ||
      !formData.day ||
      !formData.start_time ||
      !formData.end_time
    ) {
      return;
    }

    if (!routineChoice) {
      setStepError("Please select Tell Us or Skip");
      return;
    }

    setStepError("");

    // ✅ SKIP → Direct API Submit
    if (routineChoice === "skip") {
      setSkincareTime("");
      setSkinType("");
      setSensitiveType("");
      setGoal("");
      setProductUse("");

      setFormData((prev) => ({
        ...prev,
        skincare: "",
        skin_type: "",
        skin_type_second: "",
        skin_goal: "",
        skin_care_products: "",
      }));
      try {
        const res = await submitBookedConsultation(formData);

        setStepError(res.message || "Consultation booked successfully!");
        console.log("API Response:", res);
      } catch (error) {
        console.log("API Error:", error);
        setStepError("Something went wrong! Please try again.");
      }

      return;
    }

    // YES → Next Step
    if (routineChoice === "yes") {
      handleNext();
    }
  };

  const handleFinalSubmit = () => {
  if (!productUse) {
    setStepError("Please select at least one product");
    return;
  }

  setStepError("");

  // ✅ Popup Open
  setShowPopup(true);
};

//   const handleFinalSubmit = async () => {
//     if (!productUse) {
//       setStepError("Please select at least one product");
//       return;
//     }

//     setStepError("");

//     const finalPayload = {
//       ...formData,
//       skincare: skincareTime,
//       skin_type: skinType,
//       skin_type_second: sensitiveType,
//       skin_goal: goal,
//       skin_care_products: productUse,
//     };

//     try {
//       const res = await submitBookedConsultation(finalPayload);

//       setStepError(res.message || "Consultation booked successfully!");
//       console.log("FINAL API RESPONSE:", res);

//       // Optional Reset
//       setStep(1);
//     } catch (error) {
//       console.log("API Error:", error);
//       setStepError("Something went wrong while submitting. Please try again.");
//     }
//   };
const handlePopupFinish = async () => {
  const finalPayload = {
    ...formData,
    skincare: skincareTime,
    skin_type: skinType,
    skin_type_second: sensitiveType,
    skin_goal: goal,
    skin_care_products: productUse,
  };

  try {
    const res = await submitBookedConsultation(finalPayload);

    console.log("FINAL API RESPONSE:", res);

    // ✅ Popup Close
    setShowPopup(false);

    // ✅ Reset Form
    setStep(1);
    setRoutineChoice("");
    setSubmitted(false);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      treatments: "",
      day: "",
      start_time: "",
      end_time: "",
      message: "",
      skincare: "",
      skin_type: "",
      skin_type_second: "",
      skin_goal: "",
      skin_care_products: "",
      type: "offline",
    });
  } catch (error) {
    console.log("API Error:", error);
    setStepError("Something went wrong while submitting.");
  }
};

  return (
    <>
      <SimpleHeroBanner
        background={book}
        title="Book a Skin Consultation"
        breadcrumb={<Breadcrumb />}
      />
      {/* ------- */}
      <section className="py-12 lg:py-[110px]">
        <div className="container mx-auto">
          <div className="border-[10px] border-[#F6F6F6]">
            {/* Header */}
            <div className="bg-[#F7EFEC] p-4 md:p-5 text-center">
              <h3 className="text-[#282828] text-base md:text-2xl font-semibold">
                {step === 1 && "Book a Skin Consultation"}
                {step === 2 && "When do you use your skincare?"}
                {step === 3 && "How do you describe your skin type?"}
                {step === 4 && "What is your primary skin goal?"}
                {step === 5 && "What skin care products do you use?"}
              </h3>
            </div>

            {/* Form Body */}
            <div className="p-4 md:p-[30px]">
              {step === 1 && (
                <form className="grid grid-cols-12 md:gap-x-[40px] gap-y-[15px] sm:gap-y-[30px]">
                  {/* First Name */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Enter You First Name"
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    {submitted && !formData.firstName && (
                      <p className="text-red-500 text-sm mt-2">
                        First name is required
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Enter You Last Name"
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    {submitted && !formData.lastName && (
                      <p className="text-red-500 text-sm mt-2">
                        Last name is required
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter You E-mail"
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />

                    {submitted && !formData.email && (
                      <p className="text-red-500 text-sm mt-2">
                        E-mail is required
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      Mobile Number
                    </label>
                    <PhoneInput
                      country="gb"
                      enableSearch
                      value={formData.mobile}
                      onChange={(value) =>
                        setFormData({ ...formData, mobile: `+${value}` })
                      }
                      containerClass="!w-full"
                      inputClass="
                        !w-full
                        !h-[48px]
                        !pl-[60px]
                        !border-0
                        !border-b
                        !border-[#666666]/30
                        !rounded-none
                        !text-sm
                        !text-[#666666]
                        !font-quattro
                        focus:!outline-none
                        "
                      buttonClass="
                        !border-0
                        !border-b
                        !border-[#666666]/30
                        !rounded-none
                        !bg-transparent
                        "
                      dropdownClass="!text-sm"
                    />
                    {submitted && !formData.mobile && (
                      <p className="text-red-500 text-sm mt-2">
                        Mobile number is required
                      </p>
                    )}
                  </div>

                  {/* Treatments */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      Treatments
                    </label>
                    <select
                      value={formData.treatments}
                      onChange={(e) =>
                        setFormData({ ...formData, treatments: e.target.value })
                      }
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    >
                      <option value="">Select Treatment</option>

                      <option value="Image Peel & Chemical Peel">
                        Image Peel & Chemical Peel
                      </option>

                      <option value="3D - HydrO2 Facial">
                        3D - HydrO2 Facial
                      </option>

                      <option value="Hifu">Hifu</option>

                      <option value="3D Emlift">3D Emlift</option>

                      <option value="Fat Freezing">Fat Freezing</option>

                      <option value="Skin Tightening Face And Body">
                        Skin Tightening Face And Body
                      </option>

                      <option value="Bum Lift, Thigh Gap & Bingo Wing">
                        Bum Lift, Thigh Gap & Bingo Wing
                      </option>

                      <option value="Fat Reduction (Cavitation - inch loss)">
                        Fat Reduction (Cavitation - inch loss)
                      </option>

                      <option value="Cellulite Reduction">
                        Cellulite Reduction
                      </option>

                      <option value="Skinpen - Microneedling">
                        Skinpen - Microneedling
                      </option>

                      <option value="CO2 Fractional Skin Resurfacing">
                        CO2 Fractional Skin Resurfacing
                      </option>
                    </select>

                    {submitted && !formData.treatments && (
                      <p className="text-red-500 text-sm mt-2">
                        Please select a treatment
                      </p>
                    )}
                  </div>

                  {/* Day */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      Day
                    </label>
                    <input
                      type="date"
                      value={formData.day}
                      onChange={(e) =>
                        setFormData({ ...formData, day: e.target.value })
                      }
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    {submitted && !formData.day && (
                      <p className="text-red-500 text-sm mt-2">
                        Date is required
                      </p>
                    )}
                  </div>

                  {/* Start Time */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      Start Time
                    </label>
                    <select
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData({ ...formData, start_time: e.target.value })
                      }
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    >
                      <option value="">Select Start Time</option>

                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>

                    {submitted && !formData.start_time && (
                      <p className="text-red-500 text-sm mt-2">
                        Start time is required
                      </p>
                    )}
                  </div>

                  {/* End Time */}
                  <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      End Time
                    </label>
                    <select
                      value={formData.end_time}
                      onChange={(e) =>
                        setFormData({ ...formData, end_time: e.target.value })
                      }
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    >
                      <option value="">Select End Time</option>

                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>

                    {submitted && !formData.end_time && (
                      <p className="text-red-500 text-sm mt-2">
                        End time is required
                      </p>
                    )}
                    {submitted &&
                      formData.start_time &&
                      formData.end_time &&
                      formData.start_time === formData.end_time && (
                        <p className="text-red-500 text-sm mt-2">
                          Start time and end time cannot be the same
                        </p>
                      )}
                  </div>

                  {/* Message */}
                  <div className="col-span-12 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Leave a comment here"
                      rows={4}
                      className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666] resize-none"
                    />
                  </div>

                  {/* Radio Options */}
                  <div className="col-span-12 flex justify-start sm:justify-center gap-3 md:gap-10 text-xs tracking-widest flex-wrap">
                    {/* Tell us */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="routine"
                        value="yes"
                        checked={routineChoice === "yes"}
                        onChange={() => setRoutineChoice("yes")}
                        className="accent-black w-4 h-4"
                      />
                      TELL US ABOUT YOURSELF AND SKIN ROUTINE
                    </label>

                    {/* Skip */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="routine"
                        value="skip"
                        checked={routineChoice === "skip"}
                        onChange={() => setRoutineChoice("skip")}
                        className="accent-black w-4 h-4"
                      />
                      SKIP
                    </label>
                  </div>
                  <div className="col-span-12">
                    {stepError && (
                      <p className="text-red-500 text-sm text-center mb-4">
                        {stepError}
                      </p>
                    )}
                  </div>
                  {/* Buttons */}
                  <div className="col-span-12 flex justify-center gap-3 sm:gap-6 flex-wrap">
                    <CommonButton type="button" onClick={handleStep1Submit}>
                      REQUEST A CALL BACK
                    </CommonButton>

                    <CommonButton type="button" onClick={handleStep1Submit}>
                      BOOK NOW
                    </CommonButton>
                  </div>
                </form>
              )}

              {step === 2 && routineChoice === "yes" && (
                <>
                  <div className="grid grid-cols-12 sm:gap-[25px] sm:gap-y-[30px]">
                    {skincareOptions.map((item) => (
                      <div
                        key={item.value}
                        className="col-span-12 sm:col-span-6 lg:col-span-3"
                      >
                        <label
                          className={`cursor-pointer border-[5px] flex justify-center items-center flex-col py-[37px] transition-all duration-300
                                                    ${skincareTime === item.value ? "border-black" : "border-[#F6F6F6]"}
                                                    `}
                        >
                          {/* Hidden Radio */}
                          <input
                            type="radio"
                            name="skincareTime"
                            value={item.value}
                            className="hidden"
                            onChange={() => setSkincareTime(item.value)}
                          />

                          {/* Icon Circle */}
                          <div className="w-[44px] h-[44px] rounded-full bg-[#F7EFEC] flex items-center justify-center mb-[12px]">
                            <img
                              src={item.icon}
                              alt={item.label}
                              className=""
                            />
                          </div>

                          {/* Label */}
                          <h4 className="text-sm font-quattro">{item.label}</h4>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-12 flex justify-center flex-col items-center mt-6">
                    {stepError && (
                      <p className="text-red-500 text-sm text-center mb-4">
                        {stepError}
                      </p>
                    )}
                    <CommonButton type="button" onClick={handleStep2Next}>
                      Continue
                    </CommonButton>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step > 1 && handleBack()}
                    >
                      <LuMoveLeft />
                    </div>
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step < 5 && handleNext()}
                    >
                      <LuMoveRight />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && routineChoice === "yes" && (
                <>
                  <div className="border-[4px] border-[#F6F6F6] flex justify-center items-center mb-5 flex-wrap">
                    {options.map((item) => (
                      <label
                        key={item}
                        className={`cursor-pointer text-sm py-[11px] px-[15px] tracking-[2px] transition-all duration-300 mb-0
            ${
              skinType === item
                ? "bg-[#f7EFEC] text-[#282828]"
                : "bg-white text-[#282828]"
            }`}
                      >
                        <input
                          type="radio"
                          name="skinType"
                          value={item}
                          className="hidden"
                          onChange={() => setSkinType(item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                  <div className="border-[4px] border-[#F6F6F6] flex justify-center items-center flex-wrap">
                    {sensitivity.map((item) => (
                      <label
                        key={item}
                        className={`cursor-pointer text-sm py-[11px] px-[15px] tracking-[2px] transition-all duration-300 mb-0
            ${
              sensitiveType === item
                ? "bg-[#f7EFEC] text-[#282828]"
                : "bg-white text-[#282828]"
            }`}
                      >
                        <input
                          type="radio"
                          name="sensitiveType"
                          value={item}
                          className="hidden"
                          onChange={() => setSensitiveType(item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                  <div className="col-span-12 flex justify-center flex-col items-center  mt-[30px]">
                    {stepError && (
                      <p className="text-red-500 text-sm text-center mb-4">
                        {stepError}
                      </p>
                    )}
                    <CommonButton
                      type="button"
                      onClick={() => {
                        if (!skinType || !sensitiveType) {
                          setStepError("Please select skin type & sensitivity");
                          return;
                        }

                        setStepError("");
                        setFormData((prev) => ({
                          ...prev,
                          skin_type: skinType,
                          skin_type_second: sensitiveType,
                        }));

                        handleNext();
                      }}
                    >
                      Continue
                    </CommonButton>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step > 1 && handleBack()}
                    >
                      <LuMoveLeft />
                    </div>
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step < 5 && handleNext()}
                    >
                      <LuMoveRight />
                    </div>
                  </div>
                </>
              )}

              {step === 4 && routineChoice === "yes" && (
                <>
                  <div className="grid grid-cols-12 gap-5">
                    {goals.map((item) => (
                      <div key={item} className="col-span-12 md:col-span-6">
                        <label
                          className={`flex items-center gap-3 cursor-pointer
        py-[12px] pr-[10px] pl-[20px]
        text-[#212529] text-sm tracking-wide
        border transition-all duration-300 mb-0
        border-transparent bg-[#f6f6f6]
      `}
                        >
                          {/* Hidden Input */}
                          <input
                            type="radio"
                            name="goal"
                            value={item}
                            checked={goal === item}
                            className="hidden"
                            onChange={() => setGoal(item)}
                          />

                          {/* Custom Circle */}
                          <span
                            className={`w-[16px] h-[16px] rounded-full border flex items-center justify-center
          ${goal === item ? "border-black" : "border-gray-400"}
        `}
                          >
                            {goal === item && (
                              <span className="w-[8px] h-[8px] rounded-full bg-black"></span>
                            )}
                          </span>

                          {/* Text */}
                          <span>{item}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-12 flex justify-center flex-col items-center mt-[30px]">
                    {stepError && (
                      <p className="text-red-500 text-sm text-center mb-4">
                        {stepError}
                      </p>
                    )}
                    <CommonButton
                      type="button"
                      onClick={() => {
                        if (!goal) {
                          setStepError("Please select your primary skin goal");
                          return;
                        }

                        setStepError("");

                        setFormData((prev) => ({
                          ...prev,
                          skin_goal: goal,
                        }));

                        handleNext();
                      }}
                    >
                      Continue
                    </CommonButton>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step > 1 && handleBack()}
                    >
                      <LuMoveLeft />
                    </div>
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step < 5 && handleNext()}
                    >
                      <LuMoveRight />
                    </div>
                  </div>
                </>
              )}

              {step === 5 && routineChoice === "yes" && (
                <>
                  <div className="grid grid-cols-12 sm:gap-[25px] justify-center">
                    {productOptions.map((item, index) => (
                      <div
                        key={item.value}
                        className={`
        col-span-12 sm:col-span-6 md:col-span-4 
        lg:col-span-3 
        ${index === 0 ? "lg:col-start-3" : ""}
      `}
                      >
                        <label
                          className={`cursor-pointer border-[4px] flex flex-col items-center justify-center
                py-[50px] transition-all duration-300 text-center

                ${productUse === item.value ? "border-black" : "border-[#F6F6F6]"}
            `}
                        >
                          {/* Hidden Radio */}
                          <input
                            type="radio"
                            name="productUse"
                            value={item.value}
                            className="hidden"
                            onChange={() => setProductUse(item.value)}
                          />

                          {/* Icon Circle */}
                          <div
                            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center mb-[12px]
                bg-[#F7EFEC] text-black`}
                          >
                            <img src={item.icon} alt={item.label} />
                          </div>

                          {/* Label */}
                          <h4 className="text-sm font-quattro">{item.label}</h4>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-[40px] flex-col items-center">
                    {stepError && (
                      <p className="text-red-500 text-sm text-center mb-4">
                        {stepError}
                      </p>
                    )}
                    <CommonButton type="button" onClick={handleFinalSubmit}>
                      Submit
                    </CommonButton>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div
                      className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                      onClick={() => step > 1 && handleBack()}
                    >
                      <LuMoveLeft />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <ThankYouPopup
  open={showPopup}
  onClose={() => setShowPopup(false)}
  onFinish={handlePopupFinish}
/>
    </>
  );
}

export default BookCounsultation;
