import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Check } from 'lucide-react';

const DecimalSubtraction = ({ contentData }) => {
  if (!contentData) return <div>データがありません</div>;

  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // ▼▼▼ 追加：テキストから余計な記号($や\text)を消す関数 ▼▼▼
  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/\$/g, "")              // $ マークを消す
      .replace(/\\text\{([^}]+)\}/g, "$1") // \text{cm} などを cm だけにする
      .replace(/\\/g, "");             // その他の \ 記号も消す
  };

  // グリッド定義
  const CELL_W = 60; 
  const CELL_H = 80; 

  const COL_OP = 30;   
  const COL_1  = 90;   
  const COL_DOT = 150; 
  const COL_01 = 210;  

  // 各行のY座標
  const ROW_0_Y = 55;  
  const ROW_1_Y = 135; 
  const ROW_2_Y = 215; 
  const ROW_3_Y = 295; 
  
  const LINE_Y = 240;

  const handleNext = () => {
    if (currentStep < contentData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setShowResult(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto font-sans">
      
      {/* メインビジュアル（SVG筆算エリア） */}
      <div className="bg-white rounded-xl border-2 border-slate-200 mb-4 w-full flex justify-center shadow-sm relative overflow-hidden">
        <svg width="300" height="320" viewBox="0 0 300 320">
          <defs>
            <pattern id="grid" width={CELL_W} height={CELL_H} patternUnits="userSpaceOnUse">
              <rect width={CELL_W} height={CELL_H} fill="none" stroke="#f0f2f5" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <line x1="20" y1={LINE_Y} x2="280" y2={LINE_Y} stroke="#333" strokeWidth="3" strokeLinecap="round" />
          
          <text x={COL_OP} y={ROW_2_Y} fontSize="40" fill="#333" textAnchor="middle">-</text>

          {/* 引く数 (1.2) */}
          <text x={COL_1} y={ROW_2_Y + 5} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">1</text>
          <circle cx={COL_DOT} cy={ROW_2_Y + 5} r="4" fill="#333" />
          <text x={COL_01} y={ROW_2_Y + 5} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">2</text>

          {/* 引かれる数 (3 -> 3.0) */}
          <g className="transition-all duration-500">
            <text 
              x={COL_1} 
              y={ROW_1_Y + 5} 
              fontSize="60" 
              fontFamily="monospace" 
              textAnchor="middle" 
              fill={currentStep >= 2 ? "#ccc" : "#333"}
              style={{ textDecoration: currentStep >= 2 ? "line-through" : "none", textDecorationColor: "red" }}
            >
              3
            </text>
            
            {currentStep >= 2 && (
              <text x={COL_1 - 20} y={ROW_0_Y + 10} fontSize="40" fill="#ef4444" fontWeight="bold">2</text>
            )}

            <g style={{ opacity: currentStep >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
               <circle cx={COL_DOT} cy={ROW_1_Y + 5} r="4" fill="#ef4444" />
               <text 
                 x={COL_01} 
                 y={ROW_1_Y + 5} 
                 fontSize="60" 
                 fontFamily="monospace" 
                 textAnchor="middle" 
                 fill={currentStep >= 2 ? "#ccc" : "#ef4444"} 
                 style={{ textDecoration: currentStep >= 2 ? "line-through" : "none", textDecorationColor: "red" }}
               >
                 0
               </text>
               {currentStep >= 2 && (
                 <text x={COL_01 + 10} y={ROW_0_Y + 10} fontSize="40" fill="#ef4444" fontWeight="bold">10</text>
               )}
            </g>
          </g>

          {/* 答え */}
          {currentStep >= 3 && (
            <g className="animate-in fade-in zoom-in duration-500">
              <text x={COL_1} y={ROW_3_Y} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">1</text>
              <circle cx={COL_DOT} cy={ROW_3_Y} r="4" fill="#333" />
              <text x={COL_01} y={ROW_3_Y} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">8</text>
            </g>
          )}

          {/* ガイド矢印 */}
          {currentStep === 1 && (
            <path 
              d={`M ${COL_1 + 25} ${ROW_1_Y - 20} L ${COL_01 - 25} ${ROW_1_Y - 20}`} 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="4" 
              markerEnd="url(#arrow)" 
            />
          )}
          
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* 先生のガイドセリフ */}
      <div className="w-full bg-orange-50 border-l-4 border-orange-400 p-3 mb-4 rounded-r min-h-[80px] flex items-start gap-3">
        <div className="bg-orange-200 p-1.5 rounded-full text-xl shrink-0">👩‍🏫</div>
        <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-medium mt-0.5">
          {/* ▼▼▼ ここで cleanText 関数を使ってきれいにする ▼▼▼ */}
          {showResult ? "せいかい！ よくできました◎" : cleanText(contentData.steps[currentStep].guide_text)}
        </p>
      </div>

      {/* コントローラー */}
      <div className="flex gap-2 w-full">
        <button 
          onClick={handleReset}
          className="px-4 py-2 border border-slate-300 rounded-full text-slate-500 text-sm font-bold hover:bg-slate-50 flex items-center gap-1"
        >
          <RotateCcw size={14} /> 最初から
        </button>
        
        {!showResult ? (
          <button 
            onClick={handleNext}
            className="flex-1 py-2 bg-slate-800 text-white rounded-full text-sm font-bold hover:bg-slate-700 flex justify-center items-center gap-2 shadow-sm"
          >
            アニメーションを進める <ArrowRight size={14} />
          </button>
        ) : (
          <div className="flex-1 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex justify-center items-center gap-2">
            <Check size={16} /> おしまい
          </div>
        )}
      </div>
    </div>
  );
};

export default DecimalSubtraction;