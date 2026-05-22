# Boost AI - AI Agent Training & Prompt Engineering

AI Agent 설계와 프롬프트 엔지니어링을 학습하기 위한 교육용 리포지토리입니다.

# 교안 보기

[https://edunlab.github.io/boost_ai/](https://edunlab.github.io/boost_ai/)

## 목적

이 리포지토리는 AI Agent의 개념을 이해하고 실무에서 활용할 수 있는 능력을 기르기 위한 교육 자료를 제공합니다. 단순히 AI에게 질문하는 것을 넘어, AI가 일하는 방식을 설계하는 Agent 설계 역량을 배양하는 것을 목표로 합니다.

## 구조

```
boost_ai/
├── ai_prompt/
│   ├── edunitylab/          # 에듀니티랩 교육 자료
│   │   ├── 01_커리큘럼.md    # 교육 커리큘럼
│   │   ├── 02_교안.md        # 강사용 교안 (상세)
│   │   └── 03_실습과제.md    # 실습 과제
│   ├── industry/            # 산업별 Agent 예시
│   │   ├── 01_game_review_agent/
│   │   ├── 02_movie_marketing_agent/
│   │   └── 03_commerce_review_agent/
│   └── 01_create_course.md  # 코스 생성 가이드
├── docs/                    # 문서 및 웹 앱
│   ├── app.js
│   ├── index.html
│   └── style.css
├── startup.bat              # 시작 스크립트
└── README.md
```

## 교육 내용

### 에듀니티랩 (1-2일차)

**1일차: 기초**

- **1차시**: AI · LLM · Agent 개념 이해
- **2차시**: 프롬프트 구조화 & Persona 설계
- **3차시**: 출력 구조 제어 & 데이터화

**2일차: 심화**

- **4차시**: Agent 흐름 설계 (Prompt → Workflow)
- **5차시**: 조건 분기 & 판단형 Agent 설계
- **6차시**: 업무 자동화 Agent 설계 (Mini Project)

### 산업별 Agent 예시

다양한 산업 분야에서 활용할 수 있는 Agent 설계 예시를 제공합니다:

- 게임 리뷰 분석 Agent
- 영화 마케팅 Agent
- 커머스 리뷰 분석 Agent

## 시작 방법

### 웹 문서 보기

```bash
# Windows
startup.bat
```

또는 `docs/` 폴더의 `index.html`을 브라우저에서 직접 엽니다.

### 교육 자료 확인

- `ai_prompt/edunitylab/01_커리큘럼.md`: 전체 교육 일정 및 목표
- `ai_prompt/edunitylab/02_교안.md`: 상세한 강사용 교안 (시간 배분, 실습 예시, 강사 팁 포함)
- `ai_prompt/edunitylab/03_실습과제.md`: 실습 과제 및 가이드

## 핵심 개념

### Agent란 무엇인가?

Agent는 단순히 답변을 잘하는 도구가 아니라, 입력을 받아 판단하고 실행 결과를 만드는 시스템입니다.

**Agent 구성 요소:**

- **Input**: 사용자의 요청 또는 데이터
- **Reasoning**: 판단, 추론, 분류, 요약
- **Action**: 도구 사용, 저장, 알림, 다음 단계 호출
- **Output**: 사용자에게 제공되는 결과 또는 업무 산출물

### 좋은 Agent 설계를 위한 원칙

1. **Persona 설계**: 역할, 판단 기준, 대상 독자를 명확히 정의
2. **출력 구조**: 업무 목적에 맞는 형식 (표, Bullet, JSON) 선택
3. **Workflow 설계**: 복잡한 문제를 단계별로 나누어 처리
4. **조건 분기**: 입력에 따라 다른 처리 경로 설계
5. **자동화 적합성**: 반복성, 규칙성, 데이터성이 있는 업무 선정

## 기여

이 프로젝트는 교육용으로 개발되었습니다. 개선 제안이나 버그 리포트는 환영합니다.

## 라이선스

교육 목적으로 자유롭게 사용할 수 있습니다.

## 연락처

프로젝트 관리자에게 문의하세요.
