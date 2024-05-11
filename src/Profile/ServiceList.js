import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const ServiceList = ({ services, handleAddService, handleServiceClick, deleteService, handleServiceImageUpload, hoveredServiceIndex, setHoveredServiceIndex, isAuthenticated }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-4 mx-auto">
            {services.map((service, index) => (
                <div
                    key={index}
                    className="rounded-xl hover:border hover:shadow-2xl transition-shadow duration-200 cursor-pointer overflow-hidden bg-white hover:bg-gray-600 transition-colors duration-200 relative group"
                    onMouseEnter={() => setHoveredServiceIndex(index)}
                    onMouseLeave={() => setHoveredServiceIndex(null)}
                >
                    <div className={`w-full h-48 ${hoveredServiceIndex === index ? '' : 'rounded-b-xl'} bg-gray-200 flex items-center justify-center overflow-hidden`}>
                        {service.image ? (
                            <img src={service.image} alt={service.name} className={`w-full h-full object-cover ${hoveredServiceIndex === index ? '' : 'rounded-b-xl'}`} />
                        ) : (
                            <FontAwesomeIcon icon={faPlus} size="2x" className="text-gray-400 group-hover:text-white transition-colors duration-200" />
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleServiceImageUpload(e, service)} />
                    </div>
                    <div className="p-4 group-hover:text-white transition-colors duration-200">
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <p>{service.description}</p>
                        <p className="font-bold">${service.price} {service.currency}</p>
                    </div>
                    <div className="flex justify-end items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-x-0 bottom-0 mt-4">
                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteService(service)} className="p-1 cursor-pointer group-hover:text-red-600 transition" />
                    </div>
                </div>
            ))}
            {isAuthenticated && (
                <div className="hover:border-2 hover:border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer text-center bg-light-gray hover:bg-white transition-colors duration-200" onClick={handleAddService}>
                    <FontAwesomeIcon icon={faPlus} size="1x" className="text-black group-hover:text-gray-900 transition-colors duration-200" />
                    <span className="mt-2 text-sm font-semibold text-black group-hover:text-gray-900 transition-colors duration-200">Add Service</span>
                </div>
            )}
        </div>
    );
};

export default ServiceList;