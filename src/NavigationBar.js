import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Correct for v2
import { PlusIcon } from '@heroicons/react/24/solid'; // Correct for v2
import { useNavigate } from 'react-router-dom';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileInvoice, faMagic } from '@fortawesome/free-solid-svg-icons';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const CreateMenu = ({ isPro }) => {
  const navigate = useNavigate();

  const navigateToCreateInvoice = () => {
    navigate('/create-invoice');
  };

  const navigateToCreateContract = () => {
    if (isPro) {
      navigate('CreateContract');
    } else {
      // this is repetitive but i am leaving it just so i can have room for tier enforcements late for other create options
      navigate('/create-agreement');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"> {/* Backdrop */}
      <div className="bg-white rounded-lg p-6 w-3/4 md:w-1/2 lg:w-1/3 shadow-lg flex flex-col items-center"> {/* Modal container */}
        <h2 className="text-lg font-semibold mb-4">Create</h2>
        <div className="flex justify-center space-x-4">
          <button 
            className="group flex flex-col items-center p-6 border border-transparent shadow-sm text-base font-medium rounded-xl text-black bg-gray-100 hover:bg-black justify-center"
            onClick={navigateToCreateInvoice}
          >
            <FontAwesomeIcon icon={faFileInvoice} size={20} className="text-white group-hover:text-white" /> 
            <span className="group-hover:text-white">Create Invoice</span>
          </button>
          <button 
            className="group flex flex-col items-center p-6 border border-transparent shadow-sm text-base font-medium rounded-xl text-black bg-gray-100 hover:bg-black justify-center"
            onClick={navigateToCreateContract}
          >
            <FontAwesomeIcon icon={faMagic} size={20} className="text-black group-hover:text-white" /> 
            <span className="group-hover:text-white">AI Agreement</span>
          </button>
        </div>
      </div>
    </div>
  );
};


const styles = StyleSheet.create({
  createMenuContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    height: '100%',
    width: '100%',
  },
  titleSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAF7F6',
  },
  rectangle: {
    width: 134,
    height: 4,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 346,
    marginTop: 20,
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 10,
    borderRadius: 19,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    width: 110,
    textAlign: 'center',
  },
  dimmedScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  createMenu: {
    width: '100%', 
    position: 'absolute', 
    bottom: 0, 
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#FAF7F6',
    zIndex: 11,
    padding: 19,
    paddingTop: 10,
    paddingLeft: 22,
    paddingRight: 22,
    paddingBottom: 10,
  },
});


const NavigationBar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <Disclosure as="nav" className="bg-FAF7F6 ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-FAF7F6 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center p-4">
                  <img
                    className="h-8 w-auto"
                    src="/klorahLogo.png"
                    alt="Klorah"
                    onClick={() => navigate('/dashboard')}
                  />
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <a onClick={() => navigate('/crm-dashboard')} className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-black hover:border-black hover:text-black">Tasks</a>
                  <a onClick={() => navigate('/wallet')} className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-black hover:border-black hover:text-black">Wallet</a>
                  <a onClick={() => navigate('/profile')} className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-black hover:border-black hover:text-black">Profile</a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-black px-3 py-2 text-sm font-semibold shadow-sm hover:bg-black focus:visible:outline focus:visible:outline-2 focus:visible:outline-black"
                    style={{ color: '#FAF7F6' }}
                    onClick={() => setModalVisible(true)}
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
            <Disclosure.Button as="a" onClick={() => navigate('/crm-dashboard')} className="block py-2 pl-3 pr-4 text-base font-medium text-black hover:bg-FAF7F6 hover:text-black sm:pl-5 sm:pr-6">Tasks</Disclosure.Button>
              <Disclosure.Button as="a" onClick={() => navigate('/wallet')} className="block py-2 pl-3 pr-4 text-base font-medium text-black hover:bg-FAF7F6 hover:text-black sm:pl-5 sm:pr-6">Wallet</Disclosure.Button>
              <Disclosure.Button as="a" onClick={() => navigate('/profile')} className="block py-2 pl-3 pr-4 text-base font-medium text-black hover:bg-FAF7F6 hover:text-black sm:pl-5 sm:pr-6">Profile</Disclosure.Button>
            </div>
          </Disclosure.Panel>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <div
              style={styles.createMenuContent}
              onClick={() => setModalVisible(false)}
            >
              <CreateMenu />
            </div>
          </Modal>
        </>
      )}
    </Disclosure>
  );
};

export default NavigationBar;
