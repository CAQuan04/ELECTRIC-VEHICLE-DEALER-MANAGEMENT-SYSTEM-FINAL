import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicRegistrationStep from './Steps/BasicRegistrationStep';
import EmailVerificationStep from './Steps/EmailVerificationStep';
import PersonalInfoStep from './Steps/PersonalInfoStepNew';
import UserSurveyStep from './Steps/UserSurveyStep';
import { AuthService } from '../../shared/utils/auth';
import teslaModelSBg from '../../assets/tesla/2023-tesla-model-s-scaled.jpg';

const MultiStepRegisterSimple = () => {
  const navigate = useNavigate();
  const renderCount = useRef(0);
  
  // Simple state without complex dependencies
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'customer',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    provinceId: '',
    provinceName: '',
    wardId: '',
    wardName: '',
    interestedVehicles: [],
    budgetRange: '',
    purchaseTimeframe: '',
    tempUserId: null,
    emailVerified: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Track render count
  renderCount.current += 1;

  // Prevent infinite renders by limiting to reasonable number
  useEffect(() => {
    if (renderCount.current > 10) {
      console.error('Too many renders detected, stopping...');
      return;
    }
  }, []);

  const handleBasicRegistration = async (basicData) => {
    setIsLoading(true);
    try {
      const result = await AuthService.registerBasic(basicData);
      if (result.success) {
        setFormData(prev => ({ 
          ...prev, 
          ...basicData,
          tempUserId: result.tempUserId 
        }));
        setCurrentStep(2);
        setErrors({});
      } else {
        setErrors({ general: result.error || 'Đăng ký thất bại' });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (verificationCode) => {
    setIsLoading(true);
    try {
      const result = await AuthService.verifyEmail({
        tempUserId: formData.tempUserId,
        verificationCode: verificationCode
      });
      
      if (result.success) {
        setFormData(prev => ({ ...prev, emailVerified: true }));
        setCurrentStep(3);
        setErrors({});
      } else {
        setErrors({ general: result.error || 'Mã xác thực không hợp lệ.' });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra khi xác thực email.' });
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
        setFormData(prev => ({ ...prev, ...personalData }));
        setCurrentStep(4);
        setErrors({});
      } else {
        setErrors({ general: result.error || 'Cập nhật thông tin thất bại.' });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra khi cập nhật thông tin.' });
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
        const user = {
          ...result.user,
          fullName: result.user.fullName || result.user.username || formData.fullName
        };
        navigate('/register/success', {
          state: { user, formData: { ...formData, ...surveyData } }
        });
      } else {
        setErrors({ general: result.error || 'Lưu khảo sát thất bại.' });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra khi lưu khảo sát.' });
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
        const user = {
          ...result.user,
          fullName: result.user.fullName || result.user.username || formData.fullName
        };
        navigate('/register/success', {
          state: { user, formData }
        });
      } else {
        setErrors({ general: result.error || 'Hoàn tất đăng ký thất bại.' });
      }
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra khi hoàn tất đăng ký.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    } else {
      navigate('/');
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicRegistrationStep
            formData={formData}
            onNext={handleBasicRegistration}
            onBack={handleBack}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <EmailVerificationStep
            email={formData.email}
            onVerify={handleEmailVerification}
            onBack={handleBack}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <PersonalInfoStep
            formData={formData}
            onSubmit={handlePersonalInfoSubmit}
            onUpdateData={updateFormData}
            onBack={handleBack}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <UserSurveyStep
            formData={formData}
            onSubmit={handleSurveySubmit}
            onSkip={handleSkipSurvey}
            onUpdateData={updateFormData}
            onBack={handleBack}
            errors={errors}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  // Don't render if too many renders
  if (renderCount.current > 10) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Render Limit Exceeded</h1>
          <p className="mb-4">Component rendered {renderCount.current} times</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${teslaModelSBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Card Container */}
        <div 
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            border: '2px solid rgba(220, 38, 38, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="px-8 py-6"
            style={{
              background: 'linear-gradient(to right, #dc2626, #b91c1c)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Đăng ký Tesla EVM</h1>
              <span className="text-sm text-red-200">#{renderCount.current}</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="text-center text-white mb-6">
              <h2 className="text-xl mb-2">Bước {currentStep}/4</h2>
            </div>

            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegisterSimple;