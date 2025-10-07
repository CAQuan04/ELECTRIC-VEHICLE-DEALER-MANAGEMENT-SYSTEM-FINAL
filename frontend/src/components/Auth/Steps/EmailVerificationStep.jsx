import React, { useState, useEffect } from 'react';

const EmailVerificationStep = ({ email, errors, isLoading, onVerify, onResendCode, onBack }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Start with 60 second countdown
    setCountdown(60);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationCode.trim().length === 6) {
      onVerify(verificationCode.trim());
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await onResendCode();
      setCountdown(60);
      setVerificationCode('');
    } catch (error) {
      console.error('Failed to resend code:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  return (
    <>
      {/* Header */}
      <div className="text-center px-4 pt-8 pb-8">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-light text-white mb-3 tracking-wide">
          Xác thực email
        </h1>
        <p className="text-gray-300 text-lg font-light">
          Chúng tôi đã gửi mã xác thực đến
        </p>
        <p className="text-blue-400 font-medium text-lg mt-2">
          {email}
        </p>
        <div className="mt-6 w-16 h-0.5 bg-green-600 mx-auto"></div>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Error Display */}
        {errors.verification && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.verification}</span>
            </div>
          </div>
        )}

        <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm space-y-8">
          {/* Verification Code Input */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-300 mb-6">
              Nhập mã xác thực 6 số
            </label>
            
            <div className="flex justify-center">
              <input
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                className="w-48 px-4 py-4 bg-gray-900/50 border-2 border-gray-600 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-500"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Mã có hiệu lực trong 10 phút
            </p>
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Không nhận được mã?
            </p>
            
            {countdown > 0 ? (
              <p className="text-gray-500">
                Gửi lại sau {countdown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
              >
                {isResending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  'Gửi lại mã'
                )}
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-blue-200 text-sm">
                <p className="font-medium mb-2">Hướng dẫn:</p>
                <ul className="space-y-1 text-blue-300">
                  <li>• Kiểm tra hộp thư đến và thư mục spam</li>
                  <li>• Mã gồm 6 chữ số</li>
                  <li>• Nếu không nhận được, hãy thử gửi lại</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex justify-center items-center py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Quay lại
          </button>
          
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="flex-1 flex justify-center items-center py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang xác thực...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Xác thực</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default EmailVerificationStep;