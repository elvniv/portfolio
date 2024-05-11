import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import SignUp from './Authentication/SignUp';
import Login from './Authentication/login';
import ForgotPasword from './Authentication/ForgotPasword';
import Billing from './Authentication/Billing';
import MembershipBilling from './Authentication/MembershipBilling';
import Success from './Authentication/Success';
import Cancel from './Authentication/Cancel';
import Reauth from './Authentication/Reauth';
import StripeOnboarded from './Authentication/StripeOnboarded';

import Dashboard from './Dashboard/Dashboard';
import Invoice from './Dashboard/Invoice/Invoice';
import CreateInvoice from './Dashboard/Invoice/CreateInvoice';
import LoadingPage from './Dashboard/Agreement/loadingPage';
import CreateAgreement from './Dashboard/Agreement/CreateAgreement';
import EditAgreement from './Dashboard/Agreement/EditAgreement';
import PreviewInvoice from './Dashboard/Invoice/PreviewInvoice';

import WalletView from './Wallet/Wallet';
import ProfileView from './Profile/Profile';

import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import ShareAgreement from './Dashboard/Agreement/ShareAgreement';
import AutoLogin from './Authentication/AutoLogin';
import StripeOnboarding from './Profile/StripeOnboarding';
import InvoicesList from './Dashboard/InvoicesList';
import CrmDashboard from './CRM/CrmDashboard';
import CreateGoal from './CRM/CreateGoal';
import GoalDetail from './CRM/GoalDetail';
import { OnboardingProvider } from './Authentication/OnboardingContext';
import OnboardingQuestions from './Authentication/OnboardingQuestions';
import PaymentPage from './Dashboard/Invoice/Invoice';
import ContactUs from './ContactUs';
import mixpanel from 'mixpanel-browser';
import SignaturePage from './Dashboard/Agreement/SignaturePage';
import ClientDashboard from './Dashboard/ClientDashboard';
import SearchPage from './SearchPage';



export default function App() {
  useEffect(() => {
    mixpanel.init('49eb6ef75e33925ec14c7a6724df3c6d');
  }, []);

  return (
    <div>
      <Router>
        <OnboardingProvider>
        <Analytics />
        <AutoLogin />
        <Routes>
          {/* authenitcation */}
          <Route path="/" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPasword />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* in app main routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesList />} />
          <Route path="/clients" element={<ClientDashboard /> } />
          <Route path="/wallet" element={<WalletView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/:username" element={<ProfileView />} />


          {/* this is how we call the stripe checkout */}
          {/* <Route path="/billing" element={<Billing />} />
          <Route path="/membership-billing" element={<MembershipBilling />} /> */}
          <Route path="/onboarding-questions" element={<OnboardingQuestions />} />


          {/* agreement related routes */}
          <Route path="/create-agreement" element={<CreateAgreement />} />
          <Route path="/edit-agreement/:agreementId" element={<EditAgreement />} />
          <Route path="/share-agreement/:agreementId" element={<ShareAgreement />} />
          <Route path="/loading/:navigateTo" element={<LoadingPage />} />
          <Route path="/signature/:agreementId" element={<SignaturePage />} />

          {/* micalleneous routes */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/reauth" element={<Reauth />} />
        
          {/* crm routes ... to add more */}
          <Route path="/crm-dashboard" element={<CrmDashboard />} />
          <Route path="/create-goal" element={<CreateGoal />} />
          <Route path="/goal/:goalId" element={<GoalDetail />} />
          
          {/* stripe-specific related routes  */}
          <Route path="/stripe-ob" element={<StripeOnboarding />} />
          <Route path="/stripe-onboarded" element={<StripeOnboarded />} />

          {/* invoice routes 
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoice-details/:invoiceId" element={<Invoice />} />
          <Route path="/preview-invoice/:invoiceId" element={<PreviewInvoice />} /> */}

          {/* Invoice and Payment Routes */}
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoice-details/:invoiceId" element={<Invoice />} />
          <Route path="/preview-invoice/:invoiceId" element={<PreviewInvoice />} />
          <Route path="/payment/:invoiceId" element={<PaymentPage />} />

          {/* leagal routes */}
          <Route path="/tos" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        </OnboardingProvider>
      </Router>
    </div>
  );
}
