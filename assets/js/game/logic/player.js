// プレイヤー生成・管理
import { allAvailableEssenceCards } from './card.js';
import { callGeminiAPI } from '../api.js';
import { prompts } from '../prompts/index.js';

// サンプルデータ（日本人名・職業・ジャンルなど）
const sampleNames = [
    ['佐藤', '太郎'], ['鈴木', '花子'], ['高橋', '健一'], ['田中', '美咲'],
    ['伊藤', '翔'], ['渡辺', '彩'], ['山本', '大輔'], ['中村', '結衣'],
    ['小林', '悠斗'], ['加藤', 'さくら'], ['吉田', '蓮'], ['山田', '葵']
];
const sampleJobs = [
    'エンジニア', '医師', '教師', '作家', '経営者', '学生', '研究者', '公務員', 'デザイナー', '起業家', '編集者', '心理カウンセラー'
];
const sampleGenres = [
    '哲学', '社会学', '科学', '文学', '環境', 'ビジネス', '歴史', '料理', 'ゲーム', '経済学', '芸術', '心理学'
];
const sampleHobbies = ['読書', '旅行', '音楽', '料理', 'スポーツ', '写真', '映画鑑賞', '登山', 'ゲーム', '美術館巡り'];
const samplePlaces = ['東京', '大阪', '京都', '札幌', '福岡', '名古屋', '仙台', '広島', '神戸', '横浜'];
const sampleEducations = ['高卒', '短大卒', '大卒', '大学院卒', '専門卒'];
const sampleFaiths = ['無宗教', '仏教', '神道', 'キリスト教', 'イスラム教', 'その他'];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// プレイヤー1人分生成
export function generatePlayer(index) {
    const nameArr = getRandom(sampleNames);
    const name = nameArr[0] + ' ' + nameArr[1];
    const age = getRandomInt(20, 60);
    const gender = getRandom(['男性', '女性', 'その他']);
    const job = getRandom(sampleJobs);
    const favoriteGenre = getRandom(sampleGenres);
    const hobby = getRandom(sampleHobbies);
    const from = getRandom(samplePlaces);
    const live = getRandom(samplePlaces);
    const education = getRandom(sampleEducations);
    const faith = getRandom(sampleFaiths);
    // ペルソナ説明文
    const persona = `${name}（${age}歳、${gender}）。職業：${job}。好きなジャンル：${favoriteGenre}。趣味：${hobby}。出身地：${from}、居住地：${live}。学歴：${education}。信仰：${faith}。`;
    return {
        playerId: `p${index+1}`,
        name,
        age,
        gender,
        job,
        favoriteGenre,
        hobby,
        from,
        live,
        education,
        faith,
        persona,
        myEssenceCard: null, // 後で割り当て
        hand: [], // 後で割り当て
        usedCardIds: [] // 出したカードID管理
    };
}

// プレイヤー配列生成
export function generatePlayers(num = 4) {
    const players = [];
    for (let i = 0; i < num; i++) {
        players.push(generatePlayer(i));
    }
    return players;
}

// マイ・エッセンスカード割り当て
export function assignMyEssenceCard(player) {
    // 好きなジャンルから1冊選ぶ（なければランダム）
    const candidates = allAvailableEssenceCards.filter(card => card.genre === player.favoriteGenre);
    const card = candidates.length > 0 ? getRandom(candidates) : getRandom(allAvailableEssenceCards);
    player.myEssenceCard = {
        ...card,
        id: `my_essence_${player.playerId}`,
        type: 'my_essence',
        player: player.name
    };
    return player.myEssenceCard;
}

// 手札配布（マイ・エッセンス＋山札から2枚）
export function assignHand(player, usedCardIds = []) {
    const hand = [player.myEssenceCard];
    // マイ・エッセンス以外＆usedCardIdsに含まれないカードから2枚
    const handCandidates = allAvailableEssenceCards.filter(card => card.id !== player.myEssenceCard.id && !usedCardIds.includes(card.id));
    let pool = [...handCandidates];
    while (hand.length < 3 && pool.length > 0) {
        const card = getRandom(pool);
        hand.push(card);
        usedCardIds.push(card.id);
        pool = pool.filter(c => c.id !== card.id);
    }
    player.hand = hand;
    return hand;
}

// Geminiで多様な4人のプレイヤーを生成
export async function generatePlayersLLM(num = 4) {
    const lang = 'ja';
    const prompt = prompts[lang].generatePlayers();
    const response = await callGeminiAPI(prompt);
    let players = [];
    try {
        const jsonArr = JSON.parse(response.match(/\[([\s\S]*)\]/)[0]);
        players = jsonArr.map((json, idx) => {
            const persona = `あなたは「${json.name}」です。興味関心: ${json.interests}。問いかけ方: ${json.questionStyle}。考え方のスタイル: ${json.thinkingStyle}。話し方: ${json.talkingStyle}。`;
            return {
                playerId: `p${idx+1}`,
                name: json.name,
                age: json.age,
                gender: json.gender,
                job: json.job,
                favoriteGenre: json.favoriteGenre,
                hobby: json.hobby,
                from: json.from,
                live: json.live,
                education: json.education,
                faith: json.faith,
                interests: json.interests,
                questionStyle: json.questionStyle,
                thinkingStyle: json.thinkingStyle,
                talkingStyle: json.talkingStyle,
                persona,
                myEssenceCard: null,
                hand: [],
                usedCardIds: []
            };
        });
    } catch (e) {
        // フォールバック: 乱数生成
        if (typeof window.generatePlayers === 'function') {
            players = window.generatePlayers(num);
            players.forEach((p, idx) => p.playerId = `p${idx+1}`);
        }
    }
    return players;
}

// Geminiでマイ・エッセンスカードを生成
export async function generateMyEssenceCardLLM(player, allAvailableEssenceCards) {
    const lang = 'ja';
    const prompt = prompts[lang].generateMyEssenceCard({ player, allAvailableEssenceCards });
    const response = await callGeminiAPI(prompt);
    try {
        const json = JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
        return {
            id: `my_${player.name}_${Date.now()}`,
            type: 'my_essence',
            player: player.name,
            title: json.title,
            author: json.author,
            publicationYear: json.publicationYear,
            genre: json.genre,
            description: `${json.description}<br>核心概念：<ul>${json.coreConcepts.map(c => `<li><b>${c}</b></li>`).join('')}</ul>`
        };
    } catch (e) {
        // フォールバック: 既存カードから
        const fallback = allAvailableEssenceCards.find(card => card.genre === player.favoriteGenre) || allAvailableEssenceCards[0];
        return { ...fallback, id: `my_${player.name}_${Date.now()}`, type: 'my_essence', player: player.name };
    }
}