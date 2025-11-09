// Auth Module - Barrel Export
export { default as AuthComponent } from './AuthComponent';
export { 
    default as RoleGuard,
    AdminGuard,
    DealerGuard,
    CustomerGuard,
    StaffGuard,  // Add this line
    DealerShopGuard,
    AccessDenied
} from './RoleGuard';
export { default as MultiStepRegister } from './MultiStepRegister';
export { default as MultiStepRegisterSimple } from './MultiStepRegisterSimple';
export { default as RegisterForm } from './RegisterForm';

// Steps
export { default as BasicRegistrationStep } from './Steps/BasicRegistrationStep';
export { default as EmailVerificationStep } from './Steps/EmailVerificationStep';
export { default as PersonalInfoStepNew } from './Steps/PersonalInfoStepNew';
export { default as PersonalInfoStepV2 } from './Steps/PersonalInfoStepV2';
export { default as StepIndicator } from './Steps/StepIndicator';
export { default as UserSurveyStep } from './Steps/UserSurveyStep';

// Re-export for backward compatibility
import AuthComponent from './AuthComponent';
export default AuthComponent;
