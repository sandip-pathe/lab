"use client";

import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">
            Get in touch with the Anaya Legal AI Lab team
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Information */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-cyan-400 font-medium mb-2">Email</h3>
                <a
                  href="mailto:sandippathe9689@gmail.com"
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  sandippathe9689@gmail.com
                </a>
              </div>

              <div>
                <h3 className="text-cyan-400 font-medium mb-2">Address</h3>
                <p className="text-gray-300">
                  Anaya Legal AI Lab
                  <br />
                  Mumbai, MH 400018
                  <br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Send a Message
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                What is Anaya Legal AI Lab?
              </h3>
              <p className="text-gray-300">
                We&apos;re building private AI infrastructure with law firms,
                focusing on privacy, precision, and partnership. We help legal
                professionals leverage AI while maintaining strict
                confidentiality and data security.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                How can law firms partner with you?
              </h3>
              <p className="text-gray-300">
                Reach out to us at sandippathe9689@gmail.com to discuss
                collaboration opportunities. We work closely with firms to
                co-build solutions tailored to their specific needs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                What kind of support do you offer?
              </h3>
              <p className="text-gray-300">
                We provide dedicated support for all our partners, including
                technical implementation assistance, training, and ongoing
                optimization. Contact our support team at
                sandippathe9689@gmail.com
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyan-400 mb-2">
                How do you handle data privacy?
              </h3>
              <p className="text-gray-300">
                Data privacy is our top priority. All partnerships operate under
                strict NDAs, and we maintain enterprise-grade security
                standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
