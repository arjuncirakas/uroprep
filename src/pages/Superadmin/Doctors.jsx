import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  Stethoscope,
  Award,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  X,
  Users,
  Activity,
  ClipboardList
} from 'lucide-react';
import AddDoctorModal from '../../components/modals/AddDoctorModal';

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([
    {
      id: 'DOC001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@uroprep.com',
      phone: '+61 412 345 678',
      specialization: 'Urologist',
      qualification: 'MBBS, FRACS',
      department: 'Urology',
      status: 'Active',
      joinDate: '2020-03-15',
      experience: '15 years',
      patients: 234,
      address: '45 Medical Plaza, Sydney NSW 2000',
      medicalLicense: 'MED123456',
      hospital: 'Sydney Urology Centre',
      availability: 'Monday - Friday, 9:00 AM - 5:00 PM',
      languages: ['English', 'Spanish'],
      about: 'Dr. Sarah Johnson is a highly experienced urologist with over 15 years of clinical practice. She specializes in minimally invasive urological procedures and has published numerous research papers in leading medical journals.',
      education: [
        { degree: 'MBBS', institution: 'University of Sydney', year: '2008' },
        { degree: 'FRACS (Urology)', institution: 'Royal Australasian College of Surgeons', year: '2015' }
      ],
      certifications: ['Board Certified in Urology', 'Laparoscopic Surgery Certification', 'Robotic Surgery Training'],
      specialties: ['Prostate Cancer Treatment', 'Kidney Stone Management', 'Minimally Invasive Surgery'],
      appointments: 156,
      surgeries: 89,
      consultations: 234
    },
    {
      id: 'DOC002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@uroprep.com',
      phone: '+61 423 456 789',
      specialization: 'Urologist',
      qualification: 'MBBS, MS (Urology)',
      department: 'Urology',
      status: 'Active',
      joinDate: '2019-07-22',
      experience: '12 years',
      patients: 189,
      address: '78 Healthcare Avenue, Melbourne VIC 3000',
      medicalLicense: 'MED234567',
      hospital: 'Melbourne Urology Hospital',
      availability: 'Monday - Thursday, 8:00 AM - 4:00 PM',
      languages: ['English', 'Mandarin', 'Cantonese'],
      about: 'Dr. Michael Chen is a dedicated urologist with expertise in urologic oncology and reconstructive surgery. He has trained in leading institutions internationally and brings cutting-edge techniques to patient care.',
      education: [
        { degree: 'MBBS', institution: 'University of Melbourne', year: '2011' },
        { degree: 'MS (Urology)', institution: 'Monash University', year: '2017' }
      ],
      certifications: ['Urologic Oncology Fellowship', 'Advanced Endoscopy Certification'],
      specialties: ['Bladder Cancer', 'Urological Reconstruction', 'Endoscopic Procedures'],
      appointments: 132,
      surgeries: 67,
      consultations: 189
    },
    {
      id: 'DOC003',
      name: 'Dr. Emily Roberts',
      email: 'emily.roberts@uroprep.com',
      phone: '+61 434 567 890',
      specialization: 'Urology Registrar',
      qualification: 'MBBS, MMed',
      department: 'Urology',
      status: 'Active',
      joinDate: '2021-11-10',
      experience: '8 years',
      patients: 156,
      address: '92 Medical Center Road, Brisbane QLD 4000',
      medicalLicense: 'MED345678',
      hospital: 'Brisbane General Hospital',
      availability: 'Tuesday - Saturday, 10:00 AM - 6:00 PM',
      languages: ['English', 'French'],
      about: 'Dr. Emily Roberts is a skilled urology registrar with a focus on pediatric urology and functional urology. She is passionate about patient education and preventive care.',
      education: [
        { degree: 'MBBS', institution: 'University of Queensland', year: '2015' },
        { degree: 'MMed', institution: 'Queensland University of Technology', year: '2019' }
      ],
      certifications: ['Pediatric Urology Training', 'Urodynamics Certification'],
      specialties: ['Pediatric Urology', 'Urinary Incontinence', 'Functional Disorders'],
      appointments: 98,
      surgeries: 34,
      consultations: 156
    },
    {
      id: 'DOC004',
      name: 'Dr. James Wilson',
      email: 'james.wilson@uroprep.com',
      phone: '+61 445 678 901',
      specialization: 'Urologist',
      qualification: 'MBBS, FRACS',
      department: 'Urology',
      status: 'On Leave',
      joinDate: '2018-02-05',
      experience: '18 years',
      patients: 278,
      address: '156 Hospital Drive, Perth WA 6000',
      medicalLicense: 'MED456789',
      hospital: 'Perth Urology Institute',
      availability: 'Currently on medical leave',
      languages: ['English'],
      about: 'Dr. James Wilson is a senior urologist with extensive experience in complex urological surgeries. He has been a key figure in implementing advanced robotic surgery programs and training the next generation of urologists.',
      education: [
        { degree: 'MBBS', institution: 'University of Western Australia', year: '2005' },
        { degree: 'FRACS', institution: 'Royal Australasian College of Surgeons', year: '2012' }
      ],
      certifications: ['Robotic Surgery Fellowship', 'Advanced Laparoscopic Training', 'Urological Oncology Certification'],
      specialties: ['Robotic Prostatectomy', 'Complex Reconstruction', 'Urologic Oncology'],
      appointments: 198,
      surgeries: 145,
      consultations: 278
    }
  ]);

  const handleAddDoctor = (newDoctor) => {
    setDoctors([...doctors, newDoctor]);
    setIsAddDoctorModalOpen(false);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-black flex items-center justify-center mr-3">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              Doctors Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage and monitor all doctors in the system
            </p>
          </div>
          <button
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-800 to-black text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Doctor
          </button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, ID, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>
      </div>


      {/* Doctors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Doctor Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-black flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {doctor.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {doctor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doctor.specialization}</div>
                      <div className="text-xs text-gray-500">{doctor.qualification}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{doctor.experience}</div>
                    <div className="text-xs text-gray-500">Since {new Date(doctor.joinDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsViewModalOpen(true);
                      }}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No doctors found</p>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onDoctorAdded={handleAddDoctor}
      />

      {/* View Doctor Details Modal */}
      {isViewModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-5xl max-h-[95vh]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-800 to-black px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedDoctor.name}</h2>
                      <p className="text-green-100 text-sm mt-1">{selectedDoctor.specialization}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedDoctor(null);
                    }}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  {/* Status and Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-600 font-medium uppercase">Status</p>
                          <p className="text-lg font-bold text-blue-900 mt-1">{selectedDoctor.status}</p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase">Patients</p>
                          <p className="text-lg font-bold text-green-900 mt-1">{selectedDoctor.patients}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-purple-600 font-medium uppercase">Experience</p>
                          <p className="text-lg font-bold text-purple-900 mt-1">{selectedDoctor.experience}</p>
                        </div>
                        <Award className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-orange-600 font-medium uppercase">Surgeries</p>
                          <p className="text-lg font-bold text-orange-900 mt-1">{selectedDoctor.surgeries}</p>
                        </div>
                        <ClipboardList className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedDoctor.about}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedDoctor.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedDoctor.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Address</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedDoctor.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Hospital</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedDoctor.hospital}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {selectedDoctor.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <p className="font-semibold text-gray-900">{edu.degree}</p>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            <p className="text-xs text-gray-500 mt-1">Year: {edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-green-600" />
                        Certifications
                      </h3>
                      <div className="space-y-2">
                        {selectedDoctor.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-gray-700">{cert}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2 text-purple-600" />
                      Areas of Specialty
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Medical License</h3>
                      <p className="text-gray-700">{selectedDoctor.medicalLicense}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Join Date</h3>
                      <p className="text-gray-700">{new Date(selectedDoctor.joinDate).toLocaleDateString('en-AU', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Languages</h3>
                      <p className="text-gray-700">{selectedDoctor.languages.join(', ')}</p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Availability
                    </h3>
                    <p className="text-gray-700">{selectedDoctor.availability}</p>
                  </div>

                  {/* Statistics */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedDoctor.appointments}</p>
                        <p className="text-sm text-gray-600 mt-1">Appointments</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedDoctor.surgeries}</p>
                        <p className="text-sm text-gray-600 mt-1">Surgeries</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedDoctor.consultations}</p>
                        <p className="text-sm text-gray-600 mt-1">Consultations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedDoctor(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;

