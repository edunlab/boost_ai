# Session 4 Presentation Slides Content
This file is auto-generated for content verification purposes.
---
## Slide 1: [세션 오프닝] 4차시. Agent 구성 요소: Prompt, Workflow, ToolAgent 구성 요소 [Divider Slide]
- **Category**: 2일차 | 4차시. Agent 구성 요소: Prompt, Workflow, Tool

### Content
DAY 2SESSION 04
## 
에이전트 시스템을 지탱하는 세 가지 핵심 뼈대와 실무 워크플로우 설계 (Prompt, Workflow, Tool)
- **Topic**: 01에이전트 프롬프트 패턴
- **Topic**: 02단일 루프 vs 다단계 워크플로우
- **Topic**: 03외부 API 연동 & Tool 활용
4차시. Agent 구성 요소: Prompt, Workflow, Tool 세션 시작
에이전트 시스템을 지탱하는 세 가지 핵심 뼈대와 실무 워크플로우 설계

**Presenter Notes**:
> 4차시에서는 에이전트를 실질적으로 일하게 만드는 3대 핵심 기둥인 프롬프트, 워크플로우, 그리고 외부 도구             연동에 대해 다룹니다.

**Visual & Layout Guide**:
> 신뢰감을 주는 다크 네이비와 오렌지 그라데이션 대비. 입체적인 기어 및 연결선 그래픽 모티브.

---

## Slide 2: 2일차 오프닝 & 4차시 아젠다
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
- **과정명:**[중급 공통] Antigravity 기반 AI 워크플로우 설계와 에이전트 구축
- **4차시 주제:**Agent 흐름 설계: Prompt에서 Workflow로 (단계형 처리의 시작)
- **오늘 배울 내용:**
  - 단일 프롬프트가 가진 성능적 한계와 컨텍스트 유실 문제
  - 프롬프트 체이닝(Prompt Chaining)의 개념과 강점
  - Workflow 구조 설계 기법: Task -> Step -> Flow 매핑

**Presenter Notes**:
> 여러분, 반갑습니다! 2일차 아침이 밝았습니다. 어제 배운 내용이 단일 프롬프트를 완성도 있게 깎는               작업이었다면, 오늘부터는 그 프롬프트들을 연결해 하나의 거대한 공장 라인을 만드는 '워크플로우(Workflow) 설계'를 시작합니다. 4차시에서는 복잡한 문제를 잘게 쪼개어 단계별로               풀어나가는 핵심 설계도를 설계해 보겠습니다.

**Visual & Layout Guide**:
> 활기찬 아침 분위기의 라이트 오렌지 & 오션 블루 컬러 테마. 컨베이어 벨트나 조립 라인의               유기적               순서도를 연상케 하는 3D 메탈릭 파이프라인 그래픽 적용.

---

## Slide 3: 도입 질문: 한 번에 시키기 vs 나누어 시키기
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
- **도입 질문:**"한 번에 3가지 지시사항(요약, 분류, 답변 작성)을 담아 긴 프롬프트를 실행하는 것과, 3단계로 쪼개어 차례로                 실행하는 것은 어떤 품질 차이를 만들까요?"
- **이론적 한계 분석:**
  - **단일 긴 프롬프트:**모델의 주의력(Attention)이 분산되어 중간 단계 지시를 쉽게 무시함. 오류 발생 시 어떤                     단계에서                     잘못되었는지 디버깅이 불가능함.
  - **다단계 Workflow:**각 단계의 입력과 출력에 집중하므로 각 부분의 완성도가 극대화됨. 에러가 나면 해당 단계만                     수정하면                     됨.

**Presenter Notes**:
> 인턴에게 일을 시킬 때 '이 회의록을 요약하고, 핵심 골자를 파악해서, 다음 일정 메일 초안까지 작성해               와'라고 한 번에 지시하면 실수할 확률이 큽니다. 반대로 '우선 요약부터 해봐', '그다음 핵심만 뽑아봐', '그걸 바탕으로 메일을 써'라고 순차적으로 시키면 어떨까요? AI도 완전히               똑같습니다. 단계별 실행이 훨씬 정확합니다.

**Visual & Layout Guide**:
> 하나의 거대한 텍스트 상자(단일 프롬프트)와 세 개의 연결된 작은 박스(Workflow)를 연결               핀 기호와 함께 대조.

---

