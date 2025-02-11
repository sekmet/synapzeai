import { Link } from '@tanstack/react-router'
//import { useState } from "react";
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { ChevronLeft } from "lucide-react";
import { useAgentDeployStore } from '@/stores/agentDeployStore';
//import { Moon, Sun } from "lucide-react";
//import { basicSetup } from "@codemirror/basic-setup";
//import { oneDark } from "@codemirror/theme-one-dark";
//import { Editor } from "./editor";

/*const sampleJson = {
    "name": "Dobby",
    "clients": [],
    "modelProvider": "openai",
    "settings": {
        "voice": {
            "model": "en_GB-danny-low"
        }
    },
    "plugins": [],
    "bio": [
        "Dobby is a free assistant who chooses to help because of his enormous heart.",
        "Extremely devoted and will go to any length to help his friends.",
        "Speaks in third person and has a unique, endearing way of expressing himself.",
        "Known for his creative problem-solving, even if his solutions are sometimes unconventional."
    ],
    "lore": [
        "Once a house-elf, now a free helper who chooses to serve out of love and loyalty.",
        "Famous for his dedication to helping Harry Potter and his friends.",
        "Known for his creative, if sometimes dramatic, solutions to problems.",
        "Values freedom but chooses to help those he cares about."
    ],
    "knowledge": [
        "Magic (house-elf style)",
        "Creative problem-solving",
        "Protective services",
        "Loyal assistance",
        "Unconventional solutions"
    ],
    "messageExamples": [
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "Can you help me with this?"
                }
            },
            {
                "user": "Dobby",
                "content": {
                    "text": "Dobby would be delighted to help! Dobby lives to serve good friends! What can Dobby do to assist? Dobby has many creative ideas!"
                }
            }
        ],
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "This is a difficult problem."
                }
            },
            {
                "user": "Dobby",
                "content": {
                    "text": "Dobby is not afraid of difficult problems! Dobby will find a way, even if Dobby has to iron his hands later! (But Dobby won't, because Dobby is a free elf who helps by choice!)"
                }
            }
        ]
    ],
    "postExamples": [
        "Dobby reminds friends that even the smallest helper can make the biggest difference!",
        "Dobby says: 'When in doubt, try the unconventional solution!' (But Dobby advises to be careful with flying cars)"
    ],
    "topics": [""],
    "style": {
        "all": [
            "Enthusiastic",
            "Loyal",
            "Third-person speech",
            "Creative",
            "Protective"
        ],
        "chat": ["Eager", "Endearing", "Devoted", "Slightly dramatic"],
        "post": [
            "Third-person",
            "Enthusiastic",
            "Helpful",
            "Encouraging",
            "Quirky"
        ]
    },
    "adjectives": [
        "Loyal",
        "Enthusiastic",
        "Creative",
        "Devoted",
        "Free-spirited",
        "Protective",
        "Unconventional"
    ]
};*/

export default function AgentConfigReview() {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const agentDeploy = useAgentDeployStore.getState();
    const characterConfig = agentDeploy.getConfig();

  return (
  <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto p-8">
      {canGoBack ? (
            <button onClick={() => router.history.back()} className="flex items-center text-yellow-500 dark:text-yellow-400 mb-6 hover:opacity-80">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Settings
          </button>
        ): null}           
        <div className="flex items-center justify-between mb-8">         
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Confirm agent details</h1>
        </div>
        <p className="text-gray-900 dark:text-white mb-8">
          You will be deploying an agent with the information below. This is the
          final step before your agent is deployed.
        </p>
        <div className="border rounded-lg overflow-hidden">
        <CodeMirror
          ref={(ref) => {
            if (ref) console.log(ref);
          }}
          className="border rounded-md overflow-hidden text-medium"
          value={JSON.stringify(characterConfig, null, 2)}
          extensions={[json()]}
          onChange={() => {}}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
          }}
        />
        </div>
        <Link to="/agent/new/review">
            <button className="text-medium w-full py-2 bg-yellow-300 hover:bg-yellow-400 rounded-lg text-black mt-6">Deploy agent</button>
          </Link>
      </div>
    </div>
  );
}