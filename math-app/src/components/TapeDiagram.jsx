import React from 'react';

// ▼ 1. 小さな部品は「外」で作るのが鉄則！
const BoxDisplay = () => (
  <span style={{
    display: 'inline-block',
    width: '30px', height: '30px',
    border: '3px solid #e63946',
    backgroundColor: '#fff',
    verticalAlign: 'middle',
    marginTop: '-4px'
  }}></span>
);

const TapeDiagram = ({ total, left, right, unit }) => {
  
  // 2. 文字列の "box" や "?" が来ても計算できるようにする
  let valLeft = parseInt(left) || 0;
  let valRight = parseInt(right) || 0;
  let valTotal = parseInt(total) || 0;

  if (!valTotal && valLeft && valRight) {
    valTotal = valLeft + valRight;
  }
  if (!valRight) valRight = valTotal - valLeft;
  if (!valLeft) valLeft = valTotal - valRight;

  const totalRatio = valLeft + valRight;
  const flexLeft = Math.max(valLeft, totalRatio * 0.2); 
  const flexRight = Math.max(valRight, totalRatio * 0.2);

  return (
    <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* テープ本体 */}
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        height: '60px', 
        border: '3px solid #333', 
        borderRadius: '8px', 
        overflow: 'hidden',
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '8px'
      }}>
        <div style={{ 
          flex: flexLeft, 
          backgroundColor: '#4cc9f0', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRight: '2px solid #333',
          color: '#333'
        }}>
          {left === 'box' ? <BoxDisplay /> : left}
        </div>
        
        <div style={{ 
          flex: flexRight, 
          backgroundColor: '#ffe5ec', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#333'
        }}>
          {right === 'box' ? <BoxDisplay /> : right}
        </div>
      </div>

      {/* 下の寸法線 */}
      <div style={{ position: 'relative', height: '30px' }}>
        <svg width="100%" height="100%" viewBox="0 0 300 30" style={{ overflow: 'visible' }}>
          <path d="M 2,0 Q 150,20 298,0" fill="none" stroke="#555" strokeWidth="2" />
          <line x1="2" y1="0" x2="2" y2="5" stroke="#555" strokeWidth="2" />
          <line x1="298" y1="0" x2="298" y2="5" stroke="#555" strokeWidth="2" />
        </svg>
        <div style={{ 
          position: 'absolute', top: '15px', left: 0, width: '100%', 
          textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: '#333' 
        }}>
          全部で {total === 'box' ? <BoxDisplay /> : total}{unit}
        </div>
      </div>

    </div>
  );
};

export default TapeDiagram;
