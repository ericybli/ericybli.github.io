import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
        Code2,
        Cpu,
        Database,
        Bot,
        Terminal,
        Layers,
        Github,
        Twitter,
        Mail,
        ExternalLink,
        ChevronDown,
        Binary,
        BrainCircuit,
        ScanLine,
        Zap,
        Smartphone,
        Home
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 内联样式：用于确保自定义动画在所有环境中都能生效
// -----------------------------------------------------------------------------
const CustomStyles = () => (
    <style>{`
    @keyframes shimmer {
      from { background-position: 0 0; }
      to { background-position: -200% 0; }
    }
    .animate-shimmer {
      animation: shimmer 2s linear infinite;
      background-size: 200% 100%;
    }
    @keyframes tilt {
      0%, 50%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(1deg); }
      75% { transform: rotate(-1deg); }
    }
    .animate-tilt {
      animation: tilt 10s infinite linear;
    }
  `}</style>
);

// -----------------------------------------------------------------------------
// 交互组件: 鼠标聚光灯 (Mouse Spotlight)
// -----------------------------------------------------------------------------
const MouseSpotlight = () => {
        const [pos, setPos] = useState({ x: 0, y: 0 });
        const [opacity, setOpacity] = useState(0);

        useEffect(() => {
                const handleMouseMove = (e) => {
                        setPos({ x: e.clientX, y: e.clientY });
                        setOpacity(1);
                };

                const handleMouseLeave = () => setOpacity(0);

                window.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseleave', handleMouseLeave);

                return () => {
                        window.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseleave', handleMouseLeave);
                };
        }, []);

        return (
            <div
                className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
                style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(251, 191, 36, 0.15), transparent 50%)`
                }}
            />
        );
};

// -----------------------------------------------------------------------------
// 交互组件: 滚动渐显容器 (Scroll Reveal)
// -----------------------------------------------------------------------------
const ScrollReveal = ({ children, delay = 0 }) => {
        const ref = useRef(null);
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                            if (entry.isIntersecting) {
                                    setIsVisible(true);
                                    observer.unobserve(entry.target);
                            }
                    },
                    { threshold: 0.1, rootMargin: '50px' }
                );

                if (ref.current) observer.observe(ref.current);
                return () => observer.disconnect();
        }, []);

        return (
            <div
                ref={ref}
                className={`transition-all duration-1000 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
            >
                    {children}
            </div>
        );
};

// -----------------------------------------------------------------------------
// 交互组件: 3D 倾斜卡片 (3D Tilt Card)
// -----------------------------------------------------------------------------
const TiltCard = ({ children, className }) => {
        const ref = useRef(null);
        const [rotation, setRotation] = useState({ x: 0, y: 0 });
        const [isHovering, setIsHovering] = useState(false);

        const handleMouseMove = (e) => {
                if (!ref.current) return;
                const rect = ref.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                setRotation({ x: rotateX, y: rotateY });
        };

        const handleMouseLeave = () => {
                setIsHovering(false);
                setRotation({ x: 0, y: 0 });
        };

        return (
            <div
                ref={ref}
                onMouseMove={(e) => { setIsHovering(true); handleMouseMove(e); }}
                onMouseLeave={handleMouseLeave}
                className={`transform-gpu transition-transform duration-200 ease-out ${className}`}
                style={{
                        transform: isHovering
                            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
                            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
                }}
            >
                    {children}
            </div>
        );
};

// -----------------------------------------------------------------------------
// 交互组件: 故障文字效果 (Glitch Text)
// -----------------------------------------------------------------------------
const GlitchText = ({ text }) => {
        const [displayText, setDisplayText] = useState(text);
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';

        const scramble = useCallback(() => {
                let iterations = 0;
                const interval = setInterval(() => {
                        setDisplayText(
                            text
                                .split('')
                                .map((char, index) => {
                                        if (index < iterations) return text[index];
                                        return chars[Math.floor(Math.random() * chars.length)];
                                })
                                .join('')
                        );

                        if (iterations >= text.length) clearInterval(interval);
                        iterations += 1 / 3;
                }, 30);
        }, [text]);

        return (
            <span
                onMouseEnter={scramble}
                className="inline-block cursor-default text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:text-amber-300 transition-colors"
            >
      {displayText}
    </span>
        );
};

