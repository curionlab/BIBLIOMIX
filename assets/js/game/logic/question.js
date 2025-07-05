// 問い生成・管理
import { callGeminiAPI } from '../api.js';
import { prompts } from '../prompts/index.js';

/**
 * プレイヤー情報配列から中央の問いを生成
 * @param {Array} players - プレイヤー配列
 * @returns {Promise<string>} - 生成された中央の問い
 */
export async function generateCentralQuestion(players) {
    const prompt = prompts['ja'].generateCentralQuestion({ players });
    const response = await callGeminiAPI(prompt);
    if (response === 'APIキーが設定されていません。') {
        return '';
    }
    return parseCentralQuestionResponse(response);
}

/**
 * LLM応答から中央の問い文を抽出
 * @param {string} response
 * @returns {string}
 */
export function parseCentralQuestionResponse(response) {
    const match = response.match(/問い[:：]\s*"([^"]+)"/);
    return match ? match[1] : response.replace(/^.*?[:：]/, '').trim();
}

/**
 * プレイヤー・カード・中央の問いをもとに個別の問いを生成
 * @param {Object} player - 質問するプレイヤー
 * @param {Object} targetPlayer - 対象プレイヤー
 * @param {Object} card - 対象カード
 * @param {string} centralQuestion - 中央の問い
 * @returns {Promise<string>} - 生成された問い
 */
export async function generatePlayerQuestion(player, targetPlayer, card, centralQuestion) {
    const prompt = prompts['ja'].generatePlayerQuestion({ player, targetPlayer, card, centralQuestion });
    const response = await callGeminiAPI(prompt, player.persona);
    return parsePlayerQuestionResponse(response, player.name);
}

/**
 * LLM応答から個別の問い文を抽出
 * @param {string} response
 * @param {string} playerName
 * @returns {string}
 */
export function parsePlayerQuestionResponse(response, playerName) {
    const match = response.match(/^[^:]+:\s*"(.*)"/m);
    return match ? match[1] : response.replace(`${playerName}:`, '').replace(/"/g, '').trim();
}