# Auth Components

This directory contains the authentication and registration components for the EVM system.

## Components Structure

### Main Components
- **MultiStepRegister.jsx** - Main multi-step registration controller
- **StepIndicator.jsx** - Visual step progress indicator

### Registration Steps
- **BasicRegistrationStep.jsx** - Basic registration form with username/fullName separation
- **PersonalInfoStepNew.jsx** - Personal information form with Vietnam address integration
- **UserSurveyStep.jsx** - User preferences and survey form
- **EmailVerificationStep.jsx** - Email verification with OTP

## Features

### 🔐 Authentication
- Multi-step registration flow
- Email verification with OTP
- User role selection (Customer/Dealer)
- Form validation and error handling

### 🎨 UI/UX
- Tesla-themed dark design
- Responsive mobile-first layout
- Smooth step transitions
- Progress indication

### 📝 Form Fields
- **Basic Info**: Username, Full Name, Email, Password
- **Personal Info**: Phone, Address, Date of Birth, City
- **Survey**: Vehicle preferences, budget, purchase timeline
- **Verification**: Email OTP confirmation

### 🌏 Vietnam Integration
- Province/City selection
- Ward/District address fields
- Phone number validation for VN format

## Usage

```jsx
import MultiStepRegister from './Auth/MultiStepRegister';

function App() {
  return (
    <MultiStepRegister
      onComplete={(userData) => {
        // Handle successful registration
        console.log('Registration completed:', userData);
      }}
      onCancel={() => {
        // Handle registration cancellation
      }}
    />
  );
}
```

## Step Flow

1. **Basic Registration** - Email, username, password, role selection
2. **Personal Information** - Contact details, address, personal info
3. **User Survey** - Preferences, interests, vehicle requirements
4. **Email Verification** - OTP confirmation
5. **Success** - Registration completion

## Styling

All components use Tailwind CSS with Tesla-inspired design:
- Dark theme with blue/red gradients
- Glassmorphism effects
- Smooth animations and transitions
- Responsive design patterns