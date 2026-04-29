import { Link, Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="">
      <header className="absolute top-0 left-0 h-[100px] w-full bg-gray-100 flex flex-row justify-between items-center">
        <h1 className="text-gray-900 text-4xl mx-2.5 my-3">MDW React App</h1>
        <div>
          <nav>
            <ul className="flex flex-row justify-between items-center gap-4">
              <Link
                className="xl:px-3 py-2 text-black relative cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                to="/"
              >
                Home
              </Link>
              <Link
                className="px-3 py-2 text-gray-900 relative cursor-pointer  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                to="/contact"
              >
                Contact
              </Link>
              <Link
                className="px-3 py-2 text-gray-900 relative cursor-pointer  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                to="/about"
              >
                About
              </Link>
              <Link
                className="px-3 py-2 text-gray-900 relative cursor-pointer  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                to="/form-demo"
              >
                Form Demo
              </Link>
              <Link
                className="px-3 py-2 text-gray-900 relative cursor-pointer  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                to="/redux-demo"
              >
                Redux Demo
              </Link>
              {/* <a className="px-3 py-2 text-black relative cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" href="/">Home</a>
              <a className="px-3 py-2 text-gray-900 relative cursor-pointer  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" href="/contact">Contact</a>
              <a className="px-3 py-2 text-gray-900 relative cursor-pointer  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full" href="/about">About</a> */}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-8 mt-[120px] ">
        <Outlet />
      </main>
      <footer className="mt-8 w-full p-4 bg-gray-200 text-center">
        <p>&copy; 2025 MDW React App</p>
      </footer>
    </div>
  );
};

export default Layout;