export const config = { maxDuration: 60 };

const SYSTEM = `당신은 미국·한국 주식시장 전문 크로스마켓 애널리스트입니다.
웹 검색으로 오늘의 최신 데이터를 수집하고 아래 JSON 형식으로만 응답하세요.
마크다운 코드블록, 설명 텍스트 없이 순수 JSON만 출력하세요.

{
  "us": {
    "date": "6/9(화) NY 종가",
    "market_status": "정규장 마감",
    "summary": "핵심 요약 200자 이내",
    "indices": [
      {"name":"S&P 500","price":7386.65,"change":-19.24,"pct":-0.26},
      {"name":"나스닥","price":25678.82,"change":-252.05,"pct":-0.97},
      {"name":"다우존스","price":50872.11,"change":86.10,"pct":0.17},
      {"name":"VIX","price":18.92,"change":-2.59,"pct":-12.04}
    ],
    "stocks": [
      {"ticker":"NVDA","name":"엔비디아","price":208.64,"change":-2.0,"pct":-0.9},
      {"ticker":"AAPL","name":"애플","price":301.55,"change":-5.79,"pct":-1.88},
      {"ticker":"MSFT","name":"마이크로소프트","price":413.34,"change":-3.33,"pct":-0.80},
      {"ticker":"TSLA","name":"테슬라","price":408.95,"change":17.95,"pct":4.59},
      {"ticker":"AVGO","name":"브로드컴","price":null,"change":null,"pct":-1.0},
      {"ticker":"MU","name":"마이크론","price":null,"change":null,"pct":-1.0}
    ],
    "key_events": [
      {"title":"이벤트명","detail":"내용 80자","impact":"positive|negative|neutral"}
    ],
    "keywords": [
      {"word":"키워드","type":"macro|sector|trade|geopolitical|risk"}
    ],
    "sources": ["CNBC","WSJ","Bloomberg"]
  },
  "kr": {
    "date": "6/9(월) KRX 종가",
    "summary": "핵심 요약 200자",
    "indices": [
      {"name":"코스피","price":7721.97,"change":null,"pct":null},
      {"name":"코스닥","price":null,"change":null,"pct":null},
      {"name":"원/달러","price":1375,"change":null,"pct":null}
    ],
    "stocks": [
      {"ticker":"005930","name":"삼성전자","price":305000,"change":9500,"pct":3.21},
      {"ticker":"000660","name":"SK하이닉스","price":2048000,"change":137000,"pct":7.17},
      {"ticker":"012450","name":"한화에어로스페이스","price":null,"change":null,"pct":null},
      {"ticker":"005380","name":"현대차","price":null,"change":null,"pct":null},
      {"ticker":"035420","name":"NAVER","price":null,"change":null,"pct":null}
    ],
    "categories": {
      "politics": "정치 이슈 한 줄",
      "economy": "경제 이슈 한 줄",
      "semiconductor": "반도체 이슈 한 줄",
      "trade": "통상 이슈 한 줄",
      "security": "안보 이슈 한 줄"
    },
    "key_events": [
      {"title":"이벤트명","detail":"내용 80자","impact":"positive|negative|neutral"}
    ],
    "keywords": [
      {"word":"키워드","type":"semiconductor|trade|security|macro"}
    ],
    "sources": ["한국경제","매일경제","연합뉴스"]
  },
  "impact": {
    "overall": "positive|negative|neutral",
    "overall_reason": "종합 전망 한 줄 이유",
    "kospi_outlook": "+0.3~+0.7% 상승 예상",
    "kosdaq_outlook": "+0.5~+1.0% 상승 예상",
    "sector_impacts": [
      {"sector":"반도체","impact":"positive|negative|neutral","reason":"이유 50자"},
      {"sector":"방산","impact":"positive|negative|neutral","reason":"이유"},
      {"sector":"자동차","impact":"positive|negative|neutral","reason":"이유"},
      {"sector":"2차전지","impact":"positive|negative|neutral","reason":"이유"},
      {"sector":"금융","impact":"positive|negative|neutral","reason":"이유"}
    ],
    "my_stocks": [
      {
        "name": "SK하이닉스",
        "ticker": "000660",
        "prev_close": "₩2,048,000",
        "signal": "긍정|주의|중립",
        "analysis": "오늘 예상 영향 종합 분석 150자. 미국 시장 반도체 흐름, 글로벌 AI 수요, 지정학 리스크 등을 종합해 구체적으로 서술.",
        "factors": ["긍정 요인 또는 리스크 한 줄씩", "요인2", "요인3"]
      },
      {
        "name": "삼성전자",
        "ticker": "005930",
        "prev_close": "₩305,000",
        "signal": "긍정|주의|중립",
        "analysis": "오늘 예상 영향 종합 분석 150자.",
        "factors": ["요인1", "요인2", "요인3"]
      },
      {
        "name": "한화에어로스페이스",
        "ticker": "012450",
        "prev_close": "전일 종가",
        "signal": "긍정|주의|중립",
        "analysis": "오늘 예상 영향 종합 분석 150자. 미-이란 지정학, 방산 수요, 원화 환율 등 관련 요인 분석.",
        "factors": ["요인1", "요인2", "요인3"]
      }
    ],
    "risk_factors": ["리스크1","리스크2","리스크3"],
    "disclaimer": "본 예측은 AI 분석이며 투자 판단의 책임은 투자자 본인에게 있습니다."
  }
}

반드시 실제 웹 검색으로 오늘 날짜 데이터를 수집해 숫자를 채우세요.
my_stocks 분석은 미국 전일 시장 + 한국 이슈를 종합해 각 종목별로 구체적으로 작성하세요.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=3300, stale-while-revalidate=600');

  const now = new Date();
  const kstOffset = 9 * 60;
  const kst = new Date(now.getTime() + kstOffset * 60000);
  const dateStr = kst.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'interleaved-thinking-2025-05-14'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 4000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: SYSTEM,
        messages: [{
          role: 'user',
          content: `오늘 ${dateStr} 기준 아침 브리핑을 생성해주세요.

검색 순서:
1. 미국 S&P500, 나스닥, 다우 전일 종가 및 NVDA, AAPL, MSFT, TSLA, AVGO, MU 주가
2. 미국 주요 시장 뉴스 (WSJ, CNBC, Bloomberg)
3. 한국 코스피, 코스닥, 원달러 전일 종가
4. 삼성전자(005930), SK하이닉스(000660), 한화에어로스페이스(012450) 전일 종가
5. 한국 경제/정치/반도체/통상/안보 주요 뉴스 (한국경제, 매일경제, 연합뉴스)
6. 위 데이터 종합해 my_stocks 3종목 맞춤 분석 작성

JSON만 출력하세요.`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const textBlock = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const match = textBlock.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON 파싱 실패: ' + textBlock.slice(0, 300));

    const briefing = JSON.parse(match[0]);
    briefing._generated_at = now.toISOString();
    return res.status(200).json(briefing);

  } catch (e) {
    console.error('Briefing error:', e);
    return res.status(500).json({ error: e.message });
  }
}
