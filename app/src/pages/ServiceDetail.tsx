import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clapperboard, Cpu, Database, Globe, Palette, Rocket, Share2 } from 'lucide-react';
import gsap from 'gsap';

// Services data (same as HomePage)
const services = [
  { 
    id: 'web-app-development', 
    label: 'WEB & APP',
    title: 'Web and App Development',
    description: 'Modern, scalable web and mobile products built for speed, reliability, and growth.',
    longDescription: 'We design and build web and mobile applications that perform beautifully from day one. From product discovery to launch, our team handles UX, engineering, and quality so your platform is ready to scale.',
    features: ['UI/UX Planning', 'Full-stack Build', 'Performance Optimization', 'Responsive Design', 'API Integration', 'App Store Ready'],
    benefits: ['Faster time to market', 'Stable, scalable architecture', 'Cross-device consistency', 'Future-proof tech stack'],
    color: '#00d4ff',
    icon: Globe,
    caseStudies: [
      { title: 'Launch-ready SaaS', result: 'MVP in 6 weeks' },
      { title: 'Retail mobile app', result: '4.8★ store rating' },
    ]
  },
  { 
    id: 'ai-promo-video', 
    label: 'AI PROMO VIDEO',
    title: 'AI Promo Video',
    description: 'High-impact AI-driven promo videos that deliver your message with clarity and style.',
    longDescription: 'We combine AI tools with creative direction to craft promo videos that look premium and convert. From script and storyboard to final edit, we move fast without sacrificing quality.',
    features: ['Script to Screen', 'AI Storyboarding', 'Voice & Music', 'Brand Style Guides', 'Multiple Formats', 'Fast Turnaround'],
    benefits: ['Faster production cycles', 'Consistent brand voice', 'Content at scale', 'Platform-ready edits'],
    color: '#a855f7',
    icon: Clapperboard,
    caseStudies: [
      { title: 'Product launch video', result: '3x CTR on ads' },
      { title: 'Service explainer', result: '40% more leads' },
    ]
  },
  { 
    id: 'video-content-creation', 
    label: 'VIDEO EDITING',
    title: 'Video Editing and Content Creation',
    description: 'Polished edits and content packages optimized for web, social, and campaigns.',
    longDescription: 'We edit, package, and optimize your content for every platform. From reels to long-form, we deliver consistent style, pacing, and messaging that keeps audiences engaged.',
    features: ['Reels/Shorts', 'Color & Sound', 'Motion Graphics', 'Content Calendar', 'Captions', 'Aspect Variants'],
    benefits: ['Higher engagement', 'Consistent output', 'Faster content pipeline', 'Platform-tailored edits'],
    color: '#f472b6',
    icon: Rocket,
    caseStudies: [
      { title: 'Creator content system', result: '2x weekly output' },
      { title: 'Brand campaign edits', result: '30% lift in watch time' },
    ]
  },
  { 
    id: 'graphic-template-logo', 
    label: 'GRAPHIC DESIGN',
    title: 'Graphic, Template, and Logo Designing',
    description: 'Brand visuals, templates, and logos that look sharp across every touchpoint.',
    longDescription: 'We design versatile brand systems, logo marks, and templates that scale. Whether you need a new identity or ongoing assets, we deliver consistent and professional visuals.',
    features: ['Logo Systems', 'Brand Kits', 'Social Templates', 'Pitch Decks', 'Print & Digital', 'Design Systems'],
    benefits: ['Stronger brand recall', 'Faster design turnaround', 'Consistent visuals', 'Professional polish'],
    color: '#4ade80',
    icon: Palette,
    caseStudies: [
      { title: 'Fintech rebrand', result: 'Full brand kit' },
      { title: 'Retail template pack', result: '50+ reusable assets' },
    ]
  },
  { 
    id: 'social-media-marketing', 
    label: 'SOCIAL MARKETING',
    title: 'Social Media Marketing',
    description: 'Strategic campaigns and content that build audience, engagement, and conversions.',
    longDescription: 'We plan and run social campaigns that are creative, measurable, and built for growth. Our team handles content, scheduling, ads, and analytics to keep results on track.',
    features: ['Content Strategy', 'Paid Ads', 'Community Growth', 'Analytics', 'Influencer Outreach', 'A/B Testing'],
    benefits: ['Increased visibility', 'Higher engagement', 'Clear ROI reporting', 'Sustainable growth'],
    color: '#fbbf24',
    icon: Share2,
    caseStudies: [
      { title: 'D2C brand scale', result: '5x follower growth' },
      { title: 'Service campaign', result: '2.4x lead volume' },
    ]
  },
  { 
    id: 'ai-agent-integration', 
    label: 'AI AGENTS',
    title: 'AI Agent Integration',
    description: 'Custom AI agents that automate workflows, support, and business operations.',
    longDescription: 'We build AI agents that plug into your tools and data. From internal copilots to customer support assistants, we deliver secure, reliable automation.',
    features: ['Workflow Automation', 'Tool Integrations', 'Knowledge Bases', 'Monitoring', 'Security Controls', 'Human Handoff'],
    benefits: ['Reduced operational load', 'Faster response times', 'Consistent answers', 'Scalable automation'],
    color: '#f87171',
    icon: Cpu,
    caseStudies: [
      { title: 'Support agent', result: '60% ticket deflection' },
      { title: 'Ops assistant', result: '20 hrs/week saved' },
    ]
  },
  { 
    id: 'erp-system', 
    label: 'ERP SYSTEM',
    title: 'ERP System',
    description: 'Centralized ERP systems to manage finance, inventory, HR, and operations.',
    longDescription: 'We implement ERP platforms that unify your business operations. From requirements to rollout, we handle configuration, migration, and training for smooth adoption.',
    features: ['Modules & Roles', 'Data Migration', 'Custom Reports', 'Integrations', 'Training & Support', 'Access Control'],
    benefits: ['Single source of truth', 'Operational visibility', 'Reduced manual work', 'Better decision-making'],
    color: '#60a5fa',
    icon: Database,
    caseStudies: [
      { title: 'Manufacturing rollout', result: '30% faster reporting' },
      { title: 'Multi-branch setup', result: 'Unified operations' },
    ]
  },
];

