import { Link } from "react-router-dom";

export default function LandingPage() {
  // Math-themed SVG logo component
  const MathLogoSVG = () => (
    <svg className="h-10 w-auto" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="8" fill="#4F46E5"/>
      <path d="M15 30L30 15L45 30L30 45L15 30Z" fill="white"/>
      <path d="M23 23L37 37" stroke="#4338CA" strokeWidth="4" strokeLinecap="round"/>
      <path d="M23 37L37 23" stroke="#4338CA" strokeWidth="4" strokeLinecap="round"/>
      <text x="70" y="40" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#4F46E5">MathWizard</text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <MathLogoSVG />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm bg-indigo-800 text-white px-4 py-2 rounded-xl hover:bg-indigo-900 shadow-lg">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-indigo-600 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Welcome to MathWizard</h1>
              <p className="text-xl opacity-90 mb-8">
                The best online maths learning platform for ages 3–16.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register/parent"
                  className="inline-block bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:translate-y-[-2px] text-center"
                >
                  I'm a Parent
                </Link>
                <Link
                  to="/register/school"
                  className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-700 transition transform hover:translate-y-[-2px] text-center"
                >
                  I'm a School
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              {/* Placeholder for a math-related hero image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-white bg-opacity-20 rounded-full">
                  <svg className="h-40 w-40 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 5h2v14H7V5zm8 0h2v14h-2V5zm-4 0h2v14h-2V5zm-8 7h18v2H3v-2z" />
                  </svg>
                </div>
              </div>
              {/* Abstract shapes in the background */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
        {/* Decorative waves */}
        <svg className="absolute bottom-0 w-full h-8 text-white" viewBox="0 0 1440 48" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 48h1440V20.5C1295.1 6.8 1149.6 0 1003.5 0 715.3 0 427.2 16 213.6 24 142.4 27.3 71.2 34.7 0 48v0z" />
        </svg>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Why Choose MathWizard?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100 transform hover:translate-y-[-5px] transition duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Interactive Learning</h3>
              <p className="text-gray-600">Engaging activities and games that make learning math fun and effective for children of all ages.</p>
            </div>
            
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100 transform hover:translate-y-[-5px] transition duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600">Detailed insights into your child's learning journey with personalized reports and analytics.</p>
            </div>
            
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100 transform hover:translate-y-[-5px] transition duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">Curriculum Aligned</h3>
              <p className="text-gray-600">Content aligned with national curriculum standards to support classroom learning and academic success.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-center">What Parents & Teachers Say</h2>
            
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
        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Join thousands of parents and schools who are helping children build strong mathematical foundations for the future.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/register/parent" className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg font-bold">
              Register as a Parent
            </Link>
            <Link to="/register/school" className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 shadow-lg font-bold">
              Register as a School
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <MathLogoSVG />
              <p className="mt-4 text-indigo-100">
                Helping children excel in mathematics through interactive learning and practice.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Features</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><a href="#" className="hover:text-white hover:underline">Interactive Lessons</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Math Games</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Progress Tracking</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Personalized Learning</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><a href="#" className="hover:text-white hover:underline">Help Center</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><a href="#" className="hover:text-white hover:underline">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Privacy Policy</a></li>
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
