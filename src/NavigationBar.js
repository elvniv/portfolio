import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const NavigationBar = ({ darkMode }) => {
  const navItems = [
    { name: 'Skills', href: '/skills' },
    { name: 'Resume', href: '/resume' },
    { name: 'Projects', href: '/projects' },
    { name: 'Education', href: '/education' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <Disclosure as="nav" className={`
      ${darkMode ? 'bg-black bg-opacity-60 text-white' : 'bg-white bg-opacity-60 text-black'}
      backdrop-blur-md transition-colors duration-300
    `}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  <Disclosure.Button className={`
                    relative inline-flex items-center justify-center rounded-md p-2
                    ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'}
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${darkMode ? 'white' : 'black'}
                  `}>
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center p-4">
                  <Link to="/" className="text-lg font-bold cursor-pointer">ea</Link>
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`block py-2 pl-3 pr-4 text-base font-medium ${
                    darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'
                  } sm:pl-5 sm:pr-6`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default NavigationBar;