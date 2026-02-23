export default function Privacy() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-8">Privacy Policy</h1>
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Your Privacy Matters</h2>
            <p className="text-gray-700">
              At Solange, we are committed to protecting your privacy and ensuring you have a positive experience on our website.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-2">Information We Collect</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Name, email address, and phone number when you book an appointment</li>
              <li>• Payment information processed securely through Stripe or PayPal</li>
              <li>• Preferences and service history to personalize your experience</li>
              <li>• Website usage data through analytics</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-2">How We Use Your Information</h3>
            <p className="text-gray-700">
              We use your information to process bookings, send confirmations, improve our services, and communicate with you about your appointments.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-2">Security</h3>
            <p className="text-gray-700">
              Your personal and payment information is protected using industry-standard encryption and security measures.
            </p>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <p className="text-gray-700 text-sm">
              For more information about our privacy practices, please contact us at hello@solange.salon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
