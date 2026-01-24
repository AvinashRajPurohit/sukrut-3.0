'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, BarChart3, Grid3x3, MessageSquare, MessageCircle, Headphones, ShoppingCart, Lightbulb, CreditCard, MoreHorizontal, Mail, Phone, FileCheck, Plus, Minus, Code2, Calendar, Layers } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    id: 1,
    icon: Clock,
    title: 'Rapid Development',
    description: 'Accelerate your time-to-market with agile methodologies and proven frameworks',
  },
  {
    id: 2,
    icon: BarChart3,
    title: 'Data-Driven Solutions',
    description: 'Leverage analytics and insights to make informed decisions and optimize performance',
  },
  {
    id: 3,
    icon: Grid3x3,
    title: 'Scalable Architecture',
    description: 'Build systems that grow with your business, handling increased load seamlessly',
  },
  {
    id: 4,
    icon: MessageSquare,
    title: 'Continuous Support',
    description: 'Receive ongoing maintenance and updates to keep your systems running smoothly',
  },
];

const processSteps = [
  {
    id: 1,
    icon: Mail,
    title: "We'll Get Back Within 24 Hours",
    description: 'Our team reviews every inquiry and responds with next steps or clarifying questions.',
  },
  {
    id: 2,
    icon: Phone,
    title: 'Discovery Call',
    description: 'We schedule a call to understand your goals, technical needs, and timeline.',
  },
  {
    id: 3,
    icon: FileCheck,
    title: 'Tailored Proposal',
    description: 'You receive a clear proposal with scope, approach, and next steps.',
  },
];

const inquiryOptions = [
  { value: 'general', label: 'General Inquiry', icon: MessageCircle },
  { value: 'support', label: 'Technical Support', icon: Headphones },
  { value: 'sales', label: 'Sales Question', icon: ShoppingCart },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb },
  { value: 'billing', label: 'Billing Issue', icon: CreditCard },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
];

const roleOptions = [
  { value: 'ceo', label: 'CEO / Founder' },
  { value: 'cto', label: 'CTO / Technical Lead' },
  { value: 'manager', label: 'Project Manager' },
  { value: 'developer', label: 'Developer' },
  { value: 'other', label: 'Other' },
];

const countryOptions = [
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'canada', label: 'Canada' },
  { value: 'india', label: 'India' },
  { value: 'australia', label: 'Australia' },
];

const learnMoreItems = [
  { icon: Code2, title: 'Full-cycle development', description: 'From idea and design to build, launch, and ongoing support.' },
  { icon: Calendar, title: 'Fixed or flexible engagement', description: 'Match your budget and timeline with clear milestones.' },
  { icon: MessageSquare, title: 'Clear communication', description: 'Regular updates and a single point of contact.' },
  { icon: Layers, title: 'Modern tech stack', description: 'Web, mobile, APIs, and cloud—tailored to your needs.' },
];

function CustomDropdown({ options, value, onChange, placeholder, iconOptions = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-transparent transition-all bg-white text-left flex items-center justify-between text-gray-900 cursor-pointer"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? (
            iconOptions ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon && <selectedOption.icon className="w-4 h-4" />}
                {selectedOption.label}
              </span>
            ) : selectedOption.label
          ) : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ target: { name: iconOptions ? 'inquiry' : (placeholder.includes('country') ? 'country' : 'role'), value: option.value } });
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer ${
                  value === option.value ? 'bg-gray-50' : ''
                }`}
              >
                {iconOptions && IconComponent && (
                  <IconComponent className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-gray-900">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ContactClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    role: '',
    inquiry: '',
    message: '',
  });

  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [heroRef, heroVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation({ threshold: 0.1 });
  const [processRef, processVisible] = useScrollAnimation({ threshold: 0.1 });
  const [featuresRef, featuresVisible] = useScrollAnimation({ threshold: 0.1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero + Form Section */}
      <section className="relative pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white pt-28 lg:pt-32">
        {/* Premium background - subtle diagonal lines matching the image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main diagonal lines pattern - light gray, subtle like in the image */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 60px,
                  rgba(0, 0, 0, 0.025) 60px,
                  rgba(0, 0, 0, 0.025) 61px
                )
              `,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Hero Content */}
            <div 
              ref={heroRef}
              className={`relative transition-all duration-700 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Decorative dots */}
              <div className="flex items-center gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-gray-900 transition-all duration-500 ease-out ${
                      heroVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: `${i * 100}ms`,
                      opacity: heroVisible ? Math.max(0, 1 - i * 0.2) : 0
                    }}
                  />
                ))}
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '200ms' }}
              >
                Transform Your Business with Custom Software Solutions
              </h1>
              
              <p className={`text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed transition-all duration-700 ease-out ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '300ms' }}
              >
                Partner with Sukrut to build scalable, innovative software that drives growth. From concept to deployment, we deliver solutions tailored to your unique business needs and objectives.
              </p>

              <div className="space-y-0">
              <button
                type="button"
                onClick={() => setLearnMoreOpen((o) => !o)}
                className={`inline-flex items-center gap-2.5 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-700 ease-out cursor-pointer ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '400ms' }}
                aria-expanded={learnMoreOpen}
              >
                Learn More
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 transition-transform duration-300">
                  {learnMoreOpen ? <Minus className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </span>
              </button>

              {/* Animated expandable panel */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: learnMoreOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div
                    className={`border border-gray-200 rounded-xl mt-4 p-5 sm:p-6 bg-gray-50/80 backdrop-blur-sm transition-all duration-300 ${
                      learnMoreOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-4">What you get when you work with us</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {learnMoreItems.map((item, i) => {
                        const IconC = item.icon;
                        return (
                          <div key={i} className="flex gap-3">
                            <div className="shrink-0 w-9 h-9 rounded-lg bg-[#E39A2E]/10 flex items-center justify-center">
                              <IconC className="w-4 h-4 text-[#E39A2E]" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                              <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link
                      href="/about"
                      className="inline-block mt-4 text-sm font-medium text-[#E39A2E] hover:text-[#d18a1f] transition-colors"
                    >
                      Read more about us →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Right Side - Contact Form */}
            <div 
              ref={formRef}
              className={`bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-700 ease-out ${
                formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className={`text-2xl font-semibold text-gray-900 mb-6 transition-all duration-700 ease-out ${
                formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '150ms' }}
              >
                Get in Touch
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="James..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Smith..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="robertapouros@gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <CustomDropdown
                    options={inquiryOptions}
                    value={formData.inquiry}
                    onChange={handleChange}
                    placeholder="Select inquiry type"
                    iconOptions={true}
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <CustomDropdown
                    options={countryOptions}
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Select your country"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <CustomDropdown
                    options={roleOptions}
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Select your role"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="enter message...."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-transparent transition-all resize-none placeholder:text-gray-400 text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#E39A2E] text-white font-semibold rounded-lg hover:bg-[#d18a1f] transition-colors duration-300 cursor-pointer"
                >
                  Contact Us
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div 
          ref={processRef}
          className={`max-w-7xl mx-auto transition-all duration-700 ease-out ${
            processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What Happens Next</h2>
          <p className="text-gray-600 mb-10 max-w-2xl">After you submit the form, here’s what to expect.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-2xl p-6 lg:p-8 shadow-sm transition-all duration-500 ease-out hover:shadow-md ${
                    processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#E39A2E]/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#E39A2E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div 
          ref={featuresRef}
          className={`max-w-7xl mx-auto transition-all duration-700 ease-out ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`bg-white border border-gray-200 rounded-xl p-6 lg:p-8 transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-1 ${
                    featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#E39A2E]/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#E39A2E]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
