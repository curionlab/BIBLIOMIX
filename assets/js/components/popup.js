// 概念拡張ポップアップ描画部品

// 必要な要素取得
const conceptPopup = document.getElementById('concept-popup');
const popupConceptTitle = document.getElementById('popup-concept-title');
const popupContentEl = document.getElementById('popup-content');
const popupLoadingEl = document.getElementById('popup-loading');
const expandConceptBtn = document.getElementById('expand-concept-btn');
const closePopupBtn = document.getElementById('close-popup-btn');

/**
 * ポップアップを表示
 * @param {string} title
 */
export function showConceptPopup(title) {
    if (!conceptPopup) return;
    conceptPopup.classList.remove('hidden');
    conceptPopup.classList.add('show');
    if (popupConceptTitle) popupConceptTitle.textContent = title;
}

/**
 * ポップアップを非表示
 */
export function hideConceptPopup() {
    if (!conceptPopup) return;
    conceptPopup.classList.remove('show');
    conceptPopup.classList.add('hidden');
    if (popupContentEl) popupContentEl.innerHTML = '';
    if (popupConceptTitle) popupConceptTitle.textContent = '';
}

/**
 * ポップアップ内容を更新
 * @param {string} html
 */
export function setConceptPopupContent(html) {
    if (popupContentEl) popupContentEl.innerHTML = html;
}

/**
 * ローディング表示/非表示
 * @param {boolean} isLoading
 */
export function setConceptPopupLoading(isLoading) {
    if (!popupLoadingEl) return;
    if (isLoading) {
        popupLoadingEl.classList.remove('hidden');
    } else {
        popupLoadingEl.classList.add('hidden');
    }
}

// イベントリスナー登録
if (closePopupBtn) {
    closePopupBtn.addEventListener('click', hideConceptPopup);
}
// 拡張ボタンのイベントは外部で登録（API呼び出し等のため）
