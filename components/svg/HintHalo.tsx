
import React from 'react';
import type { Node } from '../../types';

interface HintHaloProps {
  node: Node;
}

const HintHalo: React.FC<HintHaloProps> = ({ node }) => (
  <circle 
    className="hint-halo" 
    cx={node.x} 
    cy={node.y} 
    r="24" 
    style={{ transformOrigin: `${node.x}px ${node.y}px` }} 
  />
);

export default HintHalo;
