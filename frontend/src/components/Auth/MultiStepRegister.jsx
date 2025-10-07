import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicRegistrationStep from './Steps/BasicRegistrationStep';
import EmailVerificationStep from './Steps/EmailVerificationStep';
import PersonalInfoStep from './Steps/PersonalInfoStepNew';
import UserSurveyStep from './Steps/UserSurveyStep';
import StepIndicator from './Steps/StepIndicator';
import { AuthService } from '../../services/auth';
import teslaModelSBg from '../../assets/tesla/2023-tesla-model-s-scaled.jpg';

const STEPS = {
  BASIC_INFO: 1,
  EMAIL_VERIFICATION: 2,
  PERSONAL_INFO: 3,
  USER_SURVEY: 4
};

const STEP_NAMES = {
  [STEPS.BASIC_INFO]: 'Thông tin cơ bản',
  [STEPS.EMAIL_VERIFICATION]: 'Xác thực email',
  [STEPS.PERSONAL_INFO]: 'Thông tin cá nhân',
  [STEPS.USER_SURVEY]: 'Khảo sát nhu cầu'
};

const MultiStepRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.initialData || {};
  const editMode = location.state?.editMode || false;
  const targetStep = location.state?.targetStep || STEPS.BASIC_INFO;
  const returnToSuccess = location.state?.returnToSuccess || false;

  const [currentStep, setCurrentStep] = useState(editMode ? targetStep : STEPS.BASIC_INFO);
  const [formData, setFormData] = useState({
    // Basic info
    email: initialData.email || '',
    password: initialData.password || '',
    confirmPassword: '',
    fullName: initialData.fullName || initialData.username || '',
    role: 'customer',
    
    // Personal info
    phone: initialData.phone || '',
    dateOfBirth: initialData.dateOfBirth || '',
    gender: initialData.gender || '',
    address: initialData.address || '',
    provinceId: initialData.provinceId || '',
    provinceName: initialData.provinceName || '',
    wardId: initialData.wardId || '',
    wardName: initialData.wardName || '',
    
    // Survey info
    interestedVehicles: initialData.interestedVehicles || [],
    budgetRange: initialData.budgetRange || '',
    purchaseTimeframe: initialData.purchaseTimeframe || '',
    
    // System fields
    tempUserId: initialData.tempUserId || null,
    emailVerified: false,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update form data helper
  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setStepErrors = (stepErrors) => {
    setErrors(stepErrors);
  };

  const goToNextStep = () => {
    if (currentStep < Object.keys(STEPS).length) {
      setCurrentStep(prev => prev + 1);
      clearErrors();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      clearErrors();
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    clearErrors();
  };

  const handleBasicRegistration = async (basicData) => {
    setIsLoading(true);
    try {
      // Check if we're in edit mode and should return to success
      if (returnToSuccess) {
        // Normalize the user data to ensure fullName is available
        const normalizedUser = {
          ...initialData, 
          ...basicData,
          fullName: basicData.fullName || basicData.username || initialData.fullName || initialData.username
        };
        // Just update the data and return to success page
        navigate('/register/success', {
          state: {
            user: normalizedUser,
            formData: { ...formData, ...basicData }
          }
        });
        return;
      }

      const result = await AuthService.registerBasic(basicData);
      if (result.success) {
        updateFormData({ 
          tempUserId: result.tempUserId,
          email: basicData.email,
          fullName: basicData.fullName,
          role: basicData.role
        });
        goToNextStep(); // Go to email verification
      } else {
        setStepErrors({ general: result.error || 'Đăng ký thất bại. Vui lòng thử lại.' });
      }
    } catch (error) {
      setStepErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (verificationCode) => {
    setIsLoading(true);
    try {
      // Check if we're in edit mode and should return to success
      if (returnToSuccess) {
        // Normalize the user data to ensure fullName is available
        const normalizedUser = {
          ...initialData,
          fullName: initialData.fullName || initialData.username || formData.fullName || formData.username
        };
        // Email verification in edit mode - just return to success page
        navigate('/register/success', {
          state: {
            user: normalizedUser,
            formData: formData
          }
        });
        return;
      }

      const result = await AuthService.verifyEmail({
        tempUserId: formData.tempUserId,
        verificationCode: verificationCode
      });
      
      if (result.success) {
        updateFormData({ emailVerified: true });
        goToNextStep(); // Go to personal info
      } else {
        setStepErrors({ general: result.error || 'Mã xác thực không hợp lệ.' });
      }
    } catch (error) {
      setStepErrors({ general: 'Có lỗi xảy ra khi xác thực email.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (personalData) => {
    setIsLoading(true);
    try {
      const result = await AuthService.updatePersonalInfo({
        tempUserId: formData.tempUserId,
        ...personalData
      });
      
      if (result.success) {
        updateFormData(personalData);
        
        // Check if we need to return to success page
        if (returnToSuccess) {
          // Normalize the user data to ensure fullName is available
          const normalizedUser = {
            ...initialData, 
            ...personalData,
            fullName: initialData.fullName || initialData.username || personalData.fullName || personalData.username
          };
          // Return directly to success page with updated data
          navigate('/register/success', {
            state: {
              user: normalizedUser,
              formData: { ...formData, ...personalData }
            }
          });
        } else {
          goToNextStep(); // Go to survey
        }
      } else {
        setStepErrors({ general: result.error || 'Cập nhật thông tin thất bại.' });
      }
    } catch (error) {
      setStepErrors({ general: 'Có lỗi xảy ra khi cập nhật thông tin.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurveySubmit = async (surveyData) => {
    setIsLoading(true);
    try {
      const result = await AuthService.completeSurvey({
        tempUserId: formData.tempUserId,
        ...surveyData
      });
      
      if (result.success) {
        // Check if we need to return to success page
        if (returnToSuccess) {
          // Normalize the user data to ensure fullName is available
          const normalizedUser = {
            ...initialData, 
            ...surveyData,
            fullName: initialData.fullName || initialData.username || surveyData.fullName || surveyData.username
          };
          // Return directly to success page with updated data
          navigate('/register/success', {
            state: {
              user: normalizedUser,
              formData: { ...formData, ...surveyData }
            }
          });
        } else {
          // Normalize the user data to ensure fullName is available
          const normalizedUser = {
            ...result.user,
            fullName: result.user.fullName || result.user.username || result.user.name || formData.fullName || formData.username
          };
          // Registration complete, redirect to success page
          navigate('/register/success', {
            state: {
              user: normalizedUser,
              formData: formData,
              canSkip: false
            }
          });
        }
      } else {
        setStepErrors({ general: result.error || 'Lưu khảo sát thất bại.' });
      }
    } catch (error) {
      setStepErrors({ general: 'Có lỗi xảy ra khi lưu khảo sát.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSurvey = async () => {
    setIsLoading(true);
    try {
      const result = await AuthService.completeRegistration({
        tempUserId: formData.tempUserId
      });
      
      if (result.success) {
        // Normalize the user data to ensure fullName is available
        const normalizedUser = {
          ...result.user,
          fullName: result.user.fullName || result.user.username || result.user.name || formData.fullName || formData.username
        };
        navigate('/register/success', {
          state: {
            user: normalizedUser,
            formData: formData,
            canSkip: false
          }
        });
      } else {
        setStepErrors({ general: result.error || 'Hoàn tất đăng ký thất bại.' });
      }
    } catch (error) {
      setStepErrors({ general: 'Có lỗi xảy ra khi hoàn tất đăng ký.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return (
          <BasicRegistrationStep
            formData={formData}
            onSubmit={handleBasicRegistration}
            onUpdateData={updateFormData}
            onBack={() => navigate('/login')}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case STEPS.EMAIL_VERIFICATION:
        return (
          <EmailVerificationStep
            email={formData.email}
            onVerify={handleEmailVerification}
            onBack={goToPrevStep}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case STEPS.PERSONAL_INFO:
        return (
          <PersonalInfoStep
            formData={formData}
            onSubmit={handlePersonalInfoSubmit}
            onUpdateData={updateFormData}
            onBack={goToPrevStep}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case STEPS.USER_SURVEY:
        return (
          <UserSurveyStep
            formData={formData}
            onSubmit={handleSurveySubmit}
            onSkip={handleSkipSurvey}
            onUpdateData={updateFormData}
            onBack={goToPrevStep}
            errors={errors}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${teslaModelSBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-red-100 text-sm">Join the future of electric vehicles</p>
                </div>
              </div>
              {editMode && (
                <div className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-400/30">
                  <span className="text-blue-200 text-sm font-medium">Chế độ chỉnh sửa</span>
                </div>
              )}
            </div>
          </div>

          {/* Step Indicator */}
          <div className="px-8 py-6 bg-gray-800/50 border-b border-gray-700/30">
            <StepIndicator 
              steps={STEPS}
              stepNames={STEP_NAMES}
              currentStep={currentStep}
              onStepClick={goToStep}
            />
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegister;