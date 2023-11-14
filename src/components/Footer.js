import React from 'react';

const Footer = () => {
  return (
    <footer className="flex my-auto text-white p-10 w-full">
      <div className="container mx-auto text-center p-10">
        <div className="">
          <a href="/roadmap" className="text-gray-400 hover:text-white mx-2">
            Roadmap
          </a>
          <a href="/faq" className="text-gray-400 hover:text-white mx-2">
            FAQ
          </a>
          <a href="/sitemap" className="text-gray-400 hover:text-white mx-2">
            Sitemap
          </a>
        </div>
        <div className="mb-4">
          <p className="text-gray-400">Subscribe to Newsletter:</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-gray-800 text-white rounded-full px-4 py-2 mt-2 focus:outline-none"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 ml-2"
          >
            Subscribe
          </button>
        </div>
        <p className="text-gray-400">© {new Date().getFullYear()} Planq Safe, Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
