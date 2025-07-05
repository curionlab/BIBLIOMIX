// 参加者タブ（section-intro）にプレイヤー情報を表示
import { getPlayerInfo } from './card.js';

export function renderPlayersIntro(players) {
    const sectionIntro = document.getElementById('section-intro');
    if (!sectionIntro) return;
    sectionIntro.innerHTML = `
        <h3 class="text-2xl font-bold mb-4 text-stone-800 border-b-2 border-amber-300 pb-2">参加者紹介</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${players.map(player => `
                <div class="p-4 bg-white rounded-lg border border-stone-200 text-center">
                    <p class="text-2xl mb-2">${getPlayerInfo(player).emoji}</p>
                    <p class="font-bold mt-2">${player.name}(${player.age}歳)</p>
                    <p class="text-sm text-stone-500 mb-1">${player.job}</p>
                    <p class="text-xs text-stone-400 mb-1">好きなジャンル: ${player.favoriteGenre}</p>
                    <p class="text-xs text-stone-400 mb-1">マイ・エッセンス: <span class="font-semibold text-stone-700">${player.myEssenceCard ? player.myEssenceCard.title : '---'}</span></p>
                    <p class="text-xs text-stone-500 mt-2">${player.persona}</p>
                </div>
            `).join('')}
        </div>
    `;
} 