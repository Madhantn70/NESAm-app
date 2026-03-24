import { createBrowserRouter } from "react-router";
import GuestPublicImpact from "./screens/GuestPublicImpact";
import Login from "./screens/Login";
import MemberHome from "./screens/MemberHome";
import MemberImpact from "./screens/MemberImpact";
import MemberActiveDFC from "./screens/MemberActiveDFC";
import AdminDashboard from "./screens/AdminDashboard";
import RegistrationEnterEmail from "./screens/RegistrationEnterEmail";
import RegistrationNotFound from "./screens/RegistrationNotFound";
import RegistrationMembershipPending from "./screens/RegistrationMembershipPending";
import RegistrationVerified from "./screens/RegistrationVerified";
import RegistrationContactAddress from "./screens/RegistrationContactAddress";
import RegistrationAgeDetails from "./screens/RegistrationAgeDetails";
import RegistrationNomineeDetails from "./screens/RegistrationNomineeDetails";
import RegistrationResume from "./screens/RegistrationResume";
import RegistrationMembershipBenefit from "./screens/RegistrationMembershipBenefit";
import RegistrationAdvanceDFC from "./screens/RegistrationAdvanceDFC";
import RegistrationFinalSummary from "./screens/RegistrationFinalSummary";
import RegistrationPaymentMethod from "./screens/RegistrationPaymentMethod";
import RegistrationPaymentProcessing from "./screens/RegistrationPaymentProcessing";
import RegistrationPaymentSuccess from "./screens/RegistrationPaymentSuccess";
import RegistrationPaymentFailure from "./screens/RegistrationPaymentFailure";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: GuestPublicImpact,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register/enter-email",
    Component: RegistrationEnterEmail,
  },
  {
    path: "/register/not-found",
    Component: RegistrationNotFound,
  },
  {
    path: "/register/membership-pending",
    Component: RegistrationMembershipPending,
  },
  {
    path: "/register/verified",
    Component: RegistrationVerified,
  },
  {
    path: "/register/resume",
    Component: RegistrationResume,
  },
  {
    path: "/register/contact-address",
    Component: RegistrationContactAddress,
  },
  {
    path: "/register/age-details",
    Component: RegistrationAgeDetails,
  },
  {
    path: "/register/nominee-details",
    Component: RegistrationNomineeDetails,
  },
  {
    path: "/register/membership-benefit",
    Component: RegistrationMembershipBenefit,
  },
  {
    path: "/register/advance-dfc",
    Component: RegistrationAdvanceDFC,
  },
  {
    path: "/register/final-summary",
    Component: RegistrationFinalSummary,
  },
  {
    path: "/register/payment-method",
    Component: RegistrationPaymentMethod,
  },
  {
    path: "/register/payment-processing",
    Component: RegistrationPaymentProcessing,
  },
  {
    path: "/register/payment-success",
    Component: RegistrationPaymentSuccess,
  },
  {
    path: "/register/payment-failure",
    Component: RegistrationPaymentFailure,
  },
  {
    path: "/member/home",
    Component: MemberHome,
  },
  {
    path: "/member/impact",
    Component: MemberImpact,
  },
  {
    path: "/member/active-dfc",
    Component: MemberActiveDFC,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "*",
    Component: GuestPublicImpact,
  },
]);