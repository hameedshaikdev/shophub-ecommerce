import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-2">About AS HUB</h1>
      <p className="text-center text-gray-500 mb-10">(Temporary name — coming soon with our official brand!)</p>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <div className="text-4xl mb-3">🪡</div>
          <h3 className="text-xl font-bold mb-2">Tailoring Tools</h3>
          <p className="text-gray-600">Professional sewing machines, precision scissors, quality threads, needles, and measuring equipment for all tailoring needs.</p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6">
          <div className="text-4xl mb-3">👗</div>
          <h3 className="text-xl font-bold mb-2">Women's Fashion</h3>
          <p className="text-gray-600">Trendy dresses, elegant tops, comfortable bottoms, ethnic wear, and stylish accessories at great prices.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <ul className="space-y-3">
          {[
            '✅ Quality products from trusted manufacturers',
            '✅ Competitive pricing with regular discounts',
            '✅ Free delivery on all orders',
            '✅ Easy UPI payment — no extra charges',
            '✅ Fast order confirmation via WhatsApp',
            '✅ Dedicated customer support',
          ].map(item => (
            <li key={item} className="text-gray-700 font-medium">{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
        <div className="space-y-4">
          <a href="mailto:as.businezzz@gmail.com"
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
              <p className="font-bold text-gray-900">as.businezzz@gmail.com</p>
            </div>
          </a>

          <a href="tel:+917013942909"
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Phone</p>
              <p className="font-bold text-gray-900">+91 70139 42909</p>
            </div>
          </a>

          <a href="https://wa.me/917013942909" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">WhatsApp</p>
              <p className="font-bold text-gray-900">Chat with us on WhatsApp</p>
            </div>
          </a>
        </div>

        <div className="mt-6 flex gap-4">
          <a href="https://facebook.com/share/166X2VepUx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
            📘 Facebook
          </a>
          <a href="https://www.instagram.com/as_tailoring_tools_textiles" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl font-bold text-sm hover:bg-pink-700 transition-colors">
            📷 Instagram
          </a>
          <a href="https://youtube.com/@astailoringtoolstextiles?si=pJxUJtUY7ykHlpSK" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
            ▶️ YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
