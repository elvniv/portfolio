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
        {/* <AutoLogin /> */}
        <Routes>
          {/* authenitcation */}
          <Route path="/" element={<SearchPage />} />

        </Routes>
        </OnboardingProvider>
      </Router>
    </div>
  );
}
