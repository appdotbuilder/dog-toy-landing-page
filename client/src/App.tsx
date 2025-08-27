import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-gray-800">PawsomeToys</span>
            </div>
            <div className="text-lg">🛒</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🐕 Welcome to PawsomeToys! 🎾
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              The ultimate destination for your furry friend's happiness
            </p>
            <p className="text-lg mb-8 leading-relaxed">
              Discover premium dog toys that will keep your pup entertained, engaged, and tail-wagging with joy!
            </p>
            <button className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-4 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Shop Now 🛒
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              🎉 Amazing Toy Collection 🎉
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From squeaky plushies to challenging puzzles, we have the perfect toy for every pup!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=500&q=80"
                alt="Super Bounce Ball" 
                className="w-full aspect-square object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Super Bounce Ball 🎾</h3>
                <p className="text-gray-600 mb-4">The ultimate fetch companion! This high-bounce rubber ball will keep your pup entertained for hours.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$12.99</span>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=500&q=80"
                alt="Cuddle Bear Plushie" 
                className="w-full aspect-square object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Cuddle Bear Plushie 🧸</h3>
                <p className="text-gray-600 mb-4">Soft, squeaky, and absolutely adorable! Perfect for snuggling and gentle play.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$18.99</span>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=500&q=80"
                alt="Puzzle Master" 
                className="w-full aspect-square object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Puzzle Master 🧩</h3>
                <p className="text-gray-600 mb-4">Challenge your dog's mind with this interactive puzzle toy. Treats not included!</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$24.99</span>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🎯 Ready to Make Your Dog's Day? 🎯
            </h2>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              Join thousands of happy pet parents!
            </p>
            <p className="text-lg mb-8 leading-relaxed">
              Don't wait! Your furry friend deserves the best toys. Shop now and see that tail wag with pure joy!
            </p>
            <button className="bg-white text-orange-600 hover:bg-orange-50 text-xl px-10 py-4 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Start Shopping Now! 🚀
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold">PawsomeToys</span>
            </div>
            <p className="text-gray-400 mb-4">
              Making tails wag and hearts happy, one toy at a time! 🎾
            </p>
            <p className="text-gray-400">
              &copy; 2024 PawsomeToys. Made with ❤️ for your furry friends!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;