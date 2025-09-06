import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../store/gameStore';
import { geometry } from '../services/geometry';
import { SVG_VIEWBOX_WIDTH, SVG_VIEWBOX_HEIGHT, DEFAULTS, SNAP_RADIUS } from '../constants';
import type { Point } from '../types';
import SvgNode from './svg/Node';
import CommittedPath from './svg/CommittedPath';
import HintHalo from './svg/HintHalo';
import SettingsPanel from './SettingsPanel';

const GameScreen: React.FC = () => {
    const puzzle = useStore(state => state.puzzle);
    const sessionPath = useStore(state => state.session?.path);
    const hintsUsed = useStore(state => state.session?.hints ?? 0);
    const makeGuess = useStore(state => state.makeGuess);
    const showHint = useStore(state => state.showHint);
    const loadNewGame = useStore(state => state.loadNewGame);

    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isControlsVisible, setControlsVisible] = useState(false);
    const [activePath, setActivePath] = useState<string | null>(null);
    const [showHintHalo, setShowHintHalo] = useState(false);

    const svgRef = useRef<SVGSVGElement>(null);
    const activePointerId = useRef<number | null>(null);
    const interactionState = useRef<'idle' | 'dragging'>('idle');

    const lastNodeId = useMemo(() => sessionPath?.[sessionPath.length - 1], [sessionPath]);
    const nextNodeIndex = useMemo(() => sessionPath ? sessionPath.length : -1, [sessionPath]);
    const nextNodeId = useMemo(() => puzzle && nextNodeIndex < puzzle.order.length ? puzzle.order[nextNodeIndex] : null, [puzzle, nextNodeIndex]);
    const isFinished = !nextNodeId;

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isFinished || !svgRef.current || !lastNodeId || !puzzle || activePointerId.current !== null) return;
        
        const hitbox = document.getElementById(`node-circle-hitbox-${lastNodeId}`);
        if(e.target === hitbox) {
            e.currentTarget.setPointerCapture(e.pointerId);
            activePointerId.current = e.pointerId;
            interactionState.current = 'dragging';
            const startNode = puzzle.nodes[lastNodeId];
            const startPoint = `${startNode.x},${startNode.y}`;
            const pointerPoint = geometry.screenToSvg(svgRef.current, e.clientX, e.clientY);
            setActivePath(`${startPoint} ${pointerPoint.x},${pointerPoint.y}`);
        }
    };
    
    const handlePointerMove = (e: React.PointerEvent) => {
        if (interactionState.current !== 'dragging' || e.pointerId !== activePointerId.current) return;

        if (!svgRef.current || !lastNodeId || !puzzle || !nextNodeId) return;
        
        const startNode = puzzle.nodes[lastNodeId];
        const startPoint = `${startNode.x},${startNode.y}`;
        
        const pointerPointSvg = geometry.screenToSvg(svgRef.current, e.clientX, e.clientY);
        const nextNode = puzzle.nodes[nextNodeId];

        let endPointSvg: Point;

        if (geometry.distance(pointerPointSvg, nextNode) < SNAP_RADIUS) {
            endPointSvg = { x: nextNode.x, y: nextNode.y };
        } else {
            endPointSvg = pointerPointSvg;
        }
        
        setActivePath(`${startPoint} ${endPointSvg.x},${endPointSvg.y}`);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (e.pointerId !== activePointerId.current) return;

        e.currentTarget.releasePointerCapture(e.pointerId);
        activePointerId.current = null;
        interactionState.current = 'idle';
        
        const wasDragging = !!activePath;
        setActivePath(null);

        if (wasDragging) {
            if (!nextNodeId || !puzzle || !svgRef.current || !lastNodeId) return;

            const releasePoint = geometry.screenToSvg(svgRef.current, e.clientX, e.clientY);
            const nextNode = puzzle.nodes[nextNodeId];
            
            if (geometry.distance(releasePoint, nextNode) < SNAP_RADIUS) {
                let isCrossing = false;
                const lastNode = puzzle.nodes[lastNodeId];
                if (sessionPath && sessionPath.length > 1) {
                    for (let i = 0; i < sessionPath.length - 2; i++) {
                        const p1 = puzzle.nodes[sessionPath[i]];
                        const q1 = puzzle.nodes[sessionPath[i+1]];
                        if (geometry.segmentsIntersect(p1, q1, lastNode, nextNode)) {
                            isCrossing = true;
                            break;
                        }
                    }
                }
                
                if (!isCrossing) {
                    makeGuess({ success: true, nextNodeId });
                } else {
                    makeGuess({ success: false, nextNodeId: '' });
                }
            } else {
                 makeGuess({ success: false, nextNodeId: '' });
            }
        }
    };

    const handleHint = () => {
        if(isFinished) return;
        showHint();
        setShowHintHalo(true);
        setTimeout(() => setShowHintHalo(false), 1500);
    }

    const handleReset = () => {
        setControlsVisible(false);
        loadNewGame({ ...DEFAULTS, seed: Date.now().toString() });
    }
    
    if (!puzzle || !sessionPath) return null;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
            <div className="flex-grow w-full max-w-5xl flex items-center justify-center shadow-lg rounded-lg bg-white/50 overflow-hidden">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
                    className="w-full h-full touch-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <g>
                        <CommittedPath path={sessionPath} nodesById={puzzle.nodes} />

                        {Object.values(puzzle.nodes).map(node => (
                            <SvgNode 
                                key={node.id} 
                                node={node} 
                                isNext={false}
                                isPassed={sessionPath.includes(node.id) && node.id !== lastNodeId}
                                isCurrent={node.id === lastNodeId}
                            />
                        ))}

                        {activePath && <polyline className="active-path" points={activePath} />}
                        
                        {showHintHalo && nextNodeId && <HintHalo node={puzzle.nodes[nextNodeId]}/>}
                    </g>
                </svg>
            </div>
            
            <button
                onClick={() => setControlsVisible(prev => !prev)}
                className="absolute top-4 right-4 z-30 w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-xl text-2xl hover:bg-gray-200 transition-colors"
                aria-label="Toggle game controls"
            >
                ⚙️
            </button>

            {isControlsVisible && (
            <div className="absolute top-20 right-4 z-20 flex flex-col items-stretch gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-xl w-40">
                <button onClick={handleHint} className="text-lg font-semibold px-4 h-11 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-left">
                    Hint ({hintsUsed})
                </button>
                <button onClick={handleReset} className="text-lg font-semibold px-4 h-11 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-left">
                    Reset
                </button>
                <button onClick={() => { setSettingsOpen(true); setControlsVisible(false); }} className="text-lg font-semibold px-4 h-11 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-left">
                    Settings
                </button>
            </div>
            )}

            {isSettingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
        </div>
    );
};

export default GameScreen;