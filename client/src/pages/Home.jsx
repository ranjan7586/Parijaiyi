import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import RiderProfiles from '../components/RiderProfiles';
import Gallery from '../components/Gallery';
import VideoVault from '../components/VideoVault';
import RouteMap from '../components/RouteMap';
import UpcomingRides from '../components/UpcomingRides';
import JoinForm from '../components/JoinForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-onyx">
      <Navbar />
      <main>
        {/* Hero source: "static" = fixed STATIC_SLIDES array in Hero.jsx,
            "api" = pull images from Cloudinary via the gallery API. */}
        <Hero source="static" />
        <About />
        <RiderProfiles />
        <Gallery />
        <VideoVault />
        <RouteMap />
        <UpcomingRides />
        <JoinForm />
      </main>
      <Footer />
    </div>
  );
}
