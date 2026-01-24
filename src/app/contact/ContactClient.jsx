'use client';

import { useState, useRef, useEffect } from 'react';
import { Target, Zap, Users, RefreshCw, MessageSquare, MessageCircle, Headphones, ShoppingCart, Lightbulb, CreditCard, MoreHorizontal, Mail, Phone, FileCheck, Plus, Minus, Code2, Calendar, Layers } from 'lucide-react';
import { FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const whyPartner = [
  {
    id: 1,
    stat: '50+',
    title: 'Projects Delivered',
    description: 'From startups to enterprises. We ship on time, every time.',
    icon: Target,
    featured: true,
  },
  {
    id: 2,
    stat: '24h',
    title: 'First Response',
    description: 'We review every inquiry within a day. No black hole, no runaround.',
    icon: Zap,
    featured: false,
  },
  {
    id: 3,
    stat: '100%',
    title: 'Dedicated Teams',
    description: 'Your project gets a focused squad. No context-switching, no drift.',
    icon: Users,
    featured: false,
  },
  {
    id: 4,
    stat: 'Ongoing',
    title: 'Long-term Support',
    description: 'Launch is just the start. We iterate, fix, and grow with you.',
    icon: RefreshCw,
    featured: false,
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

function CustomDropdown({ options, value, onChange, placeholder, iconOptions = false, name }) {
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
        className={`w-full rounded-none bg-gray-50/80 border-0 border-b-2 px-3 sm:px-4 py-3 sm:py-4 text-sm text-left flex items-center justify-between text-gray-900 outline-none transition-colors cursor-pointer ${
          isOpen ? 'border-[#E39A2E]' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? (
            iconOptions ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon && <selectedOption.icon className="w-4 h-4 text-gray-600" />}
                {selectedOption.label}
              </span>
            ) : selectedOption.label
          ) : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-0.5 bg-white border border-gray-200 rounded-none shadow-xl overflow-hidden">
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                }}
                className={`w-full px-3 sm:px-4 py-3 text-left hover:bg-[#E39A2E]/5 transition-colors flex items-center gap-3 cursor-pointer text-sm ${
                  value === option.value ? 'bg-[#E39A2E]/10 text-[#E39A2E]' : 'text-gray-900'
                }`}
              >
                {iconOptions && IconComponent && (
                  <IconComponent className="w-4 h-4 shrink-0" />
                )}
                <span>{option.label}</span>
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
    terms: false,
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero + Form Section */}
      <section className="relative pb-16 sm:pb-20 md:pb-24 overflow-hidden bg-white pt-28 lg:pt-32">
        <div className="relative max-w-[1450px] px-4 sm:px-6 mx-auto">
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

            {/* Right Side - Contact Form (light technical style, matches footer) */}
            <div
              ref={formRef}
              className={`relative overflow-hidden transition-all duration-700 ease-out ${
                formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div
                className="relative bg-white/95 backdrop-blur-sm border border-gray-200/90 p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-gray-200/40"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Corner notches - light mode accent */}
                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#E39A2E]/70" />
                <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#E39A2E]/70" />
                <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#E39A2E]/70" />
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#E39A2E]/70" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#E39A2E]/10 border border-[#E39A2E]/30 px-3 sm:px-4 py-1.5 mb-6 cursor-default">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
                    Get in Touch
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="James"
                        className="w-full rounded-none bg-gray-50/80 border-0 border-b-2 border-gray-200 px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-900 outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Smith"
                        className="w-full rounded-none bg-gray-50/80 border-0 border-b-2 border-gray-200 px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-900 outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full rounded-none bg-gray-50/80 border-0 border-b-2 border-gray-200 px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-900 outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                      Inquiry Type
                    </label>
                    <CustomDropdown
                      name="inquiry"
                      options={inquiryOptions}
                      value={formData.inquiry}
                      onChange={handleChange}
                      placeholder="Select inquiry type"
                      iconOptions={true}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                        Country
                      </label>
                      <CustomDropdown
                        name="country"
                        options={countryOptions}
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Select your country"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                        Your Role
                      </label>
                      <CustomDropdown
                        name="role"
                        options={roleOptions}
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="Select your role"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your project or question..."
                      rows={4}
                      className="w-full rounded-none bg-gray-50/80 border-0 border-b-2 border-gray-200 px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-900 outline-none focus:border-[#E39A2E] transition-colors resize-none placeholder:text-gray-400 min-h-[88px] sm:min-h-[100px]"
                    />
                  </div>

                  <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-500 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="accent-[#E39A2E] h-4 w-4 mt-0.5 sm:mt-0 shrink-0 rounded-none cursor-pointer"
                    />
                    <span className="group-hover:text-gray-700 transition-colors">I accept the terms & conditions</span>
                  </label>

                  <button
                    type="submit"
                    className="group relative w-full inline-flex items-center justify-center gap-2 rounded-none bg-[#E39A2E] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider transition-all hover:bg-[#d18a1f] hover:shadow-lg hover:shadow-[#E39A2E]/25 cursor-pointer"
                  >
                    Submit Request
                    <FiArrowUpRight className="text-base sm:text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="relative py-16 sm:py-20 bg-gray-50/50">
        <div 
          ref={processRef}
          className={`max-w-[1450px] px-4 sm:px-6 mx-auto transition-all duration-700 ease-out ${
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

      {/* Why Partner With Us - Bento-style cards */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
        {/* Optional subtle accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#E39A2E]/20 to-transparent" />

        <div
          ref={featuresRef}
          className={`relative max-w-[1450px] px-4 sm:px-6 mx-auto transition-all duration-700 ease-out ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-xs sm:text-sm font-bold tracking-widest text-[#E39A2E] uppercase mb-2">Why work with us</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Built for partnership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">What you can expect when you reach out—and why teams choose to build with us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {whyPartner.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden transition-all duration-500 ease-out ${
                    featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div
                    className={`relative h-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 lg:p-8 border border-gray-200/90 transition-all duration-300 ${
                      item.featured
                        ? 'bg-gradient-to-br from-amber-50/60 via-white to-gray-50/40 hover:shadow-xl hover:shadow-amber-100/20 hover:border-[#E39A2E]/30'
                        : 'bg-white hover:shadow-lg hover:shadow-gray-200/60 hover:border-[#E39A2E]/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Corner notches */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E39A2E]/40" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#E39A2E]/40" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#E39A2E]/40" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E39A2E]/40" />

                    {/* Left accent + stat */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#E39A2E]/10 flex items-center justify-center group-hover:bg-[#E39A2E]/15 transition-colors">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-[#E39A2E]" />
                      </div>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E39A2E] tracking-tight">{item.stat}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
