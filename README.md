🚀 CareerCoach AI 2.0

Master the interview, starting with your resume. CareerCoach AI is a comprehensive full-stack application designed to help job seekers bypass Applicant Tracking Systems (ATS) and ace their behavioral interviews using AI-driven feedback.

✨ Key Features

Resume ATS Scoring: Upload a resume to receive an instant match score against target job descriptions, along with actionable, missing keyword suggestions.

AI Mock Interviews: Dynamic practice sessions that generate tailored questions based on the uploaded resume and evaluate responses using the STAR method.

Premium UI/UX: Fully responsive, highly animated interface built with Framer Motion, featuring a seamless, flash-free Dark/Light mode toggle.

Robust Backend Architecture: Engineered for scale using JWT authentication, atomic transactions, and idempotency keys to ensure secure and reliable data handling.

💻 Tech Stack

Frontend:

React.js

Tailwind CSS

Framer Motion (Animations)

React Router (Navigation)

Backend:

Node.js

Express.js

MongoDB (Aggregation framework)

JWT (JSON Web Tokens)

🚢 Deployment Architecture

This application utilizes a decoupled, modern cloud deployment strategy to ensure maximum performance, scalability, and developer velocity.

Frontend (Vercel): The React frontend is deployed on Vercel. This leverages Vercel's global Edge Network (CDN) for blazing-fast asset delivery, highly optimized routing, and zero-configuration CI/CD pipeline directly from GitHub.

Backend (Render): The Node.js/Express REST API is hosted as a web service on Render. This provides a robust, "always-on" server environment necessary for handling heavy AI API requests, document parsing, and persistent MongoDB connections without the timeout limits of serverless architecture.

Database (MongoDB Atlas): A fully managed cloud database handling structured candidate profiles and auth schemas safely outside the compute instances.