import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Phone, Mail, MapPin, X } from 'lucide-react';

const PatientSearchDropdown = ({ 
  isOpen, 
  onClose, 
  onPatientSelect, 
  selectedPatient = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Mock patient data - in real app this would come from API
  const mockPatients = [
    {
      id: 'PAT001',
      name: 'John Smith',
      phone: '0412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      age: 65,
      upi: 'URP2024001',
      dob: '1959-03-15',
      gender: 'Male',
      emergencyContact: 'Mary Smith - 0412 345 679'
    },
    {
      id: 'PAT002',
      name: 'Michael Brown',
      phone: '0412 345 679',
      email: 'michael.brown@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      age: 58,
      upi: 'URP2024002',
      dob: '1966-07-22',
      gender: 'Male',
      emergencyContact: 'Sarah Brown - 0412 345 680'
    },
    {
      id: 'PAT003',
      name: 'David Wilson',
      phone: '0412 345 680',
      email: 'david.wilson@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      age: 71,
      upi: 'URP2024003',
      dob: '1953-11-08',
      gender: 'Male',
      emergencyContact: 'Linda Wilson - 0412 345 681'
    },
    {
      id: 'PAT004',
      name: 'Robert Davis',
      phone: '0412 345 681',
      email: 'robert.davis@email.com',
      address: '321 Elm Street, Perth WA 6000',
      age: 62,
      upi: 'URP2024004',
      dob: '1962-01-14',
      gender: 'Male',
      emergencyContact: 'Jennifer Davis - 0412 345 682'
    },
    {
      id: 'PAT005',
      name: 'James Anderson',
      phone: '0412 345 682',
      email: 'james.anderson@email.com',
      address: '654 Maple Drive, Adelaide SA 5000',
      age: 55,
      upi: 'URP2024005',
      dob: '1969-05-30',
      gender: 'Male',
      emergencyContact: 'Lisa Anderson - 0412 345 683'
    },
    {
      id: 'PAT006',
      name: 'William Thompson',
      phone: '0412 345 683',
      email: 'william.thompson@email.com',
      address: '987 Cedar Lane, Hobart TAS 7000',
      age: 68,
      upi: 'URP2024006',
      dob: '1956-09-12',
      gender: 'Male',
      emergencyContact: 'Patricia Thompson - 0412 345 684'
    }
  ];

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    onPatientSelect(patient);
    setSearchTerm('');
  };

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Patient</h2>
              <p className="text-sm text-gray-600 mt-1">Search and select a patient to book an appointment</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Field */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, ID, UPI, or phone number..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Patient List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {patient.age} years
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>ID: {patient.id}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        UPI: {patient.upi}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-sm">
                  {searchTerm ? `No patients match "${searchTerm}"` : 'No patients available'}
                </p>
              </div>
            )}
          </div>

          {/* Selected Patient Display */}
          {selectedPatient && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Selected Patient</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{selectedPatient.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>ID: {selectedPatient.id} | UPI: {selectedPatient.upi}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedPatient.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {selectedPatient && (
              <button
                onClick={() => onClose()}
                className="px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue with {selectedPatient.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSearchDropdown;
