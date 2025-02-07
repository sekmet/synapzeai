import React from "react";
import { Zap } from "lucide-react";
export function Hero() {
  return <div className="flex flex-col items-center justify-center min-h-[30vh] px-4 text-center">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Deploy AI Agents with{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            One Click
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Synapze is an AI hosting platform specifically designed to deploy
          autonomous agents built using the ElizaOS framework
        </p>
        <button className="inline-flex items-center px-6 py-3 text-lg font-medium bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors">
          <Zap className="w-5 h-5 mr-2" />
          Get Started
        </button>
      </div>
    </div>;
}