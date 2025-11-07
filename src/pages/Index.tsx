import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Code2,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  Rocket,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Layers,
  Cpu,
  Database,
  Zap,
  Star,
  Globe,
  Download,
  ExternalLink
} from 'lucide-react';

const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:3001/api' 
  : (import.meta.env.VITE_API_URL || '/api');

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated Gradient Background
const AnimatedGradient = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#0f172a_0%,#1e293b_50%,#0f172a_100%)] opacity-90" />
    </div>
  );
};

// Glassmorphism Card
const GlassCard = ({ children, className = '', delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    const loadPortfolioData = async () => {
      try {
        const url = `${API_URL}/portfolio`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPortfolioData(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading portfolio data:', err);
        setLoading(false);
      }
    };
    
    loadPortfolioData();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const contactData = portfolioData?.contactData || {};
      const subject = encodeURIComponent(`رسالة من ${formData.name}`);
      const body = encodeURIComponent(`الاسم: ${formData.name}\nالبريد الإلكتروني: ${formData.email}\n\nالرسالة:\n${formData.message}`);
      window.location.href = `mailto:${contactData.email || 'contact@example.com'}?subject=${subject}&body=${body}`;
      setFormData({ name: '', email: '', message: '' });
      alert('تم فتح بريدك الإلكتروني. يرجى إرسال الرسالة.');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء إرسال النموذج');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <AnimatedGradient />
        <FloatingParticles />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-6 relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-blue-300 font-semibold text-xl"
          >
            جاري التحميل...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium text-xl">حدث خطأ في تحميل البيانات</p>
        </div>
      </div>
    );
  }

  const heroData = portfolioData.heroData || {};
  const aboutData = portfolioData.aboutData || [];
  const skills = portfolioData.skills || [];
  const projects = portfolioData.projects || [];
  const contactData = portfolioData.contactData || {};

  return (
    <div ref={containerRef} className="min-h-screen text-white relative overflow-hidden" dir="rtl">
      <AnimatedGradient />
      <FloatingParticles />
      
      {/* Custom Cursor Effect */}
      <motion.div
        className="fixed w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border-b border-white/20 shadow-2xl shadow-black/20"
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
          animate={{
            backgroundPosition: ['0% center', '100% center', '0% center'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-24">
            {/* Desktop Menu - على اليسار */}
            <div className="hidden md:flex items-center gap-2">
              {[
                { label: 'الرئيسية', href: '#home', icon: Rocket },
                { label: 'عني', href: '#about', icon: Star },
                { label: 'المهارات', href: '#skills', icon: Zap },
                { label: 'المشاريع', href: '#projects', icon: Globe },
                { label: 'اتصل بي', href: '#contact', icon: Mail },
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative text-white/80 hover:text-white transition-all font-semibold text-sm px-4 py-2.5 rounded-xl group overflow-hidden"
                >
                  {/* Background on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                    initial={{ x: 10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </motion.div>
                  
                  {/* Text */}
                  <span className="relative z-10 pl-6">{item.label}</span>
                  
                  {/* Bottom Border */}
                  <motion.div
                    className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-blue-400 transition-colors group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={mobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Logo Section - على اليمين */}
            <motion.a
              href="#home"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 cursor-pointer group flex-row-reverse"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.75, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-white/20">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col text-right">
                <motion.span
                  className="text-xl font-black text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Abdullah Alrejib
                </motion.span>
                <motion.p
                  className="text-xs font-semibold text-blue-300 -mt-1"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  مطور Full Stack
                </motion.p>
              </div>
            </motion.a>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="md:hidden pb-6 mt-4 space-y-2 overflow-hidden backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10"
              >
                {[
                  { label: 'الرئيسية', href: '#home', icon: Rocket },
                  { label: 'عني', href: '#about', icon: Star },
                  { label: 'المهارات', href: '#skills', icon: Zap },
                  { label: 'المشاريع', href: '#projects', icon: Globe },
                  { label: 'اتصل بي', href: '#contact', icon: Mail },
                ].map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 text-white/80 hover:text-white transition-colors font-semibold py-4 px-6 rounded-xl hover:bg-white/10 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10"
                    >
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <span>{item.label}</span>
                    <motion.div
                      className="mr-auto"
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                    >
                      <ChevronRight className="w-5 h-5 text-white/50 rotate-180" />
                    </motion.div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-[100px]"
              style={{
                width: 300 + i * 150,
                height: 300 + i * 150,
                background: `linear-gradient(135deg, ${
                  i % 2 === 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(147, 51, 234, 0.4)'
                }, ${
                  i % 2 === 0 ? 'rgba(147, 51, 234, 0.2)' : 'rgba(236, 72, 153, 0.2)'
                })`,
                left: `${15 + i * 20}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, 80, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </motion.div>
                <span className="text-sm font-semibold text-white">{heroData.badge || 'متاح للتوظيف'}</span>
              </motion.div>
            </motion.div>

            {/* Main Title with Glitch Effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight"
            >
              <motion.span
                className="block bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{
                  backgroundPosition: ['0% center', '200% center', '0% center'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {heroData.title || 'مطور Full Stack'}
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              {heroData.subtitle || 'بناء حلول مبتكرة باستخدام التقنيات الحديثة. شغوف بإنشاء تجارب رقمية استثنائية.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex gap-6 justify-center flex-wrap mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-blue-500/50 px-10 py-7 text-lg font-bold rounded-xl border-0"
                >
                  <Code2 className="w-6 h-6" />
                  شاهد أعمالي
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-3 border-2 border-white/30 hover:border-white/50 backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white px-10 py-7 text-lg font-bold rounded-xl"
                >
                  <Mail className="w-6 h-6" />
                  تواصل معي
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto"
            >
              {[
                { value: heroData.projects || '50+', label: 'مشروع', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
                { value: heroData.experience || '5+', label: 'سنوات خبرة', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
                { value: heroData.clients || '100+', label: 'عميل', icon: Users, color: 'from-pink-500 to-rose-500' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 1.2 + index * 0.15, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, y: -10, rotateY: 5 }}
                  className="perspective-1000"
                >
                  <GlassCard delay={0} className="p-6 sm:p-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mx-auto mb-4 flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.15, type: "spring" }}
                      className="text-4xl sm:text-5xl font-black text-white mb-2"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm sm:text-base text-white/70 font-medium">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="text-sm text-white/60 font-medium">انتقل للاستكشاف</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 text-blue-400 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="text-center mb-16 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20"
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">عني</span>
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                من أنا
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto"
              >
                مطور شغوف بخبرة في بناء تطبيقات ويب قابلة للتوسع
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {aboutData.map((item: any, index: number) => {
                const icons = [Layers, Cpu, Database];
                const colors = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-pink-500 to-rose-500'
                ];
                const Icon = icons[index % icons.length] || Code2;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    whileHover={{ y: -15, rotateY: 5, scale: 1.02 }}
                    className="perspective-1000"
                  >
                    <GlassCard delay={0} className="h-full p-8">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center mb-6 shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4 text-white">{item.title || 'عنوان'}</h3>
                      <p className="text-white/70 leading-relaxed text-lg">
                        {item.description || 'وصف'}
                      </p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="text-center mb-16 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">المهارات</span>
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                الخبرة التقنية
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl text-white/70"
              >
                التقنيات التي أعمل بها يومياً
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {skills.map((skill: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100, rotateY: 90 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
                  viewport={{ once: true }}
                  whileHover={{ x: -10, scale: 1.02 }}
                  className="perspective-1000"
                >
                  <GlassCard delay={0} className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-xl text-white">{skill.name}</span>
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                        viewport={{ once: true }}
                        className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                      >
                        {skill.level}%
                      </motion.span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="text-center mb-16 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">المحفظة</span>
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                مشاريع مميزة
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl text-white/70"
              >
                بعض أعمالي وإنجازاتي الأخيرة
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 80, rotateX: 45 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                  viewport={{ once: true }}
                  whileHover={{ y: -20, rotateY: 5, scale: 1.03 }}
                  className="perspective-1000"
                >
                  <GlassCard delay={0} className="h-full flex flex-col p-8 group">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                      className="aspect-video bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-white/10"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-purple-500/0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      <Code2 className="w-20 h-20 text-blue-400 relative z-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{project.title}</h3>
                    <p className="text-white/70 mb-6 flex-1 leading-relaxed text-lg">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech?.map((tech: string, i: number) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Badge className="text-xs backdrop-blur-xl bg-white/10 border border-white/20 text-white/80">
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-white/30 hover:border-white/50 backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white rounded-xl"
                      >
                        عرض المشروع
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="text-center mb-16 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">اتصل بي</span>
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                دعنا نعمل معاً
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl sm:text-2xl text-white/70 mb-12"
              >
                لديك مشروع في ذهنك؟ دعنا ننشئ شيئاً رائعاً معاً.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlassCard delay={0} className="p-8 sm:p-10 md:p-14">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white">تواصل معي</h3>
                      <p className="text-white/70 mb-10 leading-relaxed text-lg">
                        أنا دائماً منفتح لمناقشة مشاريع جديدة، أفكار إبداعية، أو فرص لأكون جزءاً من رؤيتك.
                      </p>
                    </div>
                    {[
                      { icon: Mail, label: 'البريد الإلكتروني', value: contactData.email || 'contact@example.com', color: 'from-blue-500 to-cyan-500' },
                      { icon: Phone, label: 'الهاتف', value: contactData.phone || '+1 (555) 123-4567', color: 'from-purple-500 to-pink-500' },
                      { icon: MapPin, label: 'الموقع', value: contactData.location || 'Remote / Available Worldwide', color: 'from-pink-500 to-rose-500' },
                      { icon: Calendar, label: 'التوفر', value: contactData.availability || 'Available for new projects', color: 'from-cyan-500 to-blue-500' },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.15 }}
                        viewport={{ once: true }}
                        whileHover={{ x: -10, scale: 1.02 }}
                        className="flex items-center gap-5 group"
                      >
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                        >
                          <item.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <div className="font-bold text-xl text-white mb-2">{item.label}</div>
                          <div className="text-white/70 text-lg">{item.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white">أرسل رسالة</h3>
                      <p className="text-white/70 mb-8 text-lg">
                        أرسل لي رسالة مباشرة وسأرد عليك في أقرب وقت ممكن.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-white font-semibold text-lg">الاسم</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="أدخل اسمك"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 h-14 backdrop-blur-xl rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-white font-semibold text-lg">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 h-14 backdrop-blur-xl rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="message" className="text-white font-semibold text-lg">الرسالة</Label>
                        <Textarea
                          id="message"
                          placeholder="أدخل رسالتك هنا..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={6}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 resize-none backdrop-blur-xl rounded-xl"
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={formSubmitting}
                          className="w-full gap-3 h-14 font-bold text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/50 disabled:opacity-50 rounded-xl border-0"
                        >
                          {formSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                              />
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <Mail className="w-6 h-6" />
                              إرسال الرسالة
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              >
                <Code2 className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <span className="text-lg font-bold text-white">Abdullah Alrejib</span>
                <p className="text-xs text-white/60">مطور ويب</p>
              </div>
            </motion.div>
            <div className="text-center md:text-left text-white/70">
              <p className="font-medium">© 2025 المحفظة. جميع الحقوق محفوظة.</p>
            </div>
            <div className="flex gap-4">
              {[Github, Linkedin, Mail].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.3, rotate: 360, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-blue-400 w-12 h-12"
                  >
                    <Icon className="w-6 h-6" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
