import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Plus, Trash2, Eye, EyeOff, Sparkles, Activity } from 'lucide-react';
import { SafeExpressionParser, formatResultNumber } from '../../engine/safeParser';

interface FunctionCurve {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
}

const DEFAULT_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export const GraphingEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [curves, setCurves] = useState<FunctionCurve[]>([
    { id: '1', expr: 'sin(x)', color: '#8b5cf6', visible: true },
    { id: '2', expr: 'x^2 - 4', color: '#06b6d4', visible: true },
  ]);

  // Viewport bounds
  const [viewport, setViewport] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -6,
    yMax: 6,
  });

  // Cursor coordinates
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewportStartRef = useRef(viewport);

  // Add new function
  const handleAddCurve = () => {
    const nextColor = DEFAULT_COLORS[curves.length % DEFAULT_COLORS.length];
    setCurves(prev => [
      ...prev,
      { id: Date.now().toString(), expr: 'cos(x)', color: nextColor, visible: true }
    ]);
  };

  const handleUpdateExpr = (id: string, newExpr: string) => {
    setCurves(prev => prev.map(c => c.id === id ? { ...c, expr: newExpr } : c));
  };

  const handleToggleVisible = (id: string) => {
    setCurves(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const handleDeleteCurve = (id: string) => {
    if (curves.length <= 1) return;
    setCurves(prev => prev.filter(c => c.id !== id));
  };

  const handleResetView = () => {
    setViewport({ xMin: -10, xMax: 10, yMin: -6, yMax: 6 });
  };

  const handleZoom = (factor: number) => {
    setViewport(v => {
      const xRange = (v.xMax - v.xMin) * factor;
      const yRange = (v.yMax - v.yMin) * factor;
      const xMid = (v.xMin + v.xMax) / 2;
      const yMid = (v.yMin + v.yMax) / 2;
      return {
        xMin: xMid - xRange / 2,
        xMax: xMid + xRange / 2,
        yMin: yMid - yRange / 2,
        yMax: yMid + yRange / 2,
      };
    });
  };

  // Render Canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, width, height);

    const { xMin, xMax, yMin, yMax } = viewport;

    // Coordinate transforms
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (px: number) => xMin + (px / width) * (xMax - xMin);
    const toMathY = (py: number) => yMin + ((height - py) / height) * (yMax - yMin);

    // Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e1e24';
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';

    // Step calculation
    const xSpan = xMax - xMin;
    const xStep = Math.pow(10, Math.floor(Math.log10(xSpan))) / 2;

    for (let x = Math.floor(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (Math.abs(x) > 1e-6) {
        ctx.fillText(formatResultNumber(x, 2), sx + 4, toScreenY(0) + 12);
      }
    }

    const ySpan = yMax - yMin;
    const yStep = Math.pow(10, Math.floor(Math.log10(ySpan))) / 2;

    for (let y = Math.floor(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(y) > 1e-6) {
        ctx.fillText(formatResultNumber(y, 2), toScreenX(0) + 4, sy - 4);
      }
    }

    // Draw Axes (X and Y = 0)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#475569';

    // X Axis
    const yZero = toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(0, yZero);
    ctx.lineTo(width, yZero);
    ctx.stroke();

    // Y Axis
    const xZero = toScreenX(0);
    ctx.beginPath();
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, height);
    ctx.stroke();

    // Plot Curves
    const parser = new SafeExpressionParser('RAD'); // Calculus and graphing use Radians

    curves.forEach((curve) => {
      if (!curve.visible || !curve.expr.trim()) return;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = curve.color;
      ctx.beginPath();

      let isDrawing = false;
      const stepPx = 2;

      for (let px = 0; px <= width; px += stepPx) {
        const xVal = toMathX(px);
        const evalRes = parser.parseAndEvaluate(curve.expr, { x: xVal });

        if (evalRes.success && isFinite(evalRes.value) && !isNaN(evalRes.value)) {
          const py = toScreenY(evalRes.value);
          if (py >= -100 && py <= height + 100) {
            if (!isDrawing) {
              ctx.moveTo(px, py);
              isDrawing = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            isDrawing = false;
          }
        } else {
          isDrawing = false;
        }
      }
      ctx.stroke();
    });

    // Draw cursor crosshair if hovered
    if (cursorPos) {
      ctx.strokeStyle = '#8b5cf688';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const csx = toScreenX(cursorPos.x);
      const csy = toScreenY(cursorPos.y);

      ctx.beginPath();
      ctx.moveTo(csx, 0);
      ctx.lineTo(csx, height);
      ctx.moveTo(0, csy);
      ctx.lineTo(width, csy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [curves, viewport, cursorPos]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          canvasRef.current.width = rect.width;
          canvasRef.current.height = Math.max(380, rect.width * 0.55);
          draw();
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Mouse pan & zoom handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    viewportStartRef.current = { ...viewport };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const mathX = viewport.xMin + (px / canvas.width) * (viewport.xMax - viewport.xMin);
    const mathY = viewport.yMin + ((canvas.height - py) / canvas.height) * (viewport.yMax - viewport.yMin);

    setCursorPos({ x: mathX, y: mathY });

    if (isDraggingRef.current) {
      const dxPx = e.clientX - dragStartRef.current.x;
      const dyPx = e.clientY - dragStartRef.current.y;

      const dxMath = (dxPx / canvas.width) * (viewportStartRef.current.xMax - viewportStartRef.current.xMin);
      const dyMath = (dyPx / canvas.height) * (viewportStartRef.current.yMax - viewportStartRef.current.yMin);

      setViewport({
        xMin: viewportStartRef.current.xMin - dxMath,
        xMax: viewportStartRef.current.xMax - dxMath,
        yMin: viewportStartRef.current.yMin + dyMath,
        yMax: viewportStartRef.current.yMax + dyMath,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    handleZoom(factor);
  };

  return (
    <div id="graphing-engine-container" className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            <span>Interactive Graphing Calculator</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Real continuous multi-function Cartesian graphing f(x) with real-time coordinate inspection.
          </p>
        </div>

        {/* Viewport Control Bar */}
        <div className="flex items-center gap-2">
          <button
            id="graph-zoom-in"
            onClick={() => handleZoom(0.8)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="graph-zoom-out"
            onClick={() => handleZoom(1.25)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="graph-reset-view"
            onClick={handleResetView}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Reset Origin (Center at 0,0)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Functions List & Inputs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Functions y = f(x)</span>
            <button
              id="graph-add-function"
              onClick={handleAddCurve}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Function</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {curves.map((curve, idx) => (
              <div
                key={curve.id}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800"
              >
                <div
                  className="w-3 h-8 rounded-md shrink-0"
                  style={{ backgroundColor: curve.color }}
                />
                <span className="text-xs font-mono font-bold text-neutral-400">f{idx + 1}(x)=</span>
                <input
                  type="text"
                  value={curve.expr}
                  onChange={(e) => handleUpdateExpr(curve.id, e.target.value)}
                  placeholder="e.g. sin(x) or x^2 - 4"
                  className="w-full bg-transparent border-none text-white text-sm font-mono focus:outline-none placeholder:text-neutral-600"
                />
                <button
                  onClick={() => handleToggleVisible(curve.id)}
                  className="p-1 text-neutral-400 hover:text-white"
                  title={curve.visible ? 'Hide Curve' : 'Show Curve'}
                >
                  {curve.visible ? <Eye className="w-4 h-4 text-violet-400" /> : <EyeOff className="w-4 h-4 opacity-40" />}
                </button>
                <button
                  onClick={() => handleDeleteCurve(curve.id)}
                  disabled={curves.length <= 1}
                  className="p-1 text-neutral-400 hover:text-rose-400 disabled:opacity-20"
                  title="Remove Function"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-[11px] text-neutral-500 font-medium block mb-1.5">Function Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Sine Wave', expr: 'sin(x)' },
                { label: 'Parabola', expr: 'x^2 - 4' },
                { label: 'Cubic', expr: 'x^3 - 3*x' },
                { label: 'Gaussian', expr: 'exp(-x^2)' },
                { label: 'Damped Oscillation', expr: 'exp(-0.2*x)*sin(2*x)' },
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => {
                    setCurves([{ id: '1', expr: p.expr, color: '#8b5cf6', visible: true }]);
                  }}
                  className="px-2 py-1 rounded bg-neutral-850 hover:bg-neutral-800 text-[11px] text-neutral-300 border border-neutral-800 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive HTML5 Canvas */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl overflow-hidden relative">
          <canvas
            id="graphing-canvas"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="w-full rounded-xl cursor-crosshair touch-none"
          />

          {/* Real-time Coordinate Readout Overlay */}
          {cursorPos && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-violet-300 backdrop-blur-md shadow-lg">
              X: {formatResultNumber(cursorPos.x, 3)}, Y: {formatResultNumber(cursorPos.y, 3)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
