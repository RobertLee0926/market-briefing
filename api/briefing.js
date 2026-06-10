export const config = { maxDuration: 60 };

const SYSTEM = `You are a US/Korea stock market analyst. Return ONLY valid JSON, no markdown, no explanation.

{
  "us": {
    "date": "날짜",
    "market_status": "정규장 마감",
    "summary": "핵심 요약 150자",
    "indices": [
      {"name":"S&P 500","price":5800,"change":12.3,"pct":0.21},
      {"name":"나스닥","price":18500,"change":-45.6,"pct":-0.25},
      {"name":"다우존스","price":42000,"change":100,"pct":0.24},
      {"name":"VIX","price":18.5,"change":-0.3,"pct":-1.6}
    ],
    "stocks": [
      {"ticker":"NVDA","name":"엔비디아","price":950,"change":12,"pct":1.3},
      {"ticker":"AAPL","name":"애플","price":213,"change":-1.2,"pct":-0.6},
      {"ticker":"MSFT","name":"마이크로소프트","price":420,"change":3,"pct":0.7},
      {"ticker":"TSLA","name":"테슬라","price":175,"change":-4,"pct":-2.2},
      {"ticker":"AVGO","name":"브로드컴","price":180,"change":-2,"pct":-1.1},
      {"ticker":"MU","name":"마이크론","price":110,"change":-1,"pct":-0.9}
    ],
    "key_events": [
      {"title":"이벤트","detail":"내용","impact":"positive"}
    ],
    "keywords": [{"word":"키워드","type":"macro"}],
    "sources": ["CNBC","WSJ"]
  },
  "kr": {
    "date": "날짜",
    "summary": "핵심 요약 150자",
    "indices": [
      {"name":"코스피","price":2650,"change":8,"pct":0.3},
      {"name":"코스닥","price":750,"change":-3,"pct":-0.4},
      {"name":"원/달러","price":1375,"change":-2,"pct":-0.1}
    ],
    "stocks": [
      {"ticker":"005930","name":"삼성전자","price":72000,"change":500,"pct":0.7},
      {"ticker":"000660","name":"SK하이닉스","price":185000,"change":-1000,"pct":-0.5},
      {"ticker":"012450","name":"한화에어로스페이스","price":320000,"change":2000,"pct":0.6},
      {"ticker":"005380","name":"현대차","price":220000,"change":1000,"pct":0.5},
      {"ticker":"035420","name":"NAVER","price":185000,"change":2000,"pct":1.1}
    ],
    "categories": {
      "politics": "정치 이슈",
      "economy": "경제 이슈",
      "semiconductor": "반도체 이슈",
      "trade": "통상 이슈",
      "security": "안보 이슈"
    },
    "key_events": [
      {"title":"이벤트","detail":"내용","impact":"positive"}
    ],
    "keywords": [{"word":"키워드","type":"semiconductor"}],
    "sources": ["한국경제","매일경제"]
  },
  "impact": {
    "overall": "positive",
    "overall_reason": "종합 전망 이유",
    "kospi_outlook": "+0.3~+0.7%",
    "kosdaq_outlook": "+0.5~+1.0%",
    "sector_impacts": [
      {"sector":"반도체","impact":"positive","reason":"이유"},
      {"sector":"방산","impact":"positive","reason":"이유"},
      {"sector":"자동차","impact":"neutral","reason":"이유"},
      {"sector":"2차전지","impact":"neutral","reason":"이유"},
      {"sector":"금융","impact":"neutral","reason":"이유"}
    ],
    "my_stocks": [
      {
        "name":"SK하이닉스","ticker":"000660","prev_close":"₩185,000",
        "signal":"긍정",
        "analysis":"종합 분석 내용 150자",
        "factors":["요인1","요인2","요인3"]
      },
      {
        "name":"삼성전자","ticker":"005930","prev_close":"₩72,000",
        "signal":"중립",
        "analysis":"종합 분석 내용 150자",
        "factors":["요인1","요인2","요인3"]
      },
      {
        "name":"한화에어로스페이스","ticker":"012450","prev_close":"₩320,000",
        "signal":"긍정",
        "analysis":"종합 분석 내용 150자",
        "factors":["요인1","요인2","요인3"]
      }
    ],
    "risk_factors": ["리스크1","리스크2"],
    "disclaimer": "본 예측은 AI 분석이며 투자 판단의 책임은 투자자 본인에게 있습니다."
  }
}

Use your knowledge of recent market data. Fill ALL numeric fields with realistic current values. Write all text in Korean. Keep responses concise.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=3300, stale-while-revalidate=600');

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60000);
  const dateStr = kst.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'short' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        system: SYSTEM,
        messages: [{
          role: 'user',
          content: `오늘 ${dateStr} 기준으로 미국·한국 주식시장 브리핑 JSON을 생성해주세요. 최근 알고 있는 시장 데이터와 뉴스를 바탕으로 현실적인 수치를 채워주세요. my_stocks 3종목(SK하이닉스, 삼성전자, 한화에어로스페이스)은 미국 시장 흐름과 한국 이슈를 종합해 구체적으로 분석해주세요. JSON만 출력하세요.`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON 파싱 실패');

    const briefing = JSON.parse(match[0]);
    briefing._generated_at = now.toISOString();
    return res.status(200).json(briefing);

  } catch (e) {
    console.error('Error:', e);
    return res.status(500).json({ error: e.message });
  }
}
