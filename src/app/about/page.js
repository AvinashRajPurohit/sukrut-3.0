import AboutHeroSection from '@/components/HomeSection/AboutHeroSection';
import MissionCapabilitiesSection from '@/components/HomeSection/MissionCapabilitiesSection';
import WhoWeAreSection from '@/components/HomeSection/WhoWeAreSection';
import OurValuesSection from '@/components/HomeSection/OurValuesSection';
import MeetTheTeamSection from '@/components/HomeSection/MeetTheTeamSection';
import CareersSection from '@/components/HomeSection/CareersSection';
import PrinciplesSection from '@/components/HomeSection/PrinciplesSection';
import GrowthSection from '@/components/HomeSection/GrowthSection';
import AboutTeamSection from '@/components/HomeSection/AboutTeamSection';
import ValuesMissionSection from '@/components/HomeSection/ValuesMissionSection';
import CTASection from '@/components/HomeSection/CTASection';

export const metadata = {
  title: 'About Us | Sukrut - Engineering Software for Real-World Scale',
  description: 'Learn about Sukrut, a team of passionate makers dedicated to building tools that empower businesses to grow. We focus on simplicity, performance, and people.',
  keywords: 'about Sukrut, software engineering team, digital solutions, business growth, technology company',
  openGraph: {
    title: 'About Us | Sukrut',
    description: 'A team of passionate makers dedicated to building tools that empower businesses to grow.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main role="main" className="bg-black">
      {/* Hero Section */}
      <AboutHeroSection />
      
      {/* Mission & Capabilities Section */}
      {/* <MissionCapabilitiesSection /> */}

      <PrinciplesSection />
      
      {/* Who We Are Section */}
      <WhoWeAreSection />
      
      {/* Our Values Section */}
      <OurValuesSection />
      
      {/* Meet the Team Section */}
      <MeetTheTeamSection />
      
      {/* Careers Section */}
      <CareersSection />
      
      {/* Additional sections can be added here */}
    </main>
  );
}
