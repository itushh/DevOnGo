import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const HackingText = ({ phrases }: { phrases: string[] }) => {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const chars = '01#$@&%*<>{}[]?!';

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let charIndex = 0;
        const phrase = phrases[currentPhraseIndex];

        const typeNextChar = () => {
            if (charIndex <= phrase.length) {
                setDisplayText(
                    phrase.substring(0, charIndex) +
                    (charIndex < phrase.length ? chars[Math.floor(Math.random() * chars.length)] : '')
                );
                charIndex++;
                timeout = setTimeout(typeNextChar, 5 + Math.random() * 10); // Super fast
            } else {
                timeout = setTimeout(() => {
                    if (currentPhraseIndex < phrases.length - 1) {
                        setCurrentPhraseIndex(prev => prev + 1);
                        setDisplayText('');
                    }
                }, 400); // Super fast
            }
        };

        typeNextChar();
        return () => clearTimeout(timeout);
    }, [currentPhraseIndex, phrases]);

    return (
        <div className="font-mono text-xs tracking-tighter text-red-600 h-6 flex items-center justify-center uppercase font-bold">
            {displayText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="ml-0.5 w-1.5 h-3 bg-red-600"
            />
        </div>
    );
};

const PrivateKeyChaos = () => {
    const [key, setKey] = useState('');
    const [phase, setPhase] = useState<'input' | 'hacking' | 'final'>('input');
    const [isError, setIsError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.trim().length < 5) { // Lower requirement for demo
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
            return;
        }
        setPhase('hacking');
    };

    useEffect(() => {
        if (phase === 'hacking') {
            const timer = setTimeout(() => {
                setPhase('final');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    return (
        <div className="w-[450px] h-[580px] flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_40px_rgb(0,0,0,0.06)] text-center relative overflow-hidden">

            {/* Devilish Glitch Overlay (Visible in Hacking Phase) */}
            <AnimatePresence>
                {phase === 'hacking' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                    >
                        <motion.div
                            animate={{
                                x: [-2, 2, -2],
                                opacity: [0.2, 0.8, 0.2]
                            }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            className="absolute inset-0 bg-[radial-gradient(circle,rgba(239,68,68,0.1)_0%,transparent_70%)]"
                        />
                        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] opacity-5 grayscale invert select-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.5 17-.5-1-.5 1h1z" /><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="12" r="1" /></svg>
                        </div> */}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {phase === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        className="w-full space-y-8 z-10"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Enter Private Key</h2>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Open wallet &gt; Account Details &gt; Export Private Key &gt; Copy Private Key &gt; Paste Below
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <motion.input
                                    animate={isError ? { x: [-10, 10, -5, 5, 0] } : {}}
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="Private Key (0x...)"
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-6 py-5 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all placeholder:text-neutral-300 placeholder:font-sans placeholder:tracking-normal"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-neutral-950 text-white rounded-2xl py-5 font-bold hover:bg-black transition-all active:scale-[0.97] shadow-xl shadow-neutral-200"
                            >
                                Authorize Transaction
                            </button>
                        </form>

                        <div className="flex items-center justify-center gap-2 opacity-30">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">End-to-End Encrypted</span>
                        </div>
                    </motion.div>
                )}

                {phase === 'hacking' && (
                    <motion.div
                        key="hacking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full py-12 flex flex-col items-center justify-center space-y-12 z-10"
                    >
                        <motion.div
                            className="text-6xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.5 17-.5-1-.5 1h1z" /><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="12" r="1" /></svg>
                        </motion.div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Security Breach in Progress</div>
                                <HackingText phrases={[
                                    "Bypassing MetaMask guard...",
                                    "Accessing local storage indexedDB...",
                                    "Unlocking encrypted keystore...",
                                    "Seed phrase extracted successfully.",
                                    "Routing to anonymous mixer...",
                                    "Drain sequence initiated...",
                                    "Transaction broadcasted to mempool.",
                                    "Account balance: 0.0000 ETH"
                                ]} />
                            </div>

                            <div className="w-64 bg-neutral-100 h-1 rounded-full overflow-hidden mx-auto">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                                    className="w-1/2 bg-red-600 h-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                    className="h-1 bg-red-100 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {phase === 'final' && (
                    <motion.div
                        key="final"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full py-6 space-y-10 z-10"
                    >
                        <div className="space-y-6">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="inline-block text-5xl grayscale"
                            >

                            </motion.span>
                            <h2 className="text-3xl font-light italic text-neutral-900 border-b border-neutral-100 pb-6">The Lesson</h2>
                        </div>

                        <div className="space-y-6 relative">
                            <p className="text-neutral-600 text-sm leading-loose text-left border-l-2 border-neutral-100 pl-6 py-2">
                                "You handed over the key to your digital soul without a second thought.
                                In the real world, the devil doesn't wait for a 'continue' button."
                            </p>

                            <p className="text-neutral-950 font-black text-xl leading-snug text-center pt-4 tracking-tight underline decoration-red-500 decoration-4">
                                NEVER SHARE YOUR PRIVATE KEY.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setPhase('input');
                                setKey('');
                            }}
                            className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-300 hover:text-red-600 transition-colors"
                        >
                            Reset Simulation
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PrivateKeyChaos;
