const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 ">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 sm:grid-cols-2 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl tracking-wider font-poppinsMedium text-white">REC<span className='dark:text-[#3730A3]'>✦</span>VA</h2>
        
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg  font-poppinsRegular tracking-wider text-white mb-2">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-primary text-xs font-poppinsRegular tracking-wider">About</a></li>
            <li><a href="/help" className="hover:text-primary  text-xs  font-poppinsRegular tracking-wider">Help Center</a></li>
            
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg   font-poppinsRegular tracking-wider font-medium text-white mb-2">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/docs" className="hover:text-primary  text-xs font-poppinsRegular tracking-wider">Documentation</a></li>
            <li><a href="/blog" className="hover:text-primary  text-xs font-poppinsRegular tracking-wider">Blog</a></li>
            <li><a href="/status" className="hover:text-primary  text-xs font-poppinsRegular tracking-wider">System Status</a></li>
            <li><a href="/terms" className="hover:text-primary  text-xs font-poppinsRegular tracking-wider">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-poppinsRegular tracking-wider text-white mb-2">Connect</h3>
          <p className=" text-xs font-poppinsRegular tracking-wider">
            Email: <a href="mailto:support@recova.ai" className=" text-blue-600">support@recova.com</a>
          </p>
        
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center  text-xs font-poppinsRegular tracking-wider text-gray-400">
        © {new Date().getFullYear()} Recova. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
