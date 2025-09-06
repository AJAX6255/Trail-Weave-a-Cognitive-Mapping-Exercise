import React from 'react';
import type { Node } from '../../types';

interface SvgNodeProps {
  node: Node;
  isNext: boolean;
  isPassed: boolean;
  isCurrent: boolean;
}

const SvgNode: React.FC<SvgNodeProps> = ({ node, isNext, isPassed, isCurrent }) => {
  const isNumber = !isNaN(parseInt(node.label, 10));
  const nodeTypeClass = isNumber ? 'node-number' : 'node-letter';
  const statusClass = isNext ? 'is-next' : isPassed ? 'is-passed' : '';
  
  return (
    <g 
      id={`node-group-${node.id}`} 
      className={`node-group ${nodeTypeClass} ${statusClass}`} 
    >
      <circle 
        id={`node-circle-hitbox-${node.id}`}
        className="node-circle-hitbox"
        cx={node.x} 
        cy={node.y} 
        r="30"
        style={{ pointerEvents: isCurrent ? 'all' : 'none' }}
      />
      <circle 
        className="node-circle-main"
        cx={node.x} 
        cy={node.y} 
        r="20"
      />
      <text
        className="node-label"
        x={node.x}
        y={node.y}
        dominantBaseline="middle"
        alignmentBaseline="middle"
      >
        {node.label}
      </text>
    </g>
  );
};

export default SvgNode;