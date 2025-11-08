# Implementation Plan

- [x] 1. Set up backend authentication infrastructure


  - Install required npm packages (bcrypt, jsonwebtoken) in the server directory
  - Create password utility functions for hashing and comparison
  - Create JWT utility functions for token generation and verification
  - Update database schema to add name and updated_at columns to users table
  - _Requirements: 5.4, 5.8, 6.1, 6.3_



- [ ] 2. Implement backend authentication routes
  - [ ] 2.1 Create authentication routes file (server/routes/auth.js)
    - Implement POST /api/users/register endpoint with email uniqueness check
    - Implement POST /api/users/login endpoint with credential verification
    - Add input validation for all fields


    - Implement proper error responses (400, 401, 500)
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 2.2, 2.3, 2.4, 2.6, 3.2, 3.3, 3.4, 3.8_

  - [x] 2.2 Create authentication middleware (server/middleware/auth.js)


    - Implement JWT token verification middleware
    - Extract and validate Authorization header
    - Attach decoded user info to request object
    - _Requirements: 5.8, 5.9_

  - [ ] 2.3 Integrate authentication routes into server.js
    - Import and mount authentication routes
    - Add middleware to existing protected routes (resumes endpoints)
    - Update environment variables configuration
    - _Requirements: 5.1, 5.5_

- [ ] 3. Create frontend authentication pages
  - [x] 3.1 Implement Home Page component (src/pages/HomePage.tsx)


    - Create header with app name and navigation buttons
    - Add hero section with tagline
    - Implement "Get Started" CTA button that navigates to /login
    - Apply responsive Tailwind CSS styling with gradient background
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 3.2 Implement Signup Page component (src/pages/SignupPage.tsx)


    - Create form with Name, Email, Password, and Confirm Password fields
    - Implement client-side validation (email format, password match, required fields)
    - Add form submission handler that calls POST /api/users/register
    - Display success toast and redirect to /login on successful registration
    - Display error toast on registration failure
    - Add link to login page for existing users
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.7, 2.8, 7.3_



  - [x] 3.3 Implement Login Page component (src/pages/LoginPage.tsx)


    - Create form with Email and Password fields
    - Add form submission handler that calls POST /api/users/login
    - Store JWT token in sessionStorage on successful login
    - Store user object in sessionStorage on successful login
    - Redirect to /dashboard on successful login
    - Display error toast on login failure


    - Add link to signup page for new users
    - _Requirements: 3.1, 3.2, 3.5, 3.6, 3.7, 3.9, 7.2_

- [x] 4. Implement protected route functionality



  - [ ] 4.1 Create ProtectedRoute component (src/components/ProtectedRoute.tsx)
    - Check for authToken in sessionStorage
    - Redirect to /login if no token exists
    - Render children components if token exists
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 4.2 Create authentication utility functions (src/utils/auth.ts)
    - Implement getAuthToken() helper
    - Implement getUser() helper
    - Implement isAuthenticated() helper
    - Implement logout() helper
    - _Requirements: 4.1, 4.4, 4.6_

- [ ] 5. Update Dashboard with authentication features
  - [ ] 5.1 Modify DashboardPage component
    - Wrap with ProtectedRoute component
    - Display logged-in user's name from sessionStorage
    - Add logout button in header
    - Implement logout functionality that clears sessionStorage and redirects to home
    - Update resume fetching to use authenticated user ID
    - Add Authorization header to API calls
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ] 5.2 Update existing resume API calls
    - Modify resume creation to associate with authenticated user


    - Update resume fetching to filter by user ID
    - Add JWT token to all resume API request headers
    - _Requirements: 4.5_




- [ ] 6. Update App routing and navigation
  - [ ] 6.1 Update App.tsx with new routes
    - Add route for HomePage at /
    - Add route for LoginPage at /login
    - Add route for SignupPage at /signup
    - Wrap Dashboard route with ProtectedRoute
    - Wrap Editor route with ProtectedRoute
    - Wrap Preview route with ProtectedRoute
    - _Requirements: 7.1, 7.2, 7.3_



  - [ ] 6.2 Implement redirect logic for authenticated users
    - Redirect authenticated users from / to /dashboard
    - Redirect authenticated users from /login to /dashboard
    - Redirect authenticated users from /signup to /dashboard
    - _Requirements: 7.4, 7.5_

- [ ] 7. Configure environment and dependencies
  - [ ] 7.1 Update package.json and install dependencies
    - Add bcrypt and jsonwebtoken to server dependencies
    - Run npm install in server directory
    - _Requirements: 5.4, 5.8_

  - [ ] 7.2 Configure environment variables
    - Add JWT_SECRET to .env file
    - Add JWT_EXPIRES_IN to .env file
    - Document required environment variables
    - _Requirements: 5.8, 5.10_

  - [ ] 7.3 Update database schema
    - Run migration to add name column to users table
    - Run migration to add updated_at column to users table
    - Verify foreign key relationship between resumes and users
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 8. Testing and validation
  - [ ]* 8.1 Test authentication flow end-to-end
    - Test user registration with valid data
    - Test registration with duplicate email (should fail)
    - Test login with valid credentials
    - Test login with invalid credentials (should fail)
    - Test protected route access with token
    - Test protected route access without token (should redirect)
    - Test session persistence across page refresh
    - Test logout functionality
    - _Requirements: All_

  - [ ]* 8.2 Test responsive design
    - Verify home page layout on mobile and desktop
    - Verify login page layout on mobile and desktop
    - Verify signup page layout on mobile and desktop
    - Verify dashboard updates display correctly
    - _Requirements: 1.4, 1.5_

  - [ ]* 8.3 Test error handling
    - Verify form validation errors display correctly
    - Verify API error messages display in toasts
    - Verify network error handling
    - Verify invalid token handling
    - _Requirements: 2.6, 2.7, 2.8, 3.8, 3.9_
