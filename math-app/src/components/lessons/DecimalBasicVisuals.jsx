import React from 'react';

const DecimalBasicVisuals = ({ contentData }) => {
  if (!contentData) return <div>データがありません</div>;

  const pid = contentData.pattern_id ?? '';
  const nums = contentData.problem?.numbers ?? {};
  const visualStructure = contentData.visual_structure;

  // ==========================================
  // モード判定 (厳密に判定)
  // ==========================================
  const isVolume = pid.includes('U01-P01') || pid.includes('U01-P02') || pid.includes('U02-P01');
  const isRuler = pid.includes('U01-P04'); 
  const isNumberLine = pid.includes('U03-P01'); 
  const isComparison = pid.includes('U03-P02'); 
  const isBlocks = pid.includes('U02-P03') || pid.includes('U04-P01'); 

  // ==========================================
  // 1. 水のかさ（ビーカー）
  // ==========================================
  if (isVolume) {
    const showFullCup = !pid.includes('U01-P02'); 
    const fractionalVal = pid.includes('U01-P02') ? 0.1 : (nums.decimal_part ?? 0.3);
    
    return (
      <div className="w-full h-64 bg-white rounded-xl border-2 border-slate-200 flex items-end justify-center gap-4 pb-4 overflow-hidden relative">
        <div className="absolute top-2 left-2 text-xs text-slate-400 font-bold">イメージ図</div>
        
        {/* 1. 満タンのコップ */}
        {showFullCup && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-32 border-x-2 border-b-4 border-slate-400 rounded-b-lg relative overflow-hidden bg-slate-50">
              <div className="absolute bottom-0 w-full h-[90%] bg-blue-400 opacity-80"></div>
              <div className="absolute inset-0 flex flex-col justify-end pb-0">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className="w-full border-t border-slate-300 h-[10%] opacity-50"></div>
                 ))}
              </div>
            </div>
            <span className="mt-2 font-bold text-slate-600">1L (1dL)</span>
          </div>
        )}

        {/* 2. 端数のコップ */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-32 border-x-2 border-b-4 border-slate-400 rounded-b-lg relative overflow-hidden bg-slate-50">
             <div 
               className="absolute bottom-0 w-full bg-blue-300 opacity-80 transition-all duration-1000"
               style={{ height: `${fractionalVal * 10 * 9}%` }}
             ></div>
             <div className="absolute inset-0 flex flex-col justify-end pb-0">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className="w-full border-t border-slate-400 h-[10%] opacity-50 relative">
                     {pid.includes('U01-P02') && i === 9 && (
                       <div className="absolute right-0 -top-2 text-[10px] text-red-500 font-bold">0.1</div>
                     )}
                   </div>
                 ))}
              </div>
          </div>
          <span className="mt-2 font-bold text-slate-600">{pid.includes('U01-P01') ? "はした" : `${fractionalVal}L`}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. 定規・鉛筆
  // ==========================================
  if (isRuler) {
    const cm = nums.cm ?? 8;
    const mm = nums.mm ?? 5;
    const pencilLength = 220; 

    return (
      <div className="w-full h-48 bg-white rounded-xl border-2 border-slate-200 flex flex-col items-center justify-center relative p-4">
        <div className="relative w-full h-12 mb-0">
           <div className="h-8 bg-green-200 border border-green-600 rounded-l-md absolute left-0 top-2" style={{ width: `${pencilLength}px` }}></div>
           <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-green-200 border-b-[10px] border-b-transparent absolute top-3" style={{ left: `${pencilLength}px` }}></div>
           <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-black border-b-[6px] border-b-transparent absolute top-4" style={{ left: `${pencilLength + 15}px` }}></div>
        </div>

        <div className="w-full h-16 border-t-2 border-slate-800 relative mt-2">
           <div className="absolute top-0 left-0 text-xs font-bold">{cm}cm</div>
           {[...Array(11)].map((_, i) => (
             <div key={i} className={`absolute top-0 w-px bg-slate-800 ${i === 0 || i === 10 ? 'h-6' : i === 5 ? 'h-4' : 'h-2'}`} 
                  style={{ left: `${i * 10}%` }}>
             </div>
           ))}
           <div className="absolute top-0 right-0 text-xs font-bold">{cm + 1}cm</div>
           
           <div className="absolute top-8 text-red-500 font-bold flex flex-col items-center" style={{ left: `${mm * 10}%`, transform: 'translateX(-50%)' }}>
             <span className="text-xl">↑</span>
             <span className="text-xs">{mm}mm</span>
           </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. 数直線
  // ==========================================
  if (isNumberLine) {
    const target = nums.position ?? 2.5; 
    return (
      <div className="w-full h-40 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center p-6 relative">
         <div className="w-full h-0.5 bg-slate-800 relative flex justify-between items-end">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="relative flex flex-col items-center">
                 <div className={`w-0.5 bg-slate-800 ${i === 0 || i === 10 ? 'h-6' : i === 5 ? 'h-4' : 'h-2'}`}></div>
                 {(i === 0 || i === 10) && (
                   <span className="absolute top-8 font-bold text-lg">{i === 0 ? Math.floor(target) : Math.floor(target) + 1}</span>
                 )}
              </div>
            ))}

            <div 
              className="absolute -top-10 flex flex-col items-center animate-bounce"
              style={{ left: `${(target - Math.floor(target)) * 100}%`, transform: 'translateX(-50%)' }}
            >
               <span className="text-red-500 font-bold text-xl">↓</span>
               <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">ここ！</span>
            </div>
         </div>
      </div>
    );
  }

  // ==========================================
  // 4. ブロック
  // ==========================================
  if (isBlocks) {
    const val = nums.target ?? nums.a ?? 2.3;
    const intPart = Math.floor(val);
    const decPart = Math.round((val - intPart) * 10);
    
    return (
      <div className="w-full bg-white rounded-xl border-2 border-slate-200 p-4 flex flex-wrap gap-4 justify-center items-center">
        {[...Array(intPart)].map((_, i) => (
          <div key={`int-${i}`} className="flex gap-0.5 bg-blue-50 p-1 rounded border border-blue-200 relative pb-6">
             {[...Array(10)].map((__, j) => (
               <div key={j} className="w-3 h-12 bg-blue-400 rounded-sm"></div>
             ))}
             <span className="absolute bottom-1 left-0 w-full text-center text-xs font-bold text-blue-500">1</span>
          </div>
        ))}
        
        <div className="flex gap-0.5 bg-red-50 p-1 rounded border border-red-200 ml-4 relative pb-6">
             {[...Array(decPart)].map((__, j) => (
               <div key={j} className="w-3 h-12 bg-red-400 rounded-sm"></div>
             ))}
             <span className="absolute bottom-1 left-0 w-full text-center text-xs font-bold text-red-500">0.{decPart}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. 大小比較 シーソー
  // ==========================================
  if (isComparison) {
    const { a = 0, b = 0 } = nums;
    const isLeftHeavy = a > b;
    const angle = isLeftHeavy ? -10 : 10;
    
    return (
      <div className="w-full h-48 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center relative p-4 overflow-hidden">
         <div 
           className="w-3/4 h-2 bg-slate-700 relative transition-transform duration-1000"
           style={{ transform: `rotate(${angle}deg)` }}
         >
            <div className="absolute -top-12 left-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">{a}</div>
            </div>
            <div className="absolute -top-12 right-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">{b}</div>
            </div>
         </div>
         <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-slate-500 absolute bottom-4"></div>
      </div>
    );
  }

  if (visualStructure) {
    return (
      <div className="w-full bg-white rounded-xl border-2 border-slate-200 p-4 text-left">
        <div className="text-xs text-slate-400 font-bold mb-2">イメージ図の説明</div>
        <p className="text-sm text-slate-700 font-semibold mb-3">{visualStructure.summary}</p>
        {visualStructure.elements?.length > 0 && (
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {visualStructure.elements.map((element, index) => (
              <li key={`${pid}-element-${index}`}>{element}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // デフォルト
  return (
    <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
      図解準備中 ({pid})
    </div>
  );
};

export default DecimalBasicVisuals;
