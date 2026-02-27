import { useEffect, useRef, useState, useMemo, Suspense, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight, ExternalLink, X, Send, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const DEBUG_SIMPLE_SCENE = false;
const ENABLE_ENVIRONMENT = true;
const ENABLE_PARTICLES = true;
const ENABLE_FLOATING_CRYSTALS = true;
const LOGO_VERTICAL_STRETCH = 2.2;
const LOGO_HORIZONTAL_STRETCH = 1.15;
const LOGO_Y_OFFSET = -1.2;

// Services data
const services = [
  { 
    id: 'web-app-development', 
    label: 'WEB & APP',
    title: 'Web and App Development',
    description: 'Modern, scalable web and mobile products built for speed, reliability, and growth.',
    features: ['UI/UX Planning', 'Full-stack Build', 'Performance Optimization', 'App Store Ready'],
    color: '#00d4ff'
  },
  { 
    id: 'ai-promo-video', 
    label: 'AI PROMO VIDEO',
    title: 'AI Promo Video',
    description: 'High-impact AI-driven promo videos that deliver your message with clarity and style.',
    features: ['Script to Screen', 'AI Storyboarding', 'Voice & Music', 'Fast Turnaround'],
    color: '#a855f7'
  },
  { 
    id: 'video-content-creation', 
    label: 'VIDEO EDITING',
    title: 'Video Editing and Content Creation',
    description: 'Polished edits and content packages optimized for web, social, and campaigns.',
    features: ['Reels/Shorts', 'Color & Sound', 'Motion Graphics', 'Content Calendar'],
    color: '#f472b6'
  },
  { 
    id: 'graphic-template-logo', 
    label: 'GRAPHIC DESIGN',
    title: 'Graphic, Template, and Logo Designing',
    description: 'Brand visuals, templates, and logos that look sharp across every touchpoint.',
    features: ['Logo Systems', 'Brand Kits', 'Templates', 'Print & Digital'],
    color: '#4ade80'
  },
  { 
    id: 'social-media-marketing', 
    label: 'SOCIAL MARKETING',
    title: 'Social Media Marketing',
    description: 'Strategic campaigns and content that build audience, engagement, and conversions.',
    features: ['Content Strategy', 'Paid Ads', 'Community Growth', 'Analytics'],
    color: '#fbbf24'
  },
  { 
    id: 'ai-agent-integration', 
    label: 'AI AGENTS',
    title: 'AI Agent Integration',
    description: 'Custom AI agents that automate workflows, support, and business operations.',
    features: ['Workflow Automation', 'Tool Integrations', 'Knowledge Bases', 'Secure Deploy'],
    color: '#f87171'
  },
  { 
    id: 'erp-system', 
    label: 'ERP SYSTEM',
    title: 'ERP System',
    description: 'Centralized ERP systems to manage finance, inventory, HR, and operations.',
    features: ['Modules & Roles', 'Data Migration', 'Reporting', 'Training & Support'],
    color: '#60a5fa'
  },
];

// Portfolio projects
const portfolioProjects = [
  { id: 1, title: 'PAPER PLANES', client: 'Google', category: 'websites', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80' },
  { id: 2, title: 'SUSTAINABLE HORIZONS', client: 'WSJ', category: 'websites', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
  { id: 3, title: 'E.C.H.O.', client: 'U.S. Air Force', category: 'xr', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80' },
  { id: 4, title: 'MILLION PIECE MISSION', client: 'U.S. Air Force', category: 'games', image: 'https://images.unsplash.com/photo-1614728853913-1e22ba0e982b?w=800&q=80' },
  { id: 5, title: 'DISCOVER YOUR PATRONUS', client: 'Harry Potter', category: 'xr', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
  { id: 6, title: 'PROMETHEUS', client: '', category: 'games', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80' },
];

// 3D Logo Component - Scroll-based animation
function Logo3D({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const torusKnotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Scroll-based rotation
      meshRef.current.rotation.y = scrollProgress * Math.PI * 2 + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = scrollProgress * 0.5;
      
      // Scale based on scroll (with vertical stretch)
      const scale = Math.max(0.3, 1 - scrollProgress * 0.7);
      meshRef.current.scale.set(
        scale * LOGO_HORIZONTAL_STRETCH,
        scale * LOGO_VERTICAL_STRETCH,
        scale
      );
      
      // Subtle vertical drift with scroll
      meshRef.current.position.y = LOGO_Y_OFFSET + scrollProgress * 1.5;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
    
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -state.clock.elapsedTime * 0.2;
    }
    
    if (torusKnotRef.current) {
      torusKnotRef.current.rotation.x = scrollProgress * Math.PI;
      torusKnotRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer twisted ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
          emissive="#0a0a0a"
          emissiveIntensity={2.2}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.4, 0.06, 16, 100]} />
        <meshStandardMaterial
          color="#a0a0a0"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={2}
          emissive="#0a0a0a"
          emissiveIntensity={2.0}
        />
      </mesh>
      
      {/* Center A logo */}
      <mesh>
        <torusGeometry args={[0.8, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#0F3057"
          metalness={1}
          roughness={0}
          emissive="#0F3057"
          emissiveIntensity={1.8}
        />
      </mesh>
      
      {/* A shape */}
      <group position={[0, 0, 0]}>
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial
            color="#0F3057"
            metalness={0.9}
            roughness={0.1}
            emissive="#0F3057"
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial
            color="#0F3057"
            metalness={0.9}
            roughness={0.1}
            emissive="#0F3057"
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#0F3057"
            metalness={0.9}
            roughness={0.1}
            emissive="#0F3057"
            emissiveIntensity={1.8}
          />
        </mesh>
      </group>
      
      {/* Twisted loop */}
      <mesh ref={torusKnotRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusKnotGeometry args={[2.5, 0.03, 100, 16, 2, 3]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// Particle System - Continuous animation
function Particles({ count = 1000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 30;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = (Math.random() - 0.5) * 30;
      
      vel[i3] = (Math.random() - 0.5) * 0.015;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.015;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
      
      if (Math.abs(posArray[i3]) > 15) velocities[i3] *= -1;
      if (Math.abs(posArray[i3 + 1]) > 15) velocities[i3 + 1] *= -1;
      if (Math.abs(posArray[i3 + 2]) > 15) velocities[i3 + 2] *= -1;
    }
    
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#4ade80"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Floating crystals
function FloatingCrystals() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, i) => (
        <Float
          key={i}
          speed={1.5}
          rotationIntensity={0.8}
          floatIntensity={1.5}
          position={[
            Math.sin(i * Math.PI / 6) * 5,
            Math.cos(i * 0.7) * 3,
            Math.cos(i * Math.PI / 6) * 5
          ]}
        >
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color={`hsl(${i * 30 + 180}, 70%, 60%)`}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// 3D Scene
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#05070a']} />
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      {ENABLE_ENVIRONMENT && (
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
      )}
      <ambientLight intensity={0.85} />
      <pointLight position={[10, 10, 10]} intensity={2.4} color="#5bff9a" />
      <pointLight position={[-10, -10, -10]} intensity={1.6} color="#c084fc" />
      <pointLight position={[0, 6, 6]} intensity={2.0} color="#22d3ee" />
      <directionalLight position={[0, 10, 8]} intensity={1.2} color="#ffffff" />
      
      <Logo3D scrollProgress={scrollProgress} />
      {ENABLE_PARTICLES && <Particles count={1000} />}
      {ENABLE_FLOATING_CRYSTALS && <FloatingCrystals />}
    </>
  );
}

function DebugScene() {
  return (
    <>
      <color attach="background" args={['#05070a']} />
      <ambientLight intensity={0.5} />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#ff4da6" />
      </mesh>
    </>
  );
}

// Phone Mockup Component
function PhoneMockup({ activeService, onServiceSelect }: { activeService: number; onServiceSelect: (index: number) => void }) {
  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-[40px] p-3 shadow-2xl">
        {/* Phone bezel */}
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-gray-600 via-gray-800 to-black opacity-50" />
        
        {/* Decorative elements */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-800 rounded-full" />
        <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute top-4 right-4 text-[10px] text-gray-400 font-mono">001</div>
        
        {/* Side button */}
        <div className="absolute -left-1 top-20 w-1 h-12 bg-gray-600 rounded-l" />
        <div className="absolute -left-1 top-36 w-1 h-8 bg-gray-600 rounded-l" />
        
        {/* Screen */}
        <div className="relative bg-black rounded-[32px] overflow-hidden aspect-[9/16]">
          {/* Screen content */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
            {/* Header */}
            <div className="p-4 pt-8">
              <p className="text-xs text-gray-400 mb-1">What type of project</p>
              <p className="text-xs text-gray-400">do you need help with?</p>
            </div>
            
            {/* Service list */}
            <div className="px-2 space-y-1">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  onClick={() => onServiceSelect(index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    backgroundColor: activeService === index ? 'rgba(0, 212, 255, 0.2)' : 'transparent'
                  }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    activeService === index 
                      ? 'text-cyan-400 border border-cyan-400/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {service.label}
                </motion.button>
              ))}
            </div>
            
            {/* Bottom indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {services.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    activeService === index ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Screen glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        </div>
        
        {/* Bottom decoration */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-cyan-500/10 rounded-[50px] blur-xl -z-10" />
    </div>
  );
}

// Service Detail Card
function ServiceDetailCard({ service, isActive }: { service: typeof services[0]; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 50 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`absolute inset-0 flex flex-col justify-center px-8 md:px-16 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <motion.h3 
        className="text-4xl md:text-6xl font-light mb-4"
        style={{ color: service.color }}
      >
        {service.title}
      </motion.h3>
      
      <p className="text-lg md:text-xl text-white/85 mb-8 max-w-xl">
        {service.description}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {service.features.map((feature, idx) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: service.color }} />
            <span className="text-sm text-white/70">{feature}</span>
          </motion.div>
        ))}
      </div>
      
      <Link
        to={`/service/${service.id}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-sm hover:bg-white/10 transition-all w-fit group"
      >
        Learn More
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

// Hero Section
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen w-full"
      style={{ minHeight: '100vh' }}
    >
      {/* CTA Button */}
      <motion.div 
        className="absolute bottom-20 left-12 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <button
          type="button"
          onClick={() => {
            const target = document.getElementById('services');
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="group relative px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 text-white font-medium tracking-wider overflow-hidden transition-all hover:bg-white/10 hover:border-white/40"
        >
          <span className="relative z-10 flex items-center gap-3">
            See Our Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div 
            className="w-1 h-2 bg-white/60 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// Services Section with Phone Mockup
function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState(0);
  const [mobileModalService, setMobileModalService] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  
  // Update active service based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const serviceIndex = Math.min(
        Math.floor(value * services.length),
        services.length - 1
      );
      setActiveService(serviceIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services"
      className="relative"
      style={{ height: "140vh" }}
    >
      {/* Mobile full-screen service modal */}
      {mobileModalService !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 md:hidden bg-black/95"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
          <div className="relative h-full w-full overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="text-xs tracking-[0.3em] text-gray-500">
                {services[mobileModalService].label}
              </span>
              <button
                type="button"
                onClick={() => setMobileModalService(null)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-12 pt-6">
              <h3
                className="text-3xl font-light mb-3"
                style={{ color: services[mobileModalService].color }}
              >
                {services[mobileModalService].title}
              </h3>
              <p className="text-gray-300 mb-6">
                {services[mobileModalService].description}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {services[mobileModalService].features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: services[mobileModalService].color }}
                    />
                    {feature}
                  </div>
                ))}
              </div>
              <Link
                to={`/service/${services[mobileModalService].id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-sm hover:bg-white/10 transition-all"
                onClick={() => setMobileModalService(null)}
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      <div className="sticky top-0 h-screen flex flex-col overflow-visible">
        <div className="container mx-auto px-8 pt-16 pb-8 shrink-0">
          <h2 className="text-4xl md:text-6xl font-light mb-6">OUR SERVICES</h2>
          <p className="text-gray-400 max-w-xl">
            Specialized teams delivering digital products, AI content, and business systems.
          </p>
        </div>
        <div className="flex-1 flex overflow-visible pb-12">
        {/* Left side - Phone Mockup */}
        <div className="w-full md:w-2/5 h-full flex items-center justify-center p-8 pb-16 z-20">
          <PhoneMockup 
            activeService={activeService} 
            onServiceSelect={(index) => {
              setActiveService(index);
              if (isMobile) {
                setMobileModalService(index);
              }
            }}
          />
        </div>
        
        {/* Right side - Service Details (Desktop only) */}
        <div className="hidden md:block w-3/5 h-full relative">
          {services.map((service, index) => (
            <ServiceDetailCard 
              key={service.id}
              service={service}
              isActive={activeService === index}
            />
          ))}
        </div>
        
        {/* Mobile service details */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl font-light mb-2" style={{ color: services[activeService].color }}>
              {services[activeService].title}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {services[activeService].description}
            </p>
            <Link
              to={`/service/${services[activeService].id}`}
              className="inline-flex items-center gap-2 text-sm text-cyan-400"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
          {services.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                activeService === index ? 'bg-cyan-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

// Portfolio Section
function PortfolioSection({ sectionRef }: { sectionRef?: RefObject<HTMLDivElement | null> }) {
  return (
    <section ref={sectionRef} className="relative min-h-screen pt-0 pb-20 mt-32">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-light mb-4">SELECTED WORK</h2>
          <p className="text-gray-400 max-w-xl">
            A curated collection of projects that push the boundaries of digital experiences.
          </p>
        </motion.div>
        
        {/* Carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
            {portfolioProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 md:w-96 snap-center"
              >
                <Link
                  to={`/portfolio#${project.id}`}
                  className="block"
                >
                <div className="project-card rounded-2xl overflow-hidden aspect-[4/5] relative group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {project.client && (
                      <p className="text-xs text-cyan-400 mb-2 tracking-wider">{project.client}</p>
                    )}
                    <h3 className="text-xl font-light tracking-wider">{project.title}</h3>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* View All button */}
          <div className="flex justify-center mt-8">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-sm hover:bg-white/10 transition-all group"
            >
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { title: 'Discover', text: 'We align on goals, audience, and success metrics.' },
    { title: 'Design', text: 'We craft UX, visuals, and content direction.' },
    { title: 'Build', text: 'We develop with clean architecture and QA.' },
    { title: 'Launch', text: 'We ship, measure, and optimize performance.' },
    { title: 'Scale', text: 'We iterate and expand based on real data.' },
  ];

  return (
    <section className="relative py-24 border-t border-white/10">
      <div className="container mx-auto px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4">HOW WE WORK</h2>
          <p className="text-gray-400 max-w-xl">
            A clear, fast-moving process that keeps your project on track.
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-xs text-gray-500 mb-3 tracking-widest">STEP {index + 1}</div>
              <div className="text-lg mb-2">{step.title}</div>
              <p className="text-sm text-gray-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  const items = [
    { title: 'Fast Delivery', text: 'Lean sprints and rapid iteration.' },
    { title: 'AI-Enhanced Workflow', text: 'AI supports our team where it adds value.' },
    { title: 'Dedicated Team', text: 'Focused specialists for each phase.' },
    { title: 'Post-Launch Support', text: 'We monitor, improve, and scale.' },
  ];

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4">WHY CHOOSE US</h2>
          <p className="text-gray-400 max-w-xl">
            Practical advantages that make your project smoother and more effective.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-lg mb-2">{item.title}</div>
              <p className="text-sm text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const quotes = [
    {
      quote: 'Outstanding delivery and extremely fast turnaround.',
      name: 'Aarav Sharma',
      role: 'Founder, Brightify'
    },
    {
      quote: 'Our engagement and conversions improved immediately.',
      name: 'Neha Kapoor',
      role: 'Marketing Lead, Zenta'
    },
    {
      quote: 'Clear communication and top-tier execution.',
      name: 'Rohit Mehta',
      role: 'COO, Coreline'
    }
  ];

  return (
    <section className="relative py-24 border-y border-white/10">
      <div className="container mx-auto px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-4">CLIENT FEEDBACK</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trusted by teams who want quality, speed, and measurable results.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((item) => (
            <div key={item.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-lg mb-4">“{item.quote}”</p>
              <div className="text-sm text-gray-400">{item.name}</div>
              <div className="text-xs text-gray-500">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseHighlightsSection() {
  const highlights = [
    {
      title: 'AI Promo Launch',
      result: '3x ad CTR in 10 days',
      detail: 'Short-form campaign with AI storyboards and rapid edits.'
    },
    {
      title: 'Ecommerce App',
      result: '28% higher conversion',
      detail: 'Full redesign + performance tuning + analytics setup.'
    },
    {
      title: 'ERP Rollout',
      result: '30% faster reporting',
      detail: 'Unified finance + inventory with custom dashboards.'
    },
  ];

  return (
    <section className="relative py-24 border-t border-white/10">
      <div className="container mx-auto px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4">CASE HIGHLIGHTS</h2>
          <p className="text-gray-400 max-w-xl">
            A few recent outcomes across web, content, and systems.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-lg mb-2">{item.title}</div>
              <div className="text-cyan-400 text-2xl font-light mb-2">{item.result}</div>
              <p className="text-sm text-gray-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'How long does a typical project take?',
      a: 'Most projects run 2–6 weeks depending on scope and approvals.'
    },
    {
      q: 'Do you provide ongoing support?',
      a: 'Yes. We offer monthly support, maintenance, and content updates.'
    },
    {
      q: 'Can you work with my existing brand or assets?',
      a: 'Absolutely. We can use your current brand or refresh it.'
    },
    {
      q: 'What do you need to get started?',
      a: 'A short brief, goals, references, and access to existing assets.'
    },
  ];

  return (
    <section className="relative py-24 border-y border-white/10">
      <div className="container mx-auto px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-4">FAQ</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Quick answers to the most common questions we receive.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((item) => (
            <div key={item.q} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-lg mb-2">{item.q}</div>
              <p className="text-sm text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 border-t border-white/10">
      <div className="container mx-auto px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-light mb-4">CONTACT US</h2>
            <p className="text-gray-400 mb-8 max-w-sm">
              Tell us about your project and we&apos;ll get back to you quickly.
            </p>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400" />
                hello@activetheory.net
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400" />
                +91 9250818908
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
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
          </div>

          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
                <h3 className="text-2xl font-light mb-3">Thanks for reaching out</h3>
                <p className="text-gray-400">We&apos;ll respond within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 tracking-wider uppercase">
                      Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 tracking-wider uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/10"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs text-gray-500 mb-2 tracking-wider uppercase">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all resize-none focus:border-cyan-400/50 focus:bg-white/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-cyan-500 text-black font-medium flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


// Footer
function Footer() {
  return (
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
  );
}

// Main HomePage Component
export default function HomePage() {
  const workRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const target = workRef.current?.offsetTop ?? window.innerHeight;
      const progress = Math.min(scrollY / Math.max(target, 1), 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <main className="relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ width: '100%', height: '100%', display: 'block', background: '#05070a' }}
        >
          {DEBUG_SIMPLE_SCENE ? (
            <DebugScene />
          ) : (
            <Scene scrollProgress={scrollProgress} />
          )}
        </Canvas>
      </div>
      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <PortfolioSection sectionRef={workRef} />
        <ProcessSection />
        <ProofSection />
        <TestimonialsSection />
        <CaseHighlightsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
