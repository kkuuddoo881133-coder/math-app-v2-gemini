import { useState } from 'react';
import textbookData from './textbookData.json';

function App() {
  const [step, setStep] = useState(1);
  const currentData = textbookData.find(d => d.step_no === step);
  const totalSteps = textbookData.length;

  const handleNext = () => { if (step < totalSteps) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <h2 style={{ borderBottom: '2px solid orange', paddingBottom: '10px' }}>
        算数教科書モード (D14: 分数)
      </h2>

      <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <div style={{ color: '#888', marginBottom: '10px' }}>Step {step} / {totalSteps}</div>
        <h3 style={{ fontSize: '24px', color: '#007bff', margin: '0 0 20px 0' }}>{currentData.title}</h3>
        
        {/* visual_html を読み込むように変更！ */}
        {/* ここでHTMLとSVGが混ざった「ハイブリッドな絵」を表示します */}
        <div 
          style={{ width: '100%', marginBottom: '20px', padding: '10px 0', display: 'flex', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: currentData.visual_html }} 
        />

        <p 
          style={{ fontSize: '18px', lineHeight: '1.6', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}
          dangerouslySetInnerHTML={{ __html: currentData.text_main }}
        />

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={handleBack} disabled={step === 1} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ccc', border: 'none', borderRadius: '5px', color: 'white' }}>もどる</button>
        <button onClick={handleNext} disabled={step === totalSteps} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ff9800', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 'bold' }}>つぎへ ▶</button>
      </div>
    </div>
  );
}

export default App;