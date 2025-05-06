import { Link } from 'react-router-dom';
import Logo from '../../pictures/logo.svg';
import { useState } from 'react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const categoryData = [
    {
      title: "Getting Started",
      articles: [
        { title: "How to create an account", url: "#" },
        { title: "Adding your first child", url: "#" },
        { title: "Setting up parent controls", url: "#" },
        { title: "Understanding the dashboard", url: "#" }
      ]
    },
    {
      title: "Account & Billing",
      articles: [
        { title: "Managing subscription plans", url: "#" },
        { title: "Payment methods", url: "#" },
        { title: "Changing account details", url: "#" },
        { title: "Cancellation policy", url: "#" }
      ]
    },
    {
      title: "Using the Platform",
      articles: [
        { title: "Navigating lessons and games", url: "#" },
        { title: "Tracking your child's progress", url: "#" },
        { title: "Setting goals and rewards", url: "#" },
        { title: "Using the platform offline", url: "#" }
      ]
    },
    {
      title: "Troubleshooting",
      articles: [
        { title: "Common login issues", url: "#" },
        { title: "Content not loading properly", url: "#" },
        { title: "Progress not being saved", url: "#" },
        { title: "Device compatibility problems", url: "#" }
      ]
    }
  ];

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-4 drop-shadow-lg">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions and learn how to get the most out of MathWizard.
          </p>
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                className="w-full py-4 px-6 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {categoryData.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">{category.title}</h2>
              <ul className="space-y-2">
                {category.articles.map((article, artIndex) => (
                  <li key={artIndex}>
                    <a href={article.url} className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <button 
                  onClick={() => console.log(`View all ${category.title} articles`)} 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  View all articles →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Still need help section */}
        <div className="bg-indigo-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-700 mb-6">Our support team is here for you. Reach out to us and we'll get back to you as soon as possible.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/support/contact" className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-indigo-700">
              Contact Support
            </Link>
            <Link to="/support/faq" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-50 border border-indigo-200">
              View FAQ
            </Link>
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