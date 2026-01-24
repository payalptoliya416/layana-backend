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

    
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  treatments: string;
  day: string;
  startTime: string;
  endTime: string;
  message: string;
}

interface SkincareData {
  skincareTime: string;
  skinType: string;
  sensitiveType: string;
  skinGoal: string;
  productUse: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  treatments?: string;
  day?: string;
  time?: string;
}


    function BookCounsultation() {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);

    // Routine Choice
    const [routineChoice, setRoutineChoice] = useState("");

    // All Form Data
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
    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

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
        { label: "Morning", value: "morning", icon: <IoMdSunny /> },
        { label: "Night", value: "night", icon: <BsMoonFill /> },
        { label: "Morning & Night", value: "both", icon: <TbSunMoon /> },
        { label: "Never", value: "never", icon: <IoCloseSharp /> },
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
        icon: <FaPumpSoap />,
        },
        {
        label: "SPF",
        value: "spf",
        icon: <FaPumpSoap />,
        },
        {
        label: "Other",
        value: "other",
        icon: <FaPumpSoap />,
        },
    ];
    const sensitivity = ["Very Sensitive", "Quite Sensitive", "Not Sensitive"];
    
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
                    Book a Skin Consultation
                </h3>
                </div>

                {/* Form Body */}
                <div className="p-[30px]">
                <form className="grid grid-cols-12 gap-x-[40px] gap-y-[30px]">
                    {/* First Name */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        First Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter You First Name"
                        className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    <p className="text-red-500 text-sm mt-2">
                        First name is required
                    </p>
                    </div>

                    {/* Last Name */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        Last Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter You Last Name"
                        className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    <p className="text-red-500 text-sm mt-2">
                        Last name is required
                    </p>
                    </div>

                    {/* Email */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        E-mail
                    </label>
                    <input
                        type="email"
                        placeholder="Enter You E-mail"
                        className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    <p className="text-red-500 text-sm mt-2">
                        E-mail is required
                    </p>
                    </div>

                    {/* Mobile */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        Mobile Number
                    </label>
                    <PhoneInput
                        country="gb"
                        enableSearch
                        // value={formData.phone}
                        //     onChange={(value) =>
                        //     setFormData((prev) => ({
                        //       ...prev,
                        //       phone: `+${value}`,
                        //     }))
                        //   }
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
                    <p className="text-red-500 text-sm mt-2">
                        Mobile number is required
                    </p>
                    </div>

                    {/* Treatments */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        Treatments
                    </label>
                    <select className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]">
                        <option>Select Treatment</option>
                        <option>Facial</option>
                        <option>Massage</option>
                    </select>
                    <p className="text-red-500 text-sm mt-2">
                        Please select a treatment
                    </p>
                    </div>

                    {/* Day */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        Day
                    </label>
                    <input
                        type="date"
                        className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]"
                    />
                    <p className="text-red-500 text-sm mt-2">Date is required</p>
                    </div>

                    {/* Start Time */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        Start Time
                    </label>
                    <select className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]">
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                    </select>
                    </div>

                    {/* End Time */}
                    <div className="col-span-12 md:col-span-6 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        End Time
                    </label>
                    <select className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666]">
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                    </select>
                    <p className="text-red-500 text-sm mt-2">
                        Start time and end time cannot be the same
                    </p>
                    </div>

                    {/* Message */}
                    <div className="col-span-12 text-left">
                    <label className="block text-base leading-[16px] mb-0">
                        Message
                    </label>
                    <textarea
                        placeholder="Leave a comment here"
                        rows={4}
                        className="mt-[12px] w-full border-b border-[#666666] pb-[10px] outline-none text-sm text-[#666666] resize-none"
                    />
                    </div>

                    {/* Radio Options */}
                    <div className="col-span-12 flex justify-center gap-10 text-xs tracking-widest">
                    {/* Tell us */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                        name="routine"
                        value="yes"
                        className="accent-black w-4 h-4"
                        onChange={() => setRoutineChoice("yes")}
                        />
                        TELL US ABOUT YOURSELF AND SKIN ROUTINE
                    </label>

                    {/* Skip */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                        name="routine"
                        value="skip"
                        className="accent-black w-4 h-4"
                        onChange={() => setRoutineChoice("skip")}
                        />
                        SKIP
                    </label>
                    </div>

                    {/* Buttons */}
                    <div className="col-span-12 flex justify-center gap-6">
                    <CommonButton>REQUEST A CALL BACK</CommonButton>
                    <CommonButton>BOOK NOW</CommonButton>
                    </div>
                </form>
                </div>
            </div>
            </div>

            {step === 2 && routineChoice === "yes" && (
            <div className="container mx-auto">
                <div className="border-[10px] border-[#F6F6F6]">
                {/* Header */}
                <div className="bg-[#F7EFEC] p-4 md:p-5 text-center">
                    <h3 className="text-[#282828] text-base md:text-2xl font-semibold">
                    When do you use your skincare?
                    </h3>
                </div>
                <div className="p-[30px]">
                    <div className="grid grid-cols-12 gap-[25px] gap-y-[30px]">
                    {skincareOptions.map((item) => (
                        <div key={item.value} className="col-span-12 md:col-span-3">
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
                            <span className="text-[18px]">{item.icon}</span>
                            </div>

                            {/* Label */}
                            <h4 className="text-sm font-quattro">{item.label}</h4>
                        </label>
                        </div>
                    ))}
                    </div>
                    <div className="col-span-12 flex justify-center mt-6">
                    <CommonButton
                        type="button"
                        onClick={() => {
                        if (routineChoice === "yes") {
                            handleNext(); // Step 2 open
                        } else {
                            alert("Skipped Extra Questions!");
                            console.log("Final Payload:", formData);
                        }
                        }}
                    >
                        Continue
                    </CommonButton>
                    </div>

                    <div className="flex justify-between items-center">
                    <div
                        className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                        onClick={handleBack}
                    >
                        <LuMoveLeft />
                    </div>
                    <div className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer">
                        <LuMoveRight />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}

            {step === 3 && routineChoice === "yes" && (
            <div className="container mx-auto">
                <div className="border-[10px] border-[#F6F6F6]">
                {/* Header */}
                <div className="bg-[#F7EFEC] p-4 md:p-5 text-center">
                    <h3 className="text-[#282828] text-base md:text-2xl font-semibold">
                    How do you describe your skin type?
                    </h3>
                </div>
                <div className="p-[30px]">
                    <div className="border-[4px] border-[#F6F6F6] flex justify-center items-center mb-5">
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
                    <div className="border-[4px] border-[#F6F6F6] flex justify-center items-center">
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
                    <div className="col-span-12 flex justify-center gap-6 mt-[30px]">
                    <CommonButton>Continue</CommonButton>
                    </div>
                    <div className="flex justify-between items-center">
                    <div
                        className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                        onClick={handleBack}
                    >
                        <LuMoveLeft />
                    </div>
                    <div className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer">
                        <LuMoveRight />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}

            {step === 4 && routineChoice === "yes" && (
            <div className="container mx-auto">
                <div className="border-[10px] border-[#F6F6F6]">
                {/* Header */}
                <div className="bg-[#F7EFEC] p-4 md:p-5 text-center">
                    <h3 className="text-[#282828] text-base md:text-2xl font-semibold">
                    What is your primary skin goal?
                    </h3>
                </div>
                <div className="p-[30px]">
                    <div className="grid grid-cols-12 gap-5">
                    {goals.map((item) => (
                        <div key={item} className="col-span-12 md:col-span-6">
                        <label
                            className={`flex items-center gap-3 cursor-pointer
            py-[12px] pr-[10px] pl-[20px]
            text-[#212529] text-sm tracking-wide
            border transition-all duration-300 mb-0
            ${
                goal === item
                ? "border-black bg-white"
                : "border-transparent bg-[#f6f6f6]"
            }
            `}
                        >
                            {/* Hidden Input */}
                            <input
                            type="radio"
                            name="goal"
                            value={item}
                            className="hidden"
                            onChange={() => setGoal(item)}
                            />

                            {/* Custom Circle */}
                            <span
                            className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center
                ${goal === item ? "border-black" : "border-gray-400"}
            `}
                            >
                            {goal === item && (
                                <span className="w-[7px] h-[7px] rounded-full bg-black"></span>
                            )}
                            </span>

                            {/* Text */}
                            <span>{item}</span>
                        </label>
                        </div>
                    ))}
                    </div>
                    <div className="col-span-12 flex justify-center gap-6 mt-[30px]">
                    <CommonButton>Continue</CommonButton>
                    </div>
                    <div className="flex justify-between items-center">
                    <div
                        className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                        onClick={handleBack}
                    >
                        <LuMoveLeft />
                    </div>
                    <div className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer">
                        <LuMoveRight />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}

            {step === 5 && routineChoice === "yes" && (
            <div className="container mx-auto">
                <div className="border-[10px] border-[#F6F6F6]">
                {/* Header */}
                <div className="bg-[#F7EFEC] p-4 md:p-5 text-center">
                    <h3 className="text-[#282828] text-base md:text-2xl font-semibold">
                    What skin care products do you use?
                    </h3>
                </div>
                <div className="p-[30px]">
                    <div className="grid grid-cols-12 gap-[25px] justify-center">
                    {productOptions.map((item, index) => (
                        <div
                        key={item.value}
                        className={`col-span-12 md:col-span-3 ${
                            index === 0 ? "md:col-start-2" : ""
                        }`}
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
                            <span className="text-[18px]">{item.icon}</span>
                            </div>

                            {/* Label */}
                            <h4 className="text-sm font-quattro">{item.label}</h4>
                        </label>
                        </div>
                    ))}
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-center mt-[40px]">
                    <CommonButton type="button" onClick={handleNext}>
                        Continue
                    </CommonButton>
                    </div>
                    <div className="flex justify-between items-center">
                    <div
                        className="w-10 h-10 border border-black flex justify-center items-center cursor-pointer"
                        onClick={handleBack}
                    >
                        <LuMoveLeft />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}
        </section>
        </>
    );
    }

    export default BookCounsultation;
