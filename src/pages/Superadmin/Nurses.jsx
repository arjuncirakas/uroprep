import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  UserCog,
  Award,
  Clock,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  X,
  Activity,
  ClipboardList,
  Heart
} from 'lucide-react';
import AddNurseModal from '../../components/modals/AddNurseModal';

const Nurses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddNurseModalOpen, setIsAddNurseModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [nurses, setNurses] = useState([
    {
      id: 'NUR001',
      name: 'Emma Thompson',
      email: 'emma.thompson@uroprep.com',
      phone: '+61 456 789 012',
      role: 'Urology Clinical Nurse',
      qualification: 'RN, BN',
      department: 'Urology',
      status: 'Active',
      joinDate: '2019-05-12',
      experience: '10 years',
      shift: 'Day',
      address: '23 Healthcare Street, Sydney NSW 2000',
      nursingLicense: 'NMW123456',
      hospital: 'Sydney Urology Centre',
      availability: 'Monday - Friday, 7:00 AM - 3:00 PM',
      languages: ['English', 'French'],
      about: 'Emma Thompson is a dedicated clinical nurse with extensive experience in urology patient care. She specializes in post-operative care and patient education, with a strong focus on compassionate healthcare delivery.',
      education: [
        { degree: 'Bachelor of Nursing', institution: 'University of Sydney', year: '2013' },
        { degree: 'Post-Graduate Certificate in Urology Nursing', institution: 'Australian College of Nursing', year: '2016' }
      ],
      certifications: ['Advanced Cardiac Life Support (ACLS)', 'Urology Nursing Certification', 'Wound Care Specialist'],
      specialties: ['Post-operative Care', 'Patient Education', 'Catheter Care'],
      patientsHandled: 450,
      procedures: 234,
      shifts: 520
    },
    {
      id: 'NUR002',
      name: 'Oliver Martinez',
      email: 'oliver.martinez@uroprep.com',
      phone: '+61 467 890 123',
      role: 'Urology Clinical Nurse',
      qualification: 'RN, MSN',
      department: 'Urology',
      status: 'Active',
      joinDate: '2020-08-20',
      experience: '8 years',
      shift: 'Night',
      address: '67 Medical Avenue, Melbourne VIC 3000',
      nursingLicense: 'NMW234567',
      hospital: 'Melbourne Urology Hospital',
      availability: 'Monday - Thursday, 7:00 PM - 7:00 AM',
      languages: ['English', 'Spanish'],
      about: 'Oliver Martinez brings valuable night shift expertise to the urology department. With a Master\'s in Nursing, he provides critical care for post-surgical patients and manages emergency situations with professionalism.',
      education: [
        { degree: 'Bachelor of Nursing', institution: 'Monash University', year: '2015' },
        { degree: 'Master of Science in Nursing', institution: 'University of Melbourne', year: '2019' }
      ],
      certifications: ['Critical Care Nursing', 'Emergency Response Training', 'IV Therapy Certification'],
      specialties: ['Critical Care', 'Emergency Response', 'Night Shift Management'],
      patientsHandled: 380,
      procedures: 189,
      shifts: 440
    },
    {
      id: 'NUR003',
      name: 'Sophia Anderson',
      email: 'sophia.anderson@uroprep.com',
      phone: '+61 478 901 234',
      role: 'Senior Urology Nurse',
      qualification: 'RN, BN, CNS',
      department: 'Urology',
      status: 'Active',
      joinDate: '2018-03-15',
      experience: '14 years',
      shift: 'Day',
      address: '89 Nursing Plaza, Brisbane QLD 4000',
      nursingLicense: 'NMW345678',
      hospital: 'Brisbane General Hospital',
      availability: 'Tuesday - Saturday, 6:00 AM - 2:00 PM',
      languages: ['English', 'Mandarin'],
      about: 'As a Senior Nurse with Clinical Nurse Specialist credentials, Sophia Anderson leads the nursing team with excellence. She has pioneered several patient care protocols and mentors junior nurses in advanced urology nursing practices.',
      education: [
        { degree: 'Bachelor of Nursing', institution: 'Queensland University of Technology', year: '2009' },
        { degree: 'Clinical Nurse Specialist Certification', institution: 'Australian College of Nursing', year: '2014' }
      ],
      certifications: ['Clinical Nurse Specialist', 'Leadership in Nursing', 'Advanced Urology Care', 'Mentor Certification'],
      specialties: ['Team Leadership', 'Advanced Urology Care', 'Protocol Development'],
      patientsHandled: 580,
      procedures: 312,
      shifts: 720
    },
    {
      id: 'NUR004',
      name: 'Liam Brown',
      email: 'liam.brown@uroprep.com',
      phone: '+61 489 012 345',
      role: 'Urology Clinical Nurse',
      qualification: 'RN, BN',
      department: 'Urology',
      status: 'On Leave',
      joinDate: '2021-01-10',
      experience: '6 years',
      shift: 'Day',
      address: '45 Healthcare Road, Adelaide SA 5000',
      nursingLicense: 'NMW456789',
      hospital: 'Adelaide Urology Clinic',
      availability: 'Currently on medical leave',
      languages: ['English'],
      about: 'Liam Brown is a compassionate nurse who focuses on patient comfort and recovery. His attention to detail and clinical skills make him a valuable member of the urology nursing team.',
      education: [
        { degree: 'Bachelor of Nursing', institution: 'Flinders University', year: '2017' },
        { degree: 'Certificate in Urology Nursing', institution: 'Australian Nursing Federation', year: '2019' }
      ],
      certifications: ['Basic Life Support (BLS)', 'Urology Nursing', 'Patient Safety Training'],
      specialties: ['Patient Comfort', 'Surgical Preparation', 'Recovery Care'],
      patientsHandled: 280,
      procedures: 156,
      shifts: 380
    },
    {
      id: 'NUR005',
      name: 'Isabella Davis',
      email: 'isabella.davis@uroprep.com',
      phone: '+61 490 123 456',
      role: 'Urology Clinical Nurse',
      qualification: 'RN, BN',
      department: 'Urology',
      status: 'Active',
      joinDate: '2020-11-22',
      experience: '7 years',
      shift: 'Night',
      address: '12 Medical Center Drive, Perth WA 6000',
      nursingLicense: 'NMW567890',
      hospital: 'Perth Urology Institute',
      availability: 'Wednesday - Sunday, 7:00 PM - 7:00 AM',
      languages: ['English', 'Italian'],
      about: 'Isabella Davis specializes in night shift care and has developed strong skills in monitoring post-operative patients during critical recovery hours. Her calm demeanor and expertise ensure patients receive excellent overnight care.',
      education: [
        { degree: 'Bachelor of Nursing', institution: 'Curtin University', year: '2016' },
        { degree: 'Advanced Diploma in Clinical Nursing', institution: 'Perth College of Nursing', year: '2019' }
      ],
      certifications: ['Advanced Clinical Nursing', 'Night Shift Specialist', 'Patient Monitoring Certification'],
      specialties: ['Night Care', 'Patient Monitoring', 'Post-operative Care'],
      patientsHandled: 340,
      procedures: 198,
      shifts: 460
    }
  ]);

  const handleAddNurse = (newNurse) => {
    setNurses([...nurses, newNurse]);
    setIsAddNurseModalOpen(false);
  };

  const filteredNurses = nurses.filter(nurse =>
    nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nurse.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nurse.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nurse.id.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-black flex items-center justify-center mr-3">
                <UserCog className="h-5 w-5 text-white" />
              </div>
              Nurses Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage and monitor all nurses in the system
            </p>
          </div>
          <button
            onClick={() => setIsAddNurseModalOpen(true)}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-800 to-black text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Nurse
          </button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, ID, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>
      </div>


      {/* Nurses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nurse Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
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
              {filteredNurses.map((nurse) => (
                <tr key={nurse.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-black flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {nurse.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{nurse.name}</div>
                        <div className="text-xs text-gray-500">{nurse.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {nurse.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {nurse.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{nurse.role}</div>
                      <div className="text-xs text-gray-500">{nurse.qualification}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{nurse.experience}</div>
                    <div className="text-xs text-gray-500">Since {new Date(nurse.joinDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedNurse(nurse);
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

        {filteredNurses.length === 0 && (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No nurses found</p>
          </div>
        )}
      </div>

      {/* Add Nurse Modal */}
      <AddNurseModal
        isOpen={isAddNurseModalOpen}
        onClose={() => setIsAddNurseModalOpen(false)}
        onNurseAdded={handleAddNurse}
      />

      {/* View Nurse Details Modal */}
      {isViewModalOpen && selectedNurse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-5xl max-h-[95vh]">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-800 to-black px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {selectedNurse.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedNurse.name}</h2>
                      <p className="text-green-100 text-sm mt-1">{selectedNurse.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedNurse(null);
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
                          <p className="text-lg font-bold text-blue-900 mt-1">{selectedNurse.status}</p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase">Patients</p>
                          <p className="text-lg font-bold text-green-900 mt-1">{selectedNurse.patientsHandled}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-purple-600 font-medium uppercase">Experience</p>
                          <p className="text-lg font-bold text-purple-900 mt-1">{selectedNurse.experience}</p>
                        </div>
                        <Award className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-orange-600 font-medium uppercase">Procedures</p>
                          <p className="text-lg font-bold text-orange-900 mt-1">{selectedNurse.procedures}</p>
                        </div>
                        <Heart className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedNurse.about}</p>
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
                          <p className="text-sm text-gray-900 mt-1">{selectedNurse.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedNurse.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Address</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedNurse.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Hospital</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedNurse.hospital}</p>
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
                        {selectedNurse.education.map((edu, index) => (
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
                        {selectedNurse.certifications.map((cert, index) => (
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
                      <Heart className="h-5 w-5 mr-2 text-purple-600" />
                      Areas of Specialty
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNurse.specialties.map((specialty, index) => (
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Nursing License</h3>
                      <p className="text-gray-700">{selectedNurse.nursingLicense}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Join Date</h3>
                      <p className="text-gray-700">{new Date(selectedNurse.joinDate).toLocaleDateString('en-AU', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Languages</h3>
                      <p className="text-gray-700">{selectedNurse.languages.join(', ')}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Shift</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        selectedNurse.shift === 'Day' 
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {selectedNurse.shift}
                      </span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Availability
                    </h3>
                    <p className="text-gray-700">{selectedNurse.availability}</p>
                  </div>

                  {/* Statistics */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedNurse.patientsHandled}</p>
                        <p className="text-sm text-gray-600 mt-1">Patients Handled</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedNurse.procedures}</p>
                        <p className="text-sm text-gray-600 mt-1">Procedures</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedNurse.shifts}</p>
                        <p className="text-sm text-gray-600 mt-1">Shifts Completed</p>
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
                      setSelectedNurse(null);
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

export default Nurses;