// -----------------------------------------------------------------------------
// 组件: 粒子背景
// -----------------------------------------------------------------------------
const ParticleNetwork = () => {
        const canvasRef = useRef(null);

        useEffect(() => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                let width, height;
                let particles = [];

                const resize = () => {
                        width = window.innerWidth;
                        height = window.innerHeight;
                        canvas.width = width;
                        canvas.height = height;
                        initParticles();
                };

                const initParticles = () => {
                        particles = [];
                        const count = Math.floor((width * height) / 15000);
                        for (let i = 0; i < count; i++) {
                                particles.push({
                                        x: Math.random() * width,
                                        y: Math.random() * height,
                                        vx: (Math.random() - 0.5) * 0.5,
                                        vy: (Math.random() - 0.5) * 0.5,
                                        size: Math.random() * 2 + 1,
                                });
                        }
                };

                const draw = () => {
                        ctx.clearRect(0, 0, width, height);
                        ctx.fillStyle = 'transparent';

                        ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
                        ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';

                        particles.forEach((p, i) => {
                                p.x += p.vx;
                                p.y += p.vy;

                                if (p.x < 0 || p.x > width) p.vx *= -1;
                                if (p.y < 0 || p.y > height) p.vy *= -1;

                                ctx.beginPath();
                                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                                ctx.fill();

                                for (let j = i + 1; j < particles.length; j++) {
                                        const p2 = particles[j];
                                        const dx = p.x - p2.x;
                                        const dy = p.y - p2.y;
                                        const distance = Math.sqrt(dx * dx + dy * dy);

                                        if (distance < 120) {
                                                ctx.lineWidth = 1 - distance / 120;
                                                ctx.beginPath();
                                                ctx.moveTo(p.x, p.y);
                                                ctx.lineTo(p2.x, p2.y);
                                                ctx.stroke();
                                        }
                                }
                        });
                        requestAnimationFrame(draw);
                };
                resize();
                draw();
                window.addEventListener('resize', resize);
                return () => window.removeEventListener('resize', resize);
        }, []);

        return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

// -----------------------------------------------------------------------------
// 组件: 打字机效果
// -----------------------------------------------------------------------------
const TypewriterText = ({ texts }) => {
        const [currentTextIndex, setCurrentTextIndex] = useState(0);
        const [displayText, setDisplayText] = useState('');
        const [isDeleting, setIsDeleting] = useState(false);

        useEffect(() => {
                const typeSpeed = isDeleting ? 50 : 100;
                const fullText = texts[currentTextIndex];

                const handleTyping = () => {
                        if (!isDeleting) {
                                setDisplayText(fullText.substring(0, displayText.length + 1));
                                if (displayText.length === fullText.length) {
                                        setTimeout(() => setIsDeleting(true), 2000);
                                }
                        } else {
                                setDisplayText(fullText.substring(0, displayText.length - 1));
                                if (displayText.length === 0) {
                                        setIsDeleting(false);
                                        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                                }
                        }
                };

                const timer = setTimeout(handleTyping, typeSpeed);
                return () => clearTimeout(timer);
        }, [displayText, isDeleting, currentTextIndex, texts]);

        return (
            <span className="text-amber-400 font-mono border-r-2 border-amber-400 animate-pulse pr-1">
      {displayText}
    </span>
        );
};

