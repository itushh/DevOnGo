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

// Interactive Components Imports
import BlockChainBreak from '@/src/components/interactive/BlockChainBreak';
import InstallMetaMask from '@/src/components/interactive/InstallMetaMask';
import PrivateKeyChaos from '@/src/components/interactive/PrivateKeyChaos';
import CheckHelaConnection from '@/src/components/interactive/CheckHelaConnection';
import WalletCreateAndConnect from '@/src/components/interactive/WalletCreateAndConnect';
import WalletAddress from '@/src/components/interactive/WalletAddress';
import CheckBalance from '@/src/components/interactive/CheckBalance';
import SendToSelf from '@/src/components/interactive/SendToSelf';
import SendToUs from '@/src/components/interactive/SendToUs';
import { Link } from 'react-router-dom';

const INTERACTIVE_COMPONENTS: Record<string, React.ComponentType> = {
  'intro-to-web3': BlockChainBreak,
  'wallets-101': InstallMetaMask,
  'private-keys-security': PrivateKeyChaos,
  'blockchain-networks': CheckHelaConnection,
  'transactions-tx': WalletCreateAndConnect,
  'defi-overview': WalletAddress,
  'tokens-and-swaps': CheckBalance,
  'liquidity-pools': SendToSelf,
  'staking-yield': SendToUs,
};

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { user, setUser } = useUser();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
  const [isLocked, setIsLocked] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const InteractiveComponent = selectedLesson ? INTERACTIVE_COMPONENTS[selectedLesson.id] : null;

  const handleCompleteLesson = async () => {
    if (!user || !selectedLesson || isSubmitting) return;
    setIsSubmitting(true);

    const isAlreadyCompleted = user.completed_lessons.includes(selectedLesson.id);
    const newCompleted = isAlreadyCompleted
      ? user.completed_lessons
      : [...user.completed_lessons, selectedLesson.id];

    const xpReward = isAlreadyCompleted ? 0 : 100;
    const oldLevel = user.level;
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
      setShowConfirmPopup(false);
      setLessonComplete(true);

      // Achievement Logic
      if (!isAlreadyCompleted) {
        if (newCompleted.length >= 3) {
          await unlockAchievement(user.id, 'web3-beginner');
        }
        if (newCompleted.length >= 10) {
          await unlockAchievement(user.id, 'streak-7');
        }
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedLesson) {
    const question = selectedLesson.questions[currentQuestionIdx];
    const hasInteractive = !!INTERACTIVE_COMPONENTS[selectedLesson.id];
    const progress = ((currentQuestionIdx + (showTask ? 1 : 0)) / (selectedLesson.questions.length + (hasInteractive ? 1 : 0))) * 100;

    return (
      <div className=" px-20 py-10">
        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-brand-text-muted hover:text-brand-ink" onClick={() => setSelectedLesson(null)}>
          <ArrowLeft size={18} className="mr-2" /> Back to Curriculum
        </Button>

        {/* Progress Bar */}
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
                    } else if (hasInteractive && !showTask) {
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
              <Card className="p-10 border-2 border-dashed border-brand-primary/20 bg-brand-primary/5 shadow-inner overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Final Objective
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6 text-brand-primary">
                  <Sparkles size={28} className="animate-pulse" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Web3 Mission</h2>
                </div>

                <div className="mb-10 min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-indigo-100 shadow-xl p-8 transition-all hover:shadow-2xl hover:border-brand-primary/30">
                  {InteractiveComponent ? (
                    <InteractiveComponent />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Wallet size={32} />
                      </div>
                      <p className="text-brand-text-muted font-medium italic">Interactive task module loading...</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    size="xl"
                    className="px-20 py-8 text-lg rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={() => setShowConfirmPopup(true)}
                  >
                    Success: Complete Mission
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-xl p-4"
            >
              {/* Confetti Elements */}
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    top: '50%',
                    left: '50%',
                    scale: 0,
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    scale: Math.random() * 1.5,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    ease: "easeOut",
                    delay: i * 0.02
                  }}
                  className={cn(
                    "absolute w-3 h-3 rounded-sm z-0",
                    ["bg-brand-primary", "bg-brand-secondary", "bg-brand-success", "bg-yellow-400", "bg-pink-400"][i % 5]
                  )}
                />
              ))}

              <motion.div
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="relative z-10 w-full max-w-xl bg-white border border-brand-border rounded-[40px] p-12 shadow-[0_32px_128px_rgba(0,0,0,0.15)] text-center overflow-hidden"
              >
                {/* Success Ring */}
                <div className="mb-10 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-28 h-28 bg-brand-success text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-success/30 relative z-10"
                  >
                    <CheckCircle size={56} strokeWidth={3} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-brand-success rounded-full flex items-center justify-center scale-0"
                  />
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-black mb-4 uppercase tracking-tighter text-brand-ink"
                >
                  Mission Accomplished
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-brand-text-muted mb-10"
                >
                  You've mastered <b>{selectedLesson.title}</b>.
                </motion.p>

                {/* Reward Cards */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-brand-primary/5 border border-brand-primary/10 rounded-3xl p-6"
                  >
                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">XP Earned</div>
                    <div className="text-3xl font-black text-brand-ink">+100</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6"
                  >
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Current Level</div>
                    <div className="text-3xl font-black text-brand-ink">{user?.level}</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    size="xl"
                    className="w-full py-8 text-xl rounded-2xl shadow-lg shadow-brand-primary/20 group"
                    onClick={() => {
                      setSelectedLesson(null);
                      setLessonComplete(false);
                      setShowTask(false);
                      setCurrentQuestionIdx(0);
                      setSelectedAnswer(undefined);
                      setIsLocked(false);
                    }}
                  >
                    Continue Exploring
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Confirmation Popup */}
          <AnimatePresence>
            {showConfirmPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-brand-border"
                >
                  <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-ink mb-2">Submit Mission?</h3>
                  <p className="text-brand-text-muted mb-8 text-lg">
                    Are you sure you want to finalize this Web3 task? You'll earn 100 XP upon submission.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      className="w-full py-6 text-base font-bold rounded-xl shadow-lg shadow-brand-primary/20"
                      onClick={handleCompleteLesson}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Yes, Submit Mission'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full py-6 text-base font-medium text-brand-text-muted hover:bg-gray-50 rounded-xl"
                      onClick={() => setShowConfirmPopup(false)}
                    >
                      Wait, Not Yet
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
    <div className="max-w-250 mx-auto px-8 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2 text-brand-ink">Curriculum</h1>
      <p className="text-brand-text-muted mb-12">Spend XP to unlock advanced Web3 topics and continue your journey.</p>

      <div className="space-y-4">
        {lessons.map((lesson, idx) => {
          const isCompleted = user?.completed_lessons.includes(lesson.id);
          const isUnlocked = user?.unlocked_modules?.includes(lesson.id) || idx === 0;
          const unlockCost = 25 + (idx * 25);

          if (idx < -1) {
            return (
              <Link to={`/learnx/${idx}`}>
                <Card
                  key={lesson.id}
                  className={cn(
                    "p-0 overflow-hidden flex flex-col md:flex-row group relative",
                    !isUnlocked ? "bg-gray-50/80" : "hover:border-brand-primary transition-all cursor-pointer"
                  )}
                  onClick={() => isUnlocked && setSelectedLesson(lesson)}
                >
                  <div className={cn(
                    "w-full md:w-32 flex items-center justify-center py-10 md:py-0 transition-colors",
                    isCompleted ? "bg-green-50 text-brand-success" : !isUnlocked ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-brand-ink group-hover:bg-indigo-50 group-hover:text-brand-primary"
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
                        variant={user && user.xp >= unlockCost ? "primary" : "outline"}
                        disabled={!user || user.xp < unlockCost}
                        onClick={(e) => handleUnlock(lesson, unlockCost, e)}
                        className="whitespace-nowrap"
                      >
                        Unlock • {unlockCost} XP
                      </Button>
                    )}
                  </div>
                </Card>
              </Link>
            );
          } else {
            return (
              <Card
                key={lesson.id}
                className={cn(
                  "p-0 overflow-hidden flex flex-col md:flex-row group relative",
                  !isUnlocked ? "bg-gray-50/80" : "hover:border-brand-primary transition-all cursor-pointer"
                )}
                onClick={() => isUnlocked && setSelectedLesson(lesson)}
              >
                <div className={cn(
                  "w-full md:w-32 flex items-center justify-center py-10 md:py-0 transition-colors",
                  isCompleted ? "bg-green-50 text-brand-success" : !isUnlocked ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-brand-ink group-hover:bg-indigo-50 group-hover:text-brand-primary"
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
                      variant={user && user.xp >= unlockCost ? "primary" : "outline"}
                      disabled={!user || user.xp < unlockCost}
                      onClick={(e) => handleUnlock(lesson, unlockCost, e)}
                      className="whitespace-nowrap"
                    >
                      Unlock • {unlockCost} XP
                    </Button>
                  )}
                </div>
              </Card>
            )
          }
        })}
      </div>
    </div>
  );
}

const LockIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
