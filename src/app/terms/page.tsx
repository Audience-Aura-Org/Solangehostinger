export default function Terms() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-8">Terms of Service</h1>
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Terms & Conditions</h2>
            <p className="text-gray-700">
              By using Solange's website and booking services, you agree to these terms and conditions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-2">Booking Cancellation Policy</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Cancellations must be made at least 24 hours before your appointment</li>
              <li>• Late cancellations (less than 24 hours) may incur a 50% cancellation fee</li>
              <li>• No-shows are subject to the full appointment charge</li>
              <li>• Rescheduling is subject to availability</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-2">Payment Terms</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Payment is due at time of booking</li>
              <li>• We accept Stripe, PayPal, and Mobile Money</li>
              <li>• Refunds are issued within 5-7 business days for cancelations within policy</li>
              <li>• Card payments are processed securely by our payment providers</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-2">Service Expectations</h3>
            <p className="text-gray-700">
              All services are performed by professional stylists using premium quality products. We guarantee satisfaction with the final result or offer a complimentary adjustment within 48 hours.
            </p>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <p className="text-gray-700 text-sm">
              For questions about our terms, please contact us at hello@solange.salon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
