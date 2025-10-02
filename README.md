# Daily Vow 🙏

A focused and peaceful web application for organizing your commitment to life and building a consistent habit. Prayer Ledger replaces the chaos of scattered notes with a single, dedicated space for your spiritual journey.

![Daily Vow Demo](./public/demo.gif)

## The Problem It Solves

We all start new, positive habits with great intentions, but keeping them is hard. The problem isn't a lack of desire; it's **friction**. Tracking important personal goals on scattered notes, phone reminders, or just in our heads is disorganized and works against us. This friction is what causes good habits to fail.

Prayer Ledger was designed from the ground up to eliminate that friction by providing a simple, beautiful, and dedicated system to focus on what matters.

## ✨ Key Features

* ✅ **Secure User Authentication:** Private and secure user accounts with email & password login.
* 📊 **Home Dashboard:** An inspiring overview of your prayer journey with key stats like total commitments, answered count, and current streak.
* ✍️ **Full Prayer Management (CRUD):**
    * **Create:** Easily add new prayers with titles, details, and categories.
    * **Read:** View all active and answered prayers in clean, organized lists.
    * **Update:** Mark prayers as "answered" to celebrate and track your journey.
    * **Delete:** Remove prayers that are no longer needed.
* 👤 **Profile Management:** A dedicated page to securely change your password and manage your account.
* 📱 **Fully Responsive:** A seamless experience on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/) |
| **Backend** | [Supabase](https://supabase.io/) (PostgreSQL Database, Authentication, RLS)                                 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/)                                                                    |
| **Deployment**| [Vercel](https://vercel.com/)                                                                               |

## 🏗️ Core Architectural Principles

This project was built with a strong focus on professional development practices to ensure it is not only functional but also scalable, maintainable, and accessible.

#### 🎯 Strategic & Focused MVP
The project began with a deep analysis of the core user problem, leading to a focused Minimum Viable Product (MVP) scope. Every feature was intentionally chosen to solve the primary problem of "user friction" without adding unnecessary complexity.

#### 🧱 Clean & Maintainable Architecture
The codebase follows a strict **separation of concerns**.
* **UI Components (`/components`)** are distinct from **Routing & Pages (`/app`)**.
* **Business Logic & Database interactions (`/lib`)** are centralized, ensuring that the code is easy to read, debug, and scale in the future.

#### ♿ Accessibility as a Core Feature
Accessibility was not an afterthought. The application was built to be inclusive, following best practices such as:
* Semantic HTML.
* Proper use of `<label>` tags for all form inputs.
* Full keyboard navigability with clear focus indicators.

## 🚀 Live Demo

[**View the live application here!**](https://prayer-ledger.vercel.app/login)

## ⚙️ Getting Started (Local Setup)

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/prayer-ledger.git](https://github.com/your-username/prayer-ledger.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd prayer-ledger
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up your environment variables:**
    * Create a file named `.env.local` in the root of the project.
    * Add your Supabase Project URL and Anon Key to this file. You can find these in your Supabase project's API settings.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👤 Contact

Joshua Viera - [joshuaviera95@gmail.com](joshuaviera95@gmail.com)

Project Link: [https://github.com/JoshuaViera/prayer-ledger](https://github.com/JoshuaViera/prayer-ledger)

````