// -----------------------------------------------------------------------------
// 组件: 技能/领域卡片
// -----------------------------------------------------------------------------
const TechCard = ({ icon: Icon, title, desc, tags }) => (
    <TiltCard className="group relative p-6 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/20 h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="p-3 bg-neutral-800/50 rounded-lg group-hover:bg-amber-500/20 transition-colors duration-300 ring-1 ring-neutral-700 group-hover:ring-amber-500/50">
                            <Icon className="w-8 h-8 text-neutral-400 group-hover:text-amber-400 transition-colors duration-300" />
                    </div>
                    <ScanLine className="w-5 h-5 text-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-mono group-hover:text-amber-300 transition-colors duration-300 relative z-10">
                    {title}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6 relative z-10">
                    {desc}
            </p>

            <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-mono px-2 py-1 rounded bg-neutral-800/80 text-amber-400/90 border border-neutral-700 group-hover:border-amber-500/30 transition-colors">
          {tag}
        </span>
                    ))}
            </div>
    </TiltCard>
);

// -----------------------------------------------------------------------------
// 组件: 虚拟终端
// -----------------------------------------------------------------------------
const TerminalBlock = () => {
        return (
            <ScrollReveal>
                    <div className="w-full max-w-3xl mx-auto bg-neutral-950/90 rounded-lg border border-neutral-800 shadow-2xl overflow-hidden font-mono text-sm my-20 backdrop-blur-sm group hover:border-neutral-600 transition-colors duration-500">
                            <div className="flex items-center px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 gap-2">
                                    <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="ml-4 text-neutral-500 text-xs flex-1 text-center pr-12 opacity-50">zsh — 80x24</div>
                            </div>
                            <div className="p-6 text-neutral-300 space-y-3 font-mono text-sm md:text-base">
                                    <div className="flex">
                                            <span className="text-emerald-500 mr-3 select-none">➜</span>
                                            <span className="text-amber-300">whoami</span>
                                    </div>
                                    <div className="text-neutral-400 pl-6 mb-4">
                                            "Full Stack & Robotics Engineer (Eric Li)"
                                    </div>

                                    <div className="flex">
                                            <span className="text-emerald-500 mr-3 select-none">➜</span>
                                            <span className="text-amber-300">./display_focus.sh --json</span>
                                    </div>
                                    <div className="text-yellow-100/90 pl-6">
                                            {`{`}
                                            <div className="pl-4 text-indigo-300">"proptech": <span className="text-emerald-400">["Inspection Robots", "Residential Data"]</span>,</div>
                                            <div className="pl-4 text-indigo-300">"humanoid": <span className="text-emerald-400">["Training Data Pipelines", "Sim2Real"]</span>,</div>
                                            <div className="pl-4 text-indigo-300">"stack": <span className="text-emerald-400">["React Native", "Go", "ROS2"]</span></div>
                                            {`}`}
                                    </div>

                                    <div className="flex pt-2">
                                            <span className="text-emerald-500 mr-3 select-none">➜</span>
                                            <span className="w-2.5 h-5 bg-neutral-500 animate-pulse inline-block align-middle"></span>
                                    </div>
                            </div>
                    </div>
            </ScrollReveal>
        );
};

