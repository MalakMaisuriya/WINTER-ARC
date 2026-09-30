# ❄️ WINTER ARC — Long-Term Self-Improvement & Career System

> *"Build the person you want to become."*

**WINTER ARC** is a production-ready, full-stack web application engineered specifically for BCA Semester 5 students and Full Stack Web Developers (tailored for **Malak Maisuriya**). 

Unlike generic challenge apps that auto-reset after 90 days, **Winter Arc** is built for indefinite, long-term personal transformation, habit tracking, skill mastery, project development, and job readiness.

---

## 🌟 Key Features

### 1. User Account & Authentication
- **Secure Authentication**: JWT tokens with salted `bcryptjs` password hashing.
- **Custom Profile**: Manage Name (*Malak Maisuriya*), Education (*BCA Semester 5*), Career (*Full Stack Web Developer*), Current Status, Bio, and custom theme settings.
- **Security Control**: Password change verification and explicit confirmation modal for account deletion (requires typing `"DELETE MY WINTER ARC"`).

### 2. Winter Arc Day System
- **Indefinite Arc Tracker**: Tracks continuous progress from Day 1, Day 2 ... Day 90 ... Day 100+.
- **No Data Deletion**: Zero automatic data resets or historical deletion.
- **Configurable Start/End Dates**: Optional challenge end dates, defaulting to indefinite long-term growth.

### 3. Main Dashboard & Focus Timer
- **Live Metrics**: Current Day, Current Streak (🔥), Longest Streak, Today's Progress %, Overall Completion %, Total Completed Habits, and Total Days Completed.
- **Motivational System**: Authentic daily quotes for consistency and focus.
- **Interactive Focus Timer**: Stopwatch timer for Full Stack Coding and BCA Study sessions that auto-logs time directly into daily check-ins.

### 4. Daily Habits Engine
- **Pre-Seeded Defaults**:
  - *Morning*: Wake Up On Time (7:00 AM), No Phone First 30 Mins, Morning Walk / Stretch
  - *Study*: BCA Study (1 hour)
  - *Development*: Full Stack Coding (3 hours), Project Development (1.5 hours)
  - *Career*: DSA / Interview Preparation (30 mins), English Practice (20 mins)
  - *Health*: Exercise / Walk (30 mins), Drink Water (3L)
  - *Digital Discipline*: Limit Social Media (<45 mins)
  - *Night*: Daily Review, Plan Tomorrow, Sleep On Time (11:00 PM)
- **Habit Customization**: Add, edit, re-order, change target/unit/preferred time, or soft-disable habits (disabling preserves 100% of historical records).

### 5. Daily Check-In & Reflection
- Track Mood (😄 Great, 🙂 Good, 😐 Normal, 😔 Low), Energy (1-10), Productivity (1-10), Sleep Hours, Coding Hours, Study Hours, Workout Minutes, and Screen Time.
- Daily Reflections: *"What did I accomplish today?"*, *"What could I improve tomorrow?"*, *"What is tomorrow's #1 priority?"*.

### 6. Intelligent Streak Calculation
- **Configurable Threshold**: Set completion criteria (default: 80% active habits completed = Successful Day).
- **Streak Continuity**: Tracks Current, Longest, Weekly, and Monthly streaks without breaking due to newly disabled habits.

### 7. Interactive Calendar & Analytics
- **Calendar History**: Full monthly grid color-coding Completed (>80%), Partial, Missed, or No Data days. Click any date to view historical records back to Day 1.
- **Analytics Charts**: Responsive Recharts visual graphs for habit completion rates, coding hours vs. study hours, and monthly averages.

### 8. Full Stack Developer Mode & Skill Matrix
- Skill matrix tracking for **JavaScript**, **React**, **Node.js**, **Express.js**, **MongoDB**, **REST API**, **Git**, **GitHub**, **Authentication**, **Deployment**, **DSA**, and **Interview Preparation**.
- Status indicators (*Not Started*, *Learning*, *Practicing*, *Project Ready*, *Interview Ready*) with custom topic tracking.

### 9. Project Tracker & Job Readiness
- **Project Tracker**: Track projects like *Driving School Management System* with technology tags, completion progress %, GitHub repository URLs, and Live Demo links.
- **Job Ready Dashboard**: Career readiness checklist (Resume, Portfolio, GitHub, LinkedIn, DSA, Mock Interviews) and Job Application Tracker (Company, Role, Location, Application Date, Status, Job URL, Notes).

### 10. Achievements & Badge System
- Automatically unlocks badges based on actual database logs:
  - 🔥 *7, 30, 60, 90 Day Streaks*
  - 💻 *50, 100, 250 Coding Hours*
  - 📚 *30 Study Days*, 🏃 *30 Workout Days*
  - 🚀 *First Project Completed*, 💼 *First Job Application*

### 11. Data Safety & Export
- **Export Data**: Download complete offline backup as JSON or CSV.
- **Import Backup**: Restore backup data with JSON schema validation.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Vanilla CSS (Design Tokens, Dark Charcoal Theme, Responsive Layouts), Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Authentication, Bcryptjs Password Hashing
- **Database**: MongoDB (Mongoose ORM with automatic `MongoMemoryServer` fallback for out-of-the-box zero-setup execution)
- **Architecture**: Modular RESTful APIs with input validation and centralized error handling

---

## 📁 Project Architecture

```
WINTER ARC/
├── package.json (Root package)
├── README.md
├── server/
│   ├── package.json
│   ├── .env
│   ├── server.js (Express Entry)
│   ├── config/
│   │   └── db.js (MongoDB Connection + Memory Server Fallback)
│   ├── models/ (User, WinterArc, Habit, HabitLog, DailyCheckIn, DeveloperSkill, Project, JobApplication, Goal, Achievement, Review, Reminder, UserSettings)
│   ├── controllers/ (Auth, User, WinterArc, Habit, CheckIn, Dashboard, Analytics, Developer, Project, Job, Goal, Achievement, Review, Reminder, Backup)
│   ├── routes/
│   ├── middleware/ (Auth, ErrorHandler)
│   └── utils/ (dateUtils, seedDefaults)
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css (Design System, Tokens, Dark Charcoal Theme)
        ├── App.jsx & main.jsx
        ├── context/ (AuthContext, ThemeContext, NotificationContext)
        ├── services/ (api.js)
        ├── components/ (Navbar, Sidebar, BottomNav, FocusTimerModal, DailyCheckInModal, StartWinterArcModal)
        └── pages/ (Login, Register, Dashboard, Today, Habits, Calendar, Analytics, Developer, Projects, JobReady, Goals, Achievements, Reviews, Settings)
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v18.0+
- **npm**: v9.0+

### Step-by-Step Execution

1. **Clone or Navigate to Project Directory**:
   ```bash
   cd "d:\WEB DEVLOPER\PROJECT\WINTER ACT"
   ```

2. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Configure Environment Variables**:
   `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/winterarc
   JWT_SECRET=winter_arc_super_secret_jwt_key_2026_malak_maisuriya
   NODE_ENV=development
   ```

4. **Start the Application**:

   - **Backend Server**:
     ```bash
     cd server
     npm run dev
     ```
     *Server runs at `http://localhost:5000`*

   - **Frontend React Client**:
     ```bash
     cd client
     npm run dev
     ```
     *Application loads at `http://localhost:3000`*

---

## 🔒 Security & Data Safety Principles

1. **No Automatic Data Expiration**: Winter Arc data is stored permanently in MongoDB.
2. **User Data Isolation**: Middleware validates user identity via JWT on all protected API endpoints.
3. **Explicit Deletion**: Account deletion requires typing `"DELETE MY WINTER ARC"` and entering the current password.

---

## 📄 License

Created for **Malak Maisuriya** — Personal Winter Arc Self-Improvement & Full Stack Web Developer Career System.
