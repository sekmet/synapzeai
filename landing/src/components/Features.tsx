import React from "react";
import { Upload, Code, Puzzle } from "lucide-react";
export function Features() {
  const features = [{
    icon: <Upload className="w-6 h-6" />,
    title: "Easy Deployment",
    description: "Upload your characterfile and deploy your AI agent in seconds"
  }, {
    icon: <Code className="w-6 h-6" />,
    title: "ElizaOS Framework",
    description: "Built specifically for the ElizaOS framework, ensuring optimal performance"
  }, {
    icon: <Puzzle className="w-6 h-6" />,
    title: "Flexible Integration",
    description: "Start from scratch or use templates to customize your AI agents"
  }];
  return <div className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors">
              <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </div>;
}