import d14 from './data/D14.json';
import d15 from './data/D15.json';
// import d01 from './data/D01.json'; // 増やしていくときはここに追加

// 1. データを合体
const textbookData = [
  ...d14,
  ...d15
  // ...d01
];

// 2. タイトル一覧もここで管理（App.jsxから引越し）
export const unitTitles = {
  "D14": "分数",
  "D15": "□を使った式",
  // "D01": "かけ算",  ←ここに足していけばOK
};

export default textbookData;