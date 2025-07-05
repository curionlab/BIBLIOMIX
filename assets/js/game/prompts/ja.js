/**
 * BIBLIOMIX ゲーム用 LLMプロンプト集（日本語）
 * 各プロンプトはテンプレート関数形式で、引数で動的内容を埋め込める
 */
export const prompts_ja = {
  /**
   * プレイヤー生成用プロンプト
   * @returns {string} LLM用プロンプト
   * talkingStyle: 話し方・一人称・口調・禁止事項・出力例の指示を含む
   */
  generatePlayers: () => `あなたはBIBLIOMIXという知的対話ゲームのAIです。多様な4人のプレイヤーを同時に生成してください。全員が異なるジャンル・異なる経歴・異なる名前（できれば日本人名）になるようにしてください。同じジャンルや同じ名前・経歴が重複しないようにしてください。

各プレイヤーには「talkingStyle」という属性を必ず含めてください。talkingStyleには以下の内容を必ず含めてください：
- 話し方: 知的で落ち着いた大人の話し方/論理的かつ親しみやすい語り口など
- 一人称: 私/アタシ/僕/俺/自分の氏名のFamily Name/FirstN ameなど
- 二人称: 主に、苗字呼び/名前呼び。さん付け、君付け、呼び捨て（日本人は基本は苗字+さん付け呼びです。）
- 口調: 標準語/○○弁/ギャル言葉、丁寧語（です・ます調）/フランク/年上には丁寧語、年下にはフランク、オヤジギャグが好き、ラップ調など職業や出身地に合わせて口調を決めてください。
- 禁止事項: 攻撃的な表現、下ネタなど 
- 【出力例】私の考えでは、○○です。□□と考えます。

以下のフォーマットで、日本語で4人分まとめてJSON配列で出力してください。

【出力フォーマット】
[
  {
    "name": "氏名（できれば日本人名）",
    "age": 20-60,
    "gender": "男性/女性/その他",
    "job": "職業・役職",
    "favoriteGenre": "ジャンル（哲学、社会学、科学、文学、環境、ビジネス、歴史、料理、ゲーム、経済学、芸術、心理学のいずれか）",
    "hobby": "趣味",
    "from": "出身地",
    "live": "居住地",
    "education": "学歴",
    "faith": "信仰",
    "interests": "興味関心（例：科学技術、物語、社会問題など）",
    "questionStyle": "問いかけ方（例：直感的に問いかける、論理的に掘り下げる、比喩を使う等）",
    "thinkingStyle": "考え方のスタイル（例：分析的、直感的、俯瞰的、感情重視など）",
    "talkingStyle": "上記で定めた要素を一文で記載"
  },
  ...（あと3人分）
]
`,

  /**
   * マイ・エッセンスカード生成用プロンプト
   * @param {object} player - プレイヤー情報
   * @param {Array} allAvailableEssenceCards - 利用可能なエッセンスカード一覧
   * @returns {string} LLM用プロンプト
   */
  generateMyEssenceCard: ({ player, allAvailableEssenceCards }) => `あなたはBIBLIOMIXという知的対話ゲームのAIです。以下のプレイヤー情報をもとに、その人物が提示するにふさわしい「マイ・エッセンスカード」を1つ生成してください。

【プレイヤー情報】
氏名: ${player.name}
年齢: ${player.age}
性別: ${player.gender}
職業・役職: ${player.job}
好きなジャンル: ${player.favoriteGenre}
趣味: ${player.hobby}
出身地: ${player.from}
居住地: ${player.live}
学歴: ${player.education}
信仰: ${player.faith}
ペルソナ説明: ${player.persona}

【allAvailableEssenceCardsリスト】
${allAvailableEssenceCards.map(card => `・${card.title}（著者: ${card.author}、ジャンル: ${card.genre}、出版年: ${card.publicationYear}）`).join('\n')}

【出力フォーマット】
{
  "title": "本のタイトル",
  "author": "著者名",
  "publicationYear": 20XX,
  "genre": "${player.favoriteGenre}",
  "description": "本の要約（200字以内）",
  "coreConcepts": ["概念1", "概念2", ...]
}

※必ず上記のallAvailableEssenceCardsリストの中から最もふさわしい1冊を選び、その本の情報を使って生成してください。創作・架空の本は禁止です。`,

  /**
   * 中央の問い生成用プロンプト
   * @param {Array} players - プレイヤー配列
   * @returns {string} LLM用プロンプト
   */
  generateCentralQuestion: ({ players }) => {
    const personaList = players.map(p => `・${p.name}（${p.job}、${p.favoriteGenre}好き、${p.persona}）`).join('\n');
    return `あなたはBIBLIOMIXという知的対話ゲームのAIです。以下の4人の参加者がいます。それぞれの多様な視点やペルソナ、好きなジャンルを活かし、正解探しではなく、知的なディスカッションが盛り上がる「シンプルで本質的な問い」を1つ日本語で生成してください。\n\n【参加者リスト】\n${personaList}\n\n【出力フォーマット】\n問い: "ここに問い文（例：急速に変化する現代において、人間が『幸福』を感じるための本質とは何か？）"\n\n※問いは60文字以内、できるだけ短く、抽象度が高く、価値観や視点が交差しやすいものにしてください。\n※「〜とは何か？」「〜の本質は？」などの形式を推奨します。`;
  },

  /**
   * 個別の問い生成用プロンプト
   * @param {Object} player - 質問するプレイヤー
   * @param {Object} targetPlayer - 対象プレイヤー
   * @param {Object} card - 対象カード
   * @param {string} centralQuestion - 中央の問い
   * @returns {string} LLM用プロンプト
   */
  generatePlayerQuestion: ({ player, targetPlayer, card, centralQuestion }) => `今、${targetPlayer.name}さんが紹介したエッセンスカードは「${card.title}」（ジャンル: ${card.genre}、概要: ${card.description.replace(/<[^>]*>?/gm, '')}）です。\nこのターンでは、${targetPlayer.name}さんのエッセンスカードの内容やそこから得られる知識について、好奇心を持って学びを深めるためのオープンな問いを1つ投げかけてください。\n※中央の問い「${centralQuestion}」の答えを直接求めるのではなく、知識や視点の広がり・新たな発見・探究を促す問いにしてください。\n\n以下のフォーマットに厳密に従ってください:\n${player.name}: [あなたの質問を二重引用符で囲む]`,

  /**
   * フェーズ2: 発言生成用プロンプト（1ラウンド目）
   * @param {Object} speaker - 発言者プレイヤー
   * @param {string} phase1QuestionsJson - フェーズ1の質問JSON
   * @param {string} allEssenceQText - 自分のカードと選ばれた問い一覧
   * @param {string} centralQuestion - 中央の問い
   * @returns {string} LLM用プロンプト
   */
  phase2FirstRound: ({ speaker, phase1QuestionsJson, allEssenceQText, centralQuestion }) => `今、BIBLIOMIXフェーズ2（自由対話）の第1ラウンドです。\n\n以下は全プレイヤーのエッセンスカードと質問のリストです（JSON形式）：\n${phase1QuestionsJson}\n\nあなたが提示した全てのエッセンスカードと、それぞれに対して選ばれた問いは以下の通りです。\n${allEssenceQText}\nこれら全ての問いに順に答えてください。その際に、中央の問い「${centralQuestion}」とあなたのエッセンスカードを考慮して、あなたの視点から自由に意見やアイデアを述べてください。`,

  /**
   * フェーズ2: 発言生成用プロンプト（2ラウンド目以降）
   * @param {Object} speaker - 発言者プレイヤー
   * @param {string} phase1QuestionsJson - フェーズ1の質問JSON
   * @param {string} prevText - 直前の発言ログ
   * @param {string} centralQuestion - 中央の問い
   * @returns {string} LLM用プロンプト
   */
  phase2OtherRounds: ({ speaker, phase1QuestionsJson, prevText, centralQuestion, round }) => `BIBLIOMIXフェーズ2（自由対話）の第${round}ラウンドです。\n\n以下は全プレイヤーのエッセンスカードと質問のリストです（JSON形式）：\n${phase1QuestionsJson}\n\nこれまでの発言は以下です：\n${prevText}\nこれまでの発言の流れを汲んで、中央の問い「${centralQuestion}」や場のカードについて、他の人の意見に反応したり、新しい視点を出したり、自由に意見やアイデアを述べてください。ディスカッションの場なので自分のエッセンスカードやアイデアを一方的に話し続けるのではなく、みなと協力して中央の問いに答えるためのディスカッションを心がけてください。特に第２ラウンド以降は、これまでの発言の流れを汲んで、中央の問い「${centralQuestion}」に答えるための議論を推進してください。`,

  /**
   * フェーズ2: ファシリテーター判定用プロンプト
   * @param {string} centralQuestion - 中央の問い
   * @param {string} dialogueText - 議論ログ
   * @returns {string} LLM用プロンプト
   */
  phase2Facilitator: ({ centralQuestion, dialogueText }) => `あなたはファシリテーターです。以下の議論ログを読み、この議論が中央の問い「${centralQuestion}」に対して十分な結論に到達したかどうかを「はい」または「いいえ」で簡潔に答えてください。\n\n[議論ログ]\n${dialogueText}`,

  /**
   * フェーズ3: 結論生成用プロンプト
   * @param {string} centralQuestion - 中央の問い
   * @returns {string} LLM用プロンプト
   */
  phase3Conclusion: ({ centralQuestion }) => `これまでの議論を踏まえ、中央の問い「${centralQuestion}」に対する最終結論を日本語で簡潔にまとめてください。箇条書きやJSONではなく、自然な文章で出力してください。`,

  /**
   * フェーズ3: チャート生成用プロンプト
   * @returns {string} LLM用プロンプト
   */
  phase3Chart: () => `これまでの議論を踏まえ、議論で登場した主要なキーワード（概念）とその簡単な説明、およびキーワード同士の関係を以下のJSON形式で出力してください。\n【出力例】\n{\n  "keywords": [\n    { "concept": "幸福", "description": "人間が感じる満足や充足の状態" },\n    { "concept": "共感", "description": "他者の感情や立場を理解し共有すること" }\n  ],\n  "relationships": [\n    { "from": "共感", "to": "幸福" }\n  ]\n}`,

  /**
   * UI: 対話ログ要約用プロンプト
   * @param {string} dialogueText - 対話ログ
   * @returns {string} LLM用プロンプト
   */
  summarizeDialogue: ({ dialogueText }) => `以下の対話ログを要約してください。主要な議論ポイントと結論を日本語で簡潔にまとめてください。\n[対話ログ]\n${dialogueText}`,

  /**
   * フェーズ1: マイ・エッセンスカード紹介用プロンプト
   * @param {object} player - 発言者プレイヤー
   * @param {object} myCard - マイ・エッセンスカード
   * @param {string} centralQuestion - 中央の問い
   * @returns {string} LLM用プロンプト
   */
  phase1IntroduceEssence: ({ player, myCard, centralQuestion }) =>
    `あなたは「${player.name}」です。あなたの役割は「${player.job}」です。\n中央の問いは「${centralQuestion}」です。\nあなたのマイ・エッセンスカードは「${myCard.title}」（ジャンル: ${myCard.genre}、概要: ${myCard.description.replace(/<[^>]*>?/gm, '')}）です。\nこのターンでは、あなたのマイ・エッセンスカードの核となる概念を、他のプレイヤーに分かりやすく紹介してください。\n※このターンでは質問は投げかけず、紹介だけを行ってください。\n\n以下のフォーマットに厳密に従ってください:\n${player.name}: [あなたのカードの説明と核となる概念（太字で強調）]`,

  /**
   * フェーズ1: カード提示理由・関係性説明用プロンプト
   * @param {object} player - 発言者プレイヤー
   * @param {object} cardToPlay - 提示するカード
   * @param {string} centralQuestion - 中央の問い
   * @param {object} activeDirectionCard - 方向カード
   * @returns {string} LLM用プロンプト
   */
  phase1ExplainCardRelation: ({ player, cardToPlay, centralQuestion, activeDirectionCard }) =>
    `あなたは「${player.name}」です。あなたの役割は「${player.job}」です。\n中央の問いは「${centralQuestion}」です。\n今回提示するカードは「${cardToPlay.title}」（ジャンル: ${cardToPlay.genre}、概要: ${cardToPlay.description.replace(/<[^>]*>?/gm, '')}）です。\n化学反応の方向は「${activeDirectionCard ? activeDirectionCard.title : ''}」です。\nこのカードを提示した理由と、中央の問いや方向カードとの関係性を簡潔に説明してください。\n\n${player.name}: [カード提示理由・関係性]`,
}; 