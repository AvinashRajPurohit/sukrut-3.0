import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us - Let\'s Build Something Together | Sukrut',
  description: 'Get in touch with Sukrut to discuss your software development needs. We\'re here to help transform your ideas into powerful digital solutions.',
  keywords: 'contact Sukrut, software development contact, IT services inquiry, custom software solutions',
  openGraph: {
    title: 'Contact Us - Let\'s Build Something Together',
    description: 'Get in touch with Sukrut to discuss your software development needs.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
