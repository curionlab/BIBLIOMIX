// カード描画部品
import { gameState } from '../game/state.js';

// ジャンルごとの色・タグ設定（HTML版と同等）
const genreColors = {
    '哲学': { cardBorder: 'border-fuchsia-300', tagBg: 'bg-fuchsia-100', tagText: 'text-fuchsia-800' },
    '社会学': { cardBorder: 'border-lime-300', tagBg: 'bg-lime-100', tagText: 'text-lime-800' },
    '科学': { cardBorder: 'border-blue-300', tagBg: 'bg-blue-100', tagText: 'text-blue-800' },
    '文学': { cardBorder: 'border-rose-300', tagBg: 'bg-rose-100', tagText: 'text-rose-800' },
    '環境': { cardBorder: 'border-emerald-300', tagBg: 'bg-emerald-100', tagText: 'text-emerald-800' },
    'ビジネス': { cardBorder: 'border-violet-300', tagBg: 'bg-violet-100', tagText: 'text-violet-800' },
    '歴史': { cardBorder: 'border-yellow-300', tagBg: 'bg-yellow-100', tagText: 'text-yellow-800' },
    '料理': { cardBorder: 'border-orange-300', tagBg: 'bg-orange-100', tagText: 'text-orange-800' },
    'ゲーム': { cardBorder: 'border-sky-300', tagBg: 'bg-sky-100', tagText: 'text-sky-800' },
    '経済学': { cardBorder: 'border-blue-300', tagBg: 'bg-blue-100', tagText: 'text-blue-800' },
    '芸術': { cardBorder: 'border-pink-300', tagBg: 'bg-pink-100', tagText: 'text-pink-800' },
    '心理学': { cardBorder: 'border-purple-300', tagBg: 'bg-purple-100', tagText: 'text-purple-800' }
};

// プレイヤー情報の絵文字・色
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
 * カード1枚分のHTML生成
 * @param {Object} card
 * @returns {string}
 */
export function createCardHTML(card) {
    let playerInfo = { emoji: '', color: '', text: '' };
    if (card.player && card.player !== 'F' && gameState && gameState.players) {
        const playerObj = gameState.players.find(p => p.name === card.player);
        if (playerObj) playerInfo = getPlayerInfo(playerObj);
    } else if (card.player === 'F') {
        playerInfo = { emoji: '🧑‍🏫', color: 'bg-gray-100', text: 'text-gray-600' };
    }
    let borderColorClass = 'border-stone-200';
    let bgColorClass = 'bg-white';
    let titleColorClass = 'text-stone-800';
    let authorYearColorClass = 'text-stone-500';
    let genreTagClasses = '';

    if (card.genre && genreColors[card.genre]) {
        borderColorClass = genreColors[card.genre].cardBorder;
        genreTagClasses = `${genreColors[card.genre].tagBg} ${genreColors[card.genre].tagText}`;
    } else if (card.type === 'my_essence' || card.type === 'essence') {
        borderColorClass = 'border-amber-400';
    } else if (card.type === 'direction') {
        borderColorClass = 'border-teal-400';
        bgColorClass = 'bg-teal-50';
        titleColorClass = 'text-teal-800';
    }
    if (card.serendipity) {
        borderColorClass = 'border-indigo-300';
        if (card.type !== 'direction') {
            bgColorClass = 'bg-indigo-50';
        }
    }
    return `
        <div class="card p-4 rounded-lg border-2 ${borderColorClass} ${bgColorClass} fade-in flex flex-col h-full min-w-[220px] max-w-[90vw] md:max-w-[320px] w-[80vw] md:w-[260px] break-words flex-shrink-0">
            ${card.type !== 'direction' && card.player ? `<p class="text-sm font-semibold ${playerInfo.text} whitespace-normal">${playerInfo.emoji} ${card.player}</p>` : ''}
            <h4 class="font-bold text-lg mt-1 ${titleColorClass} whitespace-normal">${card.title}</h4>
            ${card.author ? `<p class="text-sm ${authorYearColorClass} whitespace-normal">${card.author} (${card.publicationYear})</p>` : ''}
            ${card.genre ? `<p class="text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${genreTagClasses} border ${borderColorClass} whitespace-normal">${card.genre}</p>` : ''}
            ${card.description ? `<div class="text-sm text-stone-700 mt-2 flex-grow leading-relaxed break-words whitespace-normal">${card.description}</div>` : ''}
        </div>
    `;
}

/**
 * 場のカードリストを描画
 * @param {HTMLElement} boardCardsEl
 * @param {Array} cards
 */
export function renderBoardCards(boardCardsEl, cards) {
    if (!boardCardsEl) return;
    boardCardsEl.innerHTML = cards.map(card => createCardHTML(card)).join('');
    // 横スクロールを右端に自動で移動
    boardCardsEl.classList.add('auto-scroll');
    setTimeout(() => {
        boardCardsEl.scrollLeft = boardCardsEl.scrollWidth;
    }, 50);
}

export { getPlayerInfo };
