// Gemini API通信部品

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * APIキーをlocalStorageから取得
 * @returns {string}
 */
export function getApiKey() {
    return localStorage.getItem('geminiApiKey') || '';
}

/**
 * APIキーをlocalStorageに保存
 * @param {string} key
 */
export function setApiKey(key) {
    localStorage.setItem('geminiApiKey', key);
}

/**
 * APIキーの簡易バリデーション
 * @param {string} key
 * @returns {boolean}
 */
export function validateApiKey(key) {
    return typeof key === 'string' && key.length > 10;
}

/**
 * Gemini APIへリクエスト送信（リトライ・タイムアウト付き）
 * @param {string} prompt
 * @param {string|null} systemInstruction
 * @param {number} retryCount
 * @returns {Promise<string>} 応答テキスト
 */
export async function callGeminiAPI(prompt, systemInstruction = null, retryCount = 0) {
    const apiKey = getApiKey();
    if (!apiKey) {
        // alert('Gemini APIキーが設定されていません。');
        return 'APIキーが設定されていません。';
    }
    const chatHistory = [];
    if (systemInstruction) {
        chatHistory.push({ role: 'user', parts: [{ text: systemInstruction }] });
        chatHistory.push({ role: 'model', parts: [{ text: 'はい、承知いたしました。' }] });
    }
    chatHistory.push({ role: 'user', parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const url = `${API_URL}?key=${apiKey}`;
    const TIMEOUT_MS = 20000;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            let text = result.candidates[0].content.parts[0].text;
            text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            text = text.split('\n').map(line => {
                if (line.startsWith('* ')) {
                    return `<li>${line.substring(2)}</li>`;
                }
                return line;
            }).join('');
            if (text.includes('<li>')) {
                text = `<ul>${text}</ul>`;
            }
            return text;
        } else {
            if (retryCount < 3) {
                await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
                return callGeminiAPI(prompt, systemInstruction, retryCount + 1);
            }
            alert('Gemini APIの応答が不正です。APIキーやネットワークを確認してください。');
            return '応答の生成に失敗しました。';
        }
    } catch (error) {
        if (retryCount < 3) {
            await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
            return callGeminiAPI(prompt, systemInstruction, retryCount + 1);
        }
        alert('Gemini API呼び出し中にエラーが発生しました: ' + error.message);
        return `API呼び出し中にエラーが発生しました: ${error.message}`;
    }
} 