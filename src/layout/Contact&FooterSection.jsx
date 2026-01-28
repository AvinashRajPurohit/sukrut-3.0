"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";
import { MessageCircle, Headphones, ShoppingCart, Lightbulb, CreditCard, MoreHorizontal, RefreshCw } from "lucide-react";

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
        className={`w-full rounded-none bg-black/20 border-0 border-b-2 px-3 sm:px-4 py-3 sm:py-4 text-sm text-left flex items-center justify-between text-white outline-none transition-colors cursor-pointer ${
          isOpen ? 'border-[#E39A2E]' : 'border-white/20 hover:border-white/30'
        }`}
      >
        <span className={value ? 'text-white' : 'text-gray-600'}>
          {selectedOption ? (
            iconOptions ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon && <selectedOption.icon className="w-4 h-4 text-gray-400" />}
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
        <div className="absolute z-50 w-full mt-0.5 bg-gray-900 border border-white/20 rounded-none shadow-xl overflow-hidden">
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
                className={`w-full px-3 sm:px-4 py-3 text-left hover:bg-[#E39A2E]/10 transition-colors flex items-center gap-3 cursor-pointer text-sm ${
                  value === option.value ? 'bg-[#E39A2E]/20 text-[#E39A2E]' : 'text-white'
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

export default function ContactFooterSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    role: '',
    inquiry: '',
    message: '',
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.inquiry) {
      newErrors.inquiry = 'Inquiry type is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details.map((detail) => detail.message).join(', ');
          setSubmitError(errorMessages);
        } else {
          setSubmitError(data.error || 'Failed to submit form. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        role: '',
        inquiry: '',
        message: '',
        terms: false,
      });
      setIsSubmitting(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };
  return (
    <section className="relative pb-6 sm:pb-4 text-white overflow-hidden">
      
      {/* === 📐 BACKGROUND: DARK TECHNICAL GRID === */}
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B0B0B_0%,#0F0E0C_45%,#1a1a1a_100%)] z-0" />
      
      {/* Faded Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 pt-8 sm:pt-10">
        
        {/* LEFT CONTENT */}
        <div>
          {/* PREMIUM BADGE (Dark Mode Version) */}
          <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
              Contact Us
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
            Let's Engineer <br />
            <span className="text-[#E39A2E]">Your Vision.</span>
          </h2>

          <p className="text-gray-400 max-w-sm mb-8 sm:mb-12 leading-relaxed text-base sm:text-lg">
            Does your project need our expertise?
            <br />
            Fill out the form to initialize the process.
          </p>

          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-sm">
            <div className="group flex items-center gap-3 sm:gap-4 text-gray-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#E39A2E] group-hover:text-[#E39A2E] transition-colors">
                <HiOutlineMail className="text-lg sm:text-xl" />
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-wide break-all min-w-0">SukrutAssociates@gmail.com</span>
            </div>

            <div className="group flex items-center gap-3 sm:gap-4 text-gray-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#E39A2E] group-hover:text-[#E39A2E] transition-colors">
                <HiOutlinePhone className="text-lg sm:text-xl" />
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-wide">+91 12345 67890</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM (Technical Box) */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 md:p-8 lg:p-10">
          
          {/* Technical Notches - smaller on mobile */}
          <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#E39A2E]/50" />
          <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#E39A2E]/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#E39A2E]/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#E39A2E]/50" />

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="James"
                  className={`w-full rounded-none bg-black/20 border-0 border-b-2 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600 ${
                    errors.firstName ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  className={`w-full rounded-none bg-black/20 border-0 border-b-2 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600 ${
                    errors.lastName ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full rounded-none bg-black/20 border-0 border-b-2 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600 ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone (Optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91"
                  className="w-full rounded-none bg-black/20 border-0 border-b-2 border-white/20 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Inquiry Type</label>
              <div className={errors.inquiry ? 'border-b-2 border-red-500' : ''}>
                <CustomDropdown
                  name="inquiry"
                  options={inquiryOptions}
                  value={formData.inquiry}
                  onChange={handleChange}
                  placeholder="Select inquiry type"
                  iconOptions={true}
                />
              </div>
              {errors.inquiry && (
                <p className="text-xs text-red-400 mt-1">{errors.inquiry}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Country</label>
                <div className={errors.country ? 'border-b-2 border-red-500' : ''}>
                  <CustomDropdown
                    name="country"
                    options={countryOptions}
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Select your country"
                  />
                </div>
                {errors.country && (
                  <p className="text-xs text-red-400 mt-1">{errors.country}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Role</label>
                <div className={errors.role ? 'border-b-2 border-red-500' : ''}>
                  <CustomDropdown
                    name="role"
                    options={roleOptions}
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Select your role"
                  />
                </div>
                {errors.role && (
                  <p className="text-xs text-red-400 mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project requirements..."
                className={`w-full rounded-none bg-black/20 border-0 border-b-2 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600 resize-none min-h-[88px] sm:min-h-[100px] ${
                  errors.message ? 'border-red-500' : 'border-white/20'
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-400 mt-1">{errors.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-400 cursor-pointer group">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className={`accent-[#E39A2E] h-4 w-4 mt-0.5 sm:mt-0 shrink-0 rounded-none cursor-pointer ${
                    errors.terms ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                <span className="group-hover:text-white transition-colors">I accept the terms & conditions</span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-400 mt-1 ml-6">{errors.terms}</p>
              )}
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-none text-sm text-green-300">
                <p className="font-semibold">Thank you for your submission!</p>
                <p className="mt-1">We've received your message and will get back to you within 24 hours.</p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-none text-sm text-red-300">
                <p className="font-semibold">Error submitting form</p>
                <p className="mt-1">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full inline-flex items-center justify-center gap-2 bg-[#E39A2E] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-black uppercase tracking-wider transition-all hover:bg-white cursor-pointer ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Initialize Request
                  <FiArrowUpRight className="text-base sm:text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative mt-12 sm:mt-16 lg:mt-24 border-t border-white/10 pt-8 sm:pt-10 lg:pt-12 px-4 text-center z-10">
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <Image
            src="/sukrut_dark_mode_logo.png"
            alt="Sukrut Logo"
            width={180}
            height={45}
            className="w-28 h-auto sm:w-36 md:w-44 lg:w-[180px] opacity-90"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">
          {[
            { label: "About Us", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
            { label: "Workplace Login", href: "/app/login" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="cursor-pointer transition hover:text-[#E39A2E]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-gray-600 font-mono px-2">
          © {new Date().getFullYear()} Sukrut Associates. All systems operational.
        </p>
      </div>
    </section>
  );
}