// Floating particles background
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: 'rgba(0, 212, 255, 0.3)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// Animated gradient orb
function GradientOrb({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
      style={{ backgroundColor: color }}
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const service = services.find(s => s.id === id);
  const currentIndex = services.findIndex(s => s.id === id);
  const prevService = services[currentIndex - 1];
  const nextService = services[currentIndex + 1];
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  useEffect(() => {
    if (!service) {
      navigate('/');
    }
    
    // Animate elements on load
    gsap.fromTo('.animate-in',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
    );
  }, [service, navigate]);

  if (!service) return null;

  const Icon = service.icon;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      {/* Background effects */}
      <ParticleBackground />
      <GradientOrb color={service.color} />
      
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-xs text-gray-500 tracking-wider">
            {service.label}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${service.color}20`, border: `1px solid ${service.color}40` }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Icon className="w-12 h-12" style={{ color: service.color }} />
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              className="text-5xl md:text-8xl font-light mb-6"
              style={{ color: service.color }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {service.title}
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {service.description}
            </motion.p>
            
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-black font-medium transition-all hover:scale-105"
                style={{ backgroundColor: service.color }}
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Details Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left - Description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                What We <span style={{ color: service.color }}>Offer</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {service.longDescription}
              </p>
              
              {/* Features grid */}
              <div className="grid grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: service.color }} />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Right - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-light mb-6">
                Key <span style={{ color: service.color }}>Benefits</span>
              </h2>
              
              <div className="space-y-4">
                {service.benefits.map((benefit, idx) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <span className="text-lg font-bold" style={{ color: service.color }}>
                        {idx + 1}
                      </span>
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-32 relative" style={{ backgroundColor: `${service.color}05` }}>
        <div className="container mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light mb-12 text-center"
          >
            Featured <span style={{ color: service.color }}>Case Studies</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {service.caseStudies.map((study, idx) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
              >
                <h3 className="text-xl font-light mb-2 group-hover:text-cyan-400 transition-colors">
                  {study.title}
                </h3>
                <p className="text-sm text-gray-400">{study.result}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation to other services */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center">
            {prevService ? (
              <Link
                to={`/service/${prevService.id}`}
                className="flex items-center gap-4 group"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 mb-1">Previous</div>
                  <div className="text-lg group-hover:text-cyan-400 transition-colors">
                    {prevService.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextService ? (
              <Link
                to={`/service/${nextService.id}`}
                className="flex items-center gap-4 group"
              >
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Next</div>
                  <div className="text-lg group-hover:text-cyan-400 transition-colors">
                    {nextService.title}
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to start your <span style={{ color: service.color }}>{service.title}</span> project?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all justify-center"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/919250818908"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-black hover:brightness-110 transition-all justify-center"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-light tracking-wider">
              <video
                className="h-12 w-auto"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src="/media/logoanimation.webm" type="video/webm" />
                <source src="/media/logoanimation.mp4" type="video/mp4" />
              </video>
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
