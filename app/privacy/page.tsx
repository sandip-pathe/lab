"use client";

import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {currentDate}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Anaya Legal AI Lab (&quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our services and interact
              with our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-medium text-cyan-400 mb-2">
                  Personal Information
                </h3>
                <p className="leading-relaxed">
                  We may collect personal information that you provide directly
                  to us, including but not limited to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Name and contact information</li>
                  <li>Email address</li>
                  <li>Company or firm name</li>
                  <li>Job title and professional information</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To communicate with you about our services and updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To process partnership applications and agreements</li>
              <li>To analyze usage patterns and optimize user experience</li>
              <li>To comply with legal obligations and enforce our policies</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We implement enterprise-grade security measures to protect your
              information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your information, we cannot guarantee
              its absolute security.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Data Sharing and Disclosure
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>
                <strong className="text-white">With Your Consent:</strong> When
                you explicitly agree to share information
              </li>
              <li>
                <strong className="text-white">Service Providers:</strong> With
                trusted third-party service providers who assist in operating
                our platform
              </li>
              <li>
                <strong className="text-white">Legal Requirements:</strong> When
                required by law or to protect our rights and safety
              </li>
              <li>
                <strong className="text-white">Business Transfers:</strong> In
                connection with a merger, acquisition, or sale of assets
              </li>
            </ul>
          </section>

          {/* Partner Confidentiality */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Partner Confidentiality
            </h2>
            <p className="text-gray-300 leading-relaxed">
              All partnerships with law firms operate under strict
              Non-Disclosure Agreements (NDAs). Partner identities and
              proprietary information are kept confidential and are never shared
              publicly without explicit written consent. We maintain separate
              data environments for each partner to ensure complete isolation
              and privacy.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>
                <strong className="text-white">Access:</strong> Request copies
                of your personal data
              </li>
              <li>
                <strong className="text-white">Correction:</strong> Request
                correction of inaccurate information
              </li>
              <li>
                <strong className="text-white">Deletion:</strong> Request
                deletion of your personal data
              </li>
              <li>
                <strong className="text-white">Objection:</strong> Object to
                processing of your data
              </li>
              <li>
                <strong className="text-white">Portability:</strong> Request
                transfer of your data
              </li>
              <li>
                <strong className="text-white">Withdrawal:</strong> Withdraw
                consent at any time
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar tracking technologies to improve your
              experience on our platform. You can control cookie settings
              through your browser preferences. Disabling cookies may affect the
              functionality of certain features.
            </p>
          </section>

          {/* Data Retention */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Data Retention
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required or permitted by law. When data
              is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children. If
              you believe we have inadvertently collected such information,
              please contact us immediately.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              International Data Transfers
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure that such
              transfers comply with applicable data protection laws and that
              your data receives an adequate level of protection.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date. You are
              advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="text-gray-300 space-y-2">
              <p>
                <strong className="text-white">Email:</strong>{" "}
                <a
                  href="mailto:sandippathe9689@gmail.com"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  sandippathe9689@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-white">Address:</strong> Anaya legal,
                Mumbai, MH 400018, India
              </p>
            </div>
          </section>

          {/* GDPR & CCPA Compliance */}
          <section className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4">
              GDPR & CCPA Compliance
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We comply with the General Data Protection Regulation (GDPR) for
              European users and the California Consumer Privacy Act (CCPA) for
              California residents. If you are covered by these regulations, you
              have additional rights as outlined in those laws. Please contact
              us to exercise these rights.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
