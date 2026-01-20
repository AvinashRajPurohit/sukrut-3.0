import AboutHeroSection from '@/components/HomeSection/AboutHeroSection';
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
    <main role="main" className="bg-white light">
      {/* Hero Section */}
      <AboutHeroSection />
      
      {/* Principles Section */}
      <PrinciplesSection />
      
      {/* Growth Section */}
      <GrowthSection />
      
      {/* Team Section */}
      <AboutTeamSection />
      
      {/* Values & Mission Section */}
      <ValuesMissionSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Additional sections can be added here */}
    </main>
  );
}