## Slide 4: 핵심 설명: 프롬프트 체이닝 (Prompt Chaining)
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
1Input사용자 유입 메일 원본2Task 1: 분석카테고리 및 심각도 등 감정 지표 판별3중간 데이터JSON 포맷의 분류 태그4Task 2: 작성맞춤형 대응 메일 본문 최종 초안 생성
```python
`[Input 원본] ──> (Step 1: 요약) ──> [요약본] ──> (Step 2: 추출) ──> [핵심키워드] ──> (Step 3: 작성) ──> [최종 메일]`
```
- **장점:**중간 결과물을 사람이 확인하고 수정(Human-in-the-loop)한 뒤 다음 단계로 보낼 수 있음.

**Presenter Notes**:
> 프롬프트 체이닝은 에이전트의 꽃입니다. 전 단계가 끝난 결과 데이터를 다음 단계의 연료로 공급하는               파이프라인을 구축하는 것이죠. 이렇게 하면 중간에 사람이 개입해 잘못된 정보를 올바르게 고쳐 준 후 다음 단계로 진행시킬 수도 있어 안전성이 비약적으로 증가합니다.

**Visual & Layout Guide**:
> 체인 링크 아이콘이 서로 맞물려 데이터가 흐르는 동적인 라인 애니메이션 형태 시각화.

---

## Slide 5: 핵심 설명: Workflow 구조의 3요소 (TSF)
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
TTrigger (시작 조건)신규 메일 수신, 매시간 크론탭 등 이벤트 트리거SSteps (실행 절차)분석, 보강, 필터링 등 순차적/병렬적 체이닝 실행FFilter/Format (후처리)비속어 필터, 민감 정보 마스킹 및 출력 규격 보장

**Visual & Layout Guide**:
> 상위 목표(Task) 아래에 3개의 계층적 박스(Step 1, 2, 3)가 Flow 선으로 정렬된               트리형 다이어그램.

---

## Slide 6: 사례 연구: 3단계 업무 요약 Workflow 설계 예시
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
11단계: 메일 분류고객 질문의 카테고리(환불, 오류, 단순질문) 및 긴급도 분류22단계: 초안 작성1단계 분류 및 기업 가이드라인에 맞춘 개인화 답변 초안 작성33단계: 필터 검사인종 차별, 비속어, 중요 회사 정보 포함 여부 가드레일 검사

**Visual & Layout Guide**:
> 세 명의 다른 역할을 가진 캐릭터 아이콘이 순서대로 데이터 바구니를 넘겨주는 유쾌하고 직관적인               인포그래픽.

---

## Slide 7: 실습 안내: 3단계 Workflow 기획 및 검증
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
- **실습명:**3단계 체이닝 워크플로우 설계 실습
- **실습 목표:**하나의 비정형 비즈니스 보고서를 분석하여 최종 개선 권고안까지 이르는 3단계 체인 구축
- **제공 데이터:**edunitylab 회의록 및 개선 제안 메일 원본
- **산출물:**3단계 Workflow 설계서(단계별 입출력 정의) 및 각 단계 프롬프트 셋

**Presenter Notes**:
> 이제 직접 사슬을 엮어 볼 시간입니다. 제공해 드린 원본 회의록 및 제안서 메일을 바탕으로, 1단계               요약, 2단계 이슈 추출, 3단계 액션 아이템 생성을 순서대로 처리하는 3단계 워크플로우를 직접 프롬프트로 구축하고 실행해 보겠습니다.

**Visual & Layout Guide**:
> 톱니바퀴 결합과 체인 구조가 합쳐진 모던한 아이콘 디자인. 실습 시간과 주의사항을 명확히 노출.

---

## Slide 8: 실습 진행: 단계별 설계서 템플릿 작성법
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
Python Prompt Chaining API 호출 예제복사
```python
import openai
def handle_email_pipeline(user_email):
    # Task 1: 메일 분석
    analysis_prompt = f"이메일을 카테고리화 하세요: {user_email}"
    res1 = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": analysis_prompt}])
    category = res1.choices[0].message.content
    
    # Task 2: 초안 작성
    reply_prompt = f"이메일 본문 '{user_email}'에 대해 카테고리 '{category}'에 맞춰 답변 초안을 작성하시오."
    res2 = openai.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": reply_prompt}])
    return res2.choices[0].message.content
```

**Presenter Notes**:
> 이 템플릿에 맞추어 설계를 먼저 진행해야 합니다. 절대 프롬프트부터 무작정 타이핑하지 마십시오.               1단계의 출력이 2단계의 입력이 되기 위해 어떤 형태여야 하는지 고민하고, 단계별 '바톤 터치'가 매끄럽게 이뤄지도록 형식을 매칭해 주시기 바랍니다.

**Visual & Layout Guide**:
> 템플릿 표의 각 빈칸에 가이드 힌트 문구가 깜빡이는 애니메이션 효과의 슬라이드 디자인.

---

## Slide 9: 공유 및 토론: 단일 vs 단계형 결과 대조
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
- **토론 과제:**
  - 1. 단일 프롬프트로 다짜고짜 액션 아이템을 만들었을 때와, 요약-이슈-액션의 단계를 거쳐 완성했을 때 최종 결과물의 정밀도 차이는 어떠합니까?
  - 2. 1단계에서 2단계로 넘어갈 때 원본의 중요 정보가 유실되는 현상이 발생했다면, 이를 프롬프트로 어떻게 보완하셨나요?
  - 3. 실무에서 단계를 더 쪼개거나 합치고 싶은 영역은 무엇입니까?

**Presenter Notes**:
> 실습 결과를 바탕으로 이야기를 나눠 보겠습니다. 아마 단계를 거쳐 나온 액션 아이템이 훨씬 더               구체적이고 당장 업무에 쓰기 좋은 형태일 것입니다. 정보 유실 문제가 있었던 조는 1단계 요약 프롬프트에 '숫자와 날짜 정보는 절대 누락하지 말 것'이라는 규칙을 넣어 보완할 수 있습니다.

**Visual & Layout Guide**:
> 서로 다른 두 개의 스크립트 출력물을 텍스트 크기와 줄 바꿈 상태 등으로 시각적 대비를 주어               보여주는 레이아웃.

---

## Slide 10: 설계 노하우: 정보 유실과 왜곡 방지법
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
- **Workflow 안정성 극대화 가이드:**
  - **핵심 정보 보존 지시:**"입력값에 포함된 고유명사, 숫자, 담당자 이름, 데드라인은 절대 요약 단계에서 제외하거나                     생략하지 말고                     그대로 전송하라."
  - **Context Caching:**중간 결과만 전달하지 말고, 필요시 2단계 입력에 '원본 텍스트'를 배경 정보로 함께 넘겨주는 설계                     적용.
  - **중간 검증 단계:**데이터가 넘어가는 경계면에서 형식 오류가 있는지 체크하는 룰 도입.

**Presenter Notes**:
> 워크플로우를 돌리다 보면 2단계, 3단계로 갈수록 정보가 야위어서 나중엔 알맹이가 빠지는 현상이               생깁니다. 이를 막기 위해 이전 결과물과 함께 원본 텍스트를 일부 결합해 주는 컨텍스트 유지 설계가 필요합니다.

**Visual & Layout Guide**:
> 원본 정보가 단계를 거치며 깎여나가는 나쁜 예시와, 캐싱을 통해 핵심 데이터가 끝까지 보존되는               좋은 예시를 비교한 다이어그램.

---

## Slide 11: 4차시 정리 & 5차시 예고
- **Category**: 4차시. Agent 흐름 설계: Prompt에서 Workflow로
- **Meta**: 2일차 | 에듀니티랩

### Content
- **4차시 요약:**
  - 복잡한 비즈니스 문제는 단일 프롬프트보다**다단계 Workflow(Prompt Chaining)**로 푸는 것이 정확하고 디버깅에 유리하다.
  - Workflow의 핵심 설계는**Task 정의 -> Step 쪼개기 -> Flow 제어**이다.
  - **다음 차시 예고:**5차시. 조건 분기 & 판단형 Agent 설계 (상황에 따라 다르게 작동하는 진짜 에이전트의                     조건문)

**Presenter Notes**:
> 4차시 과정을 마쳤습니다. 이제 여러분은 단계를 연결할 수 있게 되었습니다. 하지만 모든 업무가 한               방향 일직선으로만 흐르지는 않죠. 고객 리뷰가 긍정이면 감사를 보내고, 부정이면 사과를 해야 합니다. 다음 5차시에는 상황에 따라 다르게 판단하고 흐름을 바꾸는 '조건 분기형 에이전트'를               조립해 보겠습니다.

**Visual & Layout Guide**:
> 체크리스트 완수 상태 표시. 우측 하단에 갈림길(If/Else) 모양의 도로 이펙트를 띄워 차기               세션에 대한 흥미 유발.                ---

---

