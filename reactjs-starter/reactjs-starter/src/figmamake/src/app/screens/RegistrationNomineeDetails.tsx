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

export default function RegistrationNomineeDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomineeName: "",
    relationship: "",
    nomineeMobile: "",
    nomineeEmail: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (
      formData.nomineeName &&
      formData.relationship &&
      formData.nomineeMobile.length === 10
    ) {
      navigate("/register/membership-benefit");
    }
  };

  const isFormValid =
    formData.nomineeName.trim() !== "" &&
    formData.relationship.trim() !== "" &&
    formData.nomineeMobile.length === 10;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Progress Stepper */}
      <ProgressStepper currentStep={3} />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col">
        <div className="flex flex-col gap-8 pt-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-foreground">Nominee Details</h1>
            <p className="text-center text-sm text-muted-foreground">
              Step 3 of 5
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Nominee Name */}
            <div className="flex flex-col gap-3">
              <label htmlFor="nomineeName" className="text-foreground">
                Nominee Name
              </label>
              <Input
                id="nomineeName"
                type="text"
                placeholder="Enter full name"
                value={formData.nomineeName}
                onChange={(e) => handleChange("nomineeName", e.target.value)}
              />
            </div>

            {/* Relationship */}
            <div className="flex flex-col gap-3">
              <label htmlFor="relationship" className="text-foreground">
                Relationship
              </label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => handleChange("relationship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Son">Son</SelectItem>
                  <SelectItem value="Daughter">Daughter</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Brother">Brother</SelectItem>
                  <SelectItem value="Sister">Sister</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nominee Mobile */}
            <div className="flex flex-col gap-3">
              <label htmlFor="nomineeMobile" className="text-foreground">
                Nominee Mobile
              </label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-4 py-3 bg-white rounded-lg border-2 border-border min-h-[3rem]">
                  <span className="text-foreground">+91</span>
                </div>
                <Input
                  id="nomineeMobile"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={formData.nomineeMobile}
                  onChange={(e) =>
                    handleChange(
                      "nomineeMobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  className="flex-1"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Nominee Email */}
            <div className="flex flex-col gap-3">
              <label htmlFor="nomineeEmail" className="text-foreground">
                Nominee Email
              </label>
              <Input
                id="nomineeEmail"
                type="email"
                placeholder="Enter email (optional)"
                value={formData.nomineeEmail}
                onChange={(e) => handleChange("nomineeEmail", e.target.value)}
              />
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