import React from 'react';

const StepIndicator = ({ currentStep, steps, stepNames, completedSteps = [] }) => {
  const stepArray = Object.values(steps);
  const totalSteps = stepArray.length;

  const getStepStatus = (step) => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    if (step < currentStep) return 'completed';
    return 'upcoming';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') {
      return (
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (status === 'current') {
      return (
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
      );
    }
    
    return (
      <span className="text-gray-400 text-sm font-medium">{step}</span>
    );
  };

  const getStepClasses = (status) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 border-green-500`;
      case 'current':
        return `${baseClasses} bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/30`;
      default:
        return `${baseClasses} bg-gray-700 border-gray-600`;
    }
  };

  const getConnectorClasses = (step) => {
    const isCompleted = step < currentStep || completedSteps.includes(step);
    return `flex-1 h-0.5 mx-4 transition-all duration-300 ${
      isCompleted ? 'bg-green-500' : 'bg-gray-600'
    }`;
  };

  return (
    <div className="px-8 py-6 border-b border-gray-700/30">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {stepArray.map((step, index) => {
          const status = getStepStatus(step);
          const isLast = index === stepArray.length - 1;
          
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={getStepClasses(status)}>
                  {getStepIcon(step, status)}
                </div>
                
                {/* Step Label */}
                <span className={`mt-2 text-xs font-medium transition-colors duration-200 ${
                  status === 'current' 
                    ? 'text-blue-400' 
                    : status === 'completed' 
                      ? 'text-green-400' 
                      : 'text-gray-500'
                }`}>
                  {stepNames[step]}
                </span>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div className={getConnectorClasses(step)}></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Bước {currentStep} / {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% hoàn thành</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;