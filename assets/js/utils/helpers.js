// ユーティリティ部品

/**
 * 配列からランダムに1つ取得
 * @param {Array} arr
 * @returns {*}
 */
export function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * min〜maxの整数乱数
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * HTMLエスケープ
 * @param {string} str
 * @returns {string}
 */
export function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function(tag) {
        const chars = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        };
        return chars[tag] || tag;
    });
}

/**
 * テキスト整形（改行→<br>等）
 * @param {string} text
 * @returns {string}
 */
export function formatText(text) {
    return text.replace(/\n/g, '<br>');
}
