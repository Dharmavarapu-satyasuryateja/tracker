import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_JOURNEY_STAGES, DEFAULT_HABITS, CRICKET_EXERCISES } from './data';
import { Habit, DailyLog, ActivityCategory, Exercise, Message } from './types';
import {
  Sunrise,
  BookOpen,
  Utensils,
  Dumbbell,
  Award,
  Moon,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Brain,
  Trash2,
  Plus,
  Send,
  Droplet,
  Activity,
  Info,
  TrendingUp,
  RefreshCw,
  Sliders,
  User,
  Zap,
  Target,
  FileText,
  Check,
  Wind,
  History,
  Heart
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Sunrise,
  BookOpen,
  Utensils,
  Dumbbell,
  Award,
  Moon
};

export default function App() {
  // --- STATE DECLARATIONS ---
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('cricket_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    const saved = localStorage.getItem('cricket_daily_log');
    if (saved) return JSON.parse(saved);
    const today = new Date().toLocaleDateString();
    return {
      date: today,
      sleepHours: 8,
      studyHours: 4,
      trainingHours: 2,
      hydrationLiters: 3.5,
      proteinGrams: 125,
      fatigueLevel: 2
    };
  });

  const [logsHistory, setLogsHistory] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('cricket_logs_history');
    return saved ? JSON.parse(saved) : [
      { date: '07/01/2026', sleepHours: 7.5, studyHours: 5, trainingHours: 1.5, hydrationLiters: 3.2, proteinGrams: 110, fatigueLevel: 2 },
      { date: '07/02/2026', sleepHours: 8.2, studyHours: 4, trainingHours: 2.5, hydrationLiters: 3.8, proteinGrams: 130, fatigueLevel: 3 },
      { date: '07/03/2026', sleepHours: 6.8, studyHours: 6, trainingHours: 2.0, hydrationLiters: 3.0, proteinGrams: 95, fatigueLevel: 4 }
    ];
  });

  const [activeStageId, setActiveStageId] = useState<string>('stage-1');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ex-1');
  const [exerciseFilter, setExerciseFilter] = useState<'all' | 'mobility' | 'stability' | 'strength' | 'agility'>('all');
  const [habitFilter, setHabitFilter] = useState<string>('all');
  const [addedStages, setAddedStages] = useState<Record<string, boolean>>({});

  // AI Coach Chat States
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: "Welcome to the U-19 Academy telemetry board, athlete. I am **Coach Willow**, your AI Sports Scientist and Mental Tactician. Ask me anything about matching your study blocks with bowler shoulder stabilizers, loading squats, or optimizing your meal timings.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom Habit Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<ActivityCategory>('fitness');
  const [newHabitTime, setNewHabitTime] = useState('07:00 AM');
  const [newHabitPoints, setNewHabitPoints] = useState(15);
  const [newHabitDesc, setNewHabitDesc] = useState('');

  // --- ADDITIONAL ATHLETE-SCI FEATURES STATE ---
  const [activeCenterTab, setActiveCenterTab] = useState<'training' | 'breathing' | 'trends'>('training');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  
  // Box Breathing & Autonomic Coherence States
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'>('Inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);

  // Real-time UTC clock for system telemetry
  const [currentTime, setCurrentTime] = useState(new Date());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('cricket_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('cricket_daily_log', JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    localStorage.setItem('cricket_logs_history', JSON.stringify(logsHistory));
  }, [logsHistory]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Box Breathing cycle effect
  useEffect(() => {
    let timer: any = null;
    if (isBreathing) {
      timer = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            setBreathingPhase((currentPhase) => {
              switch (currentPhase) {
                case 'Inhale':
                  return 'Hold';
                case 'Hold':
                  return 'Exhale';
                case 'Exhale':
                  return 'Hold Empty';
                case 'Hold Empty':
                  setCompletedBreathCycles((c) => c + 1);
                  return 'Inhale';
                default:
                  return 'Inhale';
              }
            });
            return 4; // 4 seconds per phase of box breathing
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathingSeconds(4);
      setBreathingPhase('Inhale');
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathing]);

  // --- CORE DYNAMIC CALCS ---
  const completedHabits = habits.filter(h => h.completed);
  const totalHabitsCount = habits.length;
  const completedCount = completedHabits.length;
  const habitRate = totalHabitsCount > 0 ? (completedCount / totalHabitsCount) : 0;
  const earnedXP = completedHabits.reduce((acc, h) => acc + h.points, 0);
  const maxPossibleXP = habits.reduce((acc, h) => acc + h.points, 0);

  // Readiness Score Formula: Weights: Sleep (30%), Hydration (25%), Habits complete (25%), Fatigue Index (20%)
  const calculateReadiness = (): number => {
    let score = 0;
    
    // Sleep contribution (max 30 pts)
    const sleep = dailyLog.sleepHours;
    if (sleep >= 7.5 && sleep <= 9) score += 30;
    else if (sleep >= 6) score += 20;
    else if (sleep > 0) score += 10;

    // Hydration contribution (max 25 pts)
    const water = dailyLog.hydrationLiters;
    if (water >= 3.5) score += 25;
    else if (water >= 2.5) score += 18;
    else if (water >= 1.5) score += 10;
    else score += 5;

    // Habits done (max 25 pts)
    score += Math.round(habitRate * 25);

    // Fatigue contribution (max 20 pts)
    // Less fatigue = higher readiness
    const fatigue = dailyLog.fatigueLevel;
    if (fatigue === 1) score += 20;
    else if (fatigue === 2) score += 18;
    else if (fatigue === 3) score += 12;
    else if (fatigue === 4) score += 6;
    else score += 2;

    // Protein multiplier adjustments
    if (dailyLog.proteinGrams >= 120) score = Math.min(100, score + 3);
    if (dailyLog.studyHours >= 3 && dailyLog.studyHours <= 6) score = Math.min(100, score + 2); // study mental health reward

    return Math.min(100, Math.max(0, score));
  };

  const getHistoricalReadiness = (log: DailyLog): number => {
    let score = 0;
    
    // Sleep contribution (max 30 pts)
    const sleep = log.sleepHours;
    if (sleep >= 7.5 && sleep <= 9) score += 30;
    else if (sleep >= 6) score += 20;
    else if (sleep > 0) score += 10;

    // Hydration contribution (max 25 pts)
    const water = log.hydrationLiters;
    if (water >= 3.5) score += 25;
    else if (water >= 2.5) score += 18;
    else if (water >= 1.5) score += 10;
    else score += 5;

    // Estimate historical habits (default 20 points)
    score += 20;

    // Fatigue contribution (max 20 pts)
    const fatigue = log.fatigueLevel;
    if (fatigue === 1) score += 20;
    else if (fatigue === 2) score += 18;
    else if (fatigue === 3) score += 12;
    else if (fatigue === 4) score += 6;
    else score += 2;

    if (log.proteinGrams >= 120) score = Math.min(100, score + 3);
    if (log.studyHours >= 3 && log.studyHours <= 6) score = Math.min(100, score + 2);

    return Math.min(100, Math.max(0, score));
  };

  const readinessScore = calculateReadiness();

  // Weekly Load calculation (simulated based on active logs & habits completed)
  const calculateWeeklyLoad = (): number => {
    const baseKcal = 3200;
    const trainingFactor = dailyLog.trainingHours * 350;
    const habitBonus = completedCount * 45;
    return baseKcal + trainingFactor + habitBonus;
  };

  const weeklyLoad = calculateWeeklyLoad();

  // --- HANDLERS ---
  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAddCustomHabit = (e: FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: 'custom-' + Date.now(),
      name: newHabitName,
      category: newHabitCategory,
      time: newHabitTime,
      completed: false,
      points: newHabitPoints,
      description: newHabitDesc || 'Custom athlete-configured daily habit.'
    };

    setHabits(prev => [newHabit, ...prev]);
    setNewHabitName('');
    setNewHabitDesc('');
    setShowAddForm(false);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Sync timeline activities to habits board
  const handleSyncStageToHabits = (activities: string[], stageId: string) => {
    const stage = DEFAULT_JOURNEY_STAGES.find(s => s.id === stageId);
    if (!stage) return;

    const mappedCategory: ActivityCategory = 
      stageId === 'stage-1' || stageId === 'stage-4' ? 'fitness' :
      stageId === 'stage-3' ? 'nutrition' :
      stageId === 'stage-2' || stageId === 'stage-5' ? 'study' : 'mental';

    const newHabitsList = activities.map((activity, index) => ({
      id: `synced-${stageId}-${index}`,
      name: activity,
      category: mappedCategory,
      time: stage.timeRange.split(' - ')[0],
      completed: false,
      points: 15,
      description: `Synced task from ${stage.title} routine archetype.`
    }));

    // Exclude duplicates
    setHabits(prev => {
      const filtered = prev.filter(h => !h.id.startsWith(`synced-${stageId}`));
      return [...newHabitsList, ...filtered];
    });

    setAddedStages(prev => ({ ...prev, [stageId]: true }));
  };

  // Save progress log to history
  const handleSaveDailyLog = () => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const existsIndex = logsHistory.findIndex(log => log.date === todayStr);

    const logToSave = { ...dailyLog, date: todayStr };

    if (existsIndex >= 0) {
      const updated = [...logsHistory];
      updated[existsIndex] = logToSave;
      setLogsHistory(updated);
    } else {
      setLogsHistory(prev => [logToSave, ...prev]);
    }

    // Trigger a brief confirmation from Coach Willow
    const alertMsg = `Excellent decision. Your telemetry for ${todayStr} has been compiled and saved. Readiness index registered at ${readinessScore}%. Stay resilient.`;
    setMessages(prev => [
      ...prev,
      {
        id: 'system-' + Date.now(),
        role: 'assistant',
        content: `**[SYSTEM METRIC ENQUEUED]**\n${alertMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Chat with Coach Willow API Request
  const handleSendToCoach = async () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    setErrorMessage(null);

    try {
      // Build conversation context
      const chatHistoryForAPI = messages
        .filter(m => !m.content.includes('[SYSTEM'))
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }))
        .slice(-6); // Last 6 messages for context

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg.content,
          history: chatHistoryForAPI,
          systemInstruction: `You are 'Coach Willow', an elite Cricket Fitness Coach, Sports Scientist, and Academic Balance Mentor. 
          Respond to this athlete who has a Readiness Score of ${readinessScore}%, sleeps ${dailyLog.sleepHours} hours, studies ${dailyLog.studyHours} hours, and logs fatigue at level ${dailyLog.fatigueLevel}/5 today.
          Always output highly detailed, motivating, yet scientific answers formatted in pristine Markdown. Mention specific cricket movements (e.g., core bracing, bowler delivery load, fast twitch fibers, thoracic rotation) or study/homework strategies (Pomodoro, posture resets). Keep it professional, encouraging, and clear.`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Network error from AI engine');
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'coach-' + Date.now(),
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Unable to sync with Coach Willow. Operating in standalone mode.');
      
      // Fallback response for offline/demo mode
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'fallback-' + Date.now(),
            role: 'assistant',
            content: `**[STANDALONE COACH INSTINCTS]**\nI am currently running in localized mode. Looking at your metrics:\n* Your **Readiness index is at ${readinessScore}%**.\n* You logged **${dailyLog.sleepHours} hours of sleep**. Keep shooting for 8h to trigger high human-growth hormone levels for tissue repair.\n* You have completed **${completedCount}/${totalHabitsCount}** core athletic habits today.\n\nKeep maintaining high t-spine rotation mobility so you do not transfer torque load down to your L4-L5 lumbar discs when bowling or driving off the front foot!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendToCoach();
    }
  };

  // Zone mapping for cricket specific prehab target areas
  const exerciseZoneMap: Record<string, string> = {
    'ex-1': 'T-Spine',
    'ex-2': 'Hips & Legs',
    'ex-3': 'Shoulder',
    'ex-4': 'Ankles & Feet',
    'ex-5': 'Core & Back',
    'ex-6': 'Hips & Legs',
    'ex-7': 'Core & Back',
    'ex-8': 'Shoulder',
    'ex-9': 'Ankles & Feet',
    'ex-10': 'Ankles & Feet'
  };

  // Filter exercises
  const filteredExercises = CRICKET_EXERCISES.filter(ex => {
    const matchesType = exerciseFilter === 'all' || ex.type === exerciseFilter;
    const zone = exerciseZoneMap[ex.id] || 'Other';
    const matchesZone = selectedZone === 'all' || zone === selectedZone;
    return matchesType && matchesZone;
  });

  const selectedExercise = CRICKET_EXERCISES.find(ex => ex.id === selectedExerciseId) || CRICKET_EXERCISES[0];
  const activeStage = DEFAULT_JOURNEY_STAGES.find(s => s.id === activeStageId) || DEFAULT_JOURNEY_STAGES[0];

  return (
    <div className="w-full min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col overflow-x-hidden">
      
      {/* 1. TOP HEADER: READINESS & IDENTITY (High Density Style) */}
      <header className="h-auto md:h-20 border-b border-slate-800 bg-[#1E293B] flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-0 gap-4 shrink-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-[#0F172A] text-xl select-none shadow-inner">
            S
          </div>
          <div>
            <h1 className="text-md md:text-lg font-bold leading-none text-slate-100 flex items-center gap-2">
              SURYA
            </h1>
            <p className="text-[10px] text-emerald-400 mt-1.5 uppercase tracking-wider font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Status: Match Ready • Phase: Pre-Season Conditioning
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry stats in header */}
        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Readiness Index</p>
            <p className="text-2xl md:text-3xl font-light font-mono text-emerald-400 mt-0.5">
              {readinessScore}<span className="text-xs text-slate-500 font-normal">/100</span>
            </p>
          </div>
          
          <div className="hidden md:block w-[1px] h-10 bg-slate-800"></div>
          
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Weekly Energy Budget</p>
            <p className="text-2xl md:text-3xl font-light font-mono text-slate-200 mt-0.5">
              {weeklyLoad.toLocaleString()}<span className="text-xs text-slate-500 font-normal"> kcal</span>
            </p>
          </div>

          <div className="hidden md:block w-[1px] h-10 bg-slate-800"></div>

          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Completed Habits</p>
            <p className="text-2xl md:text-3xl font-light font-mono text-emerald-500 mt-0.5">
              {completedCount}<span className="text-xs text-slate-500 font-normal">/{totalHabitsCount}</span>
            </p>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT LAYOUT GRID (High Density Multi-Column) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* --- LEFT SIDEBAR: ROUTINE TIMELINE (Stage Selector) --- */}
        <section className="lg:col-span-3 bg-[#111B30] border border-slate-800 rounded-xl flex flex-col p-4 space-y-4 max-h-[850px] overflow-y-auto">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Daily Time-block Model
            </h2>
            <span className="font-mono text-[9px] px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">
              STAGES
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Select an athlete block to audit sports-science solutions and synchronize to your active daily plan.
          </p>

          <div className="space-y-2.5">
            {DEFAULT_JOURNEY_STAGES.map((stage) => {
              const Icon = iconMap[stage.iconName] || Clock;
              const isActive = stage.id === activeStageId;
              const isAdded = addedStages[stage.id];

              return (
                <button
                  key={stage.id}
                  id={`timeline-stage-${stage.id}`}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all border flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-800/80 border-emerald-500/80 text-white shadow-md'
                      : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{stage.title}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{stage.timeRange}</p>
                      </div>
                    </div>
                    {isAdded && (
                      <span className="text-emerald-400" title="Active on planner">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  
                  {isActive && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/50 text-[11px] text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-semibold uppercase text-[9px] tracking-wider block mb-1">Target Action</span>
                      {stage.description}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sync Routine Button */}
          <div className="pt-2">
            <button
              onClick={() => handleSyncStageToHabits(activeStage.activities, activeStage.id)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sync {activeStage.title} Tasks
            </button>
          </div>
        </section>

        {/* --- CENTER COLUMN: PHYSICAL TRAINING DATA & COACH WILLOW --- */}
        <section className="lg:col-span-6 flex flex-col gap-4 max-h-[850px] overflow-y-auto">
          
          {/* Section tabs for premium modules */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCenterTab('training')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeCenterTab === 'training'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Prehab & Training</span>
            </button>
            <button
              onClick={() => setActiveCenterTab('breathing')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeCenterTab === 'breathing'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Mind & Breath Pacer</span>
            </button>
            <button
              onClick={() => setActiveCenterTab('trends')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeCenterTab === 'trends'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Bio-Metrics Trends</span>
            </button>
          </div>

          {activeCenterTab === 'training' && (
            <>
              {/* Active Stage Details Panel */}
              <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Timeline Detail Auditing
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{activeStage.title}</h3>
                  </div>
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
                    {(() => {
                      const StageIcon = iconMap[activeStage.iconName] || Clock;
                      return <StageIcon className="w-5 h-5" />;
                    })()}
                  </div>
                </div>

                {/* Micro Challenge & Solution (Direct copy from design intent) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/50 border border-slate-800/80 p-3 rounded-lg text-xs">
                  <div className="space-y-1 border-b md:border-b-0 md:border-r border-slate-800/80 pb-2 md:pb-0 md:pr-3">
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> The Challenge
                    </p>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {activeStage.challenge}
                    </p>
                  </div>
                  <div className="space-y-1 pt-2 md:pt-0 md:pl-3">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> The Solution
                    </p>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {activeStage.solution}
                    </p>
                  </div>
                </div>

                {/* List of actions enqueued */}
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scheduled Micro-Tasks</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {activeStage.activities.map((act, idx) => (
                      <div key={idx} className="bg-slate-900/40 p-2.5 rounded border border-slate-800/60 text-[11px] leading-snug text-slate-300 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Exercise Library Selector & Dynamic Spec Sheet */}
              <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-emerald-400" />
                      Mobility & Strength Telemetry
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Physical biomechanical drill database for cricket specific workloads.</p>
                  </div>
                  
                  {/* Filter Row */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {['all', 'mobility', 'stability', 'strength', 'agility'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setExerciseFilter(f as any)}
                          className={`text-[9px] font-mono px-2 py-1 rounded uppercase border ${
                            exerciseFilter === f
                              ? 'bg-emerald-500 border-emerald-600 text-[#0F172A] font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1 justify-end items-center">
                      <span className="text-[8px] text-slate-500 font-mono uppercase mr-1">Zone:</span>
                      {['all', 'Shoulder', 'T-Spine', 'Core & Back', 'Hips & Legs', 'Ankles & Feet'].map((z) => (
                        <button
                          key={z}
                          onClick={() => setSelectedZone(z)}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-all ${
                            selectedZone === z
                              ? 'bg-emerald-500/10 border-emerald-400/80 text-emerald-400 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {z}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick list & Biomechanical Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Left Side: Exercise List scrollable */}
                  <div className="md:col-span-5 space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {filteredExercises.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic p-3 text-center">No drills found in {selectedZone} matching {exerciseFilter}.</p>
                    ) : (
                      filteredExercises.map((ex) => (
                        <button
                          key={ex.id}
                          id={`ex-btn-${ex.id}`}
                          onClick={() => setSelectedExerciseId(ex.id)}
                          className={`w-full text-left p-2 rounded text-xs transition-all border flex items-center justify-between cursor-pointer ${
                            selectedExerciseId === ex.id
                              ? 'bg-slate-800 border-emerald-500/60 text-slate-100'
                              : 'bg-slate-900/30 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                          }`}
                        >
                          <span className="truncate">{ex.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono ${
                            ex.type === 'mobility' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            ex.type === 'stability' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                            ex.type === 'strength' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {ex.type}
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Right Side: Biomechanical Spec Card */}
                  <div className="md:col-span-7 bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex flex-col justify-between space-y-2">
                    {selectedExercise ? (
                      <>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">{selectedExercise.difficulty} Range</span>
                            <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400 font-mono">
                              {selectedExercise.target}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100">{selectedExercise.name}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{selectedExercise.description}</p>
                          
                          {/* Steps */}
                          <div className="pt-1.5 space-y-1">
                            <p className="text-[9px] uppercase font-bold text-slate-500">Biomechanical Execution Steps:</p>
                            <ol className="text-[10px] text-slate-300 space-y-1 leading-snug">
                              {selectedExercise.steps.slice(0, 3).map((step, sIdx) => (
                                <li key={sIdx} className="flex gap-1 items-start">
                                  <span className="text-emerald-400 font-bold shrink-0">{sIdx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5 bg-slate-900/70 p-2 rounded">
                          <Brain className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="leading-snug">
                            <strong className="text-slate-300">Cricket Benefit:</strong> {selectedExercise.benefitsForCricket}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-8">Select an exercise to load biomechanics telemetry.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeCenterTab === 'breathing' && (
            <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-4 flex flex-col items-center">
              <div className="w-full border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  Autonomic Nervous System (ANS) Pacer
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Perform Box Breathing to stimulate the vagus nerve, lowering active heart rate and reducing visual focus flutter.
                </p>
              </div>

              {/* Visual Ring Container */}
              <div className="relative flex items-center justify-center w-52 h-52 bg-slate-950/60 rounded-full border border-slate-800/80 my-2">
                {/* External glowing boundary ring */}
                <div 
                  className={`absolute inset-4 rounded-full border-2 transition-all duration-1000 ${
                    !isBreathing ? 'border-slate-800' :
                    breathingPhase === 'Inhale' ? 'border-emerald-500/40 scale-105' :
                    breathingPhase === 'Hold' ? 'border-cyan-400/40 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.15)]' :
                    breathingPhase === 'Exhale' ? 'border-blue-500/40 scale-95' :
                    'border-purple-500/40 scale-90'
                  }`}
                />

                {/* Core Expanding Circle */}
                <div 
                  className={`absolute rounded-full transition-all duration-1000 flex items-center justify-center ${
                    !isBreathing ? 'w-24 h-24 bg-slate-900/80 text-slate-500' :
                    breathingPhase === 'Inhale' ? 'w-36 h-36 bg-emerald-500/10 text-emerald-400' :
                    breathingPhase === 'Hold' ? 'w-36 h-36 bg-cyan-500/10 text-cyan-400' :
                    breathingPhase === 'Exhale' ? 'w-24 h-24 bg-blue-500/10 text-blue-400' :
                    'w-20 h-20 bg-slate-900 text-purple-400'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-[10px] tracking-widest font-mono uppercase font-bold">
                      {isBreathing ? breathingPhase : 'READY'}
                    </p>
                    <p className="text-2xl font-black font-mono mt-0.5">
                      {isBreathing ? `${breathingSeconds}s` : '0:00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Training controls */}
              <div className="flex gap-2.5 w-full max-w-sm">
                <button
                  onClick={() => setIsBreathing(!isBreathing)}
                  className={`flex-1 py-2 px-4 rounded font-bold text-xs cursor-pointer transition-all ${
                    isBreathing 
                      ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30' 
                      : 'bg-emerald-500 text-[#0F172A] hover:bg-emerald-600 shadow-md shadow-emerald-500/10'
                  }`}
                >
                  {isBreathing ? 'HALT PACING' : 'START 4-4-4-4 PACER'}
                </button>
                <button
                  onClick={() => {
                    setIsBreathing(false);
                    setCompletedBreathCycles(0);
                  }}
                  className="px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded text-xs cursor-pointer transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Mini feedback row */}
              <div className="grid grid-cols-2 gap-4 w-full bg-slate-900/30 p-3 rounded-lg border border-slate-800 text-xs text-center">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-mono font-bold">Paced Cycles</p>
                  <p className="text-slate-200 font-bold font-mono mt-0.5 text-base">{completedBreathCycles}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-mono font-bold">Coherence Bonus XP</p>
                  <p className="text-emerald-400 font-bold font-mono mt-0.5 text-base">+{completedBreathCycles * 10} XP</p>
                </div>
              </div>

              {/* Custom micro guide */}
              <div className="w-full text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-900 flex items-start gap-2 leading-relaxed">
                <Brain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-200 font-bold uppercase text-[9px] tracking-wider">Coach Willow Biomechanical Note:</p>
                  <p className="mt-0.5 text-[10px]">
                    Box breathing regulates sympathetic overflow from study overload, ensuring optimal focus during tactical cricket reviews. Done daily, it reduces bowler visual flutter at the crease by up to 14%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeCenterTab === 'trends' && (
            <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-4">
              <div className="w-full border-b border-slate-800 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-400" />
                    Sports-Science Telemetry History
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Correlation analysis showing the relationship between Sleep, Fatigue levels, and logged Readiness.
                  </p>
                </div>
                
                {logsHistory.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Reset telemetry log history? This will clear all data back to factory defaults.")) {
                        setLogsHistory([]);
                      }
                    }}
                    className="text-[9px] font-mono border border-slate-800 hover:border-rose-500/50 bg-slate-950 text-slate-500 hover:text-rose-400 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    Reset Logs
                  </button>
                )}
              </div>

              {/* Interactive SVG graph */}
              {logsHistory.length === 0 ? (
                <div className="h-44 bg-slate-950/40 rounded-lg border border-slate-900 flex flex-col items-center justify-center p-4 text-center text-xs">
                  <TrendingUp className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                  <p className="text-slate-400 font-bold">No Telemetry Logs Recorded</p>
                  <p className="text-slate-500 text-[10px] max-w-xs mt-1">
                    Log a daily bio-metric set using the panel on the right. Your scores will propagate here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span className="text-slate-400 uppercase font-bold tracking-wider">7-Day Recovery Timeline</span>
                      
                      {/* Custom Legend */}
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-slate-300">Readiness (%)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded bg-purple-400" />
                          <span className="text-slate-300">Fatigue (1-5 scaled)</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      {/* SVG Canvas */}
                      <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible select-none">
                        {/* Horizontal Grid lines */}
                        <line x1="40" y1="40" x2="480" y2="40" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="40" y1="90" x2="480" y2="90" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="40" y1="140" x2="480" y2="140" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="40" y1="190" x2="480" y2="190" stroke="#1E293B" strokeWidth="1" />

                        {/* Y-Axis Labels */}
                        <text x="32" y="44" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="end">100%</text>
                        <text x="32" y="94" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="end">60%</text>
                        <text x="32" y="144" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="end">30%</text>
                        <text x="32" y="194" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="end">0%</text>

                        {(() => {
                          const points = [...logsHistory].slice(0, 7).reverse();
                          const count = points.length;
                          const width = 440;
                          const step = count > 1 ? width / (count - 1) : width;

                          // Compute coordinates
                          const coords = points.map((log, index) => {
                            const x = 40 + index * step;
                            const readiness = getHistoricalReadiness(log);
                            const yReadiness = 190 - (readiness / 100) * 150;
                            
                            const scaledFatigue = (log.fatigueLevel / 5) * 100;
                            const yFatigue = 190 - (scaledFatigue / 100) * 150;

                            return { x, yReadiness, yFatigue, log, readiness };
                          });

                          // Generate polyline path
                          const pathReadiness = coords.map(c => `${c.x},${c.yReadiness}`).join(' ');
                          const pathFatigue = coords.map(c => `${c.x},${c.yFatigue}`).join(' ');

                          return (
                            <>
                              {/* Readiness Line */}
                              {count > 1 && (
                                <polyline
                                  fill="none"
                                  stroke="#10B981"
                                  strokeWidth="2.5"
                                  points={pathReadiness}
                                />
                              )}
                              
                              {/* Fatigue Line */}
                              {count > 1 && (
                                <polyline
                                  fill="none"
                                  stroke="#A855F7"
                                  strokeWidth="1.5"
                                  strokeDasharray="4,2"
                                  points={pathFatigue}
                                />
                              )}

                              {/* Interactive Nodes */}
                              {coords.map((c, idx) => (
                                <g key={idx} className="cursor-pointer group">
                                  {/* Hover vertical telemetry ruler line */}
                                  <line
                                    x1={c.x}
                                    y1="35"
                                    x2={c.x}
                                    y2="190"
                                    stroke="#10B981"
                                    strokeWidth="1"
                                    className="opacity-0 group-hover:opacity-20 transition-opacity"
                                  />

                                  {/* Readiness Node */}
                                  <circle
                                    cx={c.x}
                                    cy={c.yReadiness}
                                    r="4"
                                    fill="#10B981"
                                    stroke="#0F172A"
                                    strokeWidth="1.5"
                                    className="hover:r-6 hover:fill-emerald-400 transition-all"
                                  />
                                  <text
                                    x={c.x}
                                    y={c.yReadiness - 10}
                                    fill="#10B981"
                                    fontSize="8"
                                    fontFamily="monospace"
                                    textAnchor="middle"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity font-bold bg-[#0F172A]"
                                  >
                                    {c.readiness}%
                                  </text>

                                  {/* Fatigue Node */}
                                  <circle
                                    cx={c.x}
                                    cy={c.yFatigue}
                                    r="3"
                                    fill="#A855F7"
                                    stroke="#0F172A"
                                    strokeWidth="1.2"
                                    className="hover:r-5 hover:fill-purple-300 transition-all"
                                  />
                                  <text
                                    x={c.x}
                                    y={c.yFatigue + 14}
                                    fill="#A855F7"
                                    fontSize="8"
                                    fontFamily="monospace"
                                    textAnchor="middle"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                                  >
                                    {c.log.fatigueLevel}/5
                                  </text>

                                  {/* X-Axis labels (Dates) */}
                                  <text
                                    x={c.x}
                                    y="208"
                                    fill="#64748B"
                                    fontSize="8"
                                    fontFamily="monospace"
                                    textAnchor="middle"
                                  >
                                    {c.log.date.substring(0, 5)}
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                      <p className="text-[9px] text-slate-500 italic text-center font-mono mt-1">
                        *Hover vertices to display detailed telemetry values.
                      </p>
                    </div>
                  </div>

                  {/* Histology log detailed list */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Histology Logs</p>
                    <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1">
                      {logsHistory.map((log, lIdx) => {
                        const score = getHistoricalReadiness(log);
                        return (
                          <div 
                            key={log.date + '-' + lIdx}
                            className="bg-slate-900/40 border border-slate-800/80 p-2 rounded flex items-center justify-between text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {log.date}
                              </span>
                              <span className={`font-mono text-[10px] font-bold ${
                                score >= 80 ? 'text-emerald-400' :
                                score >= 60 ? 'text-amber-400' :
                                'text-rose-400'
                              }`}>
                                {score}% Readiness
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
                                Sleep: <strong className="text-slate-200">{log.sleepHours}h</strong> | 
                                Water: <strong className="text-slate-200">{log.hydrationLiters}L</strong> | 
                                Fatigue: <strong className="text-slate-200">{log.fatigueLevel}/5</strong>
                              </span>

                              <button
                                onClick={() => {
                                  if (confirm(`Remove log for ${log.date}?`)) {
                                    setLogsHistory(prev => prev.filter(item => item.date !== log.date));
                                  }
                                }}
                                className="p-1 rounded bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                                title="Delete log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic AI Tactical Advisor Chat: Coach Willow */}
          <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 flex flex-col h-[280px]">
            <div className="pb-2 border-b border-slate-800 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
                  Tactical Review & Coaching Loop
                </h3>
              </div>
              <span className="font-mono text-[9px] text-slate-500 uppercase">
                COACH WILLOW CORE v3.5
              </span>
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1.5 text-xs">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col max-w-[90%] rounded-lg p-2.5 leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-slate-800/60 border border-slate-700/50 ml-auto text-slate-200' 
                      : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                  }`}
                >
                  <p className="text-[9px] font-mono font-bold text-emerald-400 mb-1">
                    {m.role === 'user' ? 'ATHLETE J. DE VILLIERS' : 'COACH WILLOW'}
                  </p>
                  <div className="space-y-1 text-[11px] prose prose-invert prose-xs">
                    {/* Hand-render markdown bullet points safely */}
                    {m.content.split('\n').map((line, lIdx) => {
                      if (line.startsWith('* ') || line.startsWith('- ')) {
                        return <div key={lIdx} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-400">{line.substring(2)}</div>;
                      }
                      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                        return <div key={lIdx} className="pl-4 relative font-medium text-slate-200">{line}</div>;
                      }
                      // bold markers
                      let renderedText = line;
                      const boldMatch = line.match(/\*\*(.*?)\*\*/g);
                      if (boldMatch) {
                        return (
                          <p key={lIdx}>
                            {line.split('**').map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-emerald-400 font-semibold">{part}</strong> : part)}
                          </p>
                        );
                      }
                      return <p key={lIdx} className="m-0">{line}</p>;
                    })}
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-1.5 self-end">
                    {m.timestamp}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Coach Willow is auditing biomechanical balance formulas...</span>
                </div>
              )}
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-2.5 text-[10px] flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="mt-2 flex gap-1.5 border-t border-slate-800/80 pt-2 shrink-0">
              <input
                type="text"
                placeholder="Ask about hamstring deadlifts, Pomodoro time, pre-sleep breath..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-slate-900 text-xs border border-slate-800 rounded px-2.5 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
              />
              <button
                onClick={handleSendToCoach}
                disabled={!chatInput.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 text-[#0F172A] p-2 rounded flex items-center justify-center disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* --- RIGHT COLUMN: DIETARY & HABIT STATS --- */}
        <section className="lg:col-span-3 flex flex-col gap-4 max-h-[850px] overflow-y-auto">
          
          {/* Dietary Balance Dashboard Meter */}
          <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Dietary & Hydration Balance</h3>
            
            {/* Real-time bar visualizers based on logged metrics */}
            <div className="flex gap-2.5 h-28 items-end justify-between bg-slate-900/30 p-2 rounded border border-slate-800">
              
              {/* Protein Meter */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div 
                  className="w-full bg-emerald-500/80 rounded-t transition-all duration-300 flex items-center justify-center text-[9px] font-mono text-[#0F172A] font-bold"
                  style={{ height: `${Math.min(100, (dailyLog.proteinGrams / 150) * 100)}%` }}
                >
                  {dailyLog.proteinGrams}g
                </div>
              </div>

              {/* Water Meter */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div 
                  className="w-full bg-blue-500/80 rounded-t transition-all duration-300 flex items-center justify-center text-[9px] font-mono text-white font-bold"
                  style={{ height: `${Math.min(100, (dailyLog.hydrationLiters / 5) * 100)}%` }}
                >
                  {dailyLog.hydrationLiters}L
                </div>
              </div>

              {/* Carbs Meter */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div 
                  className="w-full bg-amber-500/80 rounded-t transition-all duration-300 flex items-center justify-center text-[9px] font-mono text-[#0F172A] font-bold"
                  style={{ height: `${Math.min(100, (dailyLog.trainingHours * 20 + 40))}%` }}
                >
                  Active
                </div>
              </div>

              {/* Recovery Energy Budget Meter */}
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <div 
                  className="w-full bg-slate-700/80 rounded-t transition-all duration-300 flex items-center justify-center text-[9px] font-mono text-white"
                  style={{ height: `${Math.min(100, (readinessScore))}%` }}
                >
                  {readinessScore}%
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[8px] text-slate-500 uppercase tracking-wider font-mono">
              <span className="text-center flex-1">Protein</span>
              <span className="text-center flex-1">Water</span>
              <span className="text-center flex-1">Carbs</span>
              <span className="text-center flex-1">Readiness</span>
            </div>
          </div>

          {/* Sliders for Daily Metrics Log */}
          <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Log Daily Bio-Metrics</h3>
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Sleep Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Moon className="w-3 h-3 text-rose-400" /> Sleep Duration
                </span>
                <span className="text-slate-200 font-bold">{dailyLog.sleepHours} hrs</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="11" 
                step="0.5"
                value={dailyLog.sleepHours}
                onChange={(e) => setDailyLog(prev => ({ ...prev, sleepHours: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Hydration Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-blue-400" /> Pure Water
                </span>
                <span className="text-slate-200 font-bold">{dailyLog.hydrationLiters} Liters</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5.5" 
                step="0.25"
                value={dailyLog.hydrationLiters}
                onChange={(e) => setDailyLog(prev => ({ ...prev, hydrationLiters: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Studies Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-emerald-400" /> Study Load
                </span>
                <span className="text-slate-200 font-bold">{dailyLog.studyHours} hrs</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="8" 
                step="0.5"
                value={dailyLog.studyHours}
                onChange={(e) => setDailyLog(prev => ({ ...prev, studyHours: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Protein Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-amber-400" /> Active Protein
                </span>
                <span className="text-slate-200 font-bold">{dailyLog.proteinGrams}g</span>
              </div>
              <input 
                type="range" 
                min="60" 
                max="180" 
                step="5"
                value={dailyLog.proteinGrams}
                onChange={(e) => setDailyLog(prev => ({ ...prev, proteinGrams: parseInt(e.target.value) }))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Fatigue Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-purple-400" /> Fatigue Level
                </span>
                <span className="text-slate-200 font-bold">{dailyLog.fatigueLevel}/5</span>
              </div>
              <div className="flex justify-between gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDailyLog(prev => ({ ...prev, fatigueLevel: level }))}
                    className={`flex-1 py-1 rounded text-xs font-mono font-bold border transition-all ${
                      dailyLog.fatigueLevel === level
                        ? 'bg-emerald-500 text-[#0F172A] border-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveDailyLog}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-100 py-2 rounded font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Save Telemetry
            </button>
          </div>

          {/* Habit Stacks (High Density Checklist) */}
          <div className="bg-[#111B30] border border-slate-800 rounded-xl p-4.5 space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Habit Stacks</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Points: <strong className="text-emerald-400">{earnedXP}/{maxPossibleXP} XP</strong></p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                title="Add custom biometric habit"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom Habit Form overlay inside the component */}
            {showAddForm && (
              <form onSubmit={handleAddCustomHabit} className="bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-2.5 text-xs">
                <p className="font-mono text-[9px] text-emerald-400 uppercase font-bold">Configure Custom Habit</p>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Thoracic Rotation (10 reps)"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-[11px] p-2 rounded text-slate-200 placeholder-slate-600 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value as ActivityCategory)}
                    className="bg-slate-900 border border-slate-800 text-[10px] p-1.5 rounded text-slate-400"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="study">Study</option>
                    <option value="mental">Mental</option>
                  </select>
                  <input 
                    type="text"
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-[10px] p-1.5 rounded text-slate-400"
                  />
                </div>
                <input 
                  type="text"
                  placeholder="Purpose of biomechanical drill"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-[10px] p-1.5 rounded text-slate-400"
                />
                <div className="flex justify-end gap-1.5 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-2 py-1 bg-emerald-500 text-[#0F172A] font-bold text-[10px] rounded"
                  >
                    Add Stack
                  </button>
                </div>
              </form>
            )}

            {/* Checklist items */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {habits.map((h) => (
                <div 
                  key={h.id} 
                  className={`flex items-center justify-between p-2 rounded border transition-all ${
                    h.completed 
                      ? 'bg-slate-900/30 border-slate-800/40 opacity-55' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleToggleHabit(h.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        h.completed 
                          ? 'bg-emerald-500 border-emerald-600 text-[#0F172A]' 
                          : 'border-slate-600 hover:border-emerald-500 bg-slate-950'
                      } cursor-pointer`}
                    >
                      {h.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </button>
                    <div>
                      <p className={`text-[11px] font-medium leading-none ${h.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {h.name}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{h.time} • +{h.points} XP</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteHabit(h.id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Index Footer Plate (Direct design integration) */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Autonomic Recovery Index</p>
            <div className="flex gap-1 mt-2">
              <div className="flex-1 h-1.5 bg-emerald-500 rounded-full"></div>
              <div className="flex-1 h-1.5 bg-emerald-500 rounded-full"></div>
              <div className="flex-1 h-1.5 bg-emerald-500 rounded-full"></div>
              <div className="flex-1 h-1.5 bg-emerald-500 rounded-full"></div>
              <div className={`flex-1 h-1.5 rounded-full ${dailyLog.sleepHours >= 7 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${dailyLog.sleepHours >= 8.5 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
            </div>
            <p className="text-[9px] text-emerald-400 mt-2 font-mono uppercase tracking-wider">
              {dailyLog.sleepHours >= 8 ? 'OPTIMAL RECOVERY: SYSTEM BALANCED.' : 'MILD LOAD DETECTED: 8+ HRS SLEEP RECOMMENDED.'}
            </p>
          </div>
        </section>
      </main>

      {/* 3. FOOTER: SYSTEM STATS (As described in the High Density design template) */}
      <footer className="h-10 bg-[#0F172A] border-t border-slate-800 flex items-center px-6 justify-between shrink-0 text-slate-400">
        <div className="flex gap-6">
          <div className="text-[10px] flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> 
            SYNCED
          </div>
          <div className="text-[10px] font-mono text-slate-500 hidden sm:block">LATENCY: 8ms</div>
          <div className="text-[10px] font-mono text-slate-500 hidden sm:block">BUILD: CRK_CORE_V2.5.0</div>
        </div>
        <div className="text-[10px] font-mono tracking-wide text-slate-500 uppercase">
          {currentTime.toLocaleDateString()} // {currentTime.toLocaleTimeString([], { hour12: false })} UTC
        </div>
      </footer>
    </div>
  );
}
