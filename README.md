# Daily Vow 🙏

Daily Vow is a focused web application designed to solve the core problem of prayer disorganization. It provides a centralized and frictionless system to help users maintain a consistent and organized prayer life.

## Project Structure & Quality Assurance

To ensure a high-quality and maintainable codebase, this project was built with the following principles in mind.

### Code Structure
The project follows a clear separation of concerns:
* **`/app`**: Handles all routing and page layouts, using Next.js App Router conventions. Route groups `(auth)` and `(main)` are used to apply different layouts for authentication and main app views.
* **`/components`**: Contains all reusable React components. UI primitives (buttons, inputs) are in `/ui`, while feature-specific components (profile forms) are organized into their own folders.
* **`/lib`**: Holds all utility functions, validation schemas, and the centralized Supabase client for database interactions.

### Testing Workflow
A consistent manual testing process was used to ensure reliability for critical user journeys:
1.  ✅ **New User Signup:** Create account -> Login -> Logout.
2.  ✅ **Prayer Management:** Add a new prayer -> Verify it appears on dashboard -> Update status to "answered" -> Verify it moves to the correct view.
3.  ✅ **Account Security:** Attempt an invalid password change -> Verify error message -> Successfully change password -> Log out and log back in with the new password.

---

## Problem & Solution

### The Problem
The project targets the measurable pain point of **habit-breaking friction** in personal spiritual practices. This friction is caused by disorganized, non-dedicated systems (notes apps, memory). The direct consequence is inconsistent engagement, which can be measured by the frequency and continuity of prayer entries.

### The Solution
Verity is designed to drastically reduce this friction by providing a specific, structured workflow for prayer management.

* **Data Inputs:** Users input a `title`, `details`, `category`, and `priority` for each prayer.
* **Core Logic:** The app provides user-facing analytics on the home dashboard, calculating key metrics like `Total Prayers`, `Answered Count`, and `Current Streak` to motivate continued engagement.
* **User Journey:** The workflow is seamless: A user logs in, views their dashboard stats, adds a new prayer via a structured form, sees it in their "active" list, and finally updates its status, which automatically moves it to a separate "answered" celebration view.

---