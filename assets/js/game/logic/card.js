// カード配布・管理

// --- 全エッセンスカードリスト（BIBLIOMIX_by_Agents.htmlから完全移植） ---
export const allAvailableEssenceCards = [
    // 哲学
    { id: 'ihoujin', title: '異邦人', author: 'アルベール・カミュ', publicationYear: 1942, genre: '哲学', description: '不条理な世界における人間の『<b>実存</b>』と、<b>感情</b>や<b>論理</b>が意味を持たない状況での<b>自由</b>と<b>責任</b>を問いかけます。<br>核心概念：<ul><li><b>不条理</b>: 世界や人生に内在する、無意味で理解不能な側面。</li><li><b>実存</b>: 個人の具体的な存在であり、その自由と責任。</li><li><b>感情の欠如</b>: 社会的規範や期待からの逸脱。</li><li><b>自由と責任</b>: 不条理な世界で自らの選択を行うこと。</li></ul>' },
    { id: 'sophies_world', title: 'ソフィーの世界', author: 'ヨースタイン・ゴルデル', publicationYear: 1991, genre: '哲学', description: '少女ソフィーが謎の哲学教師から送られてくる手紙を通じて、哲学の歴史と主要な概念を学ぶ物語。<b>存在</b>、<b>真実</b>、<b>意識</b>について考えるきっかけを与えます。<br>核心概念：<ul><li><b>存在</b>: 我々がなぜここにいるのかという根本的な問い。</li><li><b>真実</b>: 客観的認識と主観的認識の探求。</li><li><b>意識</b>: 自己と世界の認識。</li></ul>' },
    { id: 'beyond_good_evil', title: '善悪の彼岸', author: 'フリードリヒ・ニーチェ', publicationYear: 1886, genre: '哲学', description: '従来の道徳観を批判し、新しい価値観の創造を提唱。<b>力への意志</b>、<b>永劫回帰</b>、<b>超人</b>といった概念を通じて、人間の可能性を深く掘り下げます。<br>核心概念：<ul><li><b>力への意志</b>: 生きとし生けるものの根源的な衝動。</li><li><b>価値の転換</b>: 既存の道徳や規範の批判と乗り越え。</li><li><b>超人</b>: 自己を克服し、新しい価値を創造する人間像。</li></ul>' },
    { id: 'meditations', title: '幸福論', author: 'アラン', publicationYear: 1925, genre: '哲学', description: '日々の生活における<b>幸福</b>をテーマに、いかにして幸福を見出し、維持するかを哲学的に考察します。<b>意志</b>、<b>習慣</b>、<b>思考の選択</b>が重要です。<br>核心概念：<ul><li><b>幸福の選択</b>: 幸福は状況ではなく、心の持ち方で決まる。</li><li><b>意志の力</b>: 困難に立ち向かい、幸福を追求する力。</li><li><b>習慣の形成</b>: 幸福な状態を保つための日々の実践。</li></ul>' },
    // 科学
    { id: 'sapiens', title: 'サピエンス全史', author: 'ユヴァル・ノア・ハラリ', publicationYear: 2014, genre: '科学', description: '人類が地球を支配するに至った歴史を、<b>認知革命</b>、<b>農業革命</b>、<b>科学革命</b>という視点から読み解き、<b>虚構</b>の力が人類社会を形成したと説きます。<br>核心概念：<ul><li><b>認知革命</b>: 虚構を信じる能力が人類の発展を促した。</li><li><b>集団的協力</b>: 虚構によって大規模な協力が可能になった。</li><li><b>未来の予測</b>: 人類が自らの運命を左右しうる可能性。</li></ul>' },
    { id: 'cosmos', title: 'コスモス', author: 'カール・セーガン', publicationYear: 1980, genre: '科学', description: '宇宙の壮大さと科学の魅力を一般に紹介。<b>科学的探求</b>、<b>宇宙の起源</b>、<b>生命の進化</b>を通じて、人間の知的好奇心を刺激します。<br>核心概念：<ul><li><b>宇宙のスケール</b>: 広大な宇宙における地球と生命の位置づけ。</li><li><b>科学的方法</b>: 知識を獲得し、誤りを訂正するプロセス。</li><li><b>知的好奇心</b>: 宇宙と生命の謎を探求する人間の根源的な欲求。</li></ul>' },
    { id: 'genes', title: '遺伝子とは何か', author: 'シッダールタ・ムカジー', publicationYear: 2016, genre: '科学', description: '遺伝子の歴史、その発見から現代の遺伝子工学までを追跡。<b>遺伝</b>、<b>進化</b>、<b>アイデンティティ</b>が人間の運命にどう影響するかを考察します。<br>核心概念：<ul><li><b>遺伝情報</b>: 生命の設計図としての遺伝子。</li><li><b>ゲノム編集</b>: 遺伝子を操作する技術と倫理的課題。</li><li><b>自己と運命</b>: 遺伝子が個人のアイデンティティと運命に与える影響。</li></ul>' },
    { id: 'silent_spring', title: '沈黙の春', author: 'レイチェル・カーソン', publicationYear: 1962, genre: '環境', description: 'DDTなどの化学物質が環境に与える悪影韻を告発し、環境保護運動のきっかけとなった。<b>生態系</b>、<b>持続可能性</b>、<b>人間と自然の共生</b>の重要性を訴えます。<br>核心概念：<ul><li><b>生態系の連鎖</b>: 自然界の繊細なバランス。</li><li><b>化学物質汚染</b>: 人為的な環境破壊。</li><li><b>持続可能性</b>: 環境を守りながら発展する社会。</li></ul>' },
    // 文学
    { id: 'norwegian_wood', title: 'ノルウェイの森', author: '村上春樹', publicationYear: 1987, genre: '文学', description: '喪失と再生、<b>生と死</b>、<b>孤独</b>と<b>愛</b>をテーマに、若者の複雑な心情を描写。現代社会における人間の脆弱性と強さを探ります。<br>核心概念：<ul><li><b>喪失と再生</b>: 悲しみを乗り越え、再び生きる意味を見出すプロセス。</li><li><b>孤独と繋がり</b>: 人間関係の希薄さと、深い絆への希求。</li><li><b>青春の彷徨</b>: 自己を探し求める時期の苦悩と成長。</li></ul>' },
    { id: 'great_gatsby', title: 'グレート・ギャツビー', author: 'F.スコット・フィッツジェラルド', publicationYear: 1925, genre: '文学', description: 'アメリカン・ドリームの光と影を描き、<b>富</b>、<b>夢</b>、<b>理想</b>、そして<b>過去への執着</b>が個人の幸福にどう影響するかを考察します。<br>核心概念：<ul><li><b>アメリカン・ドリーム</b>: 努力によって成功を掴むという神話と現実。</li><li><b>理想と現実</b>: 追い求める夢と、それが叶わない時の絶望。</li><li><b>過去への執着</b>: 過去の幻影に囚われることの悲劇。</li></ul>' },
    { id: 'crime_punishment', title: '罪と罰', author: 'フョードル・ドストエフスキー', publicationYear: 1866, genre: '文学', description: '犯罪を犯した学生の心理と、<b>良心</b>、<b>罪悪感</b>、<b>許し</b>、そして<b>信仰</b>による救済を描きます。人間の内面的な葛藤と倫理を深く掘り下げます。<br>核心概念：<ul><li><b>罪と罰</b>: 倫理的選択とその結果。</li><li><b>良心</b>: 内なる道徳的な声。</li><li><b>救済</b>: 苦悩の先にある精神的な解放。</li></ul>' },
    { id: 'kafka_on_shore', title: '海辺のカフカ', author: '村上春樹', publicationYear: 2002, genre: '文学', description: '現実と非現実が交錯する世界で、少年が自分探しの旅に出る。<b>宿命</b>、<b>自由意志</b>、<b>無意識</b>、そして<b>物語の力</b>が、個人のアイデンティティ形成にどう影響するかを探ります。<br>核心概念：<ul><li><b>運命と選択</b>: 人間の運命は定められているのか、それとも選択によって変わるのか。</li><li><b>深層意識</b>: 夢や無意識の領域が現実と交錯する。</li><li><b>自己発見</b>: 旅を通じて自分自身を見つけ出すプロセス。</li></ul>' },
    // ビジネス
    { id: 'shikou_no_seirigaku', title: '思考の整理学', author: '外山滋比古', publicationYear: 1986, genre: 'ビジネス', description: '知識を効率的に増やし、アイデアを生み出すための<b>思考法</b>や<b>情報整理術</b>について、独自の視点から解説した知的生産術の古典です。<br>核心概念：<ul><li><b>知的生産</b>: 知識を獲得し、新たなアイデアや成果を生み出すプロセス。</li><li><b>情報整理</b>: 効率的な情報の管理と活用。</li><li><b>忘却の効用</b>: 不要な情報を忘れ去ることが、新たな思考を促す効果。</li><li><b>アイデア発想</b>: 異なる情報や概念を組み合わせ、斬新な発想を生み出す方法。</li></ul>' },
    { id: '7_habits', title: '7つの習慣', author: 'スティーブン・R・コヴィー', publicationYear: 1989, genre: 'ビジネス', description: '個人の<b>人格</b>と<b>原則</b>に基づいた効果的な生き方を説き、<b>主体性</b>、<b>目的</b>、<b>優先順位</b>、<b>相互依存</b>といった概念を提示します。<br>核心概念：<ul><li><b>主体性</b>: 自らの人生に責任を持ち、選択を行うこと。</li><li><b>習慣</b>: 意識的な行動が人格形成に与える影響。</li><li><b>原則</b>: 普遍的な成功法則と倫理的基盤。</li><li><b>相互依存</b>: 他者との協力関係によるより大きな成果。</li></ul>' },
    { id: 'startup_lean', title: 'リーン・スタートアップ', author: 'エリック・リース', publicationYear: 2011, genre: 'ビジネス', description: '新しい製品やサービスを開発する際の無駄をなくし、効率的に事業を立ち上げるための方法論。<b>仮説検証</b>、<b>MVP (最小実行可能製品)</b>、<b>学習</b>の重要性を説きます。<br>核心概念：<ul><li><b>迅速な仮説検証</b>: アイデアを素早く試し、市場の反応から学ぶ。</li><li><b>継続的学習</b>: 失敗から学び、改善を繰り返す。</li><li><b>最小実行可能製品 (MVP)</b>: 必要最小限の機能で製品をリリースし、フィードバックを得る。</li></ul>' },
    { id: 'principles', title: 'プリンシプルズ', author: 'レイ・ダリオ', publicationYear: 2017, genre: 'ビジネス', description: 'ブリッジウォーター・アソシエイツの創設者が、自身の成功と失敗から学んだ人生と仕事における<b>原則</b>を体系化。<b>徹底的な透明性</b>、<b>メリットクラシー</b>、<b>客観性</b>の重要性を説きます。<br>核心概念：<ul><li><b>原理原則</b>: あらゆる状況に適用できる普遍的な真理。</li><li><b>徹底的な透明性</b>: 隠し事なく事実を共有し、意見をぶつけ合う文化。</li><li><b>メリットクラシー</b>: 能力主義に基づき、最高のアイデアが勝つ組織。</li></ul>' },
    // 歴史
    { id: 'guns_germs_steel', title: '銃・病原菌・鉄', author: 'ジャレド・ダイアモンド', publicationYear: 1997, genre: '歴史', description: '人類社会の発展の不均一性を、地理的・環境的要因から解き明かす。<b>地理的決定論</b>、<b>食料生産</b>、<b>病原菌</b>、<b>技術革新</b>が文明の興亡にどう影響したかを考察。<br>核心概念：<ul><li><b>環境の力</b>: 地理や自然環境が人類社会の発展を規定した。</li><li><b>食料生産</b>: 定住と人口増加、専門化の基礎。</li><li><b>技術伝播</b>: 知識や技術の地理的・文化的な広がり。</li></ul>' },
    { id: 'homo_deus', title: 'ホモ・デウス', author: 'ユヴァル・ノア・ハラリ', publicationYear: 2016, genre: '歴史', description: '『サピエンス全史』の続編。21世紀の人類が追求する「不死」「幸福」「神性」の未来を描き、<b>データ至上主義</b>、<b>アルゴリズム支配</b>、<b>テクノロジーと倫理</b>を考察。<br>核心概念：<ul><li><b>データ至上主義</b>: データが新しい宗教となる未来。</li><li><b>アルゴリズム支配</b>: 人間の意思決定がアルゴリズムに委ねられる。</li><li><b>ポスト・ヒューマン</b>: テクノロジーによって人間性が変容する可能性。</li></ul>' },
    // 料理
    { id: 'salt_fat_acid_heat', title: 'ソルト・ファット・アシッド・ヒート', author: 'サミン・ノスラット', publicationYear: 2017, genre: '料理', description: '料理の基本要素である<b>塩</b>、<b>脂肪</b>、<b>酸</b>、<b>熱</b>を理解することで、あらゆる料理を美味しく作れるようになるという哲学を説きます。<b>基本の重要性</b>と<b>直感的な創造性</b>を育みます。<br>核心概念：<ul><li><b>料理の基本原則</b>: 食材を美味しくするための普遍的な要素。</li><li><b>味覚のバランス</b>: 塩味、脂味、酸味、熱の調和。</li><li><b>創造性と直感</b>: レシピを超えた自由な発想。</li></ul>' },
    // ゲーム
    { id: 'game_design_book', title: 'ゲームデザインの教科書', author: 'ジェシー・シェラー', publicationYear: 2008, genre: 'ゲーム', description: 'ゲームデザインの原理と実践について解説。<b>プレイヤー体験</b>、<b>ルールとメカニクス</b>、<b>フィードバックループ</b>が、魅力的なゲームを創り出す上でどう重要かを考察します。<br>核心概念：<ul><li><b>プレイヤー体験</b>: ユーザーがゲームを通して得る感情と感覚。</li><li><b>ゲームバランス</b>: 公平性と挑戦性の適切な設計。</li><li><b>報酬と動機付け</b>: プレイヤーを行動に駆り立てる仕組み。</li></ul>' },
    // その他、多様なジャンルを表現するための追加カード
    { id: 'wabisabi', title: 'デザインの日本的思考「わび・さび」', author: 'レオナード・コーレン', publicationYear: 1994, genre: '芸術', description: '日本の伝統的な美意識である「わび・さび」を、西洋の視点から解説。<b>不完全さ</b>、<b>無常観</b>、<b>質素</b>の中に美を見出すことを探ります。<br>核心概念：<ul><li><b>不完全の美</b>: 欠点や経年変化を美として捉える。</li><li><b>無常</b>: 全てのものは移ろいゆくという認識。</li><li><b>質素と簡素</b>: 無駄を削ぎ落とした美。</li></ul>' },
    { id: 'flow', title: 'フロー体験 喜びの現象学', author: 'ミハイ・チクセントミハイ', publicationYear: 1990, genre: '心理学', description: '人が活動に深く没頭し、時間感覚を忘れる「フロー体験」を科学的に分析。<b>挑戦とスキルのバランス</b>、<b>集中</b>、<b>目的意識</b>が幸福にどう影響するかを考察します。<br>核心概念：<ul><li><b>フロー状態</b>: 高い集中と没頭が生み出す至福の体験。</li><li><b>挑戦とスキル</b>: 適度な難易度がフローを促す。</li><li><b>自己目的性</b>: 行動そのものが喜びとなる。</li></ul>' },
    { id: 'thinking_fast_slow', title: 'ファスト&スロー', author: 'ダニエル・カーネマン', publicationYear: 2011, genre: '心理学', description: '人間の思考を「システム1（速い、直感的）」と「システム2（遅い、分析的）」に分け、それぞれが意思決定にどう影響するかを解説。<b>認知バイアス</b>と<b>合理性</b>の限界を明らかにします。<br>核心概念：<ul><li><b>二重思考システム</b>: 直感と熟慮の異なる思考モード。</li><li><b>ヒューリスティック</b>: 簡略化された意思決定の法則。</li><li><b>認知エラー</b>: 思考の落とし穴とその克服。</li></ul>' },
    { id: 'why_nations_fail', title: '国家はなぜ衰退するのか', author: 'ダロン・アセモグル, ジェイムズ・A・ロビンソン', publicationYear: 2012, genre: '経済学', description: '国家の繁栄と衰退を、<b>制度</b>（包括的・収奪的）、<b>政治</b>、<b>経済</b>の相互作用から説明。良い制度がイノベーションと成長を促すと説きます。<br>核心概念：<ul><li><b>包括的制度</b>: 広い参加と公正な競争を許容する制度。</li><li><b>収奪的制度</b>: 権力者が富を独占する制度。</li><li><b>政治と経済</b>: 相互に影響し合う国家発展の鍵。</li></ul>' },
    { id: 'cosmos_human', title: '宇宙と人間', author: '湯川秀樹', publicationYear: 1968, genre: '科学', description: '物理学者湯川秀樹が、宇宙と人間の関係、科学の役割、そして未来について考察。<b>科学者の倫理</b>、<b>知識の限界</b>、<b>創造性</b>を問いかけます。<br>核心概念：<ul><li><b>科学の限界</b>: 科学が全てを解き明かせない領域。</li><li><b>知識と無知</b>: 探求の終わりなきプロセス。</li><li><b>人間の役割</b>: 宇宙における自己の位置づけと責任。</li></ul>' },
    { id: 'invisible_city', title: '見えない都市', author: 'イタロ・カルヴィーノ', publicationYear: 1972, genre: '文学', description: '旅人マルコ・ポーロが、想像上の都市を語る形式で、<b>都市</b>、<b>記憶</b>、<b>欲望</b>、<b>想像力</b>といったテーマを探る。都市の多義性と人間の知覚を考察。<br>核心概念：<ul><li><b>都市の多様性</b>: 物理的な構造と人々の記憶や感情が織りなす空間。</li><li><b>記憶と忘却</b>: 経験が都市の認識を形作る。</li><li><b>想像力</b>: 現実を再構築し、新しい意味を生み出す力。</li></ul>' },
    { id: 'power_of_habit', title: '習慣の力', author: 'チャールズ・デュヒッグ', publicationYear: 2012, genre: 'ビジネス', description: '個人の生活から大企業、社会運動まで、<b>習慣</b>がいかに形成され、人生やビジネスに大きな影響を与えるかを解き明かします。<b>習慣のループ</b>、<b>変化</b>、<b>意志力</b>について。<br>核心概念：<ul><li><b>習慣のループ</b>: きっかけ、ルーチン、報酬からなる習慣のサイクル。</li><li><b>習慣の変革</b>: ループを理解し、意識的に行動を変える。</li><li><b>意志力</b>: 目標達成のための自己制御能力。</li></ul>' },
    { id: 'thinking_architecture', title: '考える建築', author: 'ピーター・ズントー', publicationYear: 2006, genre: '芸術', description: 'スイスの建築家が自身の建築哲学を語る。<b>雰囲気</b>、<b>物質性</b>、<b>記憶</b>が建築空間を形成し、人々の感情に訴えかけることを考察。<b>場と経験</b>の重要性を説きます。<br>核心概念：<ul><li><b>場の感覚</b>: 空間が持つ独特の雰囲気と影響力。</li><li><b>物質の詩学</b>: 素材が持つ意味と感情。</li><li><b>建築と感情</b>: 空間が人々の記憶や感情を呼び起こす。</li></ul>' },
];

// --- 方向カード（BIBLIOMIX_by_Agents.htmlから完全移植） ---
export const directionCards = [
    { id: 'direction_past_future', type: 'direction', title: '過去から未来を読み解け！' },
    { id: 'direction_daily_beauty', type: 'direction', title: '日常の美を見出せ！' },
    { id: 'direction_paradox_truth', type: 'direction', title: '矛盾の中に真理を見出せ！' },
    { id: 'direction_connect_divide', type: 'direction', title: '繋がりと分断を考察せよ！' },
];

// --- カード管理関数 ---
// 重複排除付きランダムドロー
export function drawRandomCard(excludedCardIds = []) {
    const available = allAvailableEssenceCards.filter(card => !excludedCardIds.includes(card.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}
// 方向カードのランダムドロー
export function drawRandomDirectionCard(excludedCardIds = []) {
    const available = directionCards.filter(card => !excludedCardIds.includes(card.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}
// セレンディピティ用カードドロー（山札から1枚、重複排除）
export function drawSerendipityCard(boardCardIds = []) {
    return drawRandomCard(boardCardIds);
}