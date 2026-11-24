#  BookNook – A Small Online Library

**BookNook** is a small online library management web application where readers can explore books, add their own books, borrow books for a few days, and return them when finished.

The platform provides a simple and user-friendly experience for managing books and borrowing activities. Whether you want to share a book with others or discover something new to read, BookNook makes it easy.

 **Live Website:** [https://booknook-rouge.vercel.app]

---

##  Features

- **Browse Books:** Explore a collection of books with their images, titles, authors, and categories.
- **New Arrivals:** Discover the latest six books added to the library.
- **User Authentication:** Register and log in securely using email and password or Google authentication.
- **Add Books:** Logged-in users can add new books with images, descriptions, categories, and available copies.
- **Book Management:** Users can edit or delete the books they have added.
- **Book Details:** View complete information about each book, including its author, description, and contributor.
- **Borrow Books:** Borrow available books for a limited period through a simple borrowing process.
- **My Books:** Manage all the books you have contributed to the library.
- **My Borrows:** View borrowed books, check borrowing and return dates, and return books.
- **Available Copies:** Automatically update the available book copies whenever a book is borrowed or returned.
- **Duplicate Borrow Protection:** Prevent users from borrowing the same book multiple times simultaneously.
- **Responsive Design:** Enjoy a consistent experience across desktop, tablet, and mobile devices.
- **Custom 404 Page:** A personalized not-found page with a button to return to the homepage.
- **Toast Notifications:** Get instant feedback for successful actions and errors.

---

## 🛠️ Technologies Used

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- HeroUI
- React Hot Toast

### Authentication
- Better Auth
- MongoDB Adapter
- JWT (JSON Web Token)

### Backend
- Node.js
- Express.js
- JavaScript
- MongoDB
- MongoDB Native Driver

### Other Tools
- Git & GitHub
- imgbb (Book Image Hosting)
- Vercel  (Deployment)

##  Main Pages & Functionality

| Page | Access | Description |
|---|---|---|
| Home | Public | Banner slider, new arrivals, and additional sections |
| All Books | Public | Browse all available books |
| Book Details | Private | View book information and borrow books |
| Add Book | Private | Add a new book to the library |
| My Books | Private | Edit and delete contributed books |
| My Borrows | Private | View and return borrowed books |
| Login | Public | Sign in using email/password or Google |
| Register | Public | Create a new account |
| My Profile | Private | View user profile information |
| 404 Page | Public | Custom page for unavailable routes |

---

##  Authentication & Security

- User registration with name, email, photo URL, and password.
- Password validation requiring at least one uppercase letter, one lowercase letter, and a minimum of six characters.
- Email and password authentication using Better Auth.
- Google social authentication.
- MongoDB Adapter for authentication data storage.
- JWT-based API authentication and authorization.
- Protected routes for authenticated users.
- Redirect users to their originally requested private route after login.

---

##  Borrowing System

BookNook provides a simple borrowing and returning system.

1. Users can view book details and check available copies.
2. Authenticated users can borrow an available book.
3. Borrowing information is stored in the MongoDB `borrows` collection.
4. Available copies decrease automatically when a book is borrowed.
5. Users cannot borrow the same book twice simultaneously.
6. Users can view their borrowed books from the My Borrows page.
7. When a book is returned, the available copies increase automatically.

---

##  Server API Endpoints

The Express.js backend provides the following REST API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a single book |
| POST | `/books` | Add a new book |
| PATCH | `/books/:id` | Update book information |
| DELETE | `/books/:id` | Delete a book |
| POST | `/borrows` | Borrow a book |
| GET | `/borrows` | Get borrowed books of the logged-in user |
| DELETE | `/borrows/:id` | Return a borrowed book |

---

##  Project Goal

The main goal of BookNook is to create a simple online library where users can share books, explore new reading materials, and manage their borrowing activities.

This project also demonstrates practical implementation of modern web development concepts, including authentication, authorization, REST APIs, database operations, CRUD functionality, and full-stack application development.

---
