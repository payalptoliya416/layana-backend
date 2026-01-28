import { useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { changePassword } from "@/services/bookedConsultation";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPopup({ onClose }: any) {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
const [message, setMessage] = useState<{
  type: "success" | "error" | "";
  text: string;
}>({
  type: "",
  text: "",
});

  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
const showMessage = (type: "success" | "error", text: string) => {
  setMessage({ type, text });

  setTimeout(() => {
    setMessage({ type: "", text: "" });
  }, 3000); // 3 sec
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setFieldErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let errors: any = {};

    // ✅ Check All Fields
    if (!formData.current_password) {
      errors.current_password = "Current password is required";
    }

    if (!formData.new_password) {
      errors.new_password = "New password is required";
    }

    if (!formData.confirm_password) {
      errors.confirm_password = "Confirm password is required";
    }

    // ✅ Show All Errors Together
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // ✅ Password Match Validation
    if (formData.new_password !== formData.confirm_password) {
      showMessage("error", "New password and confirm password do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await changePassword(formData);

     showMessage("success", res?.message || "Password updated successfully!");

  setTimeout(() => {
    onClose();
  }, 2000);

    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      } else {
       showMessage("error", error?.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
      <div className="relative w-full max-w-md rounded-xl bg-card p-6 border shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-semibold text-center mb-5 text-foreground">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="text-sm font-medium text-foreground">
      Current Password <span className="text-red-500">*</span>
    </label>
         <div className="relative">
          
  <input
    type={showPassword.current ? "text" : "password"}
    name="current_password"
    placeholder="Current Password"
    value={formData.current_password}
    onChange={handleChange}
      className={`form-input pr-10 ${
    fieldErrors.current_password ? "border border-red-500 focus:ring-red-500" : ""
  }`}
  />

  {/* Eye Button */}
  <button
    type="button"
    onClick={() =>
      setShowPassword((prev) => ({
        ...prev,
        current: !prev.current,
      }))
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  >
    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>

  {/* Error */}
         </div>
          {fieldErrors.current_password && (
            <p className="text-red-500 text-xs mt-1">
              {Array.isArray(fieldErrors.current_password)
                ? fieldErrors.current_password[0]
                : fieldErrors.current_password}
            </p>
          )}
            </div>


          {/* New Password */}
          <div className="">
           <label className="text-sm font-medium text-foreground">
      New Password <span className="text-red-500">*</span>
    </label>
        <div className="relative">
  <input
    type={showPassword.new ? "text" : "password"}
    name="new_password"
    placeholder="New Password"
    value={formData.new_password}
    onChange={handleChange}
    className={`form-input pr-10 ${
    fieldErrors.current_password ? "border border-red-500 focus:ring-red-500" : ""
  }`}
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword((prev) => ({
        ...prev,
        new: !prev.new,
      }))
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  >
    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>

</div>
  {fieldErrors.new_password && (
    <p className="text-red-500 text-xs mt-1">
      {Array.isArray(fieldErrors.new_password)
        ? fieldErrors.new_password[0]
        : fieldErrors.new_password}
    </p>
  )}
          </div>

          {/* Confirm Password */}
          <div className="">
             <label className="text-sm font-medium text-foreground">
       Confirm Password <span className="text-red-500">*</span>
    </label>
       <div className="relative">
  <input
    type={showPassword.confirm ? "text" : "password"}
    name="confirm_password"
    placeholder="Confirm Password"
    value={formData.confirm_password}
    onChange={handleChange}
      className={`form-input pr-10 ${
    fieldErrors.current_password ? "border border-red-500 focus:ring-red-500" : ""
  }`}
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword((prev) => ({
        ...prev,
        confirm: !prev.confirm,
      }))
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  >
    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>

</div>
  {fieldErrors.confirm_password && (
    <p className="text-red-500 text-xs mt-1">
      {Array.isArray(fieldErrors.confirm_password)
        ? fieldErrors.confirm_password[0]
        : fieldErrors.confirm_password}
    </p>
  )}
          </div>

          {/* Submit Button */}
          {/* Inline Message */}
{message.text && (
  <p
    className={`text-sm text-center mb-2 ${
      message.type === "success"
        ? "text-green-600"
        : "text-red-500"
    }`}
  >
    {message.text}
  </p>
)}

          <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-2 text-primary-foreground shadow-button hover:opacity-90 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
