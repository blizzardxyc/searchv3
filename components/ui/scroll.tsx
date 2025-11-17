'use client';

import React, { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const topics = [
    {
        id: 'a',
        title: 'DeepBoards',
        content:
            'Hop in and it starts cookin’ instantly notes, sketches, boards, all in one spot. Boutta map out my entire project like it’s a boss fight. IRL Notion ain’t doing the visuals like this, and Figma ain’t taking notes this clean'
    },
    {
        id: 'b',
        title: 'DeepCanvas',
        content:
            'Canvas kicks in smooth af, imma start dragging nodes, sketching flows, dropping sticky notes like loot. Squad collab be moving irl fast. Finna map out whole projects here.'
    },
    {
        id: 'c',
        title: 'DeepCodes',
        content:
            'This editor lowkey feels like VS Code but on turbo mode. Soon as the engine kicks in, imma start cookin’ code, slappin’ files around, and debugging like a boss fight. Finna ship something wild.'
    },
    {
        id: 'd',
        title: 'DeepFeeds',
        content:
            'This app lowkey feels like Insta but actually smooth af. Feed kicks in clean, imma start scrollin’, droppin’ likes, postin’ pics like it’s nothing. Finna be my new place to flex irl moments.'
    },
    {
        id: 'e',
        title: 'DeepForms',
        content:
            'Google Forms vibes but smoother and cracked. Build fast, share instantly, collect answers like loot drops.'
    },
    {
        id: 'f',
        title: 'DeepMeets',
        content:
            'This app lowkey feels like Zoom but actually cracked. Call kicks in clean af, imma hop in, mute myself instantly, and vibe while the squad yaps. Finna be our new VC home.'
    },
    {
        id: 'g',
        title: 'DeepNotes',
        content:
            'This got that ‘Notion but built for cracked multitaskers’ energy. Blocks kick in smooth af, imma build docs, wikis, tasks everything clicks together like Lego. Finna be my whole second brain.'
    },
    {
        id: 'h',
        title: 'DeepProjects',
        content:
            'Hop in and it starts cookin’ kanban smooth, tasks snappin’, updates hittin’ fast. Boutta run sprints, track bugs, and pretend we’ll finish everything on time. IRL Jira ain’t even movin’ like this.'
    },
    {
        id: 'i',
        title: 'DeepTopics',
        content:
            'Feels like managing a whole company in a giant group chat msgs flying, @mentions beefin’, threads cookin’ nonstop. Imma be keyboard-mashing my way through standups now.'
    },
    {
        id: 'j',
        title: 'DeepWebs',
        content:
            'Drag. Drop. Cook. Website builder on gamer mode fast af, smooth UI, zero coding. Finna be your new site-forge.'
    }
];

export function ScrollProgress() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const doc = document.documentElement;
            const totalHeight = doc.scrollHeight - window.innerHeight;
            const progress = Math.min((window.scrollY / totalHeight) * 100, 100);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTopicClick = (id: string) => {
        setActiveTopicId(id);
        setTimeout(() => setActiveTopicId(null), 1800);

        // CLOSE MENU
        setIsOpen(false);

        // SMOOTH SCROLL + OFFSET
        const el = document.getElementById(id);
        if (el) {
            const offset = -120; // 👈 how much space from top (increase if needed)
            const elementTop = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementTop + offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className='relative min-h-screen p-8'>
            <div className='container'>
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        id={topic.id}
                        className={`topic mb-12 ${activeTopicId === topic.id ? 'animate-flash' : ''}`}>
                        <h4 className='mb-4 text-xl font-bold'>{topic.title}</h4>
                        <p className='mb-4 text-gray-700'>{topic.content}</p>
                    </div>
                ))}
            </div>

            {/* Floating Card */}
            <motion.div
                className='fixed top-[7%] left-1/2 z-10 flex flex-col items-center justify-center rounded-3xl bg-zinc-950 p-4 shadow-lg'
                style={{ x: '-50%', y: '-7%' }}
                animate={{
                    height: isOpen ? 390 : 50,
                    width: isOpen ? 300 : 210
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }}>
                <div className='flex h-[18px] w-full items-center justify-between'>
                    <div className='flex cursor-pointer items-center' onClick={() => setIsOpen(!isOpen)}>
                        <motion.div
                            className='bg-opacity-30 mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-white'
                            style={{
                                background: `conic-gradient(white ${scrollProgress}%, transparent 0)`
                            }}>
                            <div className='h-5 w-5 rounded-full bg-zinc-950' />
                        </motion.div>
                        <span className='text-white'>About</span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <ChevronDown className='mx-1 text-white' />
                        </motion.div>
                    </div>
                    <div className='bg-opacity-30 flex h-8 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white'>
                        {scrollProgress.toFixed(0)}%
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className='links mt-4 flex w-full flex-col space-y-2'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}>
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => handleTopicClick(topic.id)}
                                    className='text-left text-gray-400 transition-colors duration-200 hover:text-white'>
                                    {topic.title}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {isOpen && (
                <div
                    className='bg-opacity-10 fixed inset-0 z-[5] bg-black backdrop-blur-sm'
                    onClick={() => setIsOpen(false)}
                />
            )}

            <style jsx global>{`
                @keyframes flash {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.4;
                    }
                }
                .animate-flash {
                    animation: flash 0.7s ease 2;
                }
            `}</style>
        </div>
    );
}
