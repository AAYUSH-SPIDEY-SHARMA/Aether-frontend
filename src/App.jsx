import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetailPage from './pages/EventDetailPage';
import Wings from './pages/Wings';
import Symposium from './pages/Symposium';
import Schedule from './pages/Schedule';
import SpeakersPage from './pages/SpeakersPage';
import SponsorsPage from './pages/SponsorsPage';
import FAQ from './pages/FAQ';
import Team from './pages/Team';
import Contact from './pages/Contact';

// Registration Flow
import EventRegistration from './pages/registration/EventRegistration';
import PaymentProcessing from './pages/registration/PaymentProcessing';
import PaymentStatus from './pages/registration/PaymentStatus';

// Admin - Layout and Login
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import WingsList from './pages/admin/wings/WingsList';
import WingForm from './pages/admin/wings/WingForm';
import EventsList from './pages/admin/events/EventsList';
import EventForm from './pages/admin/events/EventForm';
import SymposiumList from './pages/admin/symposium/SymposiumList';
import SymposiumForm from './pages/admin/symposium/SymposiumForm';
import TeamList from './pages/admin/team/TeamList';
import TeamForm from './pages/admin/team/TeamForm';
import RegistrationsList from './pages/admin/RegistrationsList';
import SponsorsList from './pages/admin/sponsors/SponsorsList';
import SponsorForm from './pages/admin/sponsors/SponsorForm';
import FAQsList from './pages/admin/faqs/FAQsList';
import FAQForm from './pages/admin/faqs/FAQForm';
import SpeakersList from './pages/admin/speakers/SpeakersList';
import SpeakerForm from './pages/admin/speakers/SpeakerForm';
import SettingsPage from './pages/admin/SettingsPage';
import AssetsList from './pages/admin/assets/AssetsList';
import HomeTeamList from './pages/admin/home-team/HomeTeamList';
import HomeTeamForm from './pages/admin/home-team/HomeTeamForm';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          {/* Main Club Pages */}
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="wings" element={<Wings />} />
          <Route path="team" element={<Team />} />
          <Route path="contact" element={<Contact />} />

          {/* Symposium 2026 Routes */}
          <Route path="symposium" element={<Symposium />} />
          <Route path="symposium/schedule" element={<Schedule />} />
          <Route path="symposium/speakers" element={<SpeakersPage />} />
          <Route path="symposium/sponsors" element={<SponsorsPage />} />
          <Route path="symposium/faq" element={<FAQ />} />

          {/* Registration Flow */}
          <Route path="register/:eventId" element={<EventRegistration />} />
          <Route path="register/:eventId/payment" element={<PaymentProcessing />} />
          <Route path="register/:eventId/status" element={<PaymentStatus />} />
        </Route>

        {/* Admin Login (No layout) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Wings */}
          <Route path="wings" element={<WingsList />} />
          <Route path="wings/new" element={<WingForm />} />
          <Route path="wings/:id/edit" element={<WingForm />} />

          {/* Events */}
          <Route path="events" element={<EventsList />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/:id/edit" element={<EventForm />} />

          {/* Symposium */}
          <Route path="symposium" element={<SymposiumList />} />
          <Route path="symposium/new" element={<SymposiumForm />} />
          <Route path="symposium/:id/edit" element={<SymposiumForm />} />

          {/* Team */}
          <Route path="team" element={<TeamList />} />
          <Route path="team/new" element={<TeamForm />} />
          <Route path="team/:id/edit" element={<TeamForm />} />

          {/* Home Page Team */}
          <Route path="home-team" element={<HomeTeamList />} />
          <Route path="home-team/new" element={<HomeTeamForm />} />
          <Route path="home-team/:id/edit" element={<HomeTeamForm />} />

          {/* Registrations */}
          <Route path="registrations" element={<RegistrationsList />} />

          {/* Sponsors */}
          <Route path="sponsors" element={<SponsorsList />} />
          <Route path="sponsors/new" element={<SponsorForm />} />
          <Route path="sponsors/:id/edit" element={<SponsorForm />} />

          {/* FAQs */}
          <Route path="faqs" element={<FAQsList />} />
          <Route path="faqs/new" element={<FAQForm />} />
          <Route path="faqs/:id/edit" element={<FAQForm />} />

          {/* Speakers */}
          <Route path="speakers" element={<SpeakersList />} />
          <Route path="speakers/new" element={<SpeakerForm />} />
          <Route path="speakers/:id/edit" element={<SpeakerForm />} />

          {/* Assets */}
          <Route path="assets" element={<AssetsList />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

