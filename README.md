
# 📊 아침 시장 브리핑

매일 오전 7시 KST 자동 업데이트되는 미국·한국 주식시장 모바일 브리핑 앱.

## 기능
- 🇺🇸 미국 전일 종가 (S&P500, 나스닥, 다우, VIX + NVDA/AAPL/MSFT/TSLA/AVGO/MU)
- 🇰🇷 한국 전일 종가 (코스피, 코스닥, 원달러 + 삼성전자/SK하이닉스/한화에어로 등)
- 📈 오늘 한국 시장 영향 예측 (섹터별, 지수 방향)
- ⭐ **보유 3종목 맞춤 분석** (SK하이닉스 / 삼성전자 / 한화에어로스페이스)
- 매일 오전 7시 KST 자동 생성 (GitHub Actions)
- 모바일 홈 화면 추가 가능 (PWA)

---

## 배포 방법

### 1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_ID/market-briefing.git
git push -u origin main
```

### 2. Vercel 배포
```bash
npm i -g vercel
vercel --prod
```

Vercel 대시보드 → Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sk-ant-...
```

### 3. GitHub Secrets 설정
GitHub 저장소 → Settings → Secrets → Actions:
```
VERCEL_APP_URL = https://your-app.vercel.app
ANTHROPIC_API_KEY = sk-ant-...
```

### 4. 모바일 홈 화면 추가
- iPhone: Safari로 접속 → 공유 버튼 → "홈 화면에 추가"
- Android: Chrome으로 접속 → 메뉴 → "홈 화면에 추가"

---

## 자동화 스케줄
- GitHub Actions가 매일 **오전 7시 KST (UTC 21:50)** 에 `/api/briefing` 호출
- Vercel이 응답을 **55분간 캐시** (s-maxage=3300)
- 이후 접속 시 캐시에서 즉시 제공 → 빠른 로딩

## 파일 구조
```
market-briefing/
├── public/
│   ├── index.html        # 모바일 웹앱
│   └── manifest.json     # PWA 설정
├── api/
│   └── briefing.js       # Claude API 호출 엔드포인트
├── .github/workflows/
│   └── daily-briefing.yml # 매일 7시 자동 실행
└── vercel.json
```
