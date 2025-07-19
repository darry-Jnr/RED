import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ChooseRole from "./pages/ChooseRole";
import EscrowPage from "./components/Escrow/EscrowPage";
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
import Messages from "./pages/Freelancers/Dashboard/Messages"; // Handles inbox + chatroom for Freelancer
import LandingLayout from "./layout/LandingLayout";
import ChooseDashboard from "./pages/ChooseDashboard";
import AccountSettingsPage from "./pages/AccountSettingsPage";

// Clients Pages
import ClientsLayout from "./layout/clients/ClientsLayout";
import ClientsHome from "./pages/Clients/Clients_Dashboard/Home";
import ClientsProfile from "./pages/Clients/Clients_Dashboard/ClientsProfile";
import ClientMessages from "./pages/Clients/Clients_Dashboard/ClientsMessages"; // ChatRoom for Client
import ClientsMessagesInbox from "./pages/Clients/Clients_Dashboard/ClientsMessagesInbox"; // Inbox for Client
import Myjobs from "./pages/Clients/Clients_Dashboard/Myjobs";
import PostJob from "./pages/Clients/Clients_Dashboard/PostJob";
import CSignUp from "./pages/Clients/AuthPages/SignUp";
import JobPaymentWrapper from "./pages/Clients/Clients_Dashboard/JobPaymentWrapper";
import PaymentSuccess from "./pages/Clients/Clients_Dashboard/PaymentSuccess";
import EditJob from "./pages/Clients/Clients_Dashboard/EditJob";

// Utilities
import { ScrollToTop } from "./components/common/ScrollToTop";

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setupUserPresence } from "./utils/firebase/setUserOnline";

export default function App() {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setupUserPresence(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* 🌟 Landing Page */}
        <Route path="/" element={<LandingLayout />} />

        {/* 🌟 Choose Role Pages */}
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/choose-dashboard" element={<ChooseDashboard />} />

        {/* Edit Job */}
        <Route path="/clients/edit-job/:id" element={<EditJob />} />

        {/* 🔐 Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/freelancer/signup" element={<SignUp />} />
        <Route path="/clients/signup" element={<CSignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        {/* ✅ Client Payment Routes */}
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

          {/* Freelancer Messages (Inbox + ChatRoom handled inside Messages) */}
          <Route path="messages/*" element={<Messages />} />

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

          {/* Client Messages */}
          <Route path="messages" element={<ClientsMessagesInbox />} />
          <Route path="messages/:chatId/*" element={<ClientMessages />} />

          <Route path="client-profile" element={<ClientsProfile />} />

          <Route path="escrow/:jobId" element={<EscrowPage />} />
        </Route>

        {/* 🚫 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

