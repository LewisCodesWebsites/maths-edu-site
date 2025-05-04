import { Link } from 'react-router-dom';
import Logo from '../../pictures/logo.svg';

export default function Privacy() {
  const lastUpdated = "January 15, 2025";

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
        <h1 className="text-4xl font-extrabold text-primary mb-6 drop-shadow-lg">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: {lastUpdated}</p>

        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-indigo max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">1. Introduction</h2>
            <p>At MathWizard, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.</p>
            <p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this privacy policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the Service, and you waive the right to receive specific notice of each such change or modification.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-indigo-800 mt-4 mb-2">2.1 Personal Data</h3>
            <p>We may collect personal information that you voluntarily provide to us when you register for the Service, express interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Payment information</li>
              <li>Child's name and age (for parent accounts)</li>
              <li>School name and position (for school accounts)</li>
            </ul>

            <h3 className="text-xl font-semibold text-indigo-800 mt-4 mb-2">2.2 Derivative Data</h3>
            <p>We automatically collect certain information when you visit, use, or navigate the Service. This information does not reveal your specific identity but may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device and usage information</li>
              <li>IP address</li>
              <li>Browser and device characteristics</li>
              <li>Operating system</li>
              <li>Language preferences</li>
              <li>Referring URLs</li>
              <li>Information about how and when you use our Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-indigo-800 mt-4 mb-2">2.3 Data From Learning Activities</h3>
            <p>To provide and improve our educational services, we collect data related to learning activities, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Progress through lessons and activities</li>
              <li>Assessment scores and performance metrics</li>
              <li>Time spent on different activities</li>
              <li>Learning preferences and patterns</li>
              <li>Areas of difficulty or strength</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">3. How We Use Your Information</h2>
            <p>We may use the information we collect about you for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage your account</li>
              <li>Provide and deliver the services you request</li>
              <li>Personalize your learning experience</li>
              <li>Process payments and subscriptions</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to inquiries and offer support</li>
              <li>Improve our Service and develop new products, services, and features</li>
              <li>Monitor usage and analyze trends to enhance user experience</li>
              <li>Protect our Service from malicious, deceptive, fraudulent, or illegal activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">4. Disclosure of Your Information</h2>
            <p>We may share information in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.</li>
              <li><strong>Business Transfers:</strong> We may share your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, judicial proceedings, court orders, or legal process.</li>
              <li><strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person, or as evidence in litigation.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">5. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">6. Children's Privacy</h2>
            <p>We are committed to protecting children's privacy. The Service is designed to be used by parents, schools, and children under parent or school supervision. We collect limited personal information about children under 13, and only with verifiable parental consent. Parents and schools have the right to review, modify, or delete the personal information of children under their care by contacting us.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">7. Your Privacy Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to access the personal information we have about you</li>
              <li>Right to request rectification or deletion of your personal information</li>
              <li>Right to object to or restrict the processing of your personal information</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent at any time, where relevant</li>
            </ul>
            <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section below.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">8. Cookies and Web Beacons</h2>
            <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Service to help customize the Service and improve your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-900">9. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or our practices, please contact us at:</p>
            <p className="font-medium">privacy@mathwizard.com</p>
            <p>MathWizard, Inc.<br />123 Learning Lane<br />Education City, EC 12345<br />Phone: (555) 123-4567</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            By using the MathWizard service, you acknowledge that you have read and understood this Privacy Policy. 
          </p>
          <div className="mt-6">
            <Link to="/legal/terms" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">View our Terms of Service</Link>
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