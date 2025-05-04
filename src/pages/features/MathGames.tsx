import { Link } from 'react-router-dom';
import Logo from '../../pictures/logo.svg';

export default function MathGames() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6 px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src={Logo} alt="MathWizard Logo" className="h-12 w-auto" />
            </Link>
            <span className="text-2xl font-extrabold text-primary tracking-tight">MathWizard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/login" className="bg-primary text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200">Login</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-primary mb-6 drop-shadow-lg">Math Games</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Learning Through Play</h2>
          <p className="text-gray-700 mb-4">
            Our math games transform learning into an exciting adventure. By combining gaming elements with mathematical challenges, children develop essential skills while having fun. Each game is designed to reinforce specific math concepts in an engaging way.
          </p>

          <h3 className="text-xl font-bold text-indigo-800 mt-8 mb-3">Benefits of Math Games:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Increases motivation and engagement with mathematics</li>
            <li>Builds problem-solving and critical thinking skills</li>
            <li>Provides instant feedback in a low-pressure environment</li>
            <li>Encourages healthy competition and goal-setting</li>
            <li>Makes practicing math concepts genuinely enjoyable</li>
          </ul>

          <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">Popular Math Games:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-bold text-indigo-800">Number Ninja</h4>
                <p className="text-sm text-gray-600">Quick calculations and number recognition</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-bold text-indigo-800">Math Quest</h4>
                <p className="text-sm text-gray-600">Adventure-based problem solving</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-bold text-indigo-800">Shape Explorer</h4>
                <p className="text-sm text-gray-600">Interactive geometry learning</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-bold text-indigo-800">Fraction Frenzy</h4>
                <p className="text-sm text-gray-600">Master fractions through fun challenges</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-bold text-indigo-800">Equation Escapade</h4>
                <p className="text-sm text-gray-600">Algebra puzzles and equation solving</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-bold text-indigo-800">Math Olympics</h4>
                <p className="text-sm text-gray-600">Competitive math challenges</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Ready to Play and Learn?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/register/parent" className="bg-primary text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg">Sign Up as a Parent</Link>
            <Link to="/register/school" className="bg-primary text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg">Sign Up as a School</Link>
          </div>
        </div>
      </main>

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