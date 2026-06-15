"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const quizQuestions = [
  {
    id: "transport_mode",
    question: "What is your primary mode of transportation?",
    type: "select",
    options: ["car", "public_transport", "bike", "walk", "motorcycle"],
    category: "transport"
  },
  {
    id: "commute_distance",
    question: "Average daily commute distance (km)?",
    type: "number",
    category: "transport"
  },
  {
    id: "meat_frequency",
    question: "How often do you eat meat?",
    type: "select",
    options: ["daily", "few_times_week", "weekly", "rarely", "never"],
    category: "food"
  },
  {
    id: "home_size",
    question: "What is your home size?",
    type: "select",
    options: ["small", "medium", "large"],
    category: "energy"
  },
  {
    id: "household_size",
    question: "How many people live in your household?",
    type: "number",
    category: "energy"
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQuestion = quizQuestions[currentStep];
  const isLastQuestion = currentStep === quizQuestions.length - 1;

  const handleAnswer = (value: string) => {
    setResponses({ ...responses, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error("Quiz submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Your Carbon Footprint</CardTitle>
            <CardDescription className="text-center">
              Here's your baseline assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {result.carbonScore}
              </div>
              <div className="text-gray-600">Carbon Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{result.baselineEmissions} kg</div>
                <div className="text-sm text-gray-600">Daily Emissions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{result.comparison.percentile}%</div>
                <div className="text-sm text-gray-600">Better than average</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Breakdown by Category</h3>
              <div className="space-y-2">
                {Object.entries(result.breakdown).map(([category, value]: [string, any]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize">{category}</span>
                    <span className="font-semibold">{value} kg CO₂</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Lifestyle Assessment</CardTitle>
          <CardDescription>
            Question {currentStep + 1} of {quizQuestions.length}
          </CardDescription>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
            
            {currentQuestion.type === "select" && (
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      responses[currentQuestion.id] === option
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <span className="capitalize">{option.replace(/_/g, " ")}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "number" && (
              <div className="space-y-2">
                <Label htmlFor="answer">Your answer</Label>
                <Input
                  id="answer"
                  type="number"
                  value={responses[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Enter a number"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!responses[currentQuestion.id] || loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? "Submitting..." : isLastQuestion ? "Submit" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
