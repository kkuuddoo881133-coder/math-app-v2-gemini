import { useState } from 'react';
// データと一緒に、タイトル一覧(unitTitles)も読み込みます
import textbookData, { unitTitles } from './textbookData.js'; 

function App() {
  // 全体を通して「今、配列の何番目のデータか？」を管理します (0スタート)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. 今表示すべきデータを取り出す
  const currentData = textbookData[currentIndex];
  const totalGlobalSteps = textbookData.length;

  // ▼▼▼ 単元情報・ページ数の計算ロジック ▼▼▼

  // 2. 現在の単元ID（D14 や D15）
  const currentUnitId = currentData.unit_id;

  /* ★修正ポイント★
     以前はここに unitTitles を書いていましたが、
     textbookData.js から読み込むので削除しました。
     これで新しい単元が増えても App.jsx を書き換える必要はありません。
  */

  // 3. 今の単元に属するデータを全部集める (分母の計算用)
  const unitItems = textbookData.filter(item => item.unit_id === currentUnitId);
  const totalStepsInUnit = unitItems.length;

  // 4. 今のデータが、その単元の中で何番目かを探す (分子の計算用)
  // (配列のインデックスに +1 して、1ページ目、2ページ目...とする)
  const currentStepInUnit = unitItems.findIndex(item => item.id === currentData.id) + 1;

  // ▲▲▲ 計算ロジック終了 ▲▲▲

  // ボタン操作
  const handleNext = () => {
    if (currentIndex < totalGlobalSteps - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      
      {/* ▼ ヘッダー：単元IDとタイトルを自動表示 */}
      <h2 style={{ borderBottom: '2px solid orange', paddingBottom: '10px' }}>
        算数教科書モード ({currentUnitId}: {unitTitles[currentUnitId]})
      </h2>

      <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* ▼ ステップ数：単元ごとの進捗を表示 (例: Step 1 / 3) */}
        <div style={{ color: '#888', marginBottom: '10px' }}>
          Step {currentStepInUnit} / {totalStepsInUnit}
        </div>

        <h3 style={{ fontSize: '24px', color: '#007bff', margin: '0 0 20px 0' }}>{currentData.title}</h3>
        
        {/* ハイブリッドな絵 (visual_html) を表示 */}
        <div 
          style={{ width: '100%', marginBottom: '20px', padding: '10px 0', display: 'flex', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: currentData.visual_html }} 
        />

        {/* 説明文 (text_main) を表示 */}
        <p 
          style={{ fontSize: '18px', lineHeight: '1.6', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}
          dangerouslySetInnerHTML={{ __html: currentData.text_main }}
        />

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          onClick={handleBack} 
          disabled={currentIndex === 0} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', color: 'white' }}
        >
          もどる
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === totalGlobalSteps - 1} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ff9800', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}
        >
          つぎへ ▶
        </button>
      </div>
    </div>
  );
}

export default App;