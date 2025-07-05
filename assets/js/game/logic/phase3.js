// フェーズ3の進行ロジック
import { gameState } from '../state.js';
import { updateUI } from '../ui.js';
import { callGeminiAPI } from '../api.js';
// import { renderSynthesisChart } from '../components/chart.js'; // チャート描画用（必要に応じて）

/**
 * フェーズ3の初期化
 * - 状態リセット・UI更新
 */
export function initializePhase3() {
    gameState.currentPhase = 3;
    gameState.currentTurn = 1;
    updateUI('p3_synthesis');
    // Phase3開始時に自動でadvancePhase3を呼ぶ
    setTimeout(() => { advancePhase3(); }, 100);
}

/**
 * フェーズ3の進行
 * - 結論生成（Gemini APIで最終結論を生成し、gameStateに保存・ログ追加）
 * - 知の化学反応マップ（チャート）描画も含む
 */
export async function advancePhase3() {
    // 1. プロンプト生成
    const phase2Logs = gameState.gameLog.filter(item => item.phase === 2 || item.type === 'response_to_question' || item.type === 'facilitator_intro' || item.type === 'facilitator_final_prompt');
    const gameLogText = phase2Logs.map(item => `${item.player}: ${item.text || item.question || ''}`).join('\n');
    console.log('gameLogText', gameLogText);
    // 結論用プロンプト
    const conclusionPrompt = `これまでの議論を踏まえ、中央の問い「${gameState.centralQuestion}」に対する最終結論を日本語で簡潔にまとめてください。箇条書きやJSONではなく、自然な文章で出力してください。`;
    // チャート用プロンプト
    const chartPrompt = `これまでの議論を踏まえ、議論で登場した主要なキーワード（概念）とその簡単な説明、およびキーワード同士の関係を以下のJSON形式で出力してください。バブル座標や半径は不要です。
【出力例】
{
  "keywords": [
    { "concept": "幸福", "description": "人間が感じる満足や充足の状態" },
    { "concept": "共感", "description": "他者の感情や立場を理解し共有すること" }
  ],
  "relationships": [
    { "from": "共感", "to": "幸福" }
  ]
}`;
    // 2. 並行でAPIリクエスト
    let conclusion = '', chartData = null;
    updateUI('p3_synthesis'); // 先にUIをローディング状態にしておく
    await Promise.all([
        (async () => {
            try {
                const res = await callGeminiAPI(conclusionPrompt + '\n\n【議論ログ】\n' + gameLogText);
                gameState.finalConclusion = res.trim();
                gameState.gameLog.push({ player: 'F', text: res.trim() });
            } catch (e) {
                gameState.finalConclusion = '結論の生成に失敗しました。';
            }
            updateUI('p3_synthesis');
        })(),
        (async () => {
            try {
                const res = await callGeminiAPI(chartPrompt + '\n\n【議論ログ】\n' + gameLogText);
                let chartRaw = res.trim();
                chartRaw = chartRaw.replace(/^```json|^```|```$/g, '').trim();
                chartData = null;
                console.log('chartRaw', chartRaw);
                try {
                    chartData = JSON.parse(chartRaw);
                } catch (e) {
                    chartData = null;
                }
                gameState.synthesisData = chartData;
            } catch (e) {
                gameState.synthesisData = null;
            }
            updateUI('p3_synthesis');
        })()
    ]);
}