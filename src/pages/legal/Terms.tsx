import { Link } from 'react-router-dom';
import Logo from '../../pictures/logo.svg';

export default function Terms() {
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
        <h1 className="text-4xl font-extrabold text-primary mb-6 drop-shadow-lg">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last Updated: {lastUpdated}</p>

        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-indigo max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">1. Introduction</h2>
            <p>Welcome to MathWizard. These Terms of Service ("Terms") govern your use of the MathWizard website, mobile application, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Service"</strong> refers to the MathWizard website, mobile application, and related services.</li>
              <li><strong>"User"</strong> refers to individuals who access or use the Service, including parents, teachers, schools, and students.</li>
              <li><strong>"Content"</strong> refers to all materials available on the Service, including text, images, videos, audio files, and interactive elements.</li>
              <li><strong>"User Content"</strong> refers to any content that Users contribute to the Service.</li>
              <li><strong>"Account"</strong> refers to the registered user profile required to access certain features of the Service.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">3. Account Registration and Security</h2>
            <p>To access certain features of the Service, you must create an account. When you create an account, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure. You must notify MathWizard immediately of any breach of security or unauthorized use of your account.</p>
            <p>We reserve the right to suspend or terminate accounts if we determine, in our sole discretion, that you have violated these Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">4. Subscription and Billing</h2>
            <p>MathWizard offers subscription-based services. By subscribing, you agree to pay the fees as described at the time of your subscription. Subscriptions automatically renew unless canceled before the renewal date.</p>
            <p>We reserve the right to change subscription fees upon reasonable notice. Such notice will be provided via email or through the Service. Continued use of the Service after the fee change constitutes acceptance of the new fees.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">5. User Content and Conduct</h2>
            <p>By submitting content to the Service, you grant MathWizard a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content in any medium and format.</p>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Submit false or misleading information</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Collect or track personal information of others</li>
              <li>Engage in unauthorized commercial activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by MathWizard and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
            <p>You may not copy, modify, create derivative works, publicly display, publicly perform, republish, or transmit any of the material obtained through the Service without prior written consent of MathWizard.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">7. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.</p>
            <p>If you wish to terminate your account, you may simply discontinue using the Service or contact our support team to request account deletion.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">8. Limitation of Liability</h2>
            <p>In no event shall MathWizard, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">9. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide notice of changes by updating the "Last Updated" date at the top of this page. It is your responsibility to review these Terms periodically for changes.</p>
            <p>Your continued use of the Service after we post modifications to the Terms constitutes your acknowledgment of the modifications and your consent to abide by the modified Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-900">10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p className="font-medium">legal@mathwizard.com</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            By using the MathWizard service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
          </p>
          <div className="mt-6">
            <Link to="/legal/privacy" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">View our Privacy Policy</Link>
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