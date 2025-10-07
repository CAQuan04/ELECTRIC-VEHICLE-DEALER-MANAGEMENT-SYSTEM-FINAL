import React, { useState, useEffect } from 'react';

const EmailVerificationStep = ({ email, onSubmit, onBack, onResendCode }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError('');

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã xác thực');
      return;
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(verificationCode);
      }
    } catch (error) {
      setError('Mã xác thực không đúng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(60);
    setError('');
    
    try {
      if (onResendCode) {
        await onResendCode();
      }
    } catch (error) {
      setError('Không thể gửi lại mã. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">
          Xác thực Email
        </h2>
        <p className="text-gray-400 mb-2">
          Chúng tôi đã gửi mã xác thực 6 số đến
        </p>
        <p className="text-blue-400 font-semibold">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
            Nhập mã xác thực
          </label>
          <div className="flex justify-center space-x-3">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-xl font-bold bg-gray-900/50 border-2 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  error ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="0"
              />
            ))}
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
          )}
        </div>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">
            Không nhận được mã?
          </p>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm underline"
            >
              Gửi lại mã xác thực
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Gửi lại sau {resendTimer}s
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || code.join('').length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Đang xác thực...
            </div>
          ) : (
            'Xác thực'
          )}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Quay lại
        </button>

        {/* Help Text */}
        <div className="text-center pt-4">
          <p className="text-gray-500 text-xs">
            Kiểm tra hộp thư spam nếu bạn không thấy email
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmailVerificationStep;
