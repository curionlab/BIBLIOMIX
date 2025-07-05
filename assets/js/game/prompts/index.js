import { prompts_ja } from './ja.js';
// import { prompts_en } from './en.js'; // 英語版を作成したら有効化

/**
 * 多言語プロンプト集約エクスポート
 * 使用例: prompts['ja'].generatePlayers(), prompts['en'].generatePlayers() など
 */
export const prompts = {
  ja: prompts_ja,
  // en: prompts_en,
}; 