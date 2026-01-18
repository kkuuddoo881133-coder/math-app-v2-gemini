import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Check } from 'lucide-react';

const DecimalStandardCalculator = ({ contentData }) => {
  if (!contentData) return <div>データがありません</div>;

  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // ▼ テキスト整形
  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/\$/g, "")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\\/g, "");
  };

  // ▼ データの解析
  const nums = contentData.problem.numbers;
  const a = nums.a; // 上の段
  const b = nums.b; // 下の段
  
  const isAddition = !contentData.title.includes("ひき算");
  const operator = isAddition ? "+" : "-";
  
  const resultRaw = isAddition ? (a * 10 + b * 10) / 10 : (a * 10 - b * 10) / 10;
  
  const getDigits = (val) => {
    const s = val.toFixed(1);
    return {
      ones: s.split('.')[0],
      tenths: s.split('.')[1]
    };
  };

  const digitsA = getDigits(a);
  const digitsB = getDigits(b);
  const digitsR = getDigits(resultRaw);

  const hasCarry = isAddition && (parseInt(digitsA.tenths) + parseInt(digitsB.tenths) >= 10);
  const isZeroCutPattern = digitsR.tenths === "0";

  // ▼ グリッド定義（修正済み）
  const CELL_W = 60; const CELL_H = 80;
  
  const COL_OP = 30;   
  const COL_1  = 90;   
  const COL_DOT = 150; 
  const COL_01 = 210;  

  // 各行のY座標（文字のベースライン）
  const ROW_0_Y = 55;  // 繰り上がりメモ
  const ROW_1_Y = 135; // 上の段
  const ROW_2_Y = 215; // 下の段
  const ROW_3_Y = 295; // 答え
  
  const LINE_Y = 240; // 計算線

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
      
      {/* メインビジュアル */}
      <div className="bg-white rounded-xl border-2 border-slate-200 mb-4 w-full flex justify-center shadow-sm relative overflow-hidden">
        <svg width="300" height="320" viewBox="0 0 300 320">
          <defs>
            <pattern id="grid" width={CELL_W} height={CELL_H} patternUnits="userSpaceOnUse">
              <rect width={CELL_W} height={CELL_H} fill="none" stroke="#f0f2f5" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <line x1="20" y1={LINE_Y} x2="280" y2={LINE_Y} stroke="#333" strokeWidth="3" strokeLinecap="round" />
          
          {/* 演算子 */}
          <text x={COL_OP} y={ROW_2_Y} fontSize="40" fill="#333" textAnchor="middle">{operator}</text>

          {/* 上の段 (A) */}
          <text x={COL_1} y={ROW_1_Y + 5} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">{digitsA.ones}</text>
          <circle cx={COL_DOT} cy={ROW_1_Y + 5} r="4" fill="#333" />
          <text x={COL_01} y={ROW_1_Y + 5} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">{digitsA.tenths}</text>

          {/* 下の段 (B) */}
          <text x={COL_1} y={ROW_2_Y + 5} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">{digitsB.ones}</text>
          <circle cx={COL_DOT} cy={ROW_2_Y + 5} r="4" fill="#333" />
          <text x={COL_01} y={ROW_2_Y + 5} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">{digitsB.tenths}</text>

          {/* ▼ アニメーション要素 ▼ */}

          {/* 1. 繰り上がりマーク */}
          {hasCarry && currentStep >= 1 && (
            <g className="animate-in slide-in-from-bottom-2 fade-in duration-500">
               <text x={COL_1} y={ROW_0_Y + 10} fontSize="30" fill="#ef4444" textAnchor="middle" fontWeight="bold">1</text>
               <circle cx={COL_1} cy={ROW_0_Y} r="18" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.5" />
            </g>
          )}

          {/* 2. 答え（十分の一の位） */}
          {currentStep >= 1 && (
            <text x={COL_01} y={ROW_3_Y} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333" className="animate-in zoom-in duration-300">
              {digitsR.tenths}
            </text>
          )}

          {/* 3. 答え（一の位と点） */}
          {currentStep >= 2 && (
            <g className="animate-in zoom-in duration-300">
              <text x={COL_1} y={ROW_3_Y} fontSize="60" fontFamily="monospace" textAnchor="middle" fill="#333">
                {digitsR.ones}
              </text>
              <circle cx={COL_DOT} cy={ROW_3_Y} r="4" fill="#333" />
            </g>
          )}

          {/* 4. .0を消す斜線 */}
          {isZeroCutPattern && currentStep >= 2 && (
            <g className="animate-in fade-in duration-500 delay-300">
              <line x1={COL_DOT - 10} y1={ROW_3_Y + 10} x2={COL_01 + 20} y2={ROW_3_Y - 40} stroke="#ef4444" strokeWidth="3" />
            </g>
          )}

          {/* ▼▼▼ 修正済み：ガイド（青い点線枠） ▼▼▼ */}
          {/* 位置(y)と高さ(height)をグリッド線に合わせて調整しました */}
          <rect 
            x={currentStep === 1 ? COL_01 - 30 : COL_1 - 30} 
            y={80} // 2行目の上端 (80px) からスタート
            width="60" 
            height="160" // 2行分 (80px * 2 = 160px) をカバー
            rx="8"
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="3" 
            strokeDasharray="6"
            className="transition-all duration-500"
            opacity={currentStep > 0 && currentStep < 3 ? 0.5 : 0}
          />

        </svg>
      </div>

      {/* 先生のガイド */}
      <div className="w-full bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r min-h-[80px] flex items-start gap-3">
        <div className="bg-blue-200 p-1.5 rounded-full text-xl shrink-0">👩‍🏫</div>
        <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-medium mt-0.5">
          {showResult ? "せいかい！ よくできました◎" : cleanText(contentData.steps[currentStep].guide_text)}
        </p>
      </div>

      {/* コントローラー */}
      <div className="flex gap-2 w-full">
        <button onClick={handleReset} className="px-4 py-2 border border-slate-300 rounded-full text-slate-500 text-sm font-bold hover:bg-slate-50 flex items-center gap-1">
          <RotateCcw size={14} /> 最初から
        </button>
        {!showResult ? (
          <button onClick={handleNext} className="flex-1 py-2 bg-slate-800 text-white rounded-full text-sm font-bold hover:bg-slate-700 flex justify-center items-center gap-2 shadow-sm">
             進める <ArrowRight size={14} />
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

export default DecimalStandardCalculator;