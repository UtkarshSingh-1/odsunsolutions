import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Check, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Github, MessageCircle } from 'lucide-react';
import gsap from 'gsap';

// Particle background
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// Form input component
function FormInput({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  isTextarea = false
}: { 
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  isTextarea?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs text-gray-500 mb-2 tracking-wider uppercase">
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          placeholder={placeholder}
          rows={5}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all resize-none ${
            isFocused ? 'border-cyan-400/50 bg-white/10' : 'border-white/10'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          placeholder={placeholder}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all ${
            isFocused ? 'border-cyan-400/50 bg-white/10' : 'border-white/10'
          }`}
        />
      )}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// Service tag component
function ServiceTag({ 
  label, 
  selected, 
  onClick 
}: { 
  label: string; 
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full text-sm transition-all ${
        selected 
          ? 'bg-cyan-500 text-black font-medium' 
          : 'bg-white/5 border border-white/10 hover:border-white/30'
      }`}
    >
      {label}
    </motion.button>
  );
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    'Web and App Development',
    'AI Promo Video',
    'Video Editing and Content Creation',
    'Graphic, Template, and Logo Designing',
    'Social Media Marketing',
    'AI Agent Integration',
    'ERP System',
  ];

  const budgetRanges = [
    '$10k - $25k',
    '$25k - $50k',
    '$50k - $100k',
    '$100k - $250k',
    '$250k+',
    'Not sure yet',
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  useEffect(() => {
    gsap.fromTo('.animate-in',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      <ParticleBackground />
      
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <Link 
          to="/" 
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Mail className="w-10 h-10 text-cyan-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-light mb-6">
              Let&apos;s <span className="text-cyan-400">Create</span> Together
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? We&apos;d love to hear about it. 
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-light mb-4">Message Sent!</h2>
                  <p className="text-gray-400 mb-8">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
                  >
                    Back to Home
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
                >
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormInput
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormInput
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                    />
                    <div className="relative">
                      <label className="block text-xs text-gray-500 mb-2 tracking-wider uppercase">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all focus:border-cyan-400/50 focus:bg-white/10 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-black">Select budget</option>
                        {budgetRanges.map(range => (
                          <option key={range} value={range} className="bg-black">{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-6">
                    <label className="block text-xs text-gray-500 mb-3 tracking-wider uppercase">
                      Services Interested In
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {services.map(service => (
                        <ServiceTag
                          key={service}
                          label={service}
                          selected={selectedServices.includes(service)}
                          onClick={() => toggleService(service)}
                        />
                      ))}
                    </div>
                  </div>

                  <FormInput
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project..."
                    isTextarea
                  />

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 py-4 rounded-full bg-cyan-500 text-black font-medium flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-light mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <a 
                    href="mailto:hello@activetheory.net" 
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5 text-cyan-400" />
                    hello@activetheory.net
                  </a>
                  <a 
                    href="tel:+919250818908" 
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5 text-cyan-400" />
                    +91 9250818908
                  </a>
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    San Francisco, CA
                  </div>
                  <a
                    href="https://wa.me/919250818908"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-black bg-[#25D366] px-4 py-2 rounded-full w-fit hover:brightness-110 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-light mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Twitter, href: '#' },
                    { icon: Instagram, href: '#' },
                    { icon: Linkedin, href: '#' },
                    { icon: Github, href: '#' },
                  ].map(({ icon: Icon, href }, idx) => (
                    <motion.a
                      key={idx}
                      href={href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-light mb-2">Response Time</h3>
                <p className="text-gray-400 text-sm">
                  We typically respond within 24 hours during business days.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-light tracking-wider">
              ODSUN<span className="text-cyan-400">SOLUTIONS</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/portfolio" className="hover:text-white transition-colors">Work</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 Odsun Solutions. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
