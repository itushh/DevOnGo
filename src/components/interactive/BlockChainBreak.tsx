import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ethers } from 'ethers';

// Simple text hack animation component
const TextHack = ({ text, className }: { text: string; className?: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = 'ABCDEF0123456789';
    const iteration = useRef(0);

    useEffect(() => {
        iteration.current = 0;
        const interval = setInterval(() => {
            setDisplay(() =>
                text
                    .split('')
                    .map((_, index) => {
                        if (index < iteration.current) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            if (iteration.current >= text.length) {
                clearInterval(interval);
            }

            iteration.current += 1 / 3;
        }, 20);

        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{display}</span>;
};

interface Block {
    id: number;
    data: string;
    prevHash: string;
    hash: string;
}

const BlockChainBreak = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [invalidIndex, setInvalidIndex] = useState<number | null>(null);

    // Initialize blocks
    useEffect(() => {
        const initialBlocks: Block[] = [];
        let prevHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

        for (let i = 0; i < 3; i++) {
            const data = `Transaction Data ${i + 1}`;
            const hash = ethers.id(i + prevHash + data);
            initialBlocks.push({
                id: i,
                data,
                prevHash,
                hash
            });
            prevHash = hash;
        }
        setBlocks(initialBlocks);
    }, []);

    const handleDataChange = (id: number, newData: string) => {
        setBlocks(prev => {
            const nextBlocks = [...prev];
            const blockIndex = nextBlocks.findIndex(b => b.id === id);
            if (blockIndex === -1) return prev;

            nextBlocks[blockIndex].data = newData;
            // Recalculate hash for THIS block
            nextBlocks[blockIndex].hash = ethers.id(id + nextBlocks[blockIndex].prevHash + newData);

            // Check where the chain breaks
            let firstBreak = null;
            for (let i = 1; i < nextBlocks.length; i++) {
                if (nextBlocks[i].prevHash !== nextBlocks[i - 1].hash) {
                    firstBreak = i;
                    break;
                }
            }
            setInvalidIndex(firstBreak);

            return nextBlocks;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 md:p-12 w-full h-full bg-neutral-950 text-white overflow-hidden border border-white/5 relative">
            {/* Background decoration */}
            {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div> */}

            {/* <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Blockchain Integrity
                </h2>
                <p className="text-neutral-400 max-w-lg mx-auto">
                    Every block is cryptographically linked. Tampering with data in one block invalidates the entire chain downstream.
                </p>
            </motion.div> */}

            <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-0 w-full max-w-7xl overflow-x-auto pb-4">
                {blocks.map((block, index) => {
                    const isInvalid = invalidIndex !== null && index >= invalidIndex;

                    return (
                        <React.Fragment key={block.id}>
                            {/* Connector */}
                            {index > 0 && (
                                <div className="relative h-16 w-[2px] lg:h-[2px] lg:w-20">
                                    <motion.div
                                        /* initial={false}
                                        animate={{
                                            backgroundColor: isInvalid ? 'rgba(0,0,0,0)' : '#3b82f6',
                                        }} */
                                        style={{
                                            backgroundColor: isInvalid ? 'rgba(0,0,0,0)' : '#3b82f6',
                                        }}
                                        className="absolute inset-0"
                                    />
                                    {/* {isInvalid && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-[10px] font-black px-1.5 py-0.5 rounded leading-none z-10"
                                        >
                                            BREAK
                                        </motion.div>
                                    )} */}
                                </div>
                            )}

                            {/* Block Card */}
                            <motion.div
                                layout
                                animate={{
                                    x: isInvalid ? [0, -2, 2, -1, 1, 0] : 0,
                                    borderColor: isInvalid ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                                }}
                                transition={{
                                    x: { repeat: isInvalid ? Infinity : 0, duration: 0.5 },
                                    duration: 0.3
                                }}
                                className={`relative group shrink-0 w-full lg:w-80 p-6 rounded-2xl border bg-neutral-900/50 backdrop-blur-xl transition-all duration-500 hover:shadow-blue-500/5 ${isInvalid ? 'shadow-red-500/10 border-red-500/30' : 'border-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${isInvalid ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'}`} />
                                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Block #{block.id}</span>
                                    </div>
                                    {/* <div className="text-[10px] font-mono text-neutral-600 bg-white/5 px-2 py-0.5 rounded">
                                        0000...{block.hash.substring(60)}
                                    </div> */}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-tighter text-neutral-500">Payload Data</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={block.data}
                                                onChange={(e) => handleDataChange(block.id, e.target.value)}
                                                className="w-full text-center bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[9px] font-bold uppercase tracking-tighter text-neutral-600">Prev Hash</label>
                                            </div>
                                            <div className="text-[10px] font-mono break-all text-neutral-500 bg-black/20 p-2 rounded border border-white/5 opacity-60">
                                                {block.prevHash.substring(0, 32)}...
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[9px] font-bold uppercase tracking-tighter text-neutral-600">Current Hash</label>
                                                {isInvalid && <span className="text-[9px] text-red-500 font-bold animate-pulse">MISMATCH</span>}
                                            </div>
                                            <div className={`text-[10px] font-mono break-all p-2 rounded border transition-colors ${isInvalid ? 'text-red-400 bg-red-500/5 border-red-500/20' : 'text-blue-400 bg-blue-500/5 border-blue-500/20'
                                                }`}>
                                                <TextHack text={block.hash.substring(0, 32)} />...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>

            <AnimatePresence>
                {invalidIndex !== null ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="mt-16 flex flex-col items-center gap-4"
                    >
                        <div className="flex items-center gap-2 text-red-400 text-sm font-medium bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                            {/* <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg> */}
                            Chain broken at Block #{invalidIndex}
                        </div>

                        <button
                            onClick={() => {
                                const fixedBlocks: Block[] = [];
                                let prevHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
                                blocks.forEach((b, i) => {
                                    const hash = ethers.id(i + prevHash + b.data);
                                    fixedBlocks.push({ ...b, prevHash, hash });
                                    prevHash = hash;
                                });
                                setBlocks(fixedBlocks);
                                setInvalidIndex(null);
                            }}
                            className="px-8 py-3 bg-linear-to-r text-white rounded-xl text-sm font-bold transition-all active:scale-95 group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Repair Chain Structure
                            </span>
                        </button>
                    </motion.div>
                ) : (
                    <div className='mt-10'>Try to change Block #2</div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlockChainBreak;
