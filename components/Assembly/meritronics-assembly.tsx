"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Play,
  RotateCcw,
  Zap,
  Eye,
  Settings,
  Package,
  Truck,
} from "lucide-react";

export default function MeritonicsAssemblyPage() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const processSteps = [
    {
      id: 1,
      name: "Material Kitting",
      dataCollection: true,
      category: "preparation",
      icon: Package,
      x: 50,
      y: 50,
    },
    {
      id: 2,
      name: "Routed PCB Wash",
      dataCollection: true,
      category: "cleaning",
      icon: Settings,
      x: 50,
      y: 120,
    },
    {
      id: 3,
      name: "Solder Print Top Side",
      dataCollection: true,
      category: "soldering",
      icon: Zap,
      x: 50,
      y: 190,
    },
    {
      id: 4,
      name: "Solder Print Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 50,
      y: 260,
    },
    {
      id: 5,
      name: "Masking Wire Bond",
      dataCollection: true,
      category: "preparation",
      icon: Settings,
      x: 50,
      y: 330,
    },
    {
      id: 6,
      name: "Affix ID Labels",
      dataCollection: true,
      category: "labeling",
      icon: Package,
      x: 50,
      y: 400,
    },
    {
      id: 7,
      name: "Solder Print Bottom",
      dataCollection: true,
      category: "soldering",
      icon: Zap,
      x: 200,
      y: 400,
    },
    {
      id: 8,
      name: "Bottom Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 350,
      y: 400,
    },
    {
      id: 9,
      name: "Component Placement",
      dataCollection: true,
      category: "assembly",
      icon: Settings,
      x: 500,
      y: 400,
    },
    {
      id: 10,
      name: "First Article Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 650,
      y: 400,
    },
    {
      id: 11,
      name: "Reflow PCBA",
      dataCollection: true,
      category: "soldering",
      icon: Zap,
      x: 800,
      y: 400,
    },
    {
      id: 12,
      name: "1 Sided PCBA?",
      dataCollection: false,
      category: "decision",
      icon: Settings,
      x: 800,
      y: 300,
    },
    {
      id: 13,
      name: "AOI Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 800,
      y: 200,
    },
    {
      id: 14,
      name: "Visual Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 650,
      y: 200,
    },
    {
      id: 15,
      name: "Touch up / Repair",
      dataCollection: true,
      category: "repair",
      icon: Settings,
      x: 500,
      y: 200,
    },
    {
      id: 16,
      name: "Selective Solder",
      dataCollection: true,
      category: "soldering",
      icon: Zap,
      x: 350,
      y: 200,
    },
    {
      id: 17,
      name: "PTH Loading",
      dataCollection: true,
      category: "assembly",
      icon: Settings,
      x: 200,
      y: 200,
    },
    {
      id: 18,
      name: "PTH Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 200,
      y: 120,
    },
    {
      id: 19,
      name: "PTH QC",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 350,
      y: 120,
    },
    {
      id: 20,
      name: "Manual Solder",
      dataCollection: true,
      category: "soldering",
      icon: Zap,
      x: 500,
      y: 120,
    },
    {
      id: 21,
      name: "Flying Probe Test",
      dataCollection: true,
      category: "testing",
      icon: Zap,
      x: 650,
      y: 120,
    },
    {
      id: 22,
      name: "Mechanical Assembly",
      dataCollection: true,
      category: "assembly",
      icon: Settings,
      x: 800,
      y: 120,
    },
    {
      id: 23,
      name: "Conformal Coat",
      dataCollection: true,
      category: "coating",
      icon: Settings,
      x: 950,
      y: 120,
    },
    {
      id: 24,
      name: "BGA X-Ray",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 950,
      y: 200,
    },
    {
      id: 25,
      name: "Clean Assembly",
      dataCollection: true,
      category: "cleaning",
      icon: Settings,
      x: 950,
      y: 280,
    },
    {
      id: 26,
      name: "Coat Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 950,
      y: 360,
    },
    {
      id: 27,
      name: "2nd Operation?",
      dataCollection: false,
      category: "decision",
      icon: Settings,
      x: 800,
      y: 500,
    },
    {
      id: 28,
      name: "Final Probe Test",
      dataCollection: true,
      category: "testing",
      icon: Zap,
      x: 650,
      y: 500,
    },
    {
      id: 29,
      name: "Underfill",
      dataCollection: true,
      category: "assembly",
      icon: Settings,
      x: 500,
      y: 500,
    },
    {
      id: 30,
      name: "Gold Pad Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 350,
      y: 500,
    },
    {
      id: 31,
      name: "Final Inspection",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 200,
      y: 500,
    },
    {
      id: 32,
      name: "Packaging",
      dataCollection: true,
      category: "packaging",
      icon: Package,
      x: 50,
      y: 500,
    },
    {
      id: 33,
      name: "Ship Lot Audit",
      dataCollection: true,
      category: "audit",
      icon: Eye,
      x: 50,
      y: 570,
    },
    {
      id: 34,
      name: "Final Check",
      dataCollection: true,
      category: "inspection",
      icon: Eye,
      x: 200,
      y: 570,
    },
    {
      id: 35,
      name: "Shipping",
      dataCollection: true,
      category: "shipping",
      icon: Truck,
      x: 350,
      y: 570,
    },
  ];

  const connections = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
    [17, 18],
    [18, 19],
    [19, 20],
    [20, 21],
    [21, 22],
    [22, 23],
    [23, 24],
    [24, 25],
    [25, 26],
    [26, 27],
    [27, 28],
    [28, 29],
    [29, 30],
    [30, 31],
    [31, 32],
    [32, 33],
    [33, 34],
    [34, 35],
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      preparation: "bg-blue-500 hover:bg-blue-600 border-blue-300",
      cleaning: "bg-green-500 hover:bg-green-600 border-green-300",
      soldering: "bg-orange-500 hover:bg-orange-600 border-orange-300",
      inspection: "bg-purple-500 hover:bg-purple-600 border-purple-300",
      assembly: "bg-yellow-500 hover:bg-yellow-600 border-yellow-300",
      testing: "bg-green-500 hover:bg-green-600 border-green-300",
      coating: "bg-indigo-500 hover:bg-indigo-600 border-indigo-300",
      repair: "bg-pink-500 hover:bg-pink-600 border-pink-300",
      labeling: "bg-cyan-500 hover:bg-cyan-600 border-cyan-300",
      packaging: "bg-emerald-500 hover:bg-emerald-600 border-emerald-300",
      audit: "bg-violet-500 hover:bg-violet-600 border-violet-300",
      shipping: "bg-slate-500 hover:bg-slate-600 border-slate-300",
      decision: "bg-amber-500 hover:bg-amber-600 border-amber-300",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-500 hover:bg-gray-600 border-gray-300"
    );
  };

  const filteredSteps = processSteps.filter((step) =>
    step.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processSteps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 800);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className=" ">
        <div className="  px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Network Pcb Stations Flow
              </h1>
              {/* <p className="text-gray-600 mt-1">
                Interactive process flow visualization
              </p> */}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search steps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                onClick={startAnimation}
                disabled={isAnimating}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Animate Flow
              </Button>
              <Button
                onClick={resetAnimation}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="   p-4">
        {/* Process Flow Visualization */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative overflow-x-auto">
              <svg
                width="1100"
                height="650"
                className="border rounded-lg bg-white"
              >
                {/* Connection Lines */}
                {connections.map(([from, to], index) => {
                  const fromStep = processSteps.find((s) => s.id === from);
                  const toStep = processSteps.find((s) => s.id === to);
                  if (!fromStep || !toStep) return null;

                  const isActive =
                    isAnimating &&
                    currentStep >= from - 1 &&
                    currentStep >= to - 1;

                  return (
                    <line
                      key={index}
                      x1={fromStep.x + 40}
                      y1={fromStep.y + 20}
                      x2={toStep.x + 40}
                      y2={toStep.y + 20}
                      stroke={isActive ? "#3b82f6" : "#e5e7eb"}
                      strokeWidth={isActive ? "3" : "2"}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Process Steps */}
                {filteredSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isSelected = selectedStep === step.id;
                  const isCurrentStep =
                    isAnimating && currentStep === step.id - 1;
                  const isPastStep = isAnimating && currentStep > step.id - 1;

                  return (
                    <g key={step.id}>
                      {/* Step Circle */}
                      <circle
                        cx={step.x + 40}
                        cy={step.y + 20}
                        r={step.category === "decision" ? 25 : 20}
                        className={`cursor-pointer transition-all duration-300 ${
                          isCurrentStep
                            ? "fill-blue-500 stroke-blue-600 animate-pulse"
                            : isPastStep
                            ? "fill-green-500 stroke-green-600"
                            : isSelected
                            ? "fill-blue-400 stroke-blue-500"
                            : step.dataCollection
                            ? "fill-orange-100 stroke-orange-400"
                            : "fill-gray-100 stroke-gray-300"
                        }`}
                        strokeWidth="2"
                        onClick={() =>
                          setSelectedStep(isSelected ? null : step.id)
                        }
                      />

                      {/* Step Number */}
                      <text
                        x={step.x + 40}
                        y={step.y + 26}
                        textAnchor="middle"
                        className="text-xs font-bold fill-current pointer-events-none"
                        fill={
                          isCurrentStep || isPastStep || isSelected
                            ? "white"
                            : "black"
                        }
                      >
                        {step.id}
                      </text>

                      {/* Step Label */}
                      <text
                        x={step.x + 40}
                        y={step.y + 50}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700 pointer-events-none max-w-20"
                      >
                        {step.name.length > 15
                          ? step.name.substring(0, 15) + "..."
                          : step.name}
                      </text>

                      {/* Data Collection Indicator */}
                      {step.dataCollection && (
                        <circle
                          cx={step.x + 55}
                          cy={step.y + 5}
                          r="4"
                          className="fill-green-500 stroke-green-600"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Step Details Panel */}
        {selectedStep && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              {(() => {
                const step = processSteps.find((s) => s.id === selectedStep);
                if (!step) return null;
                const Icon = step.icon;
                return (
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${getCategoryColor(
                        step.category
                      )} text-white`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">
                          Step {step.id}: {step.name}
                        </h3>
                        {step.dataCollection && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            Data Collection Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={getCategoryColor(step.category)}
                        >
                          {step.category.charAt(0).toUpperCase() +
                            step.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        {step.category === "inspection" &&
                          "Quality control checkpoint requiring visual or automated inspection."}
                        {step.category === "soldering" &&
                          "Soldering operation requiring precise temperature and timing control."}
                        {step.category === "assembly" &&
                          "Component placement or mechanical assembly operation."}
                        {step.category === "testing" &&
                          "Electrical or functional testing to verify performance."}
                        {step.category === "cleaning" &&
                          "Cleaning operation to remove contaminants or residues."}
                        {step.category === "preparation" &&
                          "Preparation step to ready components for next operation."}
                        {step.category === "decision" &&
                          "Decision point in the process flow."}
                        {step.category === "packaging" &&
                          "Final packaging and preparation for shipment."}
                        {step.category === "shipping" &&
                          "Final shipment and delivery operations."}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStep(null)}
                    >
                      Close
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Process Legend</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-400"></div>
                <span className="text-sm">Data Collection Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Current Step (Animation)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed Step</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Data Point Indicator</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Click on any step to view details. Use
                the animate button to see the process flow in action. All steps
                with red dots require data collection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