// -----------------------------------------------------------------------------
// 主应用组件
// -----------------------------------------------------------------------------
const App = () => {
        const [scrolled, setScrolled] = useState(false);

        useEffect(() => {
                const handleScroll = () => setScrolled(window.scrollY > 50);
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
        }, []);

        const navLinks = [
                { name: 'Home', href: '#home' },
                { name: 'Expertise', href: '#expertise' },
                { name: 'Projects', href: '#projects' },
                { name: 'Contact', href: '#contact' },
        ];

        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-amber-500/30 selection:text-amber-200 font-sans overflow-x-hidden cursor-default">
                    <CustomStyles />
                    <MouseSpotlight />
                    <ParticleNetwork />

                    {/* 导航栏 */}
                    <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-neutral-950/90 backdrop-blur-md border-neutral-800 py-3 shadow-lg shadow-amber-900/5' : 'bg-transparent border-transparent py-6'}`}>
                            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                                    <a href="#" className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter text-white hover:text-amber-400 transition-colors z-50">
                                            <Terminal className="text-amber-400 w-6 h-6" />
                                            <span>DEV<span className="text-amber-400">_</span>CORE</span>
                                    </a>
                                    <div className="hidden md:flex gap-8">
                                            {navLinks.map((link) => (
                                                <a
                                                    key={link.name}
                                                    href={link.href}
                                                    className="text-sm font-medium text-neutral-400 hover:text-amber-400 transition-all relative group py-2"
                                                >
                                                        {link.name}
                                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
                                                </a>
                                            ))}
                                    </div>
                                    <button className="md:hidden text-neutral-300 hover:text-white z-50">
                                            <Layers className="w-6 h-6" />
                                    </button>
                            </div>
                    </nav>

                    {/* Hero 区域 */}
                    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 z-10">
                            <ScrollReveal>
                                    <div className="max-w-4xl w-full mx-auto text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/30 border border-amber-500/20 text-amber-400 text-xs font-mono mb-8 hover:bg-amber-900/30 transition-colors cursor-crosshair hover:border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
                                                    SYSTEM STATUS: ONLINE
                                            </div>

                                            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 relative group">
                                                    Hello, I'm <GlitchText text="Eric Li" />
                                            </h1>

                                            <div className="text-xl md:text-3xl text-neutral-400 font-light mb-12 h-12 flex items-center justify-center gap-3">
                                                    <span>I build</span>
                                                    <TypewriterText texts={[
                                                            'Full-Stack Application.',
                                                            'AI Multi-Agent Tools.',
                                                            'Proptech Robotics.'
                                                    ]} />
                                            </div>

                                            <p className="max-w-2xl mx-auto text-neutral-400 mb-12 leading-relaxed text-lg">
                                                    Building intelligent systems across software, AI, and robotics — from full-stack applications to multi-agent copilots and autonomous property-inspection robots.
                                            </p>

                                            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                                                    <a href="#projects" className="relative px-8 py-3.5 bg-amber-500 text-neutral-950 font-bold rounded overflow-hidden group transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                 <span className="relative z-10 flex items-center gap-2">
                    View Projects <Code2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                 </span>
                                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                                    </a>

                                                    <a href="#contact" className="px-8 py-3.5 bg-transparent border border-neutral-700 hover:border-neutral-500 text-white rounded transition-all hover:scale-105 flex items-center justify-center gap-2 hover:bg-neutral-800/50 backdrop-blur-sm">
                                                            Contact Me
                                                            <Mail className="w-4 h-4" />
                                                    </a>
                                            </div>
                                    </div>
                            </ScrollReveal>

                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-neutral-600 hover:text-amber-400 transition-colors cursor-pointer">
                                    <ChevronDown className="w-8 h-8" />
                            </div>
                    </section>

                    {/* Expertise / Tech Stack */}
                    <section id="expertise" className="py-32 px-6 relative z-10">
                            <div className="max-w-7xl mx-auto">
                                    <ScrollReveal>
                                            <div className="flex items-center gap-6 mb-20">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-700 to-neutral-700"></div>
                                                    <h2 className="text-4xl font-bold text-white font-mono flex items-center gap-3">
                                                            <Binary className="text-amber-400 w-8 h-8" />
                                                            CORE_MODULES
                                                    </h2>
                                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-neutral-700 to-neutral-700"></div>
                                            </div>
                                    </ScrollReveal>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            <ScrollReveal delay={0}>
                                                    <TechCard
                                                        icon={Smartphone}
                                                        title="Web & Mobile"
                                                        desc="Full stack solutions and native mobile applications. Creating seamless experiences across devices."
                                                        tags={['React', 'Next.js', 'Python', 'Rails', 'GraphQL']}
                                                    />
                                            </ScrollReveal>
                                            <ScrollReveal delay={100}>
                                                    <TechCard
                                                        icon={Home}
                                                        title="Proptech Robotics"
                                                        desc="Autonomous inspection robots for residential properties. Detecting defects and automating facility management."
                                                        tags={['ROS2', 'SLAM', 'Computer Vision', 'Training']}
                                                    />
                                            </ScrollReveal>
                                            <ScrollReveal delay={200}>
                                                    <TechCard
                                                        icon={Bot}
                                                        title="Humanoids"
                                                        desc="Collecting massive residential training datasets for humanoid robots. Sim2Real transfer and teleoperation."
                                                        tags={['Teleop', 'Data Pipeline', 'Imitation Learning', 'VR']}
                                                    />
                                            </ScrollReveal>
                                            <ScrollReveal delay={300}>
                                                    <TechCard
                                                        icon={Database}
                                                        title="Data Mining"
                                                        desc="Large-scale distributed data collection systems. Processing high-volume residential data for model training."
                                                        tags={['ETL', 'Vector DB', 'Python', 'Cloud Storage']}
                                                    />
                                            </ScrollReveal>
                                    </div>

                                    <TerminalBlock />
                            </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="py-32 px-6 relative z-10 overflow-hidden">
                            <div className="max-w-7xl mx-auto">
                                    <ScrollReveal>
                                            <h2 className="text-4xl font-bold text-white mb-16 font-mono border-l-4 border-amber-500 pl-6">
                                                    <span className="text-amber-400 text-lg block mb-1 tracking-widest">02. PROJECT_LOGS</span>
                                                    FEATURED WORKS
                                            </h2>
                                    </ScrollReveal>

                                    <div className="space-y-32">
                                            {/* Project 1: Proptech Inspection Robot */}
                                            <ScrollReveal>
                                                    <div className="flex flex-col lg:flex-row gap-12 items-center group">
                                                            <div className="w-full lg:w-3/5 relative perspective-1000">
                                                                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                                                    <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl transform transition-all duration-500 group-hover:rotate-y-2 group-hover:scale-[1.01]">
                                                                            <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                                                                                    <img src="https://images.unsplash.com/photo-1535378433864-36c9430f120a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Robot" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
                                                                            </div>
                                                                    </div>
                                                            </div>

                                                            <div className="w-full lg:w-2/5 relative">
                                                                    <div className="absolute -left-10 top-0 text-9xl font-bold text-neutral-800/20 -z-10 select-none">01</div>
                                                                    <h3 className="text-amber-400 font-mono mb-3 flex items-center gap-2">
                                                                            <Home className="w-4 h-4" /> Proptech / Robotics
                                                                    </h3>
                                                                    <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-amber-300 transition-colors">Inspection Robot</h4>
                                                                    <div className="p-6 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-lg shadow-xl mb-6 hover:border-neutral-600 transition-colors">
                                                                            <p className="text-neutral-300 leading-relaxed">
                                                                                    Autonomous robot designed for residential inspection. Navigates hallways and rooms to detect maintenance issues, leaking, or security breaches, sending real-time reports to property managers via a mobile app.
                                                                            </p>
                                                                    </div>
                                                                    <ul className="flex flex-wrap gap-4 text-sm font-mono text-neutral-400 mb-8">
                                                                            <li className="text-amber-500">ROS2</li>
                                                                            <li>SLAM</li>
                                                                            <li>Computer Vision</li>
                                                                            <li>React Native</li>
                                                                    </ul>
                                                                    <div className="flex gap-6">
                                                                            <a href="#" className="text-neutral-400 hover:text-amber-400 hover:scale-110 transition-all"><Github className="w-6 h-6" /></a>
                                                                            <a href="#" className="text-neutral-400 hover:text-amber-400 hover:scale-110 transition-all"><ExternalLink className="w-6 h-6" /></a>
                                                                    </div>
                                                            </div>
                                                    </div>
                                            </ScrollReveal>

                                            {/* Project 2: Humanoid Data */}
                                            <ScrollReveal>
                                                    <div className="flex flex-col lg:flex-row-reverse gap-12 items-center group">
                                                            <div className="w-full lg:w-3/5 relative perspective-1000">
                                                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                                                    <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl transform transition-all duration-500 group-hover:-rotate-y-2 group-hover:scale-[1.01]">
                                                                            <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                                                                                    <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Data" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
                                                                            </div>
                                                                    </div>
                                                            </div>

                                                            <div className="w-full lg:w-2/5 text-left lg:text-right relative">
                                                                    <div className="absolute -right-10 top-0 text-9xl font-bold text-neutral-800/20 -z-10 select-none">02</div>
                                                                    <h3 className="text-indigo-400 font-mono mb-3 flex items-center justify-start lg:justify-end gap-2">
                                                                            <Bot className="w-4 h-4" /> Humanoid Robotics
                                                                    </h3>
                                                                    <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-indigo-300 transition-colors">Residential Data Pipeline</h4>
                                                                    <div className="p-6 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-lg shadow-xl mb-6 hover:border-neutral-600 transition-colors text-left">
                                                                            <p className="text-neutral-300 leading-relaxed">
                                                                                    A comprehensive data collection system for humanoid robot training. Captures high-fidelity interaction data in residential environments (kitchens, living rooms) using VR teleoperation to train imitation learning models.
                                                                            </p>
                                                                    </div>
                                                                    <ul className="flex flex-wrap gap-4 text-sm font-mono text-neutral-400 mb-8 justify-start lg:justify-end">
                                                                            <li className="text-indigo-400">Python</li>
                                                                            <li>VR Teleop</li>
                                                                            <li>TensorFlow</li>
                                                                            <li>Big Data</li>
                                                                    </ul>
                                                                    <div className="flex gap-6 justify-start lg:justify-end">
                                                                            <a href="#" className="text-neutral-400 hover:text-indigo-400 hover:scale-110 transition-all"><Github className="w-6 h-6" /></a>
                                                                            <a href="#" className="text-neutral-400 hover:text-indigo-400 hover:scale-110 transition-all"><ExternalLink className="w-6 h-6" /></a>
                                                                    </div>
                                                            </div>
                                                    </div>
                                            </ScrollReveal>
                                    </div>
                            </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="py-32 px-6 text-center relative z-10">
                            <ScrollReveal>
                                    <div className="max-w-2xl mx-auto">
                                            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto mb-8 rounded-full"></div>
                                            <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">Let's Connect</h2>
                                            <p className="text-neutral-400 mb-12 text-lg leading-relaxed">
                                                    Whether you want to discuss <span className="text-amber-400">Proptech Innovations</span>, or need to build complex <span className="text-indigo-400">Humanoid Data Pipelines</span>,<br/>my inbox is always open. Let's define the future together.
                                            </p>

                                            <div className="group relative inline-block">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300 animate-tilt"></div>
                                                    <a
                                                        href="mailto:eric.li@example.com"
                                                        className="relative block px-12 py-5 bg-neutral-950 rounded-lg text-white font-bold text-lg hover:bg-neutral-900 transition-colors flex items-center gap-3"
                                                    >
                                                            <Mail className="w-5 h-5" />
                                                            Say Hello
                                                    </a>
                                            </div>

                                            <div className="mt-20 flex justify-center gap-10">
                                                    <a href="#" className="text-neutral-500 hover:text-amber-400 hover:-translate-y-2 transition-all duration-300 transform">
                                                            <Github className="w-8 h-8" />
                                                    </a>
                                                    <a href="#" className="text-neutral-500 hover:text-amber-400 hover:-translate-y-2 transition-all duration-300 transform">
                                                            <Twitter className="w-8 h-8" />
                                                    </a>
                                                    <a href="#" className="text-neutral-500 hover:text-amber-400 hover:-translate-y-2 transition-all duration-300 transform">
                                                            <div className="w-8 h-8 font-bold border-2 border-current rounded flex items-center justify-center">in</div>
                                                    </a>
                                            </div>
                                    </div>
                            </ScrollReveal>

                            <footer className="absolute bottom-8 w-full text-center text-neutral-700 text-xs font-mono left-0">
                                    <div className="animate-pulse">_EOF_</div>
                                    &copy; 2024 ERIC LI / DEV_CORE. ALL RIGHTS RESERVED.
                            </footer>
                    </section>
            </div>
        );
};

export default App;
