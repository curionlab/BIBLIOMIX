// BIBLIOMIXエントリーポイント
import { setupUI, updateUI } from './game/ui.js';
import { initializeGame, advanceGame, resetGame } from './game/logic/index.js';
import { getApiKey, setApiKey, validateApiKey } from './game/api.js';
import { gameState } from './game/state.js';
import { renderBoardCards } from './components/card.js';
import { renderDialogueLog } from './components/dialogue.js';
import { showConceptPopup, hideConceptPopup, setConceptPopupContent, setConceptPopupLoading } from './components/popup.js';
import { renderSynthesisChart } from './components/chart.js';
import { getRandom, getRandomInt, escapeHTML, formatText } from './utils/helpers.js';

// DOMContentLoadedで初期化
window.addEventListener('DOMContentLoaded', () => {
    setupUI();
    // 初期表示はルールタブのみ
    updateUI('game_rules');

    // UIイベントバインド
    const startBtn = document.getElementById('start-simulation-btn');
    const nextBtn = document.getElementById('next-turn-btn');
    const resetBtn = document.getElementById('reset-game-btn');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const geminiApiKeyInput = document.getElementById('gemini-api-key');
    const expandConceptBtn = document.getElementById('expand-concept-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const debugNextBtn = document.getElementById('debug-next-turn-btn');

    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            const loadingDiv = document.getElementById('simulation-loading');
            if (loadingDiv) loadingDiv.classList.remove('hidden');
            await initializeGame();
            if (loadingDiv) loadingDiv.classList.add('hidden');
            updateUI('intro');
            // ボタン表示切り替え
            if (nextBtn) nextBtn.classList.remove('hidden');
            if (resetBtn) resetBtn.classList.remove('hidden');
            if (debugNextBtn) debugNextBtn.classList.remove('hidden');
            if (startBtn) startBtn.classList.add('hidden');
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            advanceGame();
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetGame();
            updateUI('game_rules');
            if (nextBtn) nextBtn.classList.add('hidden');
            if (resetBtn) resetBtn.classList.add('hidden');
            if (debugNextBtn) debugNextBtn.classList.add('hidden');
            if (startBtn) startBtn.classList.remove('hidden');
        });
    }
    if (saveApiKeyBtn && geminiApiKeyInput) {
        saveApiKeyBtn.addEventListener('click', () => {
            const key = geminiApiKeyInput.value.trim();
            if (validateApiKey(key)) {
                setApiKey(key);
                // alert('APIキーが保存されました！');
            } else {
                alert('正しいAPIキーを入力してください。');
            }
        });
    }
    // ポップアップ拡張ボタン
    if (expandConceptBtn) {
        expandConceptBtn.addEventListener('click', async () => {
            setConceptPopupLoading(true);
            setConceptPopupContent('');
            // ここでAPI呼び出し等を行い、内容をセット
            // setConceptPopupContent(生成結果);
            setConceptPopupLoading(false);
        });
    }
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hideConceptPopup);
    }
    if (debugNextBtn) {
        debugNextBtn.addEventListener('click', async () => {
            window.USE_DUMMY_AI = true;
            await advanceGame();
            window.USE_DUMMY_AI = false;
        });
    }
});