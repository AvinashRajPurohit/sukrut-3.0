"use client"
import { useState } from "react";
import ProcessStep from "./ProcessStep";

export default function ProcessTimeline({ steps }) {
  const [activeStep, setActiveStep] = useState(steps[1].id);

  return (
    <div className="relative mt-10">

      {/* LINE */}
      <div className="absolute top-2 left-0 right-0 h-px bg-gray-200" />

      {/* STEPS */}
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <ProcessStep
            key={step.id}
            step={step}
            active={activeStep === step.id}
            onClick={() => setActiveStep(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
