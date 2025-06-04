# GRZ+ Revalidation Tracking Application

This application is designed to support healthcare institutions in tracking and evaluating the home revalidation process of patients after being discharged. Built with a **React (Vite, TypeScript)** frontend and a **Django Rest Framework** backend, it provides a seamless experience for both **caregivers** and **patients**.

## 🧠 Project Overview

The platform simplifies communication between patients and caregivers by offering:
- A secure onboarding flow for patients
- A clear overview of form progress across household rooms
- Insightful summaries of patient responses for caregivers

## 🏥 Key Features

### Patient Side
- 📩 **Automatic Account Creation**: Patients are invited via email upon caregiver registration.
- 🔐 **Secure Login**: Patients set their password through a secure link.
- 🧭 **Onboarding Flow**: Explains application usage and goals.
- 🏠 **Form Overview Dashboard**: Visual progress tracking for forms categorized by room (e.g. bathroom, living room).
- ✅ **Interactive Forms**: Questions come in three formats:
  - Text answers
  - Yes/No questions
  - Emoji-based ratings (Very Bad ➝ Very Good)

### Caregiver Side
- 🧑‍⚕️ **Add & Manage Patients**: Assign patients to your profile.
- 📊 **View Summaries**: Easily see submitted responses with key answers highlighted.
- 🔎 **Search Functionality**: Filter by patient or form.

## 🔧 Tech Stack

| Layer         | Technology                          |
|---------------|--------------------------------------|
| Frontend      | React (Vite) + TypeScript           |
| Backend       | Django + Django Rest Framework      |
| Auth          | JWT (Custom claims: name, role, email) |
| Forms Storage | NoSQL (for flexible form structures) |
| Database      | PostgreSQL (user & metadata)        |

## 📂 Folder Structure

```
project-root/
.
├── backend
│   ├── grzplus
│   │   ├── db.sqlite3
│   │   ├── emails
│   │   ├── forms
│   │   ├── grzplus
│   │   ├── manage.py
│   │   └── users
│   └── requirements.txt
├── frontend
│   └── grzPlus
│       ├── eslint.config.js
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       ├── README.md
│       ├── src
└── README.MD

11 directories, 13 files

```

## 🚀 Getting Started

### Backend
```bash
cd backend
cd grzplus
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend
```bash
cd frontend
cd grzPlus
npm install
npm run dev
```

## 🖼️ Screenshots
> - ✅ Patient Form Progress View  
> - 👨‍⚕️ Caregiver Dashboard  
> - 🧭 Onboarding Flow

## 🔒 Authentication

- Custom JWT implementation using `SimpleJWT`
- Claims include: `user_id`, `email`, `role`, and `name`
- Separate login views for patients and caregivers (if needed)

## 📌 Roadmap

- [ ] Add media uploads to forms
- [ ] Implement notifications for caregivers
- [ ] Add export options (PDF, CSV) for caregivers

## 🤝 Acknowledgements

Thanks to the GRZ+ project team, testers, and all stakeholders who contributed to refining this application for real-world use.

---

**Maintainer, designer, programmer**  
Dylan Okyere
