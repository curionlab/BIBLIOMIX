// UI初期化・更新モジュール
// setupUI: 初期イベントバインドや初期表示
// updateUI: 進行状況に応じた画面切り替え

import { timelineConfig, gameState } from './state.js';
import { renderPlayersIntro } from '../components/players.js';
import { renderBoardCards } from '../components/card.js';
import { renderDialogueLog } from '../components/dialogue.js';
import { callGeminiAPI } from './api.js';
// import { renderSynthesisChart } from '../components/chart.js'; // Phase3バブルチャートは不要になったため

function renderTimeline(activeStepId) {
    const timelineEl = document.getElementById('timeline');
    if (timelineEl) {
        timelineEl.innerHTML = timelineConfig.map(step => `
            <li>
                <button data-step="${step.id}" class="timeline-item w-full text-left px-4 py-2 text-sm text-stone-700 rounded-md border-l-4 border-transparent hover:bg-amber-100/50 transition-colors duration-200${activeStepId === step.id ? ' bg-amber-200 border-amber-500 font-bold' : ''}">
                    ${step.title}
                </button>
            </li>
        `).join('');
    }
}

export function setupUI() {
    // タイムラインのクリックで該当セクション表示
    renderTimeline();
    const timelineEl = document.getElementById('timeline');
    if (timelineEl) {
        timelineEl.addEventListener('click', (e) => {
            if (e.target.matches('.timeline-item')) {
                const stepId = e.target.getAttribute('data-step');
                updateUI(stepId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // APIキー保存ボタン
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const geminiApiKeyInput = document.getElementById('gemini-api-key');
    const apiKeyStatus = document.getElementById('api-key-status');
    const gameControls = document.getElementById('game-controls');
    if (saveApiKeyBtn && geminiApiKeyInput && apiKeyStatus && gameControls) {
        saveApiKeyBtn.addEventListener('click', () => {
            const key = geminiApiKeyInput.value.trim();
            if (key) {
                localStorage.setItem('geminiApiKey', key);
                apiKeyStatus.textContent = 'APIキーが保存されました！';
                apiKeyStatus.classList.remove('hidden', 'text-red-700');
                apiKeyStatus.classList.add('text-green-700');
                document.getElementById('api-key-section').classList.add('hidden');
                gameControls.classList.remove('hidden');
            } else {
                apiKeyStatus.textContent = 'APIキーを入力してください。';
                apiKeyStatus.classList.remove('hidden', 'text-green-700');
                apiKeyStatus.classList.add('text-red-700');
            }
        });
        // ローカルストレージから自動復元
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
            geminiApiKeyInput.value = storedApiKey;
            apiKeyStatus.textContent = 'APIキーが読み込まれました。';
            apiKeyStatus.classList.remove('hidden', 'text-red-700');
            apiKeyStatus.classList.add('text-green-700');
            document.getElementById('api-key-section').classList.add('hidden');
            gameControls.classList.remove('hidden');
        }
    }

    // 「対話を要約」ボタンのイベントバインド（DOMContentLoaded不要、直接バインド）
    const summarizeBtn = document.getElementById('summarize-dialogue-btn');
    const summaryBox = document.getElementById('dialogue-summary');
    const summaryContent = document.getElementById('summary-content');
    const summaryLoading = document.getElementById('summary-loading');
    const closeSummaryBtn = document.getElementById('close-summary-btn');
    if (summarizeBtn && summaryBox && summaryContent && summaryLoading) {
        summarizeBtn.onclick = async () => {
            summaryLoading.classList.remove('hidden');
            summaryBox.classList.remove('hidden');
            // 対話ログのテキストを抽出
            const dialogueContentEl = document.getElementById('dialogue-content');
            let dialogueText = '';
            if (dialogueContentEl) {
                dialogueText = Array.from(dialogueContentEl.querySelectorAll('.text-stone-700'))
                    .map(el => el.textContent.trim())
                    .join('\n');
            }
            const prompt = `以下の対話ログを要約してください。主要な議論ポイントと結論を日本語で簡潔にまとめてください。\n[対話ログ]\n${dialogueText}`;
            let summary = '';
            try {
                summary = await callGeminiAPI(prompt);
            } catch (e) {
                summary = '要約の生成に失敗しました。';
            }
            // HTMLタグを許可リストでフィルタしてinnerHTMLで描画
            function sanitizeSummary(html) {
                // ul, li, b, strong, em, brのみ許可
                return html.replace(/<(?!\/?(ul|li|b|strong|em|br)\b)[^>]*>/gi, '');
            }
            summaryContent.innerHTML = sanitizeSummary(summary);
            summaryBox.classList.remove('hidden');
            summaryLoading.classList.add('hidden');
        };
    }
    if (closeSummaryBtn && summaryBox) {
        closeSummaryBtn.onclick = () => {
            summaryBox.classList.add('hidden');
        };
    }

    // 必要に応じて他のボタンやUI要素の初期化もここで行う
}

export function updateUI(stepId) {
    // 状態のデバッグ出力
    console.log('[UI更新]', {
        フェーズ: gameState.currentPhase,
        ターン: gameState.currentTurn,
        プレイヤー: gameState.currentPlayer ? gameState.currentPlayer.name || gameState.currentPlayer.playerId : undefined,
        stepId
    });
    // 進行状況に応じて各セクションの表示/非表示や内容更新を行う
    // 例: section-rules, section-intro, game-board-container, section-synthesis など
    // ここでは雛形のみ記載
    const sectionRules = document.getElementById('section-rules');
    const sectionIntro = document.getElementById('section-intro');
    const gameBoardContainer = document.getElementById('game-board-container');
    const sectionSynthesis = document.getElementById('section-synthesis');

    if (sectionRules) sectionRules.classList.add('hidden');
    if (sectionIntro) sectionIntro.classList.add('hidden');
    if (gameBoardContainer) gameBoardContainer.classList.add('hidden');
    if (sectionSynthesis) sectionSynthesis.classList.add('hidden');

    // 中央の問いを常に反映
    const mainCentralQuestion = document.getElementById('main-central-question');
    if (mainCentralQuestion) {
        mainCentralQuestion.textContent = gameState.centralQuestion || '';
    }

    // stepIdに応じて表示切り替え（例）
    switch (stepId) {
        case 'game_rules':
            if (sectionRules) sectionRules.classList.remove('hidden');
            break;
        case 'intro':
            if (sectionIntro) sectionIntro.classList.remove('hidden');
            // 参加者情報を描画
            renderPlayersIntro(gameState.players);
            break;
        case 'p3_synthesis':
            if (sectionSynthesis) {
                sectionSynthesis.classList.remove('hidden');
                // デバッグ: synthesisDataの内容を出力
                console.log('[Phase3] synthesisData:', gameState.synthesisData);
                // 結論とキーワードリスト・関係リストを表示
                sectionSynthesis.innerHTML = `
                    <h3 class="text-2xl font-bold mb-4 text-stone-800 border-b-2 border-amber-300 pb-2">フェーズ3：結論</h3>
                    <div class="p-4 bg-white rounded-lg border border-stone-200 mb-6">
                        <h4 class="font-bold text-amber-800 mb-2">最終結論</h4>
                        <p class="text-stone-700 whitespace-pre-line">${gameState.finalConclusion ? gameState.finalConclusion : '結論がまだ生成されていません。'}</p>
                    </div>
                    <div class="mb-6" id="synthesis-keywords-area">
                        <h4 class="font-bold text-amber-800 mb-2">議論で生まれた中心キーワードと関係</h4>
                        <div id="synthesis-keywords-list"></div>
                        <div id="synthesis-relationships-list" class="mt-4"></div>
                    </div>
                `;
                // キーワード・関係リストを描画
                const keywordsList = document.getElementById('synthesis-keywords-list');
                if (gameState.synthesisData && Array.isArray(gameState.synthesisData.keywords) && gameState.synthesisData.keywords.length > 0) {
                    keywordsList.innerHTML = gameState.synthesisData.keywords.map(k => `
                        <div class="p-3 mb-2 bg-amber-50 border-l-4 border-amber-400 rounded">
                            <span class="font-bold text-stone-800">${k.concept}</span>: <span class="text-stone-700">${k.description || ''}</span>
                        </div>
                    `).join('');
                } else {
                    keywordsList.innerHTML = '<div class="text-stone-500">キーワードなし</div>';
                }
                const relList = document.getElementById('synthesis-relationships-list');
                if (gameState.synthesisData && Array.isArray(gameState.synthesisData.relationships) && gameState.synthesisData.relationships.length > 0) {
                    relList.innerHTML = '<div class="font-bold mb-1 text-stone-700">キーワードの関係:</div>' +
                        gameState.synthesisData.relationships.map(r => `
                            <div class="text-stone-700">→ <b>${r.from}</b> から <b>${r.to}</b></div>
                        `).join('');
                } else {
                    relList.innerHTML = '<div class="text-stone-500">関係なし</div>';
                }
            }
            break;
        default:
            if (gameBoardContainer) {
                gameBoardContainer.classList.remove('hidden');
                // 場のカード・対話ログを描画
                const boardCardsEl = document.getElementById('board-cards');
                renderBoardCards(boardCardsEl, gameState.boardCards);
                const dialogueContentEl = document.getElementById('dialogue-content');
                renderDialogueLog(dialogueContentEl, gameState.gameLog);
                // 要約ボタンを見出し横に移動
                const sectionDialogue = document.getElementById('section-dialogue');
                const h3 = sectionDialogue ? sectionDialogue.querySelector('h3') : null;
                const summarizeBtn = document.getElementById('summarize-dialogue-btn');
                if (h3 && summarizeBtn) {
                    h3.style.display = 'inline-block';
                    summarizeBtn.style.display = 'inline-block';
                    summarizeBtn.style.marginLeft = '1rem';
                    h3.parentNode.insertBefore(summarizeBtn, h3.nextSibling);
                }
            }
            break;
    }

    // タイムラインを再描画
    renderTimeline(stepId);
    // ハイライトされたタイムライン項目を自動スクロール
    const timelineEl = document.getElementById('timeline');
    if (timelineEl) {
        const activeBtn = timelineEl.querySelector('.timeline-item.bg-amber-200');
        if (activeBtn && typeof activeBtn.scrollIntoView === 'function') {
            activeBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }
}
