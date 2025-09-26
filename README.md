# Australian Urology Oncology Management System

A comprehensive web application for managing end-to-end clinical pathways for patients referred with elevated PSA or suspected prostate cancer, aligned with Australian clinical guidelines (RACGP, USANZ, eviQ) and NSQHS Standards.

## 🏥 System Overview

This system provides a complete role-based clinical pathway management solution with four main databases and automated workflow routing:

- **Database 1 (OPD)**: Initial Assessment & Clinical Decision Point
- **Database 2 (Active Surveillance)**: Long-term monitoring and progression detection
- **Database 3 (Surgery)**: Pre-operative planning, surgical outcomes, and immediate post-op
- **Database 4 (Post-surgery Follow-up)**: Long-term oncological and functional outcomes

## 👥 User Roles & Access Control

### Urologist (Full Access)
- All databases (DB1-DB4) read/write access
- Clinical decision authority for all pathways
- Surgical scheduling and outcome entry
- MDT case presentation and outcome entry
- Audit trail and quality metrics access

### Urology Registrar
- DB1-DB4 read/write access under supervision
- Clinical assessment entry with consultant oversight
- Surgical assistance documentation
- Limited surgical scheduling (senior approval required)

### Urology Clinical Nurse
- DB1-DB4 data entry and appointment scheduling
- Patient education delivery and documentation
- Pre-operative checklist completion
- Follow-up coordination and reminder management
- Cannot make clinical pathway decisions

### Admin/Clerical Staff
- Appointment scheduling across all databases
- Patient demographic updates
- Report generation (non-clinical data)
- System user management
- No access to clinical decision fields

### MDT Coordinator
- MDT case scheduling and coordination
- Cross-database case summary generation
- Meeting outcome documentation
- Quality metrics for MDT performance
- Limited clinical data access (view only)

### GP Portal Access (Read-Only)
- View patients referred by their practice
- Access to discharge summaries
- Follow-up recommendations and schedules
- Cannot modify clinical data
- Secure messaging with urology team

## 🚀 Key Features

### Referral Entry Portal
- **CPC Criteria Validation**: Automatic flagging of CPC-compliant referrals
- **Auto-Generated Fields**: Unique Patient ID (UPI), referral timestamp, triage priority
- **Clinical Override**: Support for non-CPC referrals with justification
- **System Validations**: PSA >100 ng/mL auto-flagged as URGENT

### Clinical Decision Engine
- **Automated Pathway Routing**: Based on clinical outcomes
- **Evidence-Based Prompts**: Guideline recommendations displayed contextually
- **Risk Calculators**: Integrated nomograms for survival prediction
- **Documentation Templates**: Structured clinical note generation

### Active Surveillance Management
- **Automated Progression Detection**: PSA velocity, doubling time, MRI changes
- **Protocol Compliance**: Standardized follow-up schedules
- **Quality of Life Assessment**: IPSS score, sexual function, anxiety screening
- **Intervention Pathways**: Auto-trigger re-referral to MDT when progression detected

### Surgical Pathway Management
- **Pre-operative Planning**: Cardiovascular risk assessment, anesthetic scoring
- **Surgical Scheduling**: Integration with hospital OR management
- **Intra-operative Documentation**: Real-time surgical recording
- **Post-operative Tracking**: Complication detection and outcome monitoring

### MDT Coordination
- **Case Management**: Comprehensive case packet generation
- **Meeting Scheduling**: Automated participant notification
- **Outcome Documentation**: Structured decision recording
- **Quality Metrics**: Performance tracking and benchmarking

### Analytics & Reporting
- **Real-Time KPIs**: Access flow, clinical quality, system performance
- **Regulatory Compliance**: NSQHS Standards, Cancer Registry submissions
- **Custom Report Builder**: Drag-and-drop interface for non-technical users
- **Benchmarking**: Comparison with national quality indicators

## 🔄 Clinical Workflow

```
REFERRAL → DB1 (Mandatory: Clinical assessment within 30 days)
         ↓
DB1 → [NO CANCER] → DISCHARGE TO GP
    → [MDT REQUIRED] → MDT QUEUE → [OUTCOME] → DB2/DB3/DISCHARGE
    → [ACTIVE SURVEILLANCE] → DB2
    → [SURGERY] → DB3
    → [EXTERNAL REFERRAL] → DISCHARGE WITH REFERRAL

DB2 → [PROGRESSION] → MDT QUEUE → DB3
    → [STABLE >5 YEARS] → DISCHARGE TO GP
    → [PATIENT WITHDRAWAL] → DISCHARGE WITH PLAN

DB3 → [POST-OP LOW RISK] → DB4
    → [POST-OP HIGH RISK] → MDT → EXTERNAL REFERRAL/DB4

DB4 → [STABLE >2 YEARS] → DISCHARGE TO GP
    → [RECURRENCE] → MDT → TREATMENT
    → [COMPLICATIONS] → ONGOING CARE
```

## 🛡️ Security & Compliance

### Australian Privacy Principles (APP) Compliance
- **Data Minimization**: Only collect necessary clinical information
- **Purpose Limitation**: Data used only for stated clinical purposes
- **Consent Management**: Patient consent for data sharing and research
- **Access Logging**: All data access logged with user, time, purpose
- **Data Retention**: Automatic archiving after discharge

### Data Security Measures
- **Encryption**: AES-256 encryption at rest and in transit
- **Multi-Factor Authentication**: Mandatory for all users
- **Session Management**: Automatic timeout after 30 minutes inactivity
- **Audit Logging**: Comprehensive activity logging for all user actions
- **Regular Security Assessments**: Quarterly penetration testing

## 📊 Key Performance Indicators

### Access & Flow Metrics
- Average Wait Time: Referral to first consultation
- Consultation to Treatment Time: DB1 to intervention
- Surgery Wait Time: Decision to procedure
- Follow-up Compliance: Percentage of attended appointments

### Clinical Quality Indicators
- Diagnostic Accuracy: Correlation between clinical suspicion and pathology
- Surgical Outcomes: Margin positivity rates, complication rates
- Functional Outcomes: Continence and erectile function preservation
- Patient Satisfaction: Validated questionnaire results

### System Performance Metrics
- Database Utilization: Patient numbers in each database
- Completion Rates: Percentage of complete clinical records
- Alert Response Times: Time from alert generation to clinician action
- Documentation Quality: Completeness and accuracy scores

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uro-prep/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Testing

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components (sidebars, headers)
├── layouts/            # Page layout components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── gp/             # GP portal pages
│   ├── urology-nurse/  # Urology nurse pages
│   ├── urologist/      # Urologist pages
│   ├── mdt-coordinator/# MDT coordinator pages
│   └── referral/       # Public referral portal
├── store/              # Redux store and slices
│   └── slices/         # Redux slices for state management
└── assets/             # Static assets
```

## 🔧 Technology Stack

- **Frontend**: React 19, Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📝 License

This project is proprietary software developed for Australian healthcare institutions. All rights reserved.

## 🤝 Contributing

This is a clinical system requiring appropriate medical and technical oversight. All changes must be reviewed by clinical and technical leads.

## 📞 Support

For technical support or clinical questions, please contact the system administrator or clinical lead.

---

**Note**: This system is designed for use in Australian healthcare settings and complies with local regulations and clinical guidelines. Ensure proper training and governance procedures are in place before clinical use.