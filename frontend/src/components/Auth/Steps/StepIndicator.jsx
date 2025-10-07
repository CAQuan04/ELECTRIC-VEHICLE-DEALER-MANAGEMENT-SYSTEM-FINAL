import React from 'react';

const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div key={index} className="flex flex-col items-center relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110'
                      : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>

                <div className="mt-3 text-center">
                  <div
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-blue-400'
                        : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-12 w-20 h-0.5 transition-colors duration-500 ${
                      stepNumber < currentStep
                        ? 'bg-gradient-to-r from-green-500 to-blue-500'
                        : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
            }}
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-gray-400">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
