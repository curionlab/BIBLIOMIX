// 対話ログ描画部品
import { gameState } from '../game/state.js';

// プレイヤー情報の絵文字・色（card.jsと共通化推奨）
const genreColors = {
    '哲学': { tagBg: 'bg-fuchsia-100', tagText: 'text-fuchsia-800' },
    '社会学': { tagBg: 'bg-lime-100', tagText: 'text-lime-800' },
    '科学': { tagBg: 'bg-blue-100', tagText: 'text-blue-800' },
    '文学': { tagBg: 'bg-rose-100', tagText: 'text-rose-800' },
    '環境': { tagBg: 'bg-emerald-100', tagText: 'text-emerald-800' },
    'ビジネス': { tagBg: 'bg-violet-100', tagText: 'text-violet-800' },
    '歴史': { tagBg: 'bg-yellow-100', tagText: 'text-yellow-800' },
    '料理': { tagBg: 'bg-orange-100', tagText: 'text-orange-800' },
    'ゲーム': { tagBg: 'bg-sky-100', tagText: 'text-sky-800' },
    '経済学': { tagBg: 'bg-blue-100', tagText: 'text-blue-800' },
    '芸術': { tagBg: 'bg-pink-100', tagText: 'text-pink-800' },
    '心理学': { tagBg: 'bg-purple-100', tagText: 'text-purple-800' }
};
function getPlayerInfo(player) {
    const genreEmojiMap = {
        '科学': '🧑‍🔬', '文学': '📚', '哲学': '🤔', 'ビジネス': '💼', '歴史': '🏺',
        '環境': '🌱', '料理': '🍳', 'ゲーム': '🎮', '経済学': '💹', '芸術': '🎨', '心理学': '🧠', '社会学': '🌏'
    };
    const emoji = genreEmojiMap[player.favoriteGenre] || '🧑';
    let color = 'bg-gray-100', text = 'text-gray-600';
    if (genreColors[player.favoriteGenre]) {
        color = genreColors[player.favoriteGenre].tagBg;
        text = genreColors[player.favoriteGenre].tagText;
    }
    return { emoji, color, text };
}

/**
 * 対話ログ1件分のHTML生成
 * @param {Object} item
 * @returns {string}
 */
export function createDialogueHTML(item) {
    let playerInfo = { emoji: '', color: '', text: '' };
    if (item.player && item.player !== 'F' && gameState && gameState.players) {
        const playerObj = gameState.players.find(p => p.name === item.player);
        if (playerObj) playerInfo = getPlayerInfo(playerObj);
    } else if (item.player === 'F') {
        playerInfo = { emoji: '🧑‍🏫', color: 'bg-gray-100', text: 'text-gray-600' };
    }
    let contentHTML;
    if (item.question) {
        contentHTML = `
            <div class="mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <p class="text-stone-700"><b>問い:</b> ${item.question}</p>
            </div>
        `;
    } else if (item.type === 'response_to_question' && item.respondsToPlayer) {
        const originalQuestion = gameState.playerQuestions[item.respondsToPlayer] || "（元の問いが見つかりません）";
        contentHTML = `
            <div class="mt-1 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p class="text-xs font-semibold text-amber-700 mb-1">【${item.respondsToPlayer}への問いかけ】</p>
                <p class="text-sm text-stone-700 italic mb-2">"${originalQuestion}"</p>
                <p class="text-stone-700 whitespace-pre-line">${item.text}</p>
            </div>
        `;
    } else {
        contentHTML = `
            <p class="text-stone-700 whitespace-pre-line">${item.text}</p>
        `;
    }
    return `
        <div class="flex items-start gap-3 fade-in">
            <div class="w-10 h-10 rounded-full ${playerInfo.color} flex items-center justify-center font-bold ${playerInfo.text} flex-shrink-0">${playerInfo.emoji}</div>
            <div>
                <p class="font-semibold ${playerInfo.text}">${item.player}</p>
                ${contentHTML}
            </div>
        </div>
    `;
}

/**
 * 対話ログリストを描画
 * @param {HTMLElement} dialogueContentEl
 * @param {Array} logItems
 */
export function renderDialogueLog(dialogueContentEl, logItems) {
    if (!dialogueContentEl) return;
    dialogueContentEl.innerHTML = logItems.map(createDialogueHTML).join('');
    // オートスクロール調整（描画後に非同期で実行）
    setTimeout(() => {
        const items = dialogueContentEl.querySelectorAll('.fade-in');
        if (items.length > 0) {
            // 常に最後の発言要素を基準にスクロール
            const target = items[items.length - 1];
            if (target && typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ block: 'start', behavior: 'smooth' });
                // 少し上に余白を作る
                // dialogueContentEl.scrollTop -= 40;
            }
        }
    }, 0);
}
