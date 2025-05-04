import React from 'react';
import { Link } from 'react-router-dom';

const MathsRanked: React.FC = () => {
  return (
    <div className="page-container">
      <div className="feature-header bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Maths Ranked</h1>
        <p className="feature-subtitle text-xl md:text-2xl max-w-3xl mx-auto">Compete, climb ranks, and prove your mathematical prowess!</p>
      </div>

      {/* Account requirement notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 max-w-6xl mx-auto mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Note:</span> A child account is required to play Maths Ranked. Parents can create child accounts from their dashboard after registering.
              <Link to="/register/parent" className="ml-2 text-blue-600 hover:text-blue-800 underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <section className="feature-section max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-indigo-900 mb-8">Your Competitive Mathematics Arena</h2>
        <div className="feature-content">
          <p className="text-lg mb-6">
            Maths Ranked is our exciting competitive mathematics platform inspired by ranking systems in popular games. 
            Test your skills against peers or AI opponents in your year group, earn points, and climb the ranks!
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Compete in fast-paced math competitions with students in your year group (±1 year)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Race to solve problems or battle head-to-head with up to 4 players</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart AI opponents fill empty spots when human players aren't available</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Earn/lose points based on your placement: 1st (+20), 2nd (+10), 3rd (0), 4th (-10)</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">Ranking System</h3>
              <p className="mb-4">Collect 100 points to advance to the next rank tier:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-lg text-amber-700">Number Novice</h4>
                  <ul className="text-sm">
                    <li>Novice 1</li>
                    <li>Novice 2</li>
                    <li>Novice 3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-500">Equation Explorer</h4>
                  <ul className="text-sm">
                    <li>Explorer 1</li>
                    <li>Explorer 2</li>
                    <li>Explorer 3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-yellow-600">Formula Fighter</h4>
                  <ul className="text-sm">
                    <li>Fighter 1</li>
                    <li>Fighter 2</li>
                    <li>Fighter 3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-blue-600">Algebra Ace</h4>
                  <ul className="text-sm">
                    <li>Ace 1</li>
                    <li>Ace 2</li>
                    <li>Ace 3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-purple-600">Calculus Champion</h4>
                  <ul className="text-sm">
                    <li>Champion 1</li>
                    <li>Champion 2</li>
                    <li>Champion 3</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-red-600">Math Mastermind</h4>
                  <ul className="text-sm">
                    <li>Mastermind 1</li>
                    <li>Mastermind 2</li>
                    <li>Mastermind 3</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">Game Modes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-indigo-600 text-white p-4">
                <h3 className="text-xl font-bold">Math Race</h3>
              </div>
              <div className="p-6">
                <p className="mb-4">Race against up to 3 other players to solve a series of math problems. First to correctly answer the most problems wins!</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>5-minute timed competitions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>Questions adapted to your year level</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>Live progress bars show where you stand</span>
                  </li>
                </ul>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Enter Race</button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-600 text-white p-4">
                <h3 className="text-xl font-bold">Math Battle</h3>
              </div>
              <div className="p-6">
                <p className="mb-4">Go head-to-head in this turn-based battle where correct answers let you attack your opponents. Last player standing wins!</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>Each correct answer gives you attack power</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>Speed and accuracy determine attack strength</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span>Use power-ups to gain advantages</span>
                  </li>
                </ul>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">Enter Battle</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">Leaderboards</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-green-600 text-white p-3 text-center font-bold">
                  Year Group
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">1. Jamie W.</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Ace 2</span>
                    </li>
                    <li className="flex justify-between items-center p-2">
                      <span className="font-semibold">2. Alex T.</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Ace 1</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">3. Riley J.</span>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Fighter 3</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <button className="text-green-600 text-sm font-medium">View Full Leaderboard</button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-3 text-center font-bold">
                  School
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">1. Shannon K.</span>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Champion 1</span>
                    </li>
                    <li className="flex justify-between items-center p-2">
                      <span className="font-semibold">2. Jamie W.</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Ace 2</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">3. Morgan P.</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Ace 2</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 text-sm font-medium">View Full Leaderboard</button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-purple-600 text-white p-3 text-center font-bold">
                  Global
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">1. Aiden H.</span>
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">Mastermind 2</span>
                    </li>
                    <li className="flex justify-between items-center p-2">
                      <span className="font-semibold">2. Taylor V.</span>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Champion 3</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">3. Shannon K.</span>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Champion 1</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <button className="text-purple-600 text-sm font-medium">View Full Leaderboard</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-100 to-purple-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">Ready to Test Your Skills?</h2>
          <p className="text-lg mb-4 max-w-2xl mx-auto">Join thousands of students already competing in Maths Ranked. Start your journey from Number Novice to Math Mastermind today!</p>
          <p className="text-md mb-8 max-w-2xl mx-auto text-indigo-700">Remember: You'll need a child account to participate. Parents can create these from their dashboard.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register/parent" className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 shadow-lg font-bold transition-colors">Register Parent Account</Link>
            <Link to="/login" className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 shadow-lg font-bold transition-colors">Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MathsRanked;