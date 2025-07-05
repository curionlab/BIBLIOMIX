// 各ロジックの統合・エクスポート
import { gameState, resetGameState, updateTimelineWithPlayerNames } from '../state.js';
import { initializePhase1, advancePhase1 } from './phase1.js';
import { initializePhase2, advancePhase2 } from './phase2.js';
import { initializePhase3, advancePhase3 } from './phase3.js';
import { generatePlayers, assignMyEssenceCard, assignHand } from './player.js';
import { generateCentralQuestion } from './question.js';
import { updateUI } from '../ui.js';
import { generatePlayersLLM, generateMyEssenceCardLLM } from './player.js';
import { allAvailableEssenceCards } from './card.js';

/**
 * ゲーム全体の初期化
 * - プレイヤー生成、カード配布、中央の問い生成、UI初期化、フェーズ1初期化
 */
export async function initializeGame() {
    resetGameState();
    let players;
    if (window.USE_DUMMY_AI || window.DEBUG_MODE) {
        // デバッグ用: 既存の乱数生成ロジック
        players = generatePlayers(4);
        const usedCardIds = [];
        players.forEach(player => {
            assignMyEssenceCard(player);
            assignHand(player, usedCardIds);
        });
    } else {
        // Geminiでプレイヤー生成
        players = await generatePlayersLLM(4);
        for (const player of players) {
            // Geminiでマイ・エッセンスカード生成
            const myEssence = await generateMyEssenceCardLLM(player, allAvailableEssenceCards);
            const baseCard = allAvailableEssenceCards.find(card => card.title === myEssence.title && card.author === myEssence.author);
            if (baseCard) {
                player.myEssenceCard = {
                    ...baseCard,
                    id: myEssence.id,
                    type: 'my_essence',
                    player: player.name
                };
            } else {
                player.myEssenceCard = myEssence;
            }
            player.hand = [player.myEssenceCard];
        }
    }
    gameState.players = players;
    updateTimelineWithPlayerNames(gameState.players);
    // 中央の問い生成はadvancePhase1で行う
    // UI初期化
    // updateUI('game_rules');
    // フェーズ1初期化はadvanceGame等で進行時に呼ぶ
}

/**
 * ゲーム進行（advance）
 * - 現在のフェーズに応じてadvancePhase1/2/3を呼び出し
 */
export async function advanceGame() {
    if (gameState.phase2Finished) {
        // フェーズ2終了後の「次へ」
        gameState.phase2Finished = false;
        await initializePhase3();
        return;
    }
    if (gameState.currentPhase === 1) {
        await advancePhase1();
    } else if (gameState.currentPhase === 2) {
        await advancePhase2();
    } else if (gameState.currentPhase === 3) {
        await advancePhase3();
    } else {
        // ルール・イントロ等
        initializePhase1();
    }
}

/**
 * ゲームリセット
 * - 状態リセット・UI初期化
 */
export function resetGame() {
    resetGameState();
    updateUI('game_rules');
}