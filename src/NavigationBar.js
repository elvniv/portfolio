import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import Confetti from 'react-confetti';

const CreateMenu = ({ darkMode }) => {
  return (
        <Confetti />

  );
};

const NavigationBar = ({ darkMode }) => {
  const [modalVisible, setModalVisible] = useState(false);

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
                  <span className="text-lg font-bold cursor-pointer" onClick={() => window.location.href = '/'}>ea</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className={`
                      inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm
                      ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
                      focus:outline-none transition-colors duration-300
                    `}
                    onClick={() => setModalVisible(true)}
                  >
                    <PlusIcon className="h-5 w-5" aria-hidden="true" /> Push for Surprise
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Disclosure.Button as="a" href="#" className={`block py-2 pl-3 pr-4 text-base font-medium ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'} sm:pl-5 sm:pr-6`}>Tasks</Disclosure.Button>
              <Disclosure.Button as="a" href="#" className={`block py-2 pl-3 pr-4 text-base font-medium ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'} sm:pl-5 sm:pr-6`}>Wallet</Disclosure.Button>
              <Disclosure.Button as="a" href="#" className={`block py-2 pl-3 pr-4 text-base font-medium ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'} sm:pl-5 sm:pr-6`}>Profile</Disclosure.Button>
            </div>
          </Disclosure.Panel>
          {modalVisible && (
            <div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              onClick={() => setModalVisible(false)}
              className="backdrop-blur-md"
            >
              <CreateMenu darkMode={darkMode} />
            </div>
          )}
        </>
      )}
    </Disclosure>
  );
};

export default NavigationBar;