LiveView - Blog Application
LiveView is a blog application built with Next.js and Firebase, allowing users to create, view, like, and manage blog posts. Users can sign up or log in through email and Google authentication. The project uses modern technologies to provide a clean and responsive user experience, including Firebase Firestore for storing posts and user data, and Firebase Storage for handling image uploads.

Features
Authentication: Users can register or log in with email/password or Google.

Create Posts: Authenticated users can create new blog posts with optional image uploads.

Real-Time Updates: Blog posts and likes are updated in real-time using Firebase Firestore's onSnapshot.

Like Posts: Users can like posts, and the likes will be updated immediately in the UI.

Favorites Section: Liked posts are automatically added to the user's Favorites section.

Responsive Design: The application adapts seamlessly to different screen sizes.

Authorization: Only authenticated users can create and like posts.

Technologies Used

Frontend
Next.js: The React framework for building fast, user-friendly, server-rendered web applications.
React: For building the interactive UI components.
Tailwind CSS: A utility-first CSS framework for styling the application with ease and flexibility.
TypeScript: For static type-checking and a better developer experience.
React Hook Form: For form management, validation, and easy integration of forms.
Zod: Used for schema-based validation in forms.

Backend & Database
Firebase:
Firebase Authentication: For managing user authentication (with email/password and Google).
Firebase Firestore: For storing and retrieving blog posts and user data in real time.
Firebase Storage: For handling image uploads for blog posts.

Other Tools
Vercel: For deployment and hosting the application.
ESLint: To ensure consistent code style and catch errors early.
Prettier: For automatically formatting the codebase.
