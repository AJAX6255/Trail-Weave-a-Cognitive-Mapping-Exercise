
import type { Point } from '../types';

export const geometry = {
  distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  },

  onSegment(p: Point, q: Point, r: Point): boolean {
    return (
      q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
    );
  },

  orientation(p: Point, q: Point, r: Point): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // Collinear
    return (val > 0) ? 1 : 2; // Clockwise or Counterclockwise
  },

  segmentsIntersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {
    if ((p1.x === p2.x && p1.y === p2.y) || (p1.x === q2.x && p1.y === q2.y) ||
        (q1.x === p2.x && q1.y === p2.y) || (q1.x === q2.x && q1.y === q2.y)) {
      return false; // Segments share an endpoint
    }

    const o1 = this.orientation(p1, q1, p2);
    const o2 = this.orientation(p1, q1, q2);
    const o3 = this.orientation(p2, q2, p1);
    const o4 = this.orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;

    // Special Cases for collinear points
    if (o1 === 0 && this.onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && this.onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && this.onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && this.onSegment(p2, q1, q2)) return true;

    return false;
  },

  screenToSvg(svg: SVGSVGElement, screenX: number, screenY: number): Point {
    const pt = svg.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
        return pt.matrixTransform(ctm.inverse());
    }
    return { x: 0, y: 0 };
  }
};
