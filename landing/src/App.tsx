import React from "react";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import Header from "./components/Header";
export function App() {
  return <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto pt-[10vh]">
        <Hero />
        <Features />
      </main>
    </div>;
}