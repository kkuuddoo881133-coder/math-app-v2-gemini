import { useState } from 'react';
import textbookData, { unitTitles } from './textbookData.js';
// ▼ 1. 新しく作った部品を読み込み
import TapeDiagram from './components/TapeDiagram.jsx';

function App() {
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

  // ▼▼▼ Pixel 6a (幅412px) 最適化デザイン ▼▼▼
  const styles = {
    // 1. アプリ全体の背景
    appBackground: {
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },

    // 2. スマホ本体のフレーム
    phoneFrame: {
      width: '100%',
      maxWidth: '412px',
      minHeight: '100vh',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    },

    // 3. ヘッダー
    header: {
      padding: '16px 20px',
      borderBottom: '2px solid orange',
      backgroundColor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },

    // 4. コンテンツエリア
    mainContent: {
      flex: 1,
      padding: '20px',
      paddingBottom: '80px',
      overflowY: 'auto',
    },

    // 5. フッター
    footer: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      maxWidth: '412px',
      padding: '16px 20px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderTop: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
    },

    // ボタン共通スタイル
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      transition: '0.2s',
    }
  };

  return (
    <div style={styles.appBackground}>
      <div style={styles.phoneFrame}>
        
        {/* ▼ ヘッダー */}
        <div style={styles.header}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
             {currentUnitId} Step {currentStepInUnit} / {totalStepsInUnit}
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
            {unitTitles[currentUnitId]}
          </h2>
        </div>

        {/* ▼ メインコンテンツ */}
        <div style={styles.mainContent}>
          <h3 style={{ fontSize: '22px', color: '#007bff', marginTop: '0', marginBottom: '20px', textAlign: 'center' }}>
            {currentData.title}
          </h3>
          
          {/* ▼▼▼ 絵のエリア（部品対応に書き換え） ▼▼▼ */}
          <div style={{ width: '100%', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            
            {/* パターンA: 従来のHTML文字がある場合 */}
            {currentData.visual_html && (
              <div 
                style={{ width: '100%' }}
                dangerouslySetInnerHTML={{ __html: currentData.visual_html }} 
              />
            )}

            {/* パターンB: 新しいテープ図部品を使う場合 */}
            {/* ★修正ポイント：visual_data が無くてもエラーにならないように ?. をつける */}
            {currentData.visual_type === 'TapeDiagram' && (
              <TapeDiagram 
                total={currentData.visual_data?.total}
                left={currentData.visual_data?.left}
                right={currentData.visual_data?.right}
                unit={currentData.visual_data?.unit}
              />
            )}

          </div>
          {/* ▲▲▲ 絵のエリア終了 ▲▲▲ */}

          {/* 文章のエリア */}
          <div 
            style={{ 
              fontSize: '16px', 
              lineHeight: '1.8', 
              color: '#444',
              backgroundColor: '#f9f9f9',
              padding: '16px',
              borderRadius: '12px',
            }}
            dangerouslySetInnerHTML={{ __html: currentData.text_main }}
          />
        </div>

        {/* ▼ フッター（操作ボタン） */}
        <div style={styles.footer}>
          <button 
            onClick={handleBack} 
            disabled={currentIndex === 0} 
            style={{ 
              ...styles.button,
              backgroundColor: currentIndex === 0 ? '#eee' : '#e0e0e0', 
              color: currentIndex === 0 ? '#aaa' : '#333',
            }}
          >
            もどる
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === totalGlobalSteps - 1} 
            style={{ 
              ...styles.button,
              backgroundColor: currentIndex === totalGlobalSteps - 1 ? '#eee' : '#ff9800', 
              color: currentIndex === totalGlobalSteps - 1 ? '#aaa' : 'white',
              boxShadow: currentIndex === totalGlobalSteps - 1 ? 'none' : '0 4px 10px rgba(255, 152, 0, 0.3)'
            }}
          >
            つぎへ ▶
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;