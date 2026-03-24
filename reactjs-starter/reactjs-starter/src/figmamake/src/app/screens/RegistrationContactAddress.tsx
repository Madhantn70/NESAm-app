import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ProgressStepper } from "../components/ProgressStepper";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function RegistrationContactAddress() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate required fields
    if (
      formData.mobile.length === 10 &&
      formData.addressLine1 &&
      formData.city &&
      formData.state &&
      formData.pinCode.length === 6
    ) {
      navigate("/register/age-details");
    }
  };

  const isFormValid =
    formData.mobile.length === 10 &&
    formData.addressLine1.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.pinCode.length === 6;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper currentStep={1} />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-foreground">Contact Details</h1>
            <p className="text-center text-sm text-muted-foreground">
              Step 1 of 5
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Mobile Number */}
            <div className="flex flex-col gap-3">
              <label htmlFor="mobile" className="text-foreground">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-4 py-3 bg-white rounded-lg border-2 border-border min-h-[3rem]">
                  <span className="text-foreground">+91</span>
                </div>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={formData.mobile}
                  onChange={(e) =>
                    handleChange(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  className="flex-1"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="flex flex-col gap-3">
              <label htmlFor="address1" className="text-foreground">
                Address Line 1
              </label>
              <Input
                id="address1"
                type="text"
                placeholder="House/Flat No., Building Name"
                value={formData.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
              />
            </div>

            {/* Address Line 2 */}
            <div className="flex flex-col gap-3">
              <label htmlFor="address2" className="text-foreground">
                Address Line 2
              </label>
              <Input
                id="address2"
                type="text"
                placeholder="Street, Area, Locality"
                value={formData.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-3">
              <label htmlFor="city" className="text-foreground">
                City
              </label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-3">
              <label htmlFor="state" className="text-foreground">
                State
              </label>
              <Input
                id="state"
                type="text"
                placeholder="Enter state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>

            {/* PIN Code */}
            <div className="flex flex-col gap-3">
              <label htmlFor="pincode" className="text-foreground">
                PIN Code
              </label>
              <Input
                id="pincode"
                type="text"
                placeholder="Enter 6-digit PIN"
                value={formData.pinCode}
                onChange={(e) =>
                  handleChange(
                    "pinCode",
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-3">
              <label htmlFor="country" className="text-foreground">
                Country
              </label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full"
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}