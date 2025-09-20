import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Square, 
  Settings, 
  Volume2,
  CheckCircle2,
  Circle,
  Clock,
  MessageCircle
} from "lucide-react"

export default function InterviewInterface() {
  const [isRecording, setIsRecording] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [progress, setProgress] = useState(33)

  const topics = [
    { id: 1, title: "Business Model & Revenue", status: "completed", icon: CheckCircle2 },
    { id: 2, title: "Market Position & Competition", status: "active", icon: MessageCircle },
    { id: 3, title: "Growth Strategy & Goals", status: "pending", icon: Circle },
    { id: 4, title: "Operational Challenges", status: "pending", icon: Circle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-blue-200">
              <AvatarImage src="/api/placeholder/48/48" alt="Dr. Sarah Mitchell" />
              <AvatarFallback className="bg-blue-600 text-white">SM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-slate-900">Dr. Sarah Mitchell</h1>
              <p className="text-sm text-slate-600">Strategic Assessment in Progress</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Recording
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Interview Settings</DialogTitle>
                  <DialogDescription>Adjust your interview preferences</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audio Quality</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Transcript</span>
                    <Badge variant="secondary">Auto-enabled</Badge>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Assessment Progress</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                12:34 elapsed
              </div>
            </div>
            <Progress value={progress} className="mt-2" />
            <CardDescription>
              Question {currentQuestion} of 4 • Approximately 8 minutes remaining
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Voice Interface - Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Question */}
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  
                  {/* Voice Visualization */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* Outer ring */}
                      <div className={`h-32 w-32 rounded-full border-4 ${
                        isRecording ? 'border-blue-500 animate-pulse' : 'border-slate-300'
                      } flex items-center justify-center bg-white shadow-lg`}>
                        
                        {/* Voice waves */}
                        {isRecording && (
                          <>
                            <div className="absolute h-40 w-40 rounded-full border-2 border-blue-300 animate-ping opacity-50" />
                            <div className="absolute h-48 w-48 rounded-full border border-blue-200 animate-ping opacity-25" style={{animationDelay: '0.5s'}} />
                          </>
                        )}
                        
                        {/* Center icon */}
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                          isRecording ? 'bg-blue-600' : 'bg-slate-400'
                        }`}>
                          {isPaused ? (
                            <Pause className="h-8 w-8 text-white" />
                          ) : isRecording ? (
                            <Mic className="h-8 w-8 text-white" />
                          ) : (
                            <MicOff className="h-8 w-8 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Question/Response */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 justify-center">
                      <Volume2 className="h-5 w-5 text-blue-600" />
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Sarah is speaking
                      </Badge>
                    </div>
                    
                    <blockquote className="text-lg text-slate-700 italic leading-relaxed max-w-2xl">
                      "Now I'd like to understand your competitive landscape better. Who do you see as your primary competitors, and what differentiates your approach in the market?"
                    </blockquote>

                    <div className="flex items-center gap-2 justify-center text-sm text-slate-600">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      <span className="ml-2">Listening for your response...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setIsPaused(!isPaused)}
                className="h-12 px-6"
              >
                {isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsRecording(!isRecording)}
                className={`h-12 px-6 ${isRecording ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
              >
                {isRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                {isRecording ? 'Mute' : 'Unmute'}
              </Button>

              <Button 
                variant="destructive" 
                size="lg"
                className="h-12 px-6"
              >
                <Square className="h-5 w-5 mr-2" />
                End Interview
              </Button>
            </div>
          </div>

          {/* Topics Sidebar */}
          <div className="space-y-6">
            
            {/* Discussion Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion Topics</CardTitle>
                <CardDescription>Key areas we'll explore together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topics.map((topic) => {
                  const Icon = topic.icon
                  return (
                    <div 
                      key={topic.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        topic.status === 'active' ? 'bg-blue-50 border-2 border-blue-200' : 
                        topic.status === 'completed' ? 'bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        topic.status === 'active' ? 'text-blue-600' :
                        topic.status === 'completed' ? 'text-green-600' : 'text-slate-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          topic.status === 'active' ? 'text-blue-900' :
                          topic.status === 'completed' ? 'text-green-900' : 'text-slate-700'
                        }`}>
                          {topic.title}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Session ID</span>
                  <span className="font-mono text-slate-900">#SW-2024-001</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Started</span>
                  <span className="text-slate-900">2:34 PM EST</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Audio Quality</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Excellent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}