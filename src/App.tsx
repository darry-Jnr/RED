import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ChooseRole from "./pages/ChooseRole";

// 🔐 Protected Route
import ProtectedRoute from "./components/auth/ProtectedRoute";
import VerifyEmail from "./components/auth/VerifyEmail";

// Freelancer Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Freelancers/AuthPages/SignUp";
import NotFound from "./pages/Freelancers/OtherPage/NotFound";
import UserProfiles from "./pages/Freelancers/UserProfiles";
import Calendar from "./pages/Freelancers/Calendar";
import AppLayout from "./layout/Freelancer/AppLayout";
import Home from "./pages/Freelancers/Dashboard/Home";
import BrowseJob from "./pages/Freelancers/Dashboard/BrowseJob";
import Messages from "./pages/Freelancers/Dashboard/Messages";
import LandingLayout from "./layout/LandingLayout";
import MessagesInbox from "./pages/Freelancers/Dashboard/MessagesInbox";
// Clients Pages
import ClientsLayout from "./layout/clients/ClientsLayout";
import ClientsHome from "./pages/Clients/Clients_Dashboard/Home";
import ClientsProfile from "./pages/Clients/Clients_Dashboard/ClientsProfile";
import ClientMessages from "./pages/Clients/Clients_Dashboard/ClientsMessages";
import Myjobs from "./pages/Clients/Clients_Dashboard/Myjobs";
import PostJob from "./pages/Clients/Clients_Dashboard/PostJob";
import CSignUp from "./pages/Clients/AuthPages/SignUp";
import JobPaymentWrapper from "./pages/Clients/Clients_Dashboard/JobPaymentWrapper";
import PaymentSuccess from "./pages/Clients/Clients_Dashboard/PaymentSuccess";
import EditJob from "./pages/Clients/Clients_Dashboard/EditJob";
import ClientsMessagesInbox from "./pages/Clients/Clients_Dashboard/ClientsMessagesInbox";

// Utilities
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* 🌟 Landing Page */}
        <Route path="/" element={<LandingLayout />} />

        {/* 🌟 Choose Role Page */}
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/clients/edit-job/:id" element={<EditJob />} />

        {/* 🔐 Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/freelancer/signup" element={<SignUp />} />
        <Route path="/clients/signup" element={<CSignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ✅ FIXED: Client Payment Route (Outside Nest) */}
        <Route
          path="/clients/payment/:jobId"
          element={
            <ProtectedRoute>
              <JobPaymentWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* 🧑‍💻 Freelancer Protected Routes */}
        <Route
          path="/freelancer"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="browse-job" element={<BrowseJob />} />
          <Route path="messages" element={<ClientsMessagesInbox />} />
          <Route path="messages/:chatId" element={<ClientMessages />} />

          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>

        {/* 🧑‍💼 Client Protected Routes */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<ClientsHome />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="my-jobs" element={<Myjobs />} />
          <Route path="messages" element={<MessagesInbox />} />
          <Route path="messages/:chatId" element={<Messages />} />

          <Route path="client-profile" element={<ClientsProfile />} />
        </Route>

        {/* 🚫 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
