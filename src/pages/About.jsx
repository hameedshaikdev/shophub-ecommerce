const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About ShopHub</h1>
      
      <div className="prose lg:prose-lg mx-auto">
        <p className="text-lg text-gray-600 mb-6">
          Welcome to ShopHub - your one-stop destination for premium tailoring tools and trendy women's fashion.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="mb-6">
          Founded with a vision to bridge the gap between professional tailoring needs and fashion enthusiasts, 
          ShopHub brings together carefully curated products from both worlds. Whether you're a professional tailor 
          looking for precision tools or a fashion-forward individual seeking the latest trends, we have something for you.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-medium mb-2">🪡 Tailoring Tools</h3>
            <p>Professional sewing machines, precision scissors, quality threads, needles, and measuring equipment for all your tailoring needs.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">👗 Women's Fashion</h3>
            <p>Trendy dresses, elegant tops, comfortable bottoms, ethnic wear, and stylish accessories to complete your wardrobe.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Quality products from trusted manufacturers</li>
          <li>Competitive pricing with regular discounts</li>
          <li>Fast and free delivery</li>
          <li>24/7 customer support</li>
          <li>Easy returns and exchanges</li>
          <li>Secure payment options</li>
        </ul>
        
        <p className="text-center text-lg font-medium text-blue-600">
          Thank you for choosing ShopHub - where quality meets style!
        </p>
      </div>
    </div>
  );
};

export default About;