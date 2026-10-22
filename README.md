# CampusEquip (RentalTrack)

An enterprise-grade, full-stack **MERN (MongoDB, Express, React, Node.js)** equipment booking, tracking, and management system designed for campus laboratories and institutions.

CampusEquip streamlines gear checkouts, automates return condition verification using **AI-driven surface defect analysis**, generates **QR Gate Passes**, and outputs formal **PDF audit reports**.

---

## Key Features

- ** Asset & Rental Management**: Real-time tracking of campus hardware, lab instruments, and digital devices across students and faculty.
- ** AI-Driven Surface Defect Detection**: Integrated live camera capture (`CameraCapture.jsx`) that analyzes equipment conditions against defect baselines to flag damaged gear automatically.
- ** QR Code Gate Pass System**: Instant generation and verification of digital passes for seamless checkout and checkin at campus security gates.
- ** Automated PDF Audit Reporting**: Built-in client-side report generation using `jsPDF` for detailed rental logs, inventory summaries, and compliance audits.
- ** Interactive Dashboard**: Modern, responsive UI built with React, Vite, and Tailwind CSS for real-time inventory monitoring.

---

## Tech Stack

### **Frontend**
- **Framework**: React 18 (via Vite)
- **Styling**: Tailwind CSS
- **Utilities**: `jsPDF` (Audit Exports), `react-qr-code`, Lucide Icons

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Middleware**: CORS, Dotenv, Body Parser

---

## Project Structure

```text
campuseqip/
├── backend/
│   ├── models/          # Mongoose Schemas (Equipment, Rental)
│   ├── routes/          # REST API endpoints & Inspection controllers
│   ├── .env             # Server configuration
│   ├── package.json     # Node dependencies
│   └── server.js        # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (CameraCapture, Dashboard, PDF, QR)
│   │   ├── App.jsx      # Main UI routes
│   │   └── main.jsx     # Vite DOM entry
│   ├── package.json     # Client dependencies
│   └── vite.config.js   # Vite configuration
│
└── .gitignore           # Excluded files & build artifacts
