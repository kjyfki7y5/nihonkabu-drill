import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════
   日本株ドリル — Stock Trading Platform UI
   ════════════════════════════════════════ */

// ─── Quiz Data (same as before) ───
const QUIZ_DATA = [
  { category: "企業当て", type: "hint", hints: ["証券コードは 7203", "愛知県豊田市に本社を置く", "世界最大級の自動車メーカー", "「カイゼン」で有名な生産方式"], answer: "トヨタ自動車", options: ["トヨタ自動車", "本田技研工業", "日産自動車", "スズキ"], explanation: "トヨタ自動車（7203）は時価総額日本最大の企業。トヨタ生産方式（TPS）は世界中の製造業に影響を与えました。", difficulty: 1 },
  { category: "企業当て", type: "hint", hints: ["証券コードは 6758", "創業者は井深大と盛田昭夫", "ゲーム・音楽・映画・金融と多角化", "PlayStationシリーズで知られる"], answer: "ソニーグループ", options: ["ソニーグループ", "パナソニック", "任天堂", "バンダイナムコ"], explanation: "ソニーグループ（6758）の東証業種分類は「電気機器」。エンタメ・金融まで幅広い事業を展開するコングロマリットです。", difficulty: 1 },
  { category: "企業当て", type: "hint", hints: ["証券コードは 4063", "信越化学工業という社名", "塩ビ樹脂・半導体シリコンウェハーで世界首位級", "営業利益率30%超の超優良企業"], answer: "信越化学工業", options: ["信越化学工業", "住友化学", "三菱ケミカルG", "旭化成"], explanation: "信越化学工業（4063）は塩ビ樹脂と半導体シリコンウェハーで世界トップシェア。驚異的な利益率を誇る化学セクターの雄。", difficulty: 2 },
  { category: "企業当て", type: "hint", hints: ["証券コードは 6861", "工場の自動化に欠かせないセンサーを開発", "営業利益率50%超という驚異的な収益力", "創業者は滝崎武光氏"], answer: "キーエンス", options: ["キーエンス", "オムロン", "ファナック", "SMC"], explanation: "キーエンス（6861）はFAセンサーの最大手。「ファブレス経営」と「直販体制」で営業利益率50%超を実現する超高収益企業。", difficulty: 2 },
  { category: "企業当て", type: "hint", hints: ["証券コードは 9983", "柳井正氏が率いるアパレル企業", "「LifeWear」をコンセプトに掲げる", "ユニクロ・GUを展開"], answer: "ファーストリテイリング", options: ["ファーストリテイリング", "しまむら", "良品計画", "ワールド"], explanation: "ファーストリテイリング（9983）は日経平均への寄与度が非常に高い「値がさ株」として有名。", difficulty: 1 },
  { category: "証券コード", type: "choice", question: "証券コード「8306」の企業は？", answer: "三菱UFJフィナンシャル・グループ", options: ["三菱UFJフィナンシャル・グループ", "三井住友フィナンシャルグループ", "みずほフィナンシャルグループ", "りそなホールディングス"], explanation: "三菱UFJ FG（8306）は日本最大のメガバンクグループ。8316が三井住友FG、8411がみずほFG。", difficulty: 2 },
  { category: "証券コード", type: "choice", question: "証券コード「9432」の企業は？", answer: "日本電信電話（NTT）", options: ["日本電信電話（NTT）", "KDDI", "ソフトバンク", "NTTデータグループ"], explanation: "NTT（9432）は通信セクターの代表銘柄。2023年に株式25分割を実施。", difficulty: 2 },
  { category: "証券コード", type: "choice", question: "証券コード「6501」の企業は？", answer: "日立製作所", options: ["日立製作所", "東芝", "三菱電機", "パナソニック"], explanation: "日立製作所（6501）はDX・社会インフラに注力。Lumadaプラットフォームが成長ドライバー。", difficulty: 3 },
  { category: "業種分類", type: "choice", question: "ソニーグループの東証33業種分類は？", answer: "電気機器", options: ["電気機器", "情報・通信業", "サービス業", "その他製品"], explanation: "ソニーは多角化していますが、東証の業種分類では「電気機器」。", difficulty: 2 },
  { category: "業種分類", type: "choice", question: "オリエンタルランドの東証33業種分類は？", answer: "サービス業", options: ["サービス業", "不動産業", "情報・通信業", "小売業"], explanation: "東京ディズニーリゾートを運営するオリエンタルランド（4661）は「サービス業」。", difficulty: 2 },
  { category: "業種分類", type: "choice", question: "日本郵船の東証33業種分類は？", answer: "海運業", options: ["海運業", "陸運業", "倉庫・運輸関連業", "サービス業"], explanation: "日本郵船（9101）は海運業。2021〜2022年にコンテナ船運賃高騰で空前の利益を計上。", difficulty: 2 },
  { category: "財務比較", type: "choice", question: "営業利益率がより高いのは？（2024年3月期）", answer: "キーエンス（約55%）", options: ["キーエンス（約55%）", "トヨタ自動車（約11%）", "ソニーグループ（約13%）", "任天堂（約36%）"], explanation: "キーエンスの営業利益率は約55%で日本企業トップクラス。", difficulty: 1 },
  { category: "財務比較", type: "choice", question: "2024年時点で時価総額が大きいのは？", answer: "トヨタ自動車", options: ["トヨタ自動車", "ソニーグループ", "キーエンス", "三菱UFJ FG"], explanation: "トヨタ自動車は時価総額約50兆円超で日本企業1位。", difficulty: 1 },
  { category: "財務比較", type: "choice", question: "配当利回りが高い傾向にあるセクターは？", answer: "海運・商社・銀行", options: ["海運・商社・銀行", "IT・サービス", "医薬品・化学", "食品・小売"], explanation: "海運・商社・銀行は高配当銘柄が多い。バフェットも総合商社に投資。", difficulty: 2 },
  { category: "トリビア", type: "choice", question: "日経平均株価の構成銘柄数は？", answer: "225銘柄", options: ["225銘柄", "100銘柄", "500銘柄", "300銘柄"], explanation: "日経平均は東証プライム市場の代表的な225銘柄で構成。", difficulty: 1 },
  { category: "トリビア", type: "choice", question: "東証の後場終了時刻は？（2024年11月以降）", answer: "15:30", options: ["15:30", "15:00", "16:00", "14:30"], explanation: "2024年11月5日から取引時間が30分延長され15:30まで。", difficulty: 2 },
  { category: "トリビア", type: "choice", question: "「PBR1倍割れ」とは？", answer: "株価が1株あたり純資産を下回る状態", options: ["株価が1株あたり純資産を下回る状態", "株価が1株あたり利益を下回る状態", "配当利回りが1%を下回る状態", "営業利益率が1%を下回る状態"], explanation: "PBR1倍割れは理論上「解散価値以下」。東証が改善を要請し大きなテーマに。", difficulty: 2 },
  { category: "トリビア", type: "choice", question: "バフェットが投資した日本の5大商社に含まれないのは？", answer: "豊田通商", options: ["豊田通商", "三菱商事", "伊藤忠商事", "住友商事"], explanation: "バフェットが投資したのは三菱商事・三井物産・伊藤忠・住友商事・丸紅の5社。", difficulty: 2 },
  { category: "トリビア", type: "choice", question: "旧「東証一部」は何に変わった？（2022年4月再編）", answer: "プライム市場", options: ["プライム市場", "スタンダード市場", "グロース市場", "メイン市場"], explanation: "2022年4月に「プライム」「スタンダード」「グロース」の3市場に再編。", difficulty: 1 },
  { category: "企業当て", type: "hint", hints: ["証券コードは 4519", "国内製薬企業で時価総額トップクラス", "がん領域に強みを持つ", "「オプジーボ」で一世を風靡"], answer: "中外製薬", options: ["中外製薬", "武田薬品工業", "第一三共", "小野薬品工業"], explanation: "ひっかけ！4519は中外製薬。オプジーボは小野薬品（4528）。中外製薬はロシュ傘下。", difficulty: 3 },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const CATEGORIES = ["ALL", "企業当て", "証券コード", "業種分類", "財務比較", "トリビア"];
const DIFF = { 1: "EASY", 2: "MID", 3: "HARD" };
const DIFF_COLOR = { 1: "#00c896", 2: "#f0b90b", 3: "#f6465d" };
const RANKS = [
  { min: 90, label: "バフェット級", tag: "LEGENDARY" },
  { min: 70, label: "ファンドマネージャー", tag: "EXPERT" },
  { min: 50, label: "専業トレーダー", tag: "ADVANCED" },
  { min: 30, label: "兼業投資家", tag: "INTERMEDIATE" },
  { min: 0, label: "投資ビギナー", tag: "BEGINNER" },
];
const getRank = (pct) => RANKS.find((r) => pct >= r.min);

// ─── Fake ticker data ───
const TICKERS = [
  { code: "7203", name: "トヨタ", price: 2847, chg: +1.24 },
  { code: "6758", name: "ソニーG", price: 3215, chg: -0.38 },
  { code: "6861", name: "キーエンス", price: 68450, chg: +2.15 },
  { code: "8306", name: "三菱UFJ", price: 1823, chg: +0.67 },
  { code: "9983", name: "ファストリ", price: 42150, chg: -0.92 },
  { code: "9432", name: "NTT", price: 156, chg: +0.45 },
  { code: "4063", name: "信越化学", price: 5890, chg: +1.83 },
  { code: "9984", name: "SBG", price: 8945, chg: -1.56 },
  { code: "6501", name: "日立", price: 3680, chg: +3.21 },
  { code: "7974", name: "任天堂", price: 9120, chg: +0.78 },
];

// ─── Ticker Strip ───
function TickerStrip() {
  return (
    <div style={{
      overflow: "hidden", whiteSpace: "nowrap", background: "#0b0e14",
      borderBottom: "1px solid #1c2030", height: 32, display: "flex", alignItems: "center",
    }}>
      <div style={{
        display: "inline-block",
        animation: "tickerScroll 30s linear infinite",
      }}>
        {[...TICKERS, ...TICKERS].map((t, i) => (
          <span key={i} style={{ marginRight: 28, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            <span style={{ color: "#6b7280" }}>{t.code}</span>
            <span style={{ color: "#cbd5e1", margin: "0 6px" }}>{t.name}</span>
            <span style={{ color: "#cbd5e1" }}>¥{t.price.toLocaleString()}</span>
            <span style={{ color: t.chg >= 0 ? "#00c896" : "#f6465d", marginLeft: 4 }}>
              {t.chg >= 0 ? "▲" : "▼"}{Math.abs(t.chg).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// ─── Ad Banner (placeholder) ───
function AdBanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #131720, #1a1f2e)",
      borderBottom: "1px solid #1c2030",
      padding: "6px 12px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      minHeight: 40, maxHeight: 48,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 背景のアクセントライン */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, #f0b90b44, transparent)",
      }} />
      <span style={{
        fontSize: 8, fontFamily: "'JetBrains Mono', monospace",
        color: "#484f58", letterSpacing: 1, flexShrink: 0,
      }}>AD</span>
      <div style={{
        fontSize: 11, color: "#8b949e",
        fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
        textAlign: "center", lineHeight: 1.4,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ color: "#f0b90b", fontSize: 13 }}>📊</span>
        <span>
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>広告スペース</span>
          <span style={{ color: "#6b7280", marginLeft: 6, fontSize: 10 }}>ここにバナー広告が表示されます</span>
        </span>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, #f0b90b22, transparent)",
      }} />
    </div>
  );
}

// ─── Mini candle chart (decorative) ───
function MiniChart({ positive, width = 120, height = 40 }) {
  const candles = useRef(
    Array.from({ length: 20 }, () => {
      const up = positive ? Math.random() > 0.35 : Math.random() > 0.65;
      const body = 3 + Math.random() * 12;
      const wick = 1 + Math.random() * 5;
      return { up, body, wick };
    })
  ).current;
  const cw = width / candles.length;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {candles.map((c, i) => {
        const col = c.up ? "#00c896" : "#f6465d";
        const base = c.up ? height - c.body - 4 : 4;
        return (
          <g key={i}>
            <rect x={i * cw + cw * 0.35} y={base - c.wick} width={1} height={c.body + c.wick * 2} fill={col} opacity={0.5} />
            <rect x={i * cw + cw * 0.15} y={base} width={cw * 0.7} height={c.body} fill={col} rx={0.5} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Pulsing dot ───
function LiveDot() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: "#00c896",
        animation: "livePulse 1.5s ease-in-out infinite",
      }} />
      <style>{`@keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,200,150,0.4); } 50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(0,200,150,0); } }`}</style>
    </span>
  );
}

// ─── Shared vars ───
const V = {
  bg: "#0d1117",
  card: "#161b22",
  border: "#21262d",
  borderLight: "#30363d",
  text: "#e6edf3",
  textSub: "#8b949e",
  textDim: "#484f58",
  green: "#00c896",
  red: "#f6465d",
  yellow: "#f0b90b",
  accent: "#58a6ff",
  font: "'JetBrains Mono', 'Fira Code', monospace",
  fontSans: "'DM Sans', 'Noto Sans JP', sans-serif",
};

export default function NihonkabuDrill() {
  const [screen, setScreen] = useState("home"); // home | play | result | ranking | register
  const [selCat, setSelCat] = useState("ALL");
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selAns, setSelAns] = useState(null);
  const [hintN, setHintN] = useState(1);
  const [showExp, setShowExp] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState("free");
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hist, setHist] = useState([]);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const TIME_LIMIT = 5;
  const [qTime, setQTime] = useState(TIME_LIMIT);
  const qTimerRef = useRef(null);
  const [timedOut, setTimedOut] = useState(false);
  const shareCardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ─── Ranking state ───
  const [rankingData, setRankingData] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [registered, setRegistered] = useState(false);

  // Load ranking from shared storage
  const loadRanking = async () => {
    setRankingLoading(true);
    try {
      const result = await window.storage.get("ranking-board", true);
      const data = result ? JSON.parse(result.value) : [];
      setRankingData(data);
    } catch (e) {
      setRankingData([]);
    }
    setRankingLoading(false);
  };

  // Save score to ranking
  const saveToRanking = async (name, scoreVal, pctVal, timeVal, okCount, totalCount) => {
    try {
      let data = [];
      try {
        const result = await window.storage.get("ranking-board", true);
        data = result ? JSON.parse(result.value) : [];
      } catch (e) { data = []; }

      const entry = {
        name,
        score: scoreVal,
        pct: pctVal,
        time: timeVal,
        correct: okCount,
        total: totalCount,
        date: new Date().toISOString().slice(0, 10),
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      };

      data.push(entry);
      data.sort((a, b) => b.score - a.score || a.time - b.time);
      data = data.slice(0, 100); // top 100

      await window.storage.set("ranking-board", JSON.stringify(data), true);
      setRankingData(data);
      setRegistered(true);
      return data.findIndex(d => d.id === entry.id) + 1; // return rank
    } catch (e) {
      console.error("Failed to save ranking:", e);
      return -1;
    }
  };

  useEffect(() => { loadRanking(); }, []);

  const start = (cat, m) => {
    const pool = cat === "ALL" ? QUIZ_DATA : QUIZ_DATA.filter(q => q.category === cat);
    const qs = m === "survival" ? shuffle(pool) : shuffle(pool).slice(0, Math.min(10, pool.length));
    setQuestions(qs);
    setQi(0); setScore(0); setSelAns(null); setHintN(1); setShowExp(false);
    setDone(false); setMode(m); setLives(3); setStreak(0); setHist([]);
    setTime(0); setQTime(TIME_LIMIT); setTimedOut(false); setSaving(false); setSaved(false); setRegistered(false); setScreen("play");
  };

  // Timer
  useEffect(() => {
    if (screen === "play") {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    } else { clearInterval(timerRef.current); }
  }, [screen]);

  // Per-question countdown
  useEffect(() => {
    if (screen === "play" && !done) {
      setQTime(TIME_LIMIT);
      qTimerRef.current = setInterval(() => {
        setQTime(t => {
          if (t <= 1) {
            clearInterval(qTimerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(qTimerRef.current);
    }
  }, [screen, qi, done]);

  // Handle timeout
  useEffect(() => {
    if (screen === "play" && !done && qTime === 0) {
      setTimedOut(true);
      setDone(true);
      setSelAns(null);
      const q = questions[qi];
      setStreak(0);
      if (mode === "survival") setLives(l => l - 1);
      setHist(h => [...h, { q, ok: false, pts: 0 }]);
      setTimeout(() => setShowExp(true), 200);
    }
  }, [qTime]);

  const answer = (opt) => {
    if (done) return;
    clearInterval(qTimerRef.current);
    setDone(true); setSelAns(opt); setTimedOut(false);
    const q = questions[qi];
    const ok = opt === q.answer;
    const pts = ok ? (q.type === "hint" ? Math.max(1, 5 - hintN) : 1) : 0;
    if (ok) { setScore(s => s + pts); setStreak(s => s + 1); }
    else { setStreak(0); if (mode === "survival") setLives(l => l - 1); }
    setHist(h => [...h, { q, ok, pts }]);
    setTimeout(() => setShowExp(true), 200);
  };

  const next = () => {
    if ((mode === "survival" && lives <= 0) || qi + 1 >= questions.length) {
      clearInterval(timerRef.current); setScreen("result"); return;
    }
    setQi(i => i + 1); setSelAns(null); setHintN(1); setShowExp(false); setDone(false); setQTime(TIME_LIMIT); setTimedOut(false);
  };

  const os = (opt) => {
    if (!done) return null;
    if (opt === questions[qi].answer) return "ok";
    if (opt === selAns && selAns !== null) return "ng";
    return null;
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const base = {
    minHeight: "100vh", background: V.bg, color: V.text, fontFamily: V.fontSans,
    fontSize: 13, lineHeight: 1.6,
  };
  const container = { maxWidth: 520, margin: "0 auto", padding: "0 12px" };

  // ═══════════════ HOME ═══════════════
  if (screen === "home") {
    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        <TickerStrip />
        <AdBanner />
        <div style={container}>
          {/* Logo area */}
          <div style={{ padding: "32px 0 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `linear-gradient(135deg, ${V.green}, #00a67a)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#000", fontFamily: V.font,
            }}>株</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: V.text }}>日本株ドリル</div>
              <div style={{ fontSize: 11, color: V.textSub, fontFamily: V.font, letterSpacing: 1 }}>NIHONKABU DRILL</div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: 8, marginBottom: 20,
          }}>
            {[
              { label: "収録問題", val: `${QUIZ_DATA.length}`, unit: "問" },
              { label: "カテゴリ", val: "5", unit: "種" },
              { label: "制限時間", val: "5", unit: "秒" },
            ].map(({ label, val, unit }) => (
              <div key={label} style={{
                flex: 1, background: V.card, border: `1px solid ${V.border}`,
                borderRadius: 8, padding: "10px 12px", textAlign: "center",
              }}>
                <div style={{ fontSize: 12, color: V.text, fontFamily: V.font, letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: V.text, fontFamily: V.font }}>
                  {val}<span style={{ fontSize: 11, color: V.textSub, marginLeft: 2 }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mode select (buy/sell style) */}
          <div style={{ fontSize: 12, color: V.text, fontFamily: V.font, letterSpacing: 1, marginBottom: 8 }}>MODE</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[
              { m: "free", label: "NORMAL", desc: "10問クリア" },
              { m: "survival", label: "SURVIVAL", desc: "3ミス終了 全問出題" },
            ].map(({ m, label, desc }) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "14px 12px", borderRadius: 8, cursor: "pointer",
                background: mode === m ? (m === "free" ? V.green + "18" : V.red + "18") : V.card,
                border: `1.5px solid ${mode === m ? (m === "free" ? V.green : V.red) : V.border}`,
                color: mode === m ? (m === "free" ? V.green : V.red) : V.textSub,
                fontFamily: V.font, textAlign: "center", transition: "all 0.15s ease",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>{desc}</div>
              </button>
            ))}
          </div>

          {/* Category — like market tabs */}
          <div style={{ fontSize: 12, color: V.text, fontFamily: V.font, letterSpacing: 1, marginBottom: 8 }}>CATEGORY</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelCat(cat)} style={{
                padding: "6px 14px", borderRadius: 6, cursor: "pointer",
                background: selCat === cat ? V.accent + "20" : "transparent",
                border: `1px solid ${selCat === cat ? V.accent : V.border}`,
                color: selCat === cat ? V.accent : V.textSub,
                fontFamily: V.fontSans, fontSize: 12, fontWeight: 600,
                transition: "all 0.15s ease",
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Overview table */}
          <div style={{ background: V.card, border: `1px solid ${V.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 40px 110px",
              padding: "8px 12px", borderBottom: `1px solid ${V.border}`,
              fontSize: 11, color: V.textSub, fontFamily: V.font, letterSpacing: 1,
            }}>
              <span>CATEGORY</span><span style={{ textAlign: "right" }}>COUNT</span><span style={{ textAlign: "right" }}>LEVEL</span>
            </div>
            {CATEGORIES.filter(c => c !== "ALL").map(cat => {
              const qs = QUIZ_DATA.filter(q => q.category === cat);
              return (
                <div key={cat} style={{
                  display: "grid", gridTemplateColumns: "1fr 40px 110px",
                  padding: "10px 12px", borderBottom: `1px solid ${V.border}`,
                  fontSize: 12,
                }}>
                  <span style={{ color: V.text, fontWeight: 500 }}>{cat}</span>
                  <span style={{ textAlign: "right", color: V.textSub, fontFamily: V.font }}>{qs.length}</span>
                  <span style={{ textAlign: "right", display: "flex", gap: 4, justifyContent: "flex-end" }}>
                    {[...new Set(qs.map(q => q.difficulty))].sort().map(d => (
                      <span key={d} style={{
                        fontSize: 9, padding: "1px 5px", borderRadius: 3,
                        background: DIFF_COLOR[d] + "20", color: DIFF_COLOR[d],
                        fontFamily: V.font, fontWeight: 600,
                      }}>{DIFF[d]}</span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Start button — BIG green "BUY" style */}
          <button onClick={() => start(selCat, mode)} style={{
            width: "100%", padding: "16px", borderRadius: 8, cursor: "pointer",
            background: `linear-gradient(135deg, ${V.green}, #00a67a)`,
            border: "none", color: "#000", fontFamily: V.font,
            fontSize: 15, fontWeight: 700, letterSpacing: 2,
            boxShadow: `0 0 20px ${V.green}30`,
            transition: "all 0.2s ease",
          }}>
            START QUIZ
          </button>

          {/* Ranking button */}
          <button onClick={() => { loadRanking(); setScreen("ranking"); }} style={{
            width: "100%", marginTop: 8, padding: "14px", borderRadius: 8, cursor: "pointer",
            background: V.card, border: `1px solid ${V.border}`,
            color: V.yellow, fontFamily: V.font,
            fontSize: 13, fontWeight: 700, letterSpacing: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            🏆 SURVIVAL RANKING
          </button>

          <div style={{ textAlign: "center", fontSize: 11, color: V.textSub, marginTop: 12, paddingBottom: 40, fontFamily: V.font }}>
            ※ 本アプリは投資助言に該当するものではありません
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════ PLAY ═══════════════
  if (screen === "play") {
    const q = questions[qi];
    const isH = q.type === "hint";

    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        <TickerStrip />
        <AdBanner />
        <div style={container}>
          {/* Top bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0 8px",
          }}>
            <button onClick={() => setScreen("home")} style={{
              background: "none", border: "none", color: V.text, fontSize: 13,
              cursor: "pointer", fontFamily: V.fontSans, padding: 0,
            }}>← 終了</button>
            <div style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: V.font, fontSize: 13 }}>
              <span style={{ color: V.text }}><LiveDot /> {fmtTime(time)}</span>
              {mode === "survival" && (
                <span style={{ color: lives <= 1 ? V.red : V.text }}>
                  HP {lives}/3
                </span>
              )}
              <span style={{ color: V.green, fontWeight: 600 }}>{score} PTS</span>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i < qi ? (hist[i]?.ok ? V.green : V.red) : i === qi ? V.accent : V.border,
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>

          {/* Countdown timer bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
          }}>
            <div style={{
              flex: 1, height: 6, background: V.border, borderRadius: 3, overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: `${(qTime / TIME_LIMIT) * 100}%`,
                height: "100%", borderRadius: 3,
                background: qTime <= 2 ? V.red : qTime <= 3 ? V.yellow : V.green,
                transition: done ? "none" : "width 1s linear, background 0.3s ease",
                boxShadow: qTime <= 2 ? `0 0 8px ${V.red}60` : "none",
              }} />
              {qTime <= 2 && !done && (
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: `${(qTime / TIME_LIMIT) * 100}%`,
                  height: "100%", borderRadius: 3,
                  background: V.red,
                  animation: "timerPulse 0.5s ease-in-out infinite",
                }} />
              )}
            </div>
            <span style={{
              fontFamily: V.font, fontSize: 16, fontWeight: 700, minWidth: 36, textAlign: "right",
              color: qTime <= 2 ? V.red : qTime <= 3 ? V.yellow : V.green,
              animation: qTime <= 2 && !done ? "timerPulse 0.5s ease-in-out infinite" : "none",
            }}>
              {done ? (timedOut ? "0.0" : `${qTime}.0`) : `${qTime}.0`}
            </span>
            <style>{`@keyframes timerPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
          </div>

          {/* Question card */}
          <div style={{
            background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
            padding: "16px", marginBottom: 12,
          }}>
            {/* Meta row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 4,
                  background: V.accent + "20", color: V.accent,
                  fontFamily: V.font, fontWeight: 600, letterSpacing: 0.5,
                }}>{q.category}</span>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 4,
                  background: DIFF_COLOR[q.difficulty] + "20", color: DIFF_COLOR[q.difficulty],
                  fontFamily: V.font, fontWeight: 600,
                }}>{DIFF[q.difficulty]}</span>
              </div>
              <span style={{ fontSize: 13, color: V.text, fontFamily: V.font }}>
                Q{qi + 1}/{questions.length}
              </span>
            </div>

            {/* Question text */}
            {isH ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 600, color: V.text, marginBottom: 12, lineHeight: 1.7 }}>
                  この企業はどれか？
                </div>
                {/* Hints as order book rows */}
                <div style={{ background: V.bg, borderRadius: 6, overflow: "hidden", border: `1px solid ${V.border}` }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "40px 1fr 50px",
                    padding: "6px 10px", fontSize: 11, color: V.textSub,
                    fontFamily: V.font, borderBottom: `1px solid ${V.border}`,
                  }}>
                    <span>#</span><span>HINT</span><span style={{ textAlign: "right" }}>STATUS</span>
                  </div>
                  {q.hints.map((h, i) => {
                    const shown = i < hintN;
                    return (
                      <div key={i} style={{
                        display: "grid", gridTemplateColumns: "40px 1fr 50px",
                        padding: "8px 10px", fontSize: 12,
                        borderBottom: i < q.hints.length - 1 ? `1px solid ${V.border}` : "none",
                        background: shown ? V.green + "08" : "transparent",
                        transition: "all 0.3s ease",
                      }}>
                        <span style={{ fontFamily: V.font, color: V.textSub, fontWeight: 600 }}>{i + 1}</span>
                        <span style={{ color: shown ? V.text : V.textSub }}>{shown ? h : "••••••••"}</span>
                        <span style={{
                          textAlign: "right", fontSize: 10, fontFamily: V.font, fontWeight: 600,
                          color: shown ? V.green : V.textSub,
                        }}>{shown ? "OPEN" : "LOCKED"}</span>
                      </div>
                    );
                  })}
                </div>
                {!done && hintN < q.hints.length && (
                  <button onClick={() => setHintN(n => n + 1)} style={{
                    width: "100%", marginTop: 8, padding: "10px", borderRadius: 6,
                    background: V.accent + "18", border: `1px solid ${V.accent}`,
                    color: V.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: V.font,
                    transition: "all 0.15s ease",
                  }}>
                    ▶ 次のヒントを開示（-1pt）
                  </button>
                )}
              </>
            ) : (
              <div style={{ fontSize: 16, fontWeight: 600, color: V.text, lineHeight: 1.8 }}>
                {q.question}
              </div>
            )}
          </div>

          {/* Options — Order book / bid-ask style */}
          <div style={{
            background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "8px 14px", fontSize: 12, color: V.text, fontFamily: V.font,
              borderBottom: `1px solid ${V.border}`, letterSpacing: 1,
            }}>ANSWER</div>
            {q.options.map((opt, i) => {
              const st = os(opt);
              return (
                <div
                  key={opt}
                  onClick={() => !done && answer(opt)}
                  style={{
                    padding: "12px 14px",
                    borderBottom: i < q.options.length - 1 ? `1px solid ${V.border}` : "none",
                    cursor: done ? "default" : "pointer",
                    background: st === "ok" ? V.green + "12" : st === "ng" ? V.red + "12" : "transparent",
                    borderLeft: st === "ok" ? `3px solid ${V.green}` : st === "ng" ? `3px solid ${V.red}` : "3px solid transparent",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, fontFamily: V.font,
                      background: st === "ok" ? V.green + "30" : st === "ng" ? V.red + "30" : V.bg,
                      color: st === "ok" ? V.green : st === "ng" ? V.red : V.textSub,
                      border: `1px solid ${st === "ok" ? V.green : st === "ng" ? V.red : V.border}`,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{
                      fontSize: 14, color: V.text, fontWeight: st === "ok" ? 700 : 400,
                    }}>{opt}</span>
                  </div>
                  {st && (
                    <span style={{
                      fontSize: 12, fontFamily: V.font, fontWeight: 700, letterSpacing: 1,
                      color: st === "ok" ? V.green : V.red,
                    }}>
                      {st === "ok" ? "◯ CORRECT" : "✕ WRONG"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {showExp && (
            <div style={{
              marginTop: 12, padding: "14px",
              background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 700, fontFamily: V.font, letterSpacing: 1, marginBottom: 6,
                color: selAns === q.answer ? V.green : V.red,
              }}>
                {timedOut ? "⏱ TIME UP" : selAns === q.answer ? "✓ PROFIT" : "✗ LOSS"}
                {isH && selAns === q.answer && (
                  <span style={{ color: V.yellow, marginLeft: 8 }}>+{Math.max(1, 5 - hintN)} PTS</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: V.text, margin: 0, lineHeight: 1.8 }}>{q.explanation}</p>
            </div>
          )}

          {showExp && (
            <button onClick={next} style={{
              width: "100%", marginTop: 12, padding: "14px", borderRadius: 8, cursor: "pointer",
              background: qi + 1 >= questions.length || (mode === "survival" && lives <= 0)
                ? `linear-gradient(135deg, ${V.yellow}, #d4a20a)`
                : `linear-gradient(135deg, ${V.green}, #00a67a)`,
              border: "none", color: "#000", fontFamily: V.font,
              fontSize: 13, fontWeight: 700, letterSpacing: 1,
            }}>
              {qi + 1 >= questions.length || (mode === "survival" && lives <= 0) ? "VIEW RESULTS" : "NEXT →"}
            </button>
          )}
          <div style={{ height: 40 }} />
        </div>
      </div>
    );
  }


  // ═══════════════ RESULT ═══════════════
  if (screen === "result") {
    const maxS = questions.reduce((a, q) => a + (q.type === "hint" ? 4 : 1), 0);
    const pct = Math.round((score / maxS) * 100);
    const rank = getRank(pct);
    const okN = hist.filter(h => h.ok).length;
    const isProfit = pct >= 50;
    const bestStreak = Math.max(0, ...hist.reduce((acc, h) => {
      if (h.ok) { acc[acc.length - 1] = (acc[acc.length - 1] || 0) + 1; }
      else { acc.push(0); }
      return acc;
    }, [0]));

    const tweetText = `【日本株ドリル】\nScore: ${score}/${maxS} (${pct}%) | Rank: ${rank.label}\n${hist.map(h => h.ok ? "🟩" : "🟥").join("")}\n#日本株ドリル #株クラ`;

    const handleShare = async () => {
      setSaving(true);
      try {
        const mod = await import("html2canvas");
        const html2canvas = mod.default || mod;
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: "#0d1117", scale: 2, useCORS: true, logging: false,
        });
        const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
        const file = new File([blob], "nihonkabu-drill-result.png", { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ text: tweetText, files: [file] });
          } catch (e) {
            // キャンセル
          }
        } else {
          window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank");
        }
      } catch (e) {
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank");
      }
      setSaving(false);
    };

    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        <TickerStrip />
        <AdBanner />
        <div style={container}>

          {/* ═══ Share Card (capturable) ═══ */}
          <div ref={shareCardRef} style={{
            background: V.bg, padding: "24px 20px 20px", borderRadius: 12,
            border: `1px solid ${V.border}`, marginTop: 16,
          }}>
            {/* Card header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: `linear-gradient(135deg, ${V.green}, #00a67a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#000", fontFamily: V.font,
                }}>株</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: V.text }}>日本株ドリル</span>
              </div>
              <span style={{ fontSize: 10, color: V.textSub, fontFamily: V.font }}>NIHONKABU DRILL</span>
            </div>

            {/* Score hero */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <MiniChart positive={isProfit} width={180} height={40} />
              <div style={{
                fontSize: 12, fontFamily: V.font, letterSpacing: 2, marginTop: 10,
                color: isProfit ? V.green : V.red,
              }}>
                {isProfit ? "▲ PROFIT" : "▼ LOSS"}
              </div>
              <div style={{
                fontSize: 48, fontWeight: 800, fontFamily: V.font, marginTop: 2,
                color: isProfit ? V.green : V.red, lineHeight: 1,
              }}>
                {pct}<span style={{ fontSize: 22 }}>%</span>
              </div>
              <div style={{ fontSize: 16, color: V.text, marginTop: 6, fontFamily: V.font, fontWeight: 600 }}>
                {score} / {maxS} PTS
              </div>
            </div>

            {/* Rank */}
            <div style={{
              background: V.card, borderRadius: 8, padding: "14px", textAlign: "center",
              marginBottom: 12, border: `1px solid ${V.border}`,
            }}>
              <div style={{ fontSize: 11, color: V.text, fontFamily: V.font, letterSpacing: 2, marginBottom: 4 }}>RANK</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: V.text, letterSpacing: 2 }}>{rank.label}</div>
              <span style={{
                display: "inline-block", marginTop: 4,
                fontSize: 9, padding: "2px 10px", borderRadius: 3,
                background: V.accent + "20", color: V.accent,
                fontFamily: V.font, fontWeight: 600, letterSpacing: 1,
              }}>{rank.tag}</span>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {[
                { label: "正解", val: `${okN}/${hist.length}`, color: V.green },
                { label: "TIME", val: fmtTime(time), color: V.accent },
                { label: "STREAK", val: `${bestStreak}`, color: V.yellow },
              ].map(({ label, val, color }) => (
                <div key={label} style={{
                  flex: 1, background: V.card, border: `1px solid ${V.border}`,
                  borderRadius: 6, padding: "10px 8px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 11, color: V.text, fontFamily: V.font, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: V.font }}>{val}</div>
                </div>
              ))}
            </div>

            {/* P/L bars */}
            <div style={{ display: "flex", gap: 3, padding: "10px 0 4px" }}>
              {hist.map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: 32, borderRadius: 3,
                  background: h.ok ? V.green : V.red,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#000", fontFamily: V.font,
                }}>{h.ok ? `+${h.pts}` : "0"}</div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
              {hist.map((_, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: V.text, fontFamily: V.font }}>Q{i + 1}</div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: V.text, fontFamily: V.font, letterSpacing: 0.5 }}>
              #日本株ドリル #株クラ
            </div>
          </div>
          {/* ═══ End Share Card ═══ */}

          {/* Share button */}
          <div style={{ marginTop: 12 }}>
            <button onClick={handleShare} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "14px", borderRadius: 8, cursor: saving ? "wait" : "pointer",
              background: "#fff", border: "none",
              color: "#000", fontFamily: V.font,
              fontSize: 13, fontWeight: 700, letterSpacing: 1,
              opacity: saving ? 0.6 : 1,
              transition: "opacity 0.15s ease",
            }}>
              {!saving && <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
              {saving ? "画像を生成中..." : "結果をポストする"}
            </button>
          </div>

          {/* Detail table */}
          <div style={{
            background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
            overflow: "hidden", marginTop: 16, marginBottom: 16,
          }}>
            <div style={{ padding: "10px 12px", fontSize: 12, color: V.text, fontFamily: V.font, letterSpacing: 1, borderBottom: `1px solid ${V.border}` }}>
              DETAIL
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "32px 1fr 50px 40px 40px",
              padding: "8px 12px", fontSize: 11, color: V.textSub,
              fontFamily: V.font, letterSpacing: 0.5,
              borderBottom: `1px solid ${V.border}`,
            }}>
              <span>#</span><span>CATEGORY</span><span>LEVEL</span><span style={{ textAlign: "center" }}>P/L</span><span style={{ textAlign: "right" }}>PTS</span>
            </div>
            {hist.map((h, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "32px 1fr 50px 40px 40px",
                padding: "8px 12px", fontSize: 12,
                borderBottom: i < hist.length - 1 ? `1px solid ${V.border}` : "none",
                background: h.ok ? V.green + "06" : V.red + "06",
              }}>
                <span style={{ fontFamily: V.font, color: V.textSub }}>{i + 1}</span>
                <span style={{ color: V.text }}>{h.q.category}</span>
                <span style={{ fontSize: 10, fontFamily: V.font, fontWeight: 600, color: DIFF_COLOR[h.q.difficulty] }}>{DIFF[h.q.difficulty]}</span>
                <span style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: h.ok ? V.green : V.red }}>{h.ok ? "◯" : "✕"}</span>
                <span style={{ textAlign: "right", fontFamily: V.font, fontWeight: 600, color: h.pts > 0 ? V.green : V.textSub }}>{h.pts > 0 ? `+${h.pts}` : "0"}</span>
              </div>
            ))}
            <div style={{
              display: "grid", gridTemplateColumns: "32px 1fr 50px 40px 40px",
              padding: "8px 12px", fontSize: 12,
              borderTop: `1px solid ${V.border}`, background: V.bg,
            }}>
              <span /><span style={{ fontWeight: 700, color: V.text, fontFamily: V.font }}>TOTAL</span><span /><span />
              <span style={{ textAlign: "right", fontFamily: V.font, fontWeight: 700, color: V.green }}>{score}</span>
            </div>
          </div>

          {/* Rank table */}
          <div style={{
            background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
            overflow: "hidden", marginBottom: 16,
          }}>
            <div style={{ padding: "10px 12px", fontSize: 12, color: V.text, fontFamily: V.font, letterSpacing: 1, borderBottom: `1px solid ${V.border}` }}>RANK TABLE</div>
            {RANKS.map(r => (
              <div key={r.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 12px", fontSize: 13,
                borderBottom: `1px solid ${V.border}`,
                background: r.label === rank.label ? V.accent + "10" : "transparent",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 3,
                    background: r.label === rank.label ? V.accent + "30" : V.bg,
                    color: r.label === rank.label ? V.accent : V.textSub,
                    fontFamily: V.font, fontWeight: 600,
                  }}>{r.tag}</span>
                  <span style={{ color: r.label === rank.label ? V.text : V.textSub, fontWeight: r.label === rank.label ? 700 : 400 }}>{r.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: V.textSub, fontFamily: V.font }}>{r.min}%+</span>
                  {r.label === rank.label && <span style={{ fontSize: 12, color: V.accent, fontWeight: 700, fontFamily: V.font }}>← YOU</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Ranking register (survival only) */}
          {mode === "survival" && (
            <div style={{
              background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
              padding: "16px", marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, color: V.text, fontFamily: V.font, letterSpacing: 1, marginBottom: 10 }}>
                🏆 REGISTER TO RANKING
              </div>
              {registered ? (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{ fontSize: 15, color: V.green, fontWeight: 700, fontFamily: V.font }}>✓ ランキングに登録しました</div>
                  <button onClick={() => { loadRanking(); setScreen("ranking"); }} style={{
                    marginTop: 10, padding: "10px 20px", borderRadius: 6, cursor: "pointer",
                    background: V.yellow + "20", border: `1px solid ${V.yellow}`,
                    color: V.yellow, fontFamily: V.font, fontSize: 13, fontWeight: 700,
                  }}>RANKING を見る</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="表示名を入力"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={12}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: 6,
                        background: V.bg, border: `1px solid ${V.border}`,
                        color: V.text, fontFamily: V.fontSans, fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!playerName.trim()) return;
                        saveToRanking(playerName.trim(), score, pct, time, okN, hist.length);
                      }}
                      disabled={!playerName.trim()}
                      style={{
                        padding: "10px 16px", borderRadius: 6, cursor: playerName.trim() ? "pointer" : "default",
                        background: playerName.trim() ? `linear-gradient(135deg, ${V.yellow}, #d4a20a)` : V.border,
                        border: "none", color: "#000", fontFamily: V.font,
                        fontSize: 12, fontWeight: 700, letterSpacing: 1,
                        opacity: playerName.trim() ? 1 : 0.4,
                      }}
                    >登録</button>
                  </div>
                  <div style={{ fontSize: 11, color: V.textSub, marginTop: 6, fontFamily: V.fontSans }}>
                    ※ 全ユーザー共通ランキングに表示されます
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => start(selCat, mode)} style={{
              flex: 1, padding: "14px", borderRadius: 8, cursor: "pointer",
              background: `linear-gradient(135deg, ${V.green}, #00a67a)`,
              border: "none", color: "#000", fontFamily: V.font,
              fontSize: 14, fontWeight: 700, letterSpacing: 1,
            }}>RETRY</button>
            <button onClick={() => setScreen("home")} style={{
              flex: 1, padding: "14px", borderRadius: 8, cursor: "pointer",
              background: V.card, border: `1px solid ${V.border}`,
              color: V.text, fontFamily: V.font,
              fontSize: 14, fontWeight: 700, letterSpacing: 1,
            }}>HOME</button>
          </div>

          <div style={{ textAlign: "center", fontSize: 11, color: V.textSub, paddingBottom: 40, fontFamily: V.font }}>
            ※ 本アプリは投資助言に該当するものではありません
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════ RANKING ═══════════════
  if (screen === "ranking") {
    const fmtT = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    return (
      <div style={base}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        <TickerStrip />
        <AdBanner />
        <div style={container}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 0 12px",
          }}>
            <button onClick={() => setScreen("home")} style={{
              background: "none", border: "none", color: V.text, fontSize: 14,
              cursor: "pointer", fontFamily: V.fontSans, padding: 0,
            }}>← ホーム</button>
            <button onClick={loadRanking} style={{
              background: "none", border: `1px solid ${V.border}`, color: V.text,
              fontSize: 12, cursor: "pointer", fontFamily: V.font, padding: "6px 12px",
              borderRadius: 4,
            }}>↻ 更新</button>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🏆</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: V.yellow, fontFamily: V.font, letterSpacing: 2 }}>
              SURVIVAL RANKING
            </div>
            <div style={{ fontSize: 13, color: V.textSub, fontFamily: V.font, marginTop: 4 }}>
              TOP 100 — SORTED BY SCORE
            </div>
          </div>

          {rankingLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: V.textSub, fontFamily: V.font, fontSize: 14 }}>
              読み込み中...
            </div>
          ) : rankingData.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "40px 20px",
              background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 15, color: V.text, fontFamily: V.fontSans }}>
                まだランキングデータがありません
              </div>
              <div style={{ fontSize: 13, color: V.textSub, marginTop: 4, fontFamily: V.fontSans }}>
                サバイバルモードをプレイして最初のスコアを登録しよう！
              </div>
            </div>
          ) : (
            <div style={{
              background: V.card, border: `1px solid ${V.border}`, borderRadius: 10,
              overflow: "hidden",
            }}>
              {/* Table header */}
              <div style={{
                display: "grid", gridTemplateColumns: "36px 1fr 54px 50px 50px",
                padding: "10px 12px", fontSize: 11, color: V.textSub,
                fontFamily: V.font, letterSpacing: 0.5,
                borderBottom: `1px solid ${V.border}`,
              }}>
                <span>RANK</span><span>NAME</span><span style={{ textAlign: "right" }}>SCORE</span>
                <span style={{ textAlign: "right" }}>ACC</span><span style={{ textAlign: "right" }}>TIME</span>
              </div>
              {/* Rows */}
              {rankingData.map((entry, i) => {
                const isTop3 = i < 3;
                const medalColors = ["#fbbf24", "#94a3b8", "#cd7f32"];
                return (
                  <div key={entry.id || i} style={{
                    display: "grid", gridTemplateColumns: "36px 1fr 54px 50px 50px",
                    padding: "12px 12px", fontSize: 13,
                    borderBottom: i < rankingData.length - 1 ? `1px solid ${V.border}` : "none",
                    background: isTop3 ? medalColors[i] + "08" : "transparent",
                  }}>
                    <span style={{
                      fontFamily: V.font, fontWeight: 700, fontSize: isTop3 ? 14 : 12,
                      color: isTop3 ? medalColors[i] : V.textSub,
                    }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                    </span>
                    <span style={{
                      color: V.text, fontWeight: isTop3 ? 700 : 400,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {entry.name}
                      {entry.date && (
                        <span style={{ fontSize: 10, color: V.textSub, marginLeft: 6, fontFamily: V.font }}>
                          {entry.date}
                        </span>
                      )}
                    </span>
                    <span style={{
                      textAlign: "right", fontFamily: V.font, fontWeight: 700,
                      color: isTop3 ? V.green : V.text,
                    }}>{entry.score}</span>
                    <span style={{
                      textAlign: "right", fontFamily: V.font, fontSize: 12,
                      color: V.text,
                    }}>{entry.correct}/{entry.total}</span>
                    <span style={{
                      textAlign: "right", fontFamily: V.font, fontSize: 12,
                      color: V.textSub,
                    }}>{fmtT(entry.time)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Play survival button */}
          <button onClick={() => start(selCat, "survival")} style={{
            width: "100%", marginTop: 16, padding: "14px", borderRadius: 8, cursor: "pointer",
            background: `linear-gradient(135deg, ${V.red}, #d42020)`,
            border: "none", color: "#fff", fontFamily: V.font,
            fontSize: 14, fontWeight: 700, letterSpacing: 1,
          }}>
            SURVIVAL に挑戦する
          </button>

          <div style={{ height: 40 }} />
        </div>
      </div>
    );
  }
}
