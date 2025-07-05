// フェーズ1の進行ロジック
import { gameState } from '../state.js';
import { drawRandomCard, drawRandomDirectionCard } from './card.js';
import { generatePlayerQuestion, generateCentralQuestion } from './question.js';
import { updateUI } from '../ui.js';
import { callGeminiAPI } from '../api.js';
import { prompts } from '../prompts/index.js';

/**
 * フェーズ1の初期化
 * - ターン/プレイヤー/状態リセット
 */
export function initializePhase1() {
    gameState.currentPhase = 1;
    gameState.currentTurn = 0;
    gameState.currentPlayerIndex = 0;
    gameState.p1t1Step = null;
    gameState.p1t1Questions = [];
    gameState.p1t1QuestionPlayers = [];
    gameState.p1t1QuestionIndex = 0;
    gameState.activeDirectionCard = null;
    updateUI('p1_t1_start');
}

let isPhase1Advancing = false;

/**
 * フェーズ1の進行
 * - 各ターンの進行（カード提示→質問→ファシリテーター選択→次プレイヤー/ターン）
 * - セレンディピティ・スキップ・方向カードも処理
 */
export async function advancePhase1() {
    if (isPhase1Advancing) return;
    isPhase1Advancing = true;
    try {
        const players = gameState.players;
        if (!gameState.phase1Questions) gameState.phase1Questions = [];
        // 1. T1開始→プレイヤー1の番
        if (gameState.currentTurn === 0) {
            // 中央の問い生成中マーク
            const mainCentralQuestion = document.getElementById('main-central-question');
            if (mainCentralQuestion) {
                mainCentralQuestion.innerHTML = '<span class="loading-spinner"></span> 中央の問いを生成中...';
            }
            // 中央の問い生成
            gameState.centralQuestion = await generateCentralQuestion(players);
            // 生成後に反映
            if (mainCentralQuestion) {
                mainCentralQuestion.textContent = gameState.centralQuestion || '';
            }
            // ファシリテーターの「今回の『問い』カードは…」発言を追加
            gameState.gameLog.push({ player: 'F', text: `今回の『問い』カードは…「${gameState.centralQuestion}」です。` });
            gameState.currentTurn = 1;
            gameState.currentPlayerIndex = 0;
            gameState.p1t1Step = 'intro';
            // ファシリテーターの説明をログに追加
            gameState.gameLog.push({ player: 'F', text: 'フェーズ1・第1ターンを開始します。各プレイヤーが自分のマイ・エッセンスカードを紹介します。' });
            updateUI(`p1_t1_${players[0].playerId}`);
            return;
        }
        // 2. 各プレイヤーの番（T1:エッセンスカード紹介→質問→ファシリテーター選択）
        if (gameState.currentTurn > 0 && gameState.currentTurn <= players.length) {
            const player = players[gameState.currentPlayerIndex];
            // 1. エッセンスカード紹介
            if (!gameState.p1t1Step || gameState.p1t1Step === 'intro') {
                const myCard = player.myEssenceCard;
                gameState.boardCards.push({ ...myCard, type: 'essence', player: player.name });
                if (player.hand) {
                    player.hand = player.hand.filter(c => c.id !== myCard.id);
                }
                // phase1Questionsにエントリを作成
                if (!gameState.phase1Questions.some(q => q.playerId === player.playerId && q.turn === 1)) {
                    gameState.phase1Questions.push({
                        playerId: player.playerId,
                        playerName: player.name,
                        essenceCard: { ...myCard },
                        questions: [],
                        chosenQuestionId: null,
                        turn: 1
                    });
                }
                // AI発言生成（Gemini or ダミー）
                let playerText;
                if (window.USE_DUMMY_AI) {
                    playerText = `[ダミー] ${player.name}のエッセンスカード紹介: ${myCard.title} の本質を語る`;
                } else {
                    const prompt = prompts['ja'].phase1IntroduceEssence({ player, myCard, centralQuestion: gameState.centralQuestion });
                    const response = await callGeminiAPI(prompt, player.persona);
                    playerText = response.replace(`${player.name}:`, '').trim();
                }
                gameState.gameLog.push({ player: player.name, text: playerText });
                // 質問フェーズへ
                gameState.p1t1Step = 'questions';
                gameState.p1t1Questions = [];
                gameState.p1t1QuestionPlayers = players.filter(p => p.playerId !== player.playerId);
                gameState.p1t1QuestionIndex = 0;
                updateUI(`p1_t1_${player.playerId}`);
                return;
            }
            // 2. 他プレイヤーの質問
            if (gameState.p1t1Step === 'questions') {
                const questionPlayer = gameState.p1t1QuestionPlayers[gameState.p1t1QuestionIndex];
                const myCard = player.myEssenceCard;
                let question;
                if (window.USE_DUMMY_AI) {
                    question = `[ダミー] ${questionPlayer.name}から${player.name}への問い: なぜ${myCard.title}を選んだの？`;
                } else {
                    question = await generatePlayerQuestion(questionPlayer, player, myCard, gameState.centralQuestion);
                }
                // phase1Questionsに質問を追加
                const qEntry = gameState.phase1Questions.find(q => q.playerId === player.playerId && q.turn === 1);
                if (qEntry) {
                    const qId = `q_${player.playerId}_${questionPlayer.playerId}`;
                    qEntry.questions.push({ from: questionPlayer.playerId, fromName: questionPlayer.name, text: question, id: qId });
                }
                gameState.p1t1Questions.push({ player: questionPlayer.name, question });
                gameState.gameLog.push({ player: questionPlayer.name, question, to: player.name });
                gameState.p1t1QuestionIndex++;
                if (gameState.p1t1QuestionIndex < gameState.p1t1QuestionPlayers.length) {
                    updateUI(`p1_t1_${player.playerId}`);
                    return;
                } else {
                    gameState.p1t1Step = 'choose';
                    // ファシリテーターの説明をログに追加
                    gameState.gameLog.push({ player: 'F', text: '参加者で相談して一番聞きたい問いを選んでください。' });
                    updateUI(`p1_t1_${player.playerId}`);
                    return;
                }
            }
            // 3. ファシリテーターが質問を選ぶ（UIで選択 or 自動）
            if (gameState.p1t1Step === 'choose') {
                // ランダムで問いを選択
                const chosen = gameState.p1t1Questions[Math.floor(Math.random() * gameState.p1t1Questions.length)];
                if (chosen) {
                    gameState.gameLog.push({ player: 'F', text: `選ばれた問い: 「${chosen.question}」` });
                    // phase1Questionsに選ばれた問いIDを記録（T1: turn=1）
                    const qEntry = gameState.phase1Questions.find(q => q.playerId === player.playerId && q.turn === 1);
                    if (qEntry && qEntry.questions.length > 0) {
                        qEntry.chosenQuestionId = qEntry.questions.find(q => q.text === chosen.question)?.id || qEntry.questions[0].id;
                    }
                }
                // 次のプレイヤーへ
                gameState.currentPlayerIndex++;
                if (gameState.currentPlayerIndex >= players.length) {
                    gameState.currentPlayerIndex = 0;
                    gameState.currentTurn = players.length + 1;
                    gameState.p1t1Step = null;
                    gameState.p1t1Questions = [];
                    gameState.p1t1QuestionPlayers = [];
                    gameState.p1t1QuestionIndex = 0;
                    // ファシリテーターの説明
                    gameState.gameLog.push({ player: 'F', text: '第1ターンが終了しました。次は方向カードを引きます。' });
                    updateUI('p1_t2_start');
                    return;
                }
                gameState.p1t1Step = 'intro';
                gameState.p1t1Questions = [];
                gameState.p1t1QuestionPlayers = [];
                gameState.p1t1QuestionIndex = 0;
                updateUI(`p1_t1_${players[gameState.currentPlayerIndex].playerId}`);
                return;
            }
        }
        // 4. T2開始（方向カードを引く）
        if (gameState.currentTurn === players.length + 1) {
            const directionCard = drawRandomDirectionCard(gameState.boardCards.map(c => c.id));
            if (directionCard) {
                directionCard.type = 'direction';
                if (!gameState.boardCards.some(c => c.id === directionCard.id && c.type === 'direction')) {
                    gameState.boardCards.push(directionCard);
                }
                gameState.activeDirectionCard = directionCard;
            }
            // T2用step/管理配列初期化
            gameState.p1t2Step = 'intro';
            gameState.p1t2Questions = [];
            gameState.p1t2QuestionPlayers = [];
            gameState.p1t2QuestionIndex = 0;
            // ファシリテーターの説明
            gameState.gameLog.push({ player: 'F', text: `方向カード「${gameState.activeDirectionCard ? gameState.activeDirectionCard.title : ''}」が引かれました。` });
            gameState.currentTurn++;
            gameState.currentPlayerIndex = 0;
            updateUI(`p1_t2_${players[0].playerId}`);
            return;
        }
        // 5. T2: 各プレイヤーの番（T1と同じ進行）
        if (gameState.currentTurn > players.length + 1 && gameState.currentTurn <= players.length * 2 + 1) {
            const player = players[gameState.currentPlayerIndex];
            // 1. カード提示
            if (!gameState.p1t2Step || gameState.p1t2Step === 'intro') {
                let cardToPlay = null;
                if (player.hand && player.hand.length > 0) {
                    cardToPlay = player.hand[0];
                    gameState.boardCards.push({ ...cardToPlay, type: 'essence', player: player.name });
                    player.hand = player.hand.filter(c => c.id !== cardToPlay.id);
                    // T2用phase1Questionsエントリを追加
                    gameState.phase1Questions.push({
                        playerId: player.playerId,
                        playerName: player.name,
                        essenceCard: { ...cardToPlay },
                        questions: [],
                        chosenQuestionId: null,
                        turn: 2
                    });
                    // AI発言生成（Gemini or ダミー）
                    let playerText;
                    if (window.USE_DUMMY_AI) {
                        playerText = `[ダミー] ${player.name}がカード「${cardToPlay.title}」を提示し理由を語る`;
                    } else {
                        const prompt = prompts['ja'].phase1ExplainCardRelation({ player, cardToPlay, centralQuestion: gameState.centralQuestion, activeDirectionCard: gameState.activeDirectionCard });
                        const response = await callGeminiAPI(prompt, player.persona);
                        playerText = response.replace(`${player.name}:`, '').trim();
                    }
                    gameState.gameLog.push({ player: player.name, text: playerText });
                } else {
                    // セレンディピティ
                    const serendipityCard = await drawRandomCard(gameState.boardCards.map(c => c.id));
                    if (serendipityCard) {
                        serendipityCard.type = 'essence';
                        serendipityCard.serendipity = true;
                        gameState.boardCards.push({ ...serendipityCard, player: player.name });
                        // T2用phase1Questionsエントリを追加
                        gameState.phase1Questions.push({
                            playerId: player.playerId,
                            playerName: player.name,
                            essenceCard: { ...serendipityCard },
                            questions: [],
                            chosenQuestionId: null,
                            turn: 2
                        });
                        // AI発言生成（Gemini or ダミー）
                        let playerText;
                        if (window.USE_DUMMY_AI) {
                            playerText = `[ダミー] ${player.name}がセレンディピティで「${serendipityCard.title}」を引き理由を語る`;
                        } else {
                            const prompt = prompts['ja'].phase1ExplainCardRelation({ player, cardToPlay: serendipityCard, centralQuestion: gameState.centralQuestion, activeDirectionCard: gameState.activeDirectionCard });
                            const response = await callGeminiAPI(prompt, player.persona);
                            playerText = response.replace(`${player.name}:`, '').trim();
                        }
                        gameState.gameLog.push({ player: player.name, text: playerText });
                    }
                }
                // 質問フェーズへ
                gameState.p1t2Step = 'questions';
                gameState.p1t2Questions = [];
                gameState.p1t2QuestionPlayers = players.filter(p => p.playerId !== player.playerId);
                gameState.p1t2QuestionIndex = 0;
                updateUI(`p1_t2_${player.playerId}`);
                return;
            }
            // 2. 他プレイヤーの質問
            if (gameState.p1t2Step === 'questions') {
                const questionPlayer = gameState.p1t2QuestionPlayers[gameState.p1t2QuestionIndex];
                // 直前のカード提示で場に出したカードを取得
                let card = null;
                // boardCardsの末尾から自分の最新カードを探す
                for (let i = gameState.boardCards.length - 1; i >= 0; i--) {
                    if (gameState.boardCards[i].player === player.name && gameState.boardCards[i].type === 'essence') {
                        card = gameState.boardCards[i];
                        break;
                    }
                }
                let question;
                if (window.USE_DUMMY_AI) {
                    question = `[ダミー] ${questionPlayer.name}から${player.name}への問い: このカードのどこが面白い？`;
                } else {
                    question = await generatePlayerQuestion(questionPlayer, player, card, gameState.centralQuestion);
                }
                // T2用phase1Questionsエントリに質問を追加
                const qEntry = gameState.phase1Questions.find(q => q.playerId === player.playerId && q.turn === 2);
                if (qEntry) {
                    const qId = `q_${player.playerId}_${questionPlayer.playerId}_t2`;
                    qEntry.questions.push({ from: questionPlayer.playerId, fromName: questionPlayer.name, text: question, id: qId });
                }
                gameState.p1t2Questions.push({ player: questionPlayer.name, question });
                gameState.gameLog.push({ player: questionPlayer.name, question, to: player.name });
                gameState.p1t2QuestionIndex++;
                if (gameState.p1t2QuestionIndex < gameState.p1t2QuestionPlayers.length) {
                    updateUI(`p1_t2_${player.playerId}`);
                    return;
                } else {
                    gameState.p1t2Step = 'choose';
                    // ファシリテーターの説明をログに追加
                    gameState.gameLog.push({ player: 'F', text: '参加者で相談して一番聞きたい問いを選んでください。' });
                    updateUI(`p1_t2_${player.playerId}`);
                    return;
                }
            }
            // 3. ファシリテーターが質問を選ぶ（UIで選択 or 自動）
            if (gameState.p1t2Step === 'choose') {
                // ランダムで問いを選択
                const chosen = gameState.p1t2Questions[Math.floor(Math.random() * gameState.p1t2Questions.length)];
                let isLastPlayer = false;
                if (gameState.currentPlayerIndex + 1 >= players.length) isLastPlayer = true;
                if (chosen) {
                    gameState.gameLog.push({ player: 'F', text: `選ばれた問い: 「${chosen.question}」` });
                    // phase1Questionsに選ばれた問いIDを記録（T2: turn=2）
                    const qEntry = gameState.phase1Questions.find(q => q.playerId === player.playerId && q.turn === 2);
                    if (qEntry && qEntry.questions.length > 0) {
                        qEntry.chosenQuestionId = qEntry.questions.find(q => q.text === chosen.question)?.id || qEntry.questions[0].id;
                    }
                    if (isLastPlayer) {
                        gameState.gameLog.push({ player: 'F', text: 'フェーズ1が終了しました。次はフェーズ2（自由対話）に進みます。' });
                        updateUI(`p1_t2_${player.playerId}`);
                        setTimeout(() => {
                            gameState.currentPhase = 2;
                            gameState.currentTurn = 1;
                            gameState.currentPlayerIndex = 0;
                            // advanceGame()でフェーズ2進行
                            if (typeof window.advanceGame === 'function') {
                                window.advanceGame();
                            }
                        }, 0);
                        return;
                    }
                }
                // 次のプレイヤーへ
                gameState.currentPlayerIndex++;
                gameState.p1t2Step = 'intro';
                gameState.p1t2Questions = [];
                gameState.p1t2QuestionPlayers = [];
                gameState.p1t2QuestionIndex = 0;
                updateUI(`p1_t2_${players[gameState.currentPlayerIndex].playerId}`);
                return;
            }
        }
    } finally {
        isPhase1Advancing = false;
    }
}