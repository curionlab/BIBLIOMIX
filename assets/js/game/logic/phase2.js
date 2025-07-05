// フェーズ2の進行ロジック
import { gameState } from '../state.js';
import { updateUI } from '../ui.js';
import { callGeminiAPI } from '../api.js';

/**
 * フェーズ2の初期化
 * - 状態リセット・UI更新
 */
export function initializePhase2() {
    gameState.currentPhase = 2;
    gameState.currentTurn = 1;
    gameState.currentPlayerIndex = 0;
    gameState.phase2DiscussionRound = 0;
    gameState.phase2TotalTurns = 0;
    updateUI('p2_dialogue');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let isPhase2Advancing = false;

/**
 * フェーズ2の進行
 * - 各ディスカッションラウンドの進行（全員発言→ファシリテーター判定→終了判定→次ラウンド/フェーズ3遷移）
 * - Gemini APIによる発言生成・結論到達判定も含む
 */
export async function advancePhase2() {
    if (isPhase2Advancing) return;
    isPhase2Advancing = true;
    try {
        const players = gameState.players;
        if (!gameState.phase2DiscussionRound) gameState.phase2DiscussionRound = 1;
        if (!gameState.phase2RoundOrder) gameState.phase2RoundOrder = [];
        if (!gameState.phase2RoundLog) gameState.phase2RoundLog = [];

        // ラウンド開始時に順番をランダムに決定
        if (gameState.phase2RoundOrder.length === 0) {
            gameState.phase2RoundOrder = shuffleArray(players.map(p => p.playerId));
            gameState.phase2RoundLog = [];
            gameState.phase2CurrentSpeaker = 0;
        }

        const speakerId = gameState.phase2RoundOrder[gameState.phase2CurrentSpeaker];
        const speaker = players.find(p => p.playerId === speakerId);
        const prevLog = [...gameState.gameLog, ...gameState.phase2RoundLog];
        let prompt = '';
        const phase1QuestionsJson = JSON.stringify(gameState.phase1Questions, null, 2);
        const myQEntry = gameState.phase1Questions.find(q => q.playerId === speaker.playerId);
        let myQuestionText = '';
        if (myQEntry && myQEntry.chosenQuestionId) {
            const chosenQ = myQEntry.questions.find(q => q.id === myQEntry.chosenQuestionId);
            if (chosenQ) myQuestionText = chosenQ.text;
        }
        if (gameState.phase2DiscussionRound === 1) {
            // 1ラウンド目は自分の全エッセンスカードと、それぞれに対する選ばれた問いに答える
            let allEssenceQText = '';
            if (Array.isArray(gameState.phase1Questions)) {
                const myEntries = gameState.phase1Questions.filter(q => q.playerId === speaker.playerId);
                if (myEntries.length > 0) {
                    allEssenceQText = myEntries.map((entry, idx) => {
                        const cardTitle = entry.essenceCard?.title || `カード${idx+1}`;
                        let chosenQ = null;
                        if (entry.chosenQuestionId) {
                            chosenQ = entry.questions.find(q => q.id === entry.chosenQuestionId);
                        }
                        return `【${cardTitle}】\n${chosenQ ? 'Q: ' + chosenQ.text : '（選ばれた問いがありません）'}`;
                    }).join('\n\n');
                }
            }
            prompt = `あなたは「${speaker.name}」です。BIBLIOMIXフェーズ2（自由対話）の第1ラウンドです。\n\n以下は全プレイヤーのエッセンスカードと質問のリストです（JSON形式）：\n${phase1QuestionsJson}\n\nあなたが提示した全てのエッセンスカードと、それぞれに対して選ばれた問いは以下の通りです。\n${allEssenceQText}\nこれら全ての問いに順に答えてください。その際に、中央の問い「${gameState.centralQuestion}」とあなたのエッセンスカードを考慮して、あなたの視点から自由に意見やアイデアを述べてください。`;
        } else {
            const prevText = prevLog.slice(-players.length).map(item => `${item.player}: ${item.text || item.question || ''}`).join('\n');
            prompt = `あなたは「${speaker.name}」です。BIBLIOMIXフェーズ2（自由対話）の第${gameState.phase2DiscussionRound}ラウンドです。\n\n以下は全プレイヤーのエッセンスカードと質問のリストです（JSON形式）：\n${phase1QuestionsJson}\n\nこれまでの発言は以下です：\n${prevText}\n中央の問い「${gameState.centralQuestion}」や場のカードについて、他の人の意見に反応したり、新しい視点を出したり、自由に意見やアイデアを述べてください。ディスカッションの場なので一方的に話し続けるのではなく、自分のアイデアにフォーカスしてください。`;
        }
        const response = await callGeminiAPI(prompt, speaker.persona);
        gameState.gameLog.push({ player: speaker.name, text: response, phase: 2 });
        gameState.phase2RoundLog.push({ player: speaker.name, text: response });
        gameState.phase2CurrentSpeaker++;
        updateUI('p2_dialogue');

        // 全員分発言したらラウンド終了
        if (gameState.phase2CurrentSpeaker >= players.length) {
            gameState.phase2RoundOrder = [];
            gameState.phase2RoundLog = [];
            gameState.phase2CurrentSpeaker = 0;
            // ファシリテーター判定
            let shouldEnd = false;
            if (gameState.phase2DiscussionRound >= 3) {
                const dialogueText = gameState.gameLog.slice(-players.length*3).map(item => `${item.player}: ${item.text || item.question || ''}`).join('\n');
                const facilitatorPrompt = `あなたはファシリテーターです。以下の議論ログを読み、この議論が中央の問い「${gameState.centralQuestion}」に対して十分な結論に到達したかどうかを「はい」または「いいえ」で簡潔に答えてください。\n\n[議論ログ]\n${dialogueText}`;
                const facilitatorResponse = await callGeminiAPI(facilitatorPrompt, 'ファシリテーター');
                gameState.gameLog.push({ player: 'F', text: `結論到達判定: ${facilitatorResponse}`, phase: 2 });
                if (facilitatorResponse.includes('はい')) {
                    shouldEnd = true;
                } else {
                    gameState.gameLog.push({ player: 'F', text: 'まだ結論に達していません。次のラウンドで中央の問いに対する結論を出してください。', phase: 2 });
                }
            }
            gameState.phase2DiscussionRound++;
            if (gameState.phase2DiscussionRound > 4 || shouldEnd) {
                gameState.phase2Finished = true;
                updateUI('p2_dialogue');
                isPhase2Advancing = false;
                return;
            }
        }
    } finally {
        isPhase2Advancing = false;
    }
}