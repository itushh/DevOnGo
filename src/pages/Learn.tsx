import React, { useState, useEffect } from 'react';
import { db } from '@/src/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '@/src/hooks/useUser';
import { lessons, Lesson } from '@/src/utils/lessons';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { QuestionCard } from '@/src/components/ui/QuestionCard';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Lock, Play, ArrowLeft, ArrowRight, Sparkles, Wallet } from 'lucide-react';
import { cn } from '@/src/utils/utils';
import { unlockAchievement } from '@/src/services/achievementsService';
import { Web3TaskRegistry } from '@/src/components/web3-tasks/TaskRegistry';
import { markModuleOnBlockchain } from '@/src/services/blockchainService';
import { toast } from 'sonner';

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { user, setUser } = useUser();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
  const [isLocked, setIsLocked] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [isBlockchainProcessing, setIsBlockchainProcessing] = useState(false);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter(s => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const isTaskReady = !selectedLesson?.web3Task || completedSteps.length === selectedLesson.web3Task.steps.length;

  const handleCompleteLesson = async () => {
    if (!user || !selectedLesson) return;

    const isAlreadyCompleted = user.completed_lessons?.includes(selectedLesson.id) || false;

    // Blockchain progress recording - only for new completions
    if (!isAlreadyCompleted) {
      setIsBlockchainProcessing(true);
      const toastId = toast.loading("Recording progress on HeLa Blockchain...");
      try {
        const username = user.username || user.display_name || user.email?.split('@')[0] || "explorer";
        await markModuleOnBlockchain(username, selectedLesson.title);
        toast.success("Progress recorded on blockchain!", { id: toastId });
      } catch (blockchainError: any) {
        console.error('Blockchain recording failed:', blockchainError);
        toast.error(`Blockchain Error: ${blockchainError.message || "Failed to record progress"}`, { id: toastId });
        // Don't stop the flow, but notify user
      } finally {
        setIsBlockchainProcessing(false);
      }
    }

    const newCompleted = isAlreadyCompleted
      ? (user.completed_lessons || [])
      : [...(user.completed_lessons || []), selectedLesson.id];

    const xpReward = isAlreadyCompleted ? 0 : 100;
    const newXp = user.xp + xpReward;
    const newLevel = Math.floor(newXp / 1000) + 1;

    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        completed_lessons: newCompleted,
        xp: newXp,
        level: newLevel
      });

      setUser({
        ...user,
        completed_lessons: newCompleted,
        xp: newXp,
        level: newLevel
      });
      setLessonComplete(true);
      setCompletedSteps([]); // Reset steps

      // Achievement Logic
      if (!isAlreadyCompleted) {
        if (newCompleted.length >= 3) {
          await unlockAchievement(user.id, 'web3-beginner');
        }
        if (newCompleted.length >= 10) {
          await unlockAchievement(user.id, 'streak-7'); // Using this for 10 modules
        }
        if (selectedLesson.web3Task?.type === 'swap') {
          await unlockAchievement(user.id, 'first-swap');
        }
        if (selectedLesson.web3Task?.type === 'mint') {
          await unlockAchievement(user.id, 'nft-creator');
        }
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast.error("Failed to save progress locally.");
    }
  };

  if (selectedLesson) {
    const question = selectedLesson.questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + (showTask ? 1 : 0)) / (selectedLesson.questions.length + (selectedLesson.web3Task ? 1 : 0))) * 100;

    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-brand-text-muted hover:text-brand-ink" onClick={() => setSelectedLesson(null)}>
          <ArrowLeft size={18} className="mr-2" /> Back to Curriculum
        </Button>

        <div className="mb-12 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-brand-ink">{selectedLesson.title}</h1>
              <p className="text-brand-text-muted mt-1">{selectedLesson.description}</p>
            </div>
            <div className="text-[10px] font-bold text-brand-text-muted tracking-widest">{Math.round(progress)}% COMPLETE</div>
          </div>
          <ProgressBar progress={progress} color="bg-brand-primary" className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {!showTask && !lessonComplete ? (
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuestionCard
                question={question.question}
                options={question.options}
                onSelect={(idx) => {
                  setSelectedAnswer(idx);
                  setIsLocked(true);
                }}
                selectedIdx={selectedAnswer}
                correctIdx={isLocked ? question.correctIndex : undefined}
                isLocked={isLocked}
              />

              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-white rounded-xl border border-brand-border shadow-sm"
                >
                  <p className="text-sm font-medium text-brand-ink">{question.explanation}</p>
                  <Button className="mt-6 w-full py-6 text-base" onClick={() => {
                    if (selectedLesson && currentQuestionIdx < selectedLesson.questions.length - 1) {
                      setCurrentQuestionIdx(prev => prev + 1);
                      setSelectedAnswer(undefined);
                      setIsLocked(false);
                    } else if (selectedLesson?.web3Task && !showTask) {
                      setShowTask(true);
                    } else {
                      handleCompleteLesson();
                    }
                  }}>
                    Continue <ArrowRight size={18} className="ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : showTask && !lessonComplete ? (
            <motion.div
              key="task"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <Card className="p-10 border-2 border-dashed border-indigo-200 bg-indigo-50/20 shadow-inner">
                <div className="flex items-center gap-3 mb-6 text-brand-primary">
                  <Sparkles size={28} className="animate-pulse" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Web3 Mission</h2>
                </div>
                <h3 className="text-3xl font-bold mb-3 text-brand-ink">{selectedLesson.web3Task?.title}</h3>
                <p className="text-lg text-brand-text-muted mb-10 leading-relaxed">{selectedLesson.web3Task?.description}</p>

                <div className="space-y-4 mb-10">
                  <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-4">Step-by-Step Instructions</div>
                  {selectedLesson.web3Task?.steps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                        completedSteps.includes(idx)
                          ? "bg-green-50 border-brand-success text-brand-ink"
                          : "bg-white border-brand-border hover:border-indigo-200"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors",
                        completedSteps.includes(idx) ? "bg-brand-success border-brand-success text-white" : "border-gray-200"
                      )}>
                        {completedSteps.includes(idx) && <CheckCircle size={14} />}
                      </div>
                      <span className="text-sm font-semibold">{step}</span>
                    </div>
                  ))}
                </div>

                {selectedLesson.web3Task && Web3TaskRegistry[selectedLesson.web3Task.type] && (
                  <div className="mb-10 p-6 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                    {(() => {
                      const TaskComponent = Web3TaskRegistry[selectedLesson.web3Task.type];
                      return <TaskComponent />;
                    })()}
                  </div>
                )}

                <div className="bg-white p-10 rounded-2xl border border-indigo-100 shadow-xl text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet size={32} />
                  </div>
                  <p className={cn(
                    "text-xs font-bold mb-6 uppercase tracking-widest",
                    isTaskReady ? "text-brand-success" : "text-brand-text-muted opacity-50"
                  )}>
                    {isTaskReady ? 'System Ready: Proceed to Execution' : `Complete ${selectedLesson.web3Task?.steps.length! - completedSteps.length} more steps`}
                  </p>
                  <Button
                    size="xl"
                    className="w-full md:w-auto px-16 shadow-lg shadow-indigo-200"
                    onClick={() => handleCompleteLesson()}
                    disabled={!isTaskReady}
                  >
                    Execute Mission
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <CheckCircle size={48} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-brand-success/20 rounded-full"
                />
              </div>
              <h2 className="text-5xl font-black mb-3 uppercase tracking-tighter text-brand-ink">Lesson Complete!</h2>
              <p className="text-lg text-brand-text-muted mb-12">+100 XP awarded to your profile</p>
              <Button size="xl" className="px-12 py-8 text-xl rounded-2xl" onClick={() => setSelectedLesson(null)}>
                Keep Exploring
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const handleUnlock = async (lesson: Lesson, cost: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user || user.xp < cost) return;

    try {
      const userDocRef = doc(db, 'users', user.id);
      const newUnlocked = [...(user.unlocked_modules || []), lesson.id];
      const newXp = user.xp - cost;

      await updateDoc(userDocRef, {
        unlocked_modules: newUnlocked,
        xp: newXp
      });

      setUser({
        ...user,
        unlocked_modules: newUnlocked,
        xp: newXp
      });
    } catch (err) {
      console.error('Error unlocking module:', err);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2 text-brand-ink">Curriculum</h1>
      <p className="text-brand-text-muted mb-12">Spend XP to unlock advanced Web3 topics and continue your journey.</p>

      <div className="space-y-4">
        {lessons.map((lesson, idx) => {
          const isCompleted = user?.completed_lessons?.includes(lesson.id) || false;
          const isUnlocked = user?.unlocked_modules?.includes(lesson.id) || idx < 3;
          const unlockCost = 25 + (idx * 25); // Made lower for easier access
          const isInteractive = Boolean(lesson.web3Task);

          return (
            <Card
              key={lesson.id}
              className={cn(
                "p-0 overflow-hidden flex flex-col md:flex-row group relative",
                !isUnlocked
                  ? "bg-gray-50/80"
                  : isInteractive
                    ? "hover:border-indigo-400 border-indigo-200/70 bg-indigo-50/20 transition-all cursor-pointer"
                    : "hover:border-brand-primary transition-all cursor-pointer"
              )}
              onClick={() => isUnlocked && setSelectedLesson(lesson)}
            >
              <div className={cn(
                "w-full md:w-32 flex items-center justify-center py-10 md:py-0 transition-colors",
                isCompleted
                  ? "bg-green-50 text-brand-success"
                  : !isUnlocked
                    ? "bg-gray-100 text-gray-400"
                    : isInteractive
                      ? "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100"
                      : "bg-gray-50 text-brand-ink group-hover:bg-indigo-50 group-hover:text-brand-primary"
              )}>
                {isCompleted ? <CheckCircle size={32} /> : !isUnlocked ? <LockIcon size={32} /> : <Play size={32} fill="currentColor" />}
              </div>
              <div className="p-8 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className={cn("text-xl font-bold", isUnlocked ? "text-brand-ink" : "text-gray-400")}>{lesson.title}</h3>
                    {isCompleted && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">Finished</span>
                    )}
                    {!isUnlocked && (
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">Locked</span>
                    )}
                  </div>
                  <p className={cn("text-sm leading-relaxed", isUnlocked ? "text-brand-text-muted" : "text-gray-400")}>{lesson.description}</p>
                </div>

                {!isUnlocked && (
                  <Button
                    variant={user && user.xp >= unlockCost ? "default" : "outline"}
                    disabled={!user || user.xp < unlockCost}
                    onClick={(e) => handleUnlock(lesson, unlockCost, e)}
                    className="whitespace-nowrap"
                  >
                    Unlock • {unlockCost} XP
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const LockIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
