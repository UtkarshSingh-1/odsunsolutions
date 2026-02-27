import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Filter, X, ChevronRight, Award, Calendar, Users } from 'lucide-react';
import gsap from 'gsap';

// Portfolio projects data
const projects = [
  { 
    id: 1, 
    title: 'PAPER PLANES', 
    client: 'Google', 
    category: 'websites',
    year: '2023',
    description: 'An interactive web experience that allows users to create and throw digital paper planes across the world.',
    technologies: ['WebGL', 'Three.js', 'React'],
    awards: ['FWA Site of the Day', 'Awwwards SOTD'],
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    color: '#00d4ff'
  },
  { 
    id: 2, 
    title: 'SUSTAINABLE HORIZONS', 
    client: 'WSJ', 
    category: 'websites',
    year: '2023',
    description: 'A data visualization project exploring the future of sustainable energy and climate solutions.',
    technologies: ['D3.js', 'React', 'Node.js'],
    awards: ['Webby Award Nominee'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    color: '#4ade80'
  },
  { 
    id: 3, 
    title: 'E.C.H.O.', 
    client: 'U.S. Air Force', 
    category: 'xr',
    year: '2022',
    description: 'Extended Reality training simulation for next-generation aircraft maintenance.',
    technologies: ['Unity', 'VR', 'AI'],
    awards: ['Innovation Award'],
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    color: '#a855f7'
  },
  { 
    id: 4, 
    title: 'MILLION PIECE MISSION', 
    client: 'U.S. Air Force', 
    category: 'games',
    year: '2022',
    description: 'A collaborative puzzle game where millions of users work together to complete a mission.',
    technologies: ['WebGL', 'Socket.io', 'Node.js'],
    awards: ['FWA Site of the Day'],
    image: 'https://images.unsplash.com/photo-1614728853913-1e22ba0e982b?w=800&q=80',
    color: '#fbbf24'
  },
  { 
    id: 5, 
    title: 'DISCOVER YOUR PATRONUS', 
    client: 'Harry Potter', 
    category: 'xr',
    year: '2021',
    description: 'An immersive AR experience that reveals your magical guardian spirit.',
    technologies: ['ARKit', 'ARCore', 'Unity'],
    awards: ['Campaign of the Year'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    color: '#f472b6'
  },
  { 
    id: 6, 
    title: 'PROMETHEUS', 
    client: '', 
    category: 'games',
    year: '2021',
    description: 'A narrative-driven exploration game set in a procedurally generated universe.',
    technologies: ['Unity', 'Procedural Generation'],
    awards: ['Indie Game Award'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    color: '#f87171'
  },
  { 
    id: 7, 
    title: 'CHILE 20', 
    client: 'Adidas', 
    category: 'websites',
    year: '2020',
    description: 'Interactive product launch experience for the Chile 20 football boot.',
    technologies: ['WebGL', 'React', 'GSAP'],
    awards: ['Awwwards SOTD'],
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
    color: '#60a5fa'
  },
  { 
    id: 8, 
    title: 'WELCOME TO HOGWARTS', 
    client: 'Harry Potter', 
    category: 'xr',
    year: '2020',
    description: 'A magical VR tour of the iconic wizarding school.',
    technologies: ['VR', 'Unity', 'Spatial Audio'],
    awards: ['VR Experience of the Year'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    color: '#a855f7'
  },
  { 
    id: 9, 
    title: 'KANDINSKY', 
    client: 'Google', 
    category: 'websites',
    year: '2019',
    description: 'An AI-powered art creation tool inspired by the abstract master.',
    technologies: ['TensorFlow.js', 'Canvas API', 'React'],
    awards: ['AI Innovation Award'],
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    color: '#34d399'
  },
  { 
    id: 10, 
    title: 'FRONTIER WITHIN', 
    client: 'The Frontier', 
    category: 'websites',
    year: '2019',
    description: 'An immersive documentary experience exploring the human body.',
    technologies: ['WebGL', 'Three.js', 'Video'],
    awards: ['Emmy Nomination'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    color: '#fbbf24'
  },
  { 
    id: 11, 
    title: 'RACER', 
    client: 'Google', 
    category: 'games',
    year: '2018',
    description: 'A cross-device racing game playable across multiple screens.',
    technologies: ['WebSockets', 'Canvas', 'Node.js'],
    awards: ['Chrome Experiment'],
    image: 'https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2?w=800&q=80',
    color: '#f87171'
  },
  { 
    id: 12, 
    title: 'HARMONIC STATE', 
    client: 'IBM', 
    category: 'installations',
    year: '2018',
    description: 'An interactive installation visualizing quantum computing concepts.',
    technologies: ['Projection Mapping', 'Sensors', 'OpenFrameworks'],
    awards: ['SXSW Interactive Award'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    color: '#60a5fa'
  },
];

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'websites', label: 'Websites' },
  { id: 'installations', label: 'Installations' },
  { id: 'xr', label: 'XR / VR' },
  { id: 'games', label: 'Games' },
];

// Particle background
function ParticleBackground() {
  const particles = useState(() =>
    [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 4,
    }))
  )[0];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="project-card rounded-2xl overflow-hidden aspect-[4/3] relative cursor-pointer">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {project.client && (
              <p className="text-xs mb-2 tracking-wider" style={{ color: project.color }}>
                {project.client}
              </p>
            )}
            <h3 className="text-xl font-light tracking-wider mb-2">{project.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {project.description}
            </p>
          </div>
          
          {/* Awards */}
          {project.awards.length > 0 && (
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.awards.map((award, idx) => (
                <div 
                  key={idx}
                  className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] flex items-center gap-1"
                >
                  <Award className="w-3 h-3" />
                  {award}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/30 rounded-2xl transition-colors" />
      </div>
    </motion.div>
  );
}

// Project Modal
function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header image */}
        <div className="relative h-64 md:h-96">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            {project.client && (
              <p className="text-sm mb-2" style={{ color: project.color }}>{project.client}</p>
            )}
            <h2 className="text-3xl md:text-5xl font-light">{project.title}</h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-10">
          <p className="text-lg text-gray-300 mb-8">{project.description}</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Year</span>
              </div>
              <p className="text-lg">{project.year}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Category</span>
              </div>
              <p className="text-lg capitalize">{project.category}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Awards</span>
              </div>
              <p className="text-lg">{project.awards.length}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-white/5 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {project.awards.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Awards & Recognition</h3>
              <div className="space-y-2">
                {project.awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <button className="flex-1 py-4 rounded-full bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
              View Live Project
              <ExternalLink className="w-5 h-5" />
            </button>
            <Link
              to="/contact"
              className="flex-1 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Start Similar Project
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

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

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      <ParticleBackground />
      
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6 bg-black/80 backdrop-blur-lg"
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
          
          {/* Desktop filters */}
          <div className="hidden md:flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-1 text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'text-cyan-400'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white/5"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        {/* Mobile filters dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowFilters(false);
                    }}
                    className={`px-2 py-1 text-sm transition-all ${
                      selectedCategory === cat.id
                        ? 'text-cyan-400'
                        : 'text-white/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-20">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-light mb-6">
              Our <span className="text-cyan-400">Work</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A showcase of digital experiences that push boundaries and create lasting impressions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(project)}
                >
                  <ProjectCard project={project} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/10">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '150+', label: 'Projects' },
              { value: '50+', label: 'Awards' },
              { value: '12', label: 'Years' },
              { value: '30+', label: 'Clients' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-light text-cyan-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Have a project in mind?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Let&apos;s create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors justify-center"
              >
                Start a Project
                <ChevronRight className="w-5 h-5" />
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

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
