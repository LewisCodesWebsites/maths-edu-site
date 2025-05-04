import { Link } from 'react-router-dom';
import Logo from '../../pictures/logo.svg';
import { useState } from 'react';

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'I'm a Parent' or 'I'm a School' button on our homepage. Fill out the registration form with your information, and you'll receive a confirmation email. Click the verification link in the email to activate your account."
        },
        {
          question: "What age groups is MathWizard suitable for?",
          answer: "MathWizard is designed for children aged 3-16. Our content is carefully curated to match different age groups and educational levels, from early numeracy skills to advanced mathematics concepts."
        },
        {
          question: "Is MathWizard aligned with the national curriculum?",
          answer: "Yes, MathWizard's content is aligned with national curriculum standards. Our team of educational experts regularly updates our materials to ensure they meet current educational requirements."
        }
      ]
    },
    {
      category: "Accounts & Billing",
      questions: [
        {
          question: "How much does a MathWizard subscription cost?",
          answer: "Our subscription plans start at $9.99 per month for a single child. We offer family plans for multiple children and discounted annual subscriptions. Schools should contact our sales team for custom pricing based on the number of students and teachers."
        },
        {
          question: "Can I cancel my subscription at any time?",
          answer: "Yes, you can cancel your subscription at any time through your account dashboard. If you cancel, you'll continue to have access until the end of your current billing period."
        },
        {
          question: "Do you offer a free trial?",
          answer: "Yes, we offer a 14-day free trial for all new users. You'll have full access to the platform during the trial period with no commitment required."
        }
      ]
    },
    {
      category: "Using the Platform",
      questions: [
        {
          question: "How do I track my child's progress?",
          answer: "You can track your child's progress through the parent dashboard. You'll see detailed reports on completed lessons, assessment scores, time spent learning, and areas where they excel or need additional support."
        },
        {
          question: "Can multiple children use the same account?",
          answer: "Yes, our family plans allow multiple child profiles under a single parent account. Each child will have their own personalized learning path and progress tracking."
        },
        {
          question: "Can my child use MathWizard on different devices?",
          answer: "Yes, MathWizard works on computers, tablets, and smartphones. Your child's progress will sync across devices when they log in with their account."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "What should I do if I forget my password?",
          answer: "Click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password."
        },
        {
          question: "What devices and browsers are supported?",
          answer: "MathWizard supports modern browsers including Chrome, Safari, Firefox, and Edge. Our platform works on Windows, Mac, iOS, and Android devices. For the best experience, we recommend using the latest version of your browser."
        },
        {
          question: "Why isn't my child's progress saving?",
          answer: "Progress is saved automatically when connected to the internet. If progress isn't saving, check your internet connection. If the problem persists, please clear your browser cache or try a different browser."
        }
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
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-primary mb-6 drop-shadow-lg text-center">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Find answers to commonly asked questions about MathWizard.
        </p>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold text-white bg-indigo-600 py-4 px-6">{category.category}</h2>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, qIndex) => {
                  const fullIndex = catIndex * 10 + qIndex;
                  return (
                    <div key={qIndex} className="border-b border-gray-200 last:border-0">
                      <button 
                        onClick={() => toggleQuestion(fullIndex)}
                        className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-indigo-900 hover:bg-indigo-50 focus:outline-none"
                      >
                        <span>{faq.question}</span>
                        <svg 
                          className={`h-5 w-5 text-indigo-500 transform ${openQuestion === fullIndex ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openQuestion === fullIndex && (
                        <div className="px-6 py-4 bg-gray-50">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div className="mt-12 bg-indigo-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 mb-6">Didn't find what you were looking for? We're here to help!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/support/contact" className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-indigo-700">
              Contact Us
            </Link>
            <Link to="/support/help-center" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-50 border border-indigo-200">
              Visit Help Center
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