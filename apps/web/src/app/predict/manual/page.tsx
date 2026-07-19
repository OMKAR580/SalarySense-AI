"use client";

import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { StepProgress } from "@/features/prediction/components/form";
import { usePredictionWorkflow } from "@/features/prediction/hooks";
import { usePredictionRouting } from "@/features/prediction/hooks/usePredictionRouting";
import { 
  AIInsightPanel,
  FormNavigation,
  ManualEntryHero,
  SidebarInfoPanel,
  StepEducation,
  StepProfessional,
  StepReview,
  StepSalary} from "@/features/prediction/sections/manual-entry";
import { usePredictionStore } from "@/features/prediction/store";
import { PredictionMethodType } from "@/features/prediction/types";

const STEPS = ["Professional", "Education", "Salary", "Review"];

export default function ManualEntryPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // 1. Initialize routing hook (automatically redirects on SUCCESS)
  usePredictionRouting();

  // 2. Consume store actions & state
  const session = usePredictionStore(state => state.session);
  const initializeSession = usePredictionStore(state => state.initializeSession);
  const setManualPayload = usePredictionStore(state => state.setManualPayload);
  const resetSession = usePredictionStore(state => state.resetSession);

  React.useEffect(() => {
    resetSession();
    initializeSession(PredictionMethodType.MANUAL);
  }, [resetSession, initializeSession]);

  const { register, handleSubmit, trigger, formState: { errors, isValid }, watch } = useForm({
    mode: "onChange"
  });

  const formValues = watch(); // Gets all current values for the Review step

  // Define which fields need to be validated for each step
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["role", "experience", "employmentType", "workMode", "location"];
      case 1: return ["education", "specialization", "primarySkills"];
      case 2: return ["currentSalary", "expectedSalary", "industry", "careerLevel"];
      default: return [];
    }
  };

  const handleNext = async () => {
    // Validate current step fields before proceeding
    const fields = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fields as any);
    
    if (isStepValid && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const { startPrediction } = usePredictionWorkflow();

  const onSubmitForm = async (data: any) => {
    console.log("Form submitted for manual prediction!", data);
    
    // Initialize session state
    initializeSession(PredictionMethodType.MANUAL);
    setManualPayload(data);
    
    // Fire real prediction workflow (hands off to execution controller and api client)
    await startPrediction();
  };

  return (
    <div className="w-full flex flex-col pb-24 max-w-6xl mx-auto">
      <ManualEntryHero />
      
      <div className="w-full max-w-4xl mx-auto mb-8 px-4 md:px-0">
        <StepProgress steps={STEPS} currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* Left Column: Form Area */}
        <div className="lg:col-span-2">
          <form className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />
            
            {session.error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex flex-col gap-1">
                <span className="font-semibold text-red-300">Prediction Failed</span>
                <span>{session.error}</span>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {currentStep === 0 && <StepProfessional key="step0" register={register} errors={errors} />}
              {currentStep === 1 && <StepEducation key="step1" register={register} errors={errors} />}
              {currentStep === 2 && <StepSalary key="step2" register={register} errors={errors} watch={watch} />}
              {currentStep === 3 && <StepReview key="step3" data={formValues} setStep={setCurrentStep} />}
            </AnimatePresence>

            <FormNavigation 
              currentStep={currentStep} 
              totalSteps={STEPS.length}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={handleSubmit(onSubmitForm)}
              isValid={currentStep === 3 ? true : isValid}
            />
          </form>
        </div>

        {/* Right Column: Information Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <SidebarInfoPanel />
            <AIInsightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
