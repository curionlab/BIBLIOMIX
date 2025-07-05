// BIBLIOMIX 状態管理モジュール
// ゲーム全体の状態（gameState）とタイムライン構成（timelineConfig）を管理

export let gameState = {
    currentPhase: 0,           // 現在のフェーズ（0:ルール, 1:フェーズ1, 2:フェーズ2, 3:フェーズ3）
    currentTurn: 0,            // 現在のターン
    currentPlayerIndex: 0,     // 現在のプレイヤーインデックス
    centralQuestion: "",      // 中央の問い
    boardCards: [],            // 場に出ているカード
    activeDirectionCard: null, // 現在の方向カード
    playerQuestions: {},       // プレイヤーごとの問い
    gameLog: [],               // 対話ログ
    players: [],               // プレイヤー配列
    phase2DiscussionRound: 0,  // フェーズ2のディスカッションラウンド
    maxPhase2DiscussionRounds: 4,
    finalConclusion: ""
};

// タイムライン構成（初期値）
export let timelineConfig = [
    { id: 'game_rules', title: 'ゲームルール', phase: 0, turn: 0, section: 'section-rules' },
    { id: 'intro', title: '参加者', phase: 0, turn: 0, section: 'section-intro' },
    { id: 'p1_t1_start', title: 'フェーズ1-T1開始', phase: 1, turn: 0, section: 'game-board-container' },
    { id: 'p1_t1_p1', title: 'プレイヤー1の番 (P1-T1)', phase: 1, turn: 1, section: 'game-board-container' },
    { id: 'p1_t1_p2', title: 'プレイヤー2の番 (P1-T1)', phase: 1, turn: 2, section: 'game-board-container' },
    { id: 'p1_t1_p3', title: 'プレイヤー3の番 (P1-T1)', phase: 1, turn: 3, section: 'game-board-container' },
    { id: 'p1_t1_p4', title: 'プレイヤー4の番 (P1-T1)', phase: 1, turn: 4, section: 'game-board-container' },
    { id: 'p1_t2_start', title: 'フェーズ1-T2開始', phase: 1, turn: 5, section: 'game-board-container' },
    { id: 'p1_t2_p1', title: 'プレイヤー1の番 (P1-T2)', phase: 1, turn: 6, section: 'game-board-container' },
    { id: 'p1_t2_p2', title: 'プレイヤー2の番 (P1-T2)', phase: 1, turn: 7, section: 'game-board-container' },
    { id: 'p1_t2_p3', title: 'プレイヤー3の番 (P1-T2)', phase: 1, turn: 8, section: 'game-board-container' },
    { id: 'p1_t2_p4', title: 'プレイヤー4の番 (P1-T2)', phase: 1, turn: 9, section: 'game-board-container' },
    { id: 'p2_dialogue', title: 'フェーズ2: 対話', phase: 2, turn: 1, section: 'game-board-container' },
    { id: 'p3_synthesis', title: 'フェーズ3: 結論', phase: 3, turn: 1, section: 'section-synthesis' }
];

// 状態リセット関数
export function resetGameState() {
    gameState.currentPhase = 0;
    gameState.currentTurn = 0;
    gameState.currentPlayerIndex = 0;
    gameState.centralQuestion = "";
    gameState.boardCards = [];
    gameState.activeDirectionCard = null;
    gameState.playerQuestions = {};
    gameState.gameLog = [];
    gameState.players = [];
    gameState.phase2DiscussionRound = 0;
    gameState.finalConclusion = "";
}

export function updateTimelineWithPlayerNames(players) {
    timelineConfig = timelineConfig.map(item => {
        // P1-T1
        if (/^p1_t1_p\d+$/.test(item.id)) {
            const idx = parseInt(item.id.match(/^p1_t1_p(\d+)$/)[1], 10) - 1;
            if (players[idx]) {
                return { ...item, title: `${players[idx].name}の番 (P1-T1)` };
            }
        }
        // P1-T2
        if (/^p1_t2_p\d+$/.test(item.id)) {
            const idx = parseInt(item.id.match(/^p1_t2_p(\d+)$/)[1], 10) - 1;
            if (players[idx]) {
                return { ...item, title: `${players[idx].name}の番 (P1-T2)` };
            }
        }
        return item;
    });
}
