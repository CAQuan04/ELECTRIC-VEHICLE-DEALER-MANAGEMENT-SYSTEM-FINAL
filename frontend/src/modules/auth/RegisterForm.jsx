import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicRegistrationStep from './Steps/BasicRegistrationStep';
import EmailVerificationStep from './Steps/EmailVerificationStep';
import PersonalInfoStep from './Steps/PersonalInfoStepV2';
import UserSurveyStep from './Steps/UserSurveyStep';
import { AuthService } from '@utils';
import teslaModelSBg from '../../assets/tesla/2023-tesla-model-s-scaled.jpg';

const RegisterForm = () => {
  const navigate = useNavigate();
  const renderCount = useRef(0);
  
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

  renderCount.current += 1;
  
  console.log('RegisterForm render count:', renderCount.current, 'Current step:', currentStep);

  const handleBasicRegistration = async (basicData) => {
    console.log('RegisterForm - handleBasicRegistration called with:', basicData);
    setIsLoading(true);
    try {
      console.log('Calling AuthService.registerBasic...');
      const result = await AuthService.registerBasic(basicData);
      console.log('AuthService.registerBasic result:', result);
      if (result.success) {
        setFormData(prev => ({ ...prev, ...basicData, tempUserId: result.tempUserId }));
        setCurrentStep(2);
        setErrors({});
        console.log('Moving to step 2');
      } else {
        console.error('Registration failed:', result.error);
        setErrors({ general: result.error || 'Đăng ký thất bại' });
      }
    } catch (error) {
      console.error('Exception in handleBasicRegistration:', error);
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

  if (renderCount.current > 100) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Render Limit Exceeded</h1>
          <p className="mb-4">Component rendered {renderCount.current} times</p>
          <p className="mb-4 text-red-400">Current step: {currentStep}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%), url(${teslaModelSBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Card Container */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/98 border border-red-700/40 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-10 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-lg font-medium text-white tracking-tight" style={{ fontSize: '1.875rem' }}>
                  Register of Tesla EDVM
                </h1>
                <p className="text-xs text-white/80 mt-1 font-light" style={{ fontSize: '0.75rem' }}>
                  Join the future electric vehicle community
                </p>
              </div>
              <span className="text-xs text-white/90 bg-black/30 px-4 py-2 rounded-full border border-white/20 font-semibold">
                Step {currentStep}/4
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-10">
            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                {['Thông tin', 'Xác thực', 'Cá nhân', 'Khảo sát'].map((label, index) => (
                  <div 
                    key={index}
                    className={`flex-1 text-center text-xs font-semibold transition-all duration-300 ${
                      index + 1 === currentStep 
                        ? 'text-green-400' 
                        : index + 1 < currentStep 
                          ? 'text-green-500' 
                          : 'text-white/40'
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 h-1.5 rounded-full overflow-hidden bg-slate-700/30">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 transition-all duration-500 ease-out ${
                      step <= currentStep 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 scale-y-125' 
                        : 'bg-transparent'
                    }`}
                    style={{
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-700/20">
              {renderCurrentStep()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <span className="text-red-500 cursor-pointer underline hover:text-red-400 transition-colors">
              Điều khoản dịch vụ
            </span>
            {' '}và{' '}
            <span className="text-red-500 cursor-pointer underline hover:text-red-400 transition-colors">
              Chính sách bảo mật
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
