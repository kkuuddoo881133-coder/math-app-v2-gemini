import { useState } from 'react';
import d12Data from './data/curriculum/D12.json'; 

import TapeDiagram from './components/lessons/TapeDiagram.jsx';
import DecimalSubtraction from './components/lessons/DecimalSubtraction.jsx';
import DecimalStandardCalculator from './components/lessons/DecimalStandardCalculator.jsx';
import DecimalBasicVisuals from './components/lessons/DecimalBasicVisuals.jsx';

const unitTitles = {
  "D12-U01": "小数のしくみ",
  "D12-U02": "小数の大きさ",
  "D12-U03": "小数の大小",
  "D12-U04": "小数の計算"
};

// ▼▼▼ VisualRendererの原型（この関数で出し分けを一括管理） ▼▼▼
const renderVisual = (data) => {
  const pid = data.pattern_id || "";

  // 1. 従来のHTMLデータ
  if (data.visual_html) {
    return <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: data.visual_html }} />;
  }

  // 2. テープ図
  if (data.visual_type === 'TapeDiagram') {
    return <TapeDiagram {...data.visual_data} />;
  }

  // 3. 特殊なひき算 (P06)
  if (pid.includes('P06')) {
    return <DecimalSubtraction contentData={data} />;
  }

  // 4. 普通の計算 (U04の計算問題)
  if (pid.includes('U04-P02') || pid.includes('U04-P03') || pid.includes('U04-P04') || pid.includes('U04-P05')) {
    return <DecimalStandardCalculator contentData={data} />;
  }

  // 5. その他の概念図 (U01, U02, U03, U04-P01)
  // 基本的にこれらに当てはまるはず
  return <DecimalBasicVisuals contentData={data} />;
};

function App() {
  const textbookData = d12Data.map(item => ({
    ...item,
    unit_id: item.pattern_id.split('-').slice(0, 2).join('-'),
    id: item.pattern_id
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentData = textbookData[currentIndex];
  const totalGlobalSteps = textbookData.length;
  
  const currentUnitId = currentData.unit_id;
  const unitItems = textbookData.filter(item => item.unit_id === currentUnitId);
  const totalStepsInUnit = unitItems.length;
  const currentStepInUnit = unitItems.findIndex(item => item.id === currentData.id) + 1;

  const handleNext = () => {
    if (currentIndex < totalGlobalSteps - 1) setCurrentIndex(currentIndex + 1);
  };
  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const styles = {
    appBackground: { width: '100vw', minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
    phoneFrame: { width: '100%', maxWidth: '412px', minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
    header: { padding: '16px 20px', borderBottom: '2px solid orange', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 },
    mainContent: { flex: 1, padding: '20px', paddingBottom: '80px', overflowY: 'auto' },
    footer: { position: 'fixed', bottom: 0, width: '100%', maxWidth: '412px', padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.9)', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box' },
    button: { padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', borderRadius: '50px', border: 'none', cursor: 'pointer', transition: '0.2s' }
  };

  return (
    <div style={styles.appBackground}>
      <div style={styles.phoneFrame}>
        <div style={styles.header}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{currentUnitId} Step {currentStepInUnit} / {totalStepsInUnit}</div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{unitTitles[currentUnitId] || "学習"}</h2>
        </div>

        <div style={styles.mainContent}>
          <h3 style={{ fontSize: '22px', color: '#007bff', marginTop: '0', marginBottom: '20px', textAlign: 'center' }}>{currentData.title}</h3>
          
          <div style={{ width: '100%', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            {/* ▼▼▼ ここで関数を呼ぶだけにする（超スッキリ！） ▼▼▼ */}
            {renderVisual(currentData)}
          </div>

          {currentData.text_main && (
            <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '12px' }} dangerouslySetInnerHTML={{ __html: currentData.text_main }} />
          )}
        </div>

        <div style={styles.footer}>
          <button onClick={handleBack} disabled={currentIndex === 0} style={{ ...styles.button, backgroundColor: currentIndex === 0 ? '#eee' : '#e0e0e0', color: currentIndex === 0 ? '#aaa' : '#333' }}>もどる</button>
          <button onClick={handleNext} disabled={currentIndex === totalGlobalSteps - 1} style={{ ...styles.button, backgroundColor: currentIndex === totalGlobalSteps - 1 ? '#eee' : '#ff9800', color: currentIndex === totalGlobalSteps - 1 ? '#aaa' : 'white', boxShadow: currentIndex === totalGlobalSteps - 1 ? 'none' : '0 4px 10px rgba(255, 152, 0, 0.3)' }}>次の問題へ ▶</button>
        </div>
      </div>
    </div>
  );
}

export default App;