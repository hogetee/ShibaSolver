# Edit Profile Button Implementation

## Overview
This implementation adds an "Edit Profile" button that appears only when a user visits their own profile page. The button navigates to the edit profile page at `/user/edit`.

## Files Created/Modified

### 1. New Hook: `useCurrentUser.ts`
- **Location**: `src/hooks/useCurrentUser.ts`
- **Purpose**: Fetches the current authenticated user from `/api/v1/auth/me`
- **Features**:
  - Supports both mock and real API modes
  - Handles loading states and errors
  - Returns current user data including username for comparison

### 2. New Component: `EditProfileButton.tsx`
- **Location**: `src/components/profile/profile_header/EditProfileButton.tsx`
- **Purpose**: Renders the edit profile button with proper styling
- **Features**:
  - Uses Material-UI Edit icon
  - Navigates to `/user/edit` when clicked
  - Responsive design with hover effects

### 3. Modified: `ProfileHeader.tsx`
- **Location**: `src/components/profile/profile_header/ProfileHeader.tsx`
- **Changes**:
  - Added `useCurrentUser` hook to get current user data
  - Added logic to compare current user with profile user
  - Conditionally renders edit button only for own profile
  - Button appears below the bio section

## How It Works

1. **Authentication Check**: The `useCurrentUser` hook calls `/api/v1/auth/me` to get the current authenticated user
2. **Profile Comparison**: Compares the current user's username with the profile being viewed
3. **Conditional Rendering**: Shows the edit button only when `currentUser.user_name === dummyUser.username`
4. **Navigation**: Clicking the button navigates to `/user/edit`

## API Endpoint
- **URL**: `http://localhost:5003/api/v1/auth/me`
- **Method**: GET
- **Authentication**: Uses cookies (credentials: "include")
- **Response**: Returns current user data including `user_name` field

## Testing

### Manual Testing Steps:
1. Start the development server: `npm run dev`
2. Navigate to a user profile page (e.g., `/user/johndoe`)
3. If you're logged in as the same user, you should see the "Edit Profile" button
4. If viewing someone else's profile, the button should not appear
5. Click the button to verify it navigates to `/user/edit`
6. **NEW**: The edit profile page should now load with your current information pre-filled

### Mock Mode Testing:
- Set `NEXT_PUBLIC_USE_MOCK=1` in your environment
- The hook will return mock data with username "johndoe"
- Visit `/user/johndoe` to see the edit button
- Click edit to see the form pre-filled with mock data

### Real API Testing:
- Ensure your backend is running on `http://localhost:5003`
- Make sure the `/api/v1/auth/me` endpoint is implemented
- Login with a user account and visit your own profile
- Click edit to see your real data pre-filled in the form

## New Features Added

### Pre-filled Edit Form
- **Location**: `src/pages/EditProfilePage.tsx` and `src/components/edit_profile/ProfileForm.jsx`
- **Purpose**: Loads current user data into the edit form
- **Features**:
  - Fetches current user data using `useCurrentUser` hook
  - Maps backend user data to form fields
  - Handles loading and error states
  - Pre-fills all form fields with current user information
  - Updates form when user data changes

### Form Field Mapping
- **Username**: Maps from `user_name`
- **Display Name**: Maps from `display_name`
- **Bio**: Maps from `bio` field
- **Education Level**: Maps from `education_level`
- **Subjects**: Maps from `interested_subjects` array
- **Profile Picture**: Maps from `profile_picture` URL

## Styling
The edit button uses:
- Dark background (`bg-dark-900`) with light text
- Hover effect (`hover:bg-dark-800`)
- Material-UI Edit icon
- Responsive padding and rounded corners
- Positioned below the bio section with top margin

## Dependencies
- `@mui/icons-material` (already installed)
- `next/navigation` for routing
- React hooks for state management
