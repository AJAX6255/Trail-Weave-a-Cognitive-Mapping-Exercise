
import React from 'react';
import type { Node } from '../../types';

interface CommittedPathProps {
  path: string[];
  nodesById: Record<string, Node>;
}

const CommittedPath: React.FC<CommittedPathProps> = ({ path, nodesById }) => {
  if (path.length < 2) return null;
  
  const d = path.map(id => {
      const node = nodesById[id];
      return `${node.x},${node.y}`;
  }).join(' ');
  
  return <polyline className="committed-path" points={d} />;
};

export default CommittedPath;
