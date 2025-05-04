import Logo from '../pictures/logo.svg';
import IpadMockup from '../pictures/ipad.svg';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const ipadSectionRef = useRef<HTMLDivElement>(null);
  const ipadImgRef = useRef<HTMLImageElement>(null);
  const ipadPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });

    if (ipadSectionRef.current && ipadImgRef.current && ipadPinRef.current) {
      // ⚠️ IMPORTANT: Kill any existing ScrollTrigger instances to prevent conflicts
      (ScrollTrigger as any).getAll().forEach((trigger: any) => trigger.kill());
      
      // Create a single ScrollTrigger for the iPad section
      const ipadTrigger = (ScrollTrigger as any).create({
        trigger: ipadSectionRef.current,
        start: 'top center',
        end: 'bottom center',
        pin: ipadPinRef.current,
        pinSpacing: false,
        pinReparent: true, // This helps with smooth pinning
        anticipatePin: 1, // Helps prevent jumping
      });

      // Animate iPad scale AND vertical position
      gsap.fromTo(
        ipadImgRef.current,
        { 
          scale: 2.3,
          y: 0 // Start 100px lower than final position
        },
        {
          scale: 1,
          y: 0, // End at original position
          ease: "power2.out",
          scrollTrigger: {
            trigger: ipadSectionRef.current,
            start: 'top center',
            end: 'top+=2500 center', // Changed from 300 to 500 - animation will take longer to complete
            scrub: 0.3, // Smooth scrubbing (not too fast, not too slow)
          },
        }
      );

      // Animate features in after iPad shrinks
      const featureCards = Array.from(ipadSectionRef.current.querySelectorAll('.feature-card'));
      featureCards.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: ipadSectionRef.current,
              start: `top+=${-100 + i * 120} center`,
              end: `top+=${400 + i * 120} center`,
              scrub: 0.001, // Smoother scrubbing
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
    
    return () => {
      // Clean up all ScrollTrigger instances when component unmounts
      (ScrollTrigger as any).getAll().forEach((trigger: any) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6 px-4">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="MathWizard Logo" className="h-12 w-auto" />
            <span className="text-2xl font-extrabold text-primary tracking-tight">MathWizard</span>
          </div>
          <Link to="/login" className="bg-primary text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200">Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center text-center min-h-[80vh] pt-16 pb-8 bg-gradient-to-b from-indigo-100 via-white to-blue-100">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 drop-shadow-lg">Unlock the Magic of Maths</h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-8">Fun, interactive, and curriculum-aligned learning for ages 3–16. Give your child the confidence to succeed in maths!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/register/parent" className="bg-primary text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg">I'm a Parent</Link>
          <Link to="/register/school" className="bg-primary text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg">I'm a School</Link>
        </div>
        {/* iPad and features side-by-side like EventBeds */}
        <div ref={ipadSectionRef} className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto min-h-[700px] py-8">
          <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-16">
            {/* Left features */}
            <div className="flex-1 flex flex-col gap-8 items-end text-right">
              <div className="feature-card bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-4 max-w-xs text-lg font-semibold text-indigo-900">Interactive Games & Quizzes</div>
              <div className="feature-card bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-4 max-w-xs text-lg font-semibold text-indigo-900">Personalised Learning Paths</div>
            </div>
            {/* iPad mockup wrapper for pinning - fixed position when pinned */}
            <div ref={ipadPinRef} className="relative z-10 flex flex-col items-center justify-center w-full md:w-auto" style={{ willChange: 'transform' }}>
              <img ref={ipadImgRef} src={IpadMockup} alt="iPad Mockup" className="w-[320px] md:w-[400px] drop-shadow-2xl" style={{ willChange: 'transform' }} />
            </div>
            {/* Right features */}
            <div className="flex-1 flex flex-col gap-8 items-start text-left">
              <div className="feature-card bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-4 max-w-xs text-lg font-semibold text-indigo-900">Real-Time Progress Tracking</div>
              <div className="feature-card bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-4 max-w-xs text-lg font-semibold text-indigo-900">Curriculum Aligned Content</div>
            </div>
          </div>
        </div>
        {/* Spacer for smooth scroll after iPad pinning */}
        <div style={{ height: '60vh' }} />
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-24 px-4 grid md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-3">Interactive Learning</h3>
          <p className="text-gray-600">Engaging activities and games that make learning math fun and effective for children of all ages.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 0 012 2v10m-6 0a2 2 0 002 2h2a2 0 002-2m0 0V5a2 2 0 012-2h2a2 0 012 2v14a2 2 0 01-2 2h-2a2 0-01-2-2z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-3">Progress Tracking</h3>
          <p className="text-gray-600">Detailed insights into your child's learning journey with personalized reports and analytics.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-3">Curriculum Aligned</h3>
          <p className="text-gray-600">Content aligned with national curriculum standards to support classroom learning and academic success.</p>
        </div>
      </section>
      
      {/* Maths Ranked Feature Highlight */}
      <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-block bg-yellow-200 text-yellow-800 font-bold px-4 py-1 rounded-full mb-4">NEW!</div>
              <h2 className="text-3xl font-extrabold text-indigo-900 mb-4">Introducing Maths Ranked</h2>
              <p className="text-lg text-gray-700 mb-6">
                Experience a gaming-inspired competitive math platform! Just like in Fortnite, 
                players climb through ranks by winning matches against peers in their year group. 
                Compete in races or battles with AI opponents filling in when needed!
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Match with students in your year group (±1 year)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Earn points to rank up: 1st (+20), 2nd (+10), 3rd (0), 4th (-10)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Progress through unique math ranks from Number Novice to Math Mastermind</span>
                </li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-blue-800">
                    <span className="font-medium">Note:</span> A child account is required to play Maths Ranked.
                  </div>
                </div>
              </div>
              <Link to="/features/maths-ranked" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors">
                Start Competing
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
                <div className="bg-indigo-600 text-white rounded-xl p-4 mb-4">
                  <h3 className="text-xl font-bold mb-2">Your Rank: Equation Explorer 2</h3>
                  <div className="w-full bg-indigo-800 h-3 rounded-full">
                    <div className="bg-yellow-400 h-3 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-right mt-1">70/100 points to Fighter 1</p>
                </div>
                <div className="border-b border-gray-200 pb-3 mb-4">
                  <div className="text-sm text-gray-500 mb-1">Choose game mode:</div>
                  <div className="flex gap-2">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Race</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Battle</span>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">Y6</div>
                      <span className="font-medium">Emma S.</span>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Ace 1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">Y5</div>
                      <span className="font-medium">You</span>
                    </div>
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Explorer 2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">AI</div>
                      <span className="font-medium">Math-Bot</span>
                    </div>
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Explorer 3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-2 text-xs font-bold">Y5</div>
                      <span className="font-medium">James T.</span>
                    </div>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Fighter 2</span>
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors">
                  Start Match
                </button>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-300 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-primary to-blue-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-8 text-center drop-shadow-lg">What Parents & Teachers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-xl">
              <p className="italic mb-4">"MathWizard transformed my daughter's relationship with math. She used to dread it, now she asks to practice every day!"</p>
              <div className="font-semibold">Sarah T. - Parent of 9-year-old</div>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-xl">
              <p className="italic mb-4">"As a teacher, I've seen remarkable improvement in students who use MathWizard as a supplement to classroom learning."</p>
              <div className="font-semibold">Mark J. - Year 5 Teacher</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-extrabold text-primary mb-6 drop-shadow-lg">Ready to Get Started?</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-8">Join thousands of parents and schools who are helping children build strong mathematical foundations for the future.</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/register/parent" className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg font-bold">Register as a Parent</Link>
          <Link to="/register/school" className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 shadow-lg font-bold">Register as a School</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-10 mt-16 rounded-t-3xl shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src={Logo} alt="MathWizard Logo" className="h-10 w-auto" />
              <p className="mt-4 text-secondary">Helping children excel in mathematics through interactive learning and practice.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Features</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><Link to="/features/interactive-lessons" className="hover:text-white hover:underline">Interactive Lessons</Link></li>
                  <li><Link to="/features/math-games" className="hover:text-white hover:underline">Math Games</Link></li>
                  <li><Link to="/features/progress-tracking" className="hover:text-white hover:underline">Progress Tracking</Link></li>
                  <li><Link to="/features/personalized-learning" className="hover:text-white hover:underline">Personalized Learning</Link></li>
                  <li><Link to="/features/maths-ranked" className="hover:text-white hover:underline">Maths Ranked</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><Link to="/support/help-center" className="hover:text-white hover:underline">Help Center</Link></li>
                  <li><Link to="/support/contact" className="hover:text-white hover:underline">Contact Us</Link></li>
                  <li><Link to="/support/faq" className="hover:text-white hover:underline">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><Link to="/legal/terms" className="hover:text-white hover:underline">Terms of Service</Link></li>
                  <li><Link to="/legal/privacy" className="hover:text-white hover:underline">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-800 text-center text-indigo-200">
            <p>&copy; {new Date().getFullYear()} MathWizard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
