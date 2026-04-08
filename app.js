const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const forms = document.querySelectorAll(".calc-form");
const serverStatus = document.querySelector("[data-server-status]");
const metricAwareForms = document.querySelectorAll(".metric-aware-form");
const workspaceModeButtons = document.querySelectorAll("[data-workspace-mode]");
const workspacePanels = document.querySelectorAll("[data-workspace-panel]");
const workspaceActionButtons = document.querySelectorAll("[data-workspace-action]");
const resultContainers = document.querySelectorAll("[data-result]");
const protocolPlanningView = document.querySelector("[data-protocol-view]");
const protocolCapabilityButtons = document.querySelectorAll("[data-protocol-capability]");
const protocolForm = document.querySelector("[data-protocol-form]");
const protocolGenerateButton = document.querySelector("[data-protocol-generate]");
const protocolExampleButton = document.querySelector("[data-protocol-example]");
const protocolResetButton = document.querySelector("[data-protocol-reset]");
const protocolCopyButton = document.querySelector("[data-protocol-copy]");
const protocolOpenChecklistButton = document.querySelector("[data-protocol-open-checklist]");
const protocolModeBanner = document.querySelector("[data-protocol-mode-banner]");
const protocolHelp = document.querySelector("[data-protocol-help]");
const protocolOutput = document.querySelector("[data-protocol-output]");
const protocolCapabilityTitle = document.querySelector("[data-protocol-capability-title]");
const protocolCapabilityDescription = document.querySelector("[data-protocol-capability-description]");
const protocolSummaryWorkflow = document.querySelector("[data-protocol-summary-workflow]");
const protocolSummaryEndpoint = document.querySelector("[data-protocol-summary-endpoint]");
const protocolSummaryDesign = document.querySelector("[data-protocol-summary-design]");
const protocolTimingNotes = document.querySelector("[data-protocol-timing-notes]");
const protocolDynamicFields = document.querySelectorAll("[data-protocol-field]");
const protocolChecklistView = document.querySelector("[data-protocol-checklist-view]");
const checklistTitle = document.querySelector("[data-checklist-title]");
const checklistSummary = document.querySelector("[data-checklist-summary]");
const checklistTags = document.querySelector("[data-checklist-tags]");
const checklistGeneratedAt = document.querySelector("[data-checklist-generated-at]");
const checklistCapability = document.querySelector("[data-checklist-capability]");
const checklistWorkflow = document.querySelector("[data-checklist-workflow]");
const checklistEndpoint = document.querySelector("[data-checklist-endpoint]");
const checklistSites = document.querySelector("[data-checklist-sites]");
const checklistReaders = document.querySelector("[data-checklist-readers]");
const checklistProgressCount = document.querySelector("[data-checklist-progress-count]");
const checklistProgressText = document.querySelector("[data-checklist-progress-text]");
const checklistProgressBar = document.querySelector("[data-checklist-progress-bar]");
const checklistSections = document.querySelector("[data-checklist-sections]");
const checklistFlowchart = document.querySelector("[data-checklist-flowchart]");
const checklistCopyButtons = document.querySelectorAll("[data-checklist-copy]");
const checklistResetButtons = document.querySelectorAll("[data-checklist-reset]");
const themeOptionButtons = document.querySelectorAll("[data-theme-option]");
const protocolPackageStorageKey = "statistics-web:protocol-package";
const checklistProgressStoragePrefix = "statistics-web:checklist-progress:";
const themeStorageKey = "statistics-web:theme";
const defaultTheme = "executive-classic";

const metricConfigs = {
  classification: {
    accuracy: {
      labels: {
        expectedValue: "예상 Accuracy",
        benchmarkValue: "비교 기준 Accuracy",
      },
      visibleFields: [],
      help: "전체 케이스 중 AI가 맞게 판단한 비율로 샘플 수를 계산합니다.",
      exampleValues: {
        metric: "accuracy",
        expectedValue: 0.93,
        benchmarkValue: 0.95,
        nonInferiorityMargin: 0.05,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: AI 분류 정확도 0.93이 benchmark 0.95 대비 비열등성 마진 0.05 안에서 유지되는지 평가하는 상황",
    },
    sensitivity: {
      labels: {
        expectedValue: "예상 Sensitivity",
        benchmarkValue: "비교 기준 Sensitivity",
        positiveCaseRate: "평가셋 내 양성 케이스 비율",
      },
      visibleFields: ["positiveCaseRate"],
      help: "질환이나 이상이 있는 케이스를 얼마나 잘 찾는지 보는 지표입니다. 먼저 필요한 양성 케이스 수를 구한 뒤 전체 케이스 수로 바꿉니다.",
      exampleValues: {
        metric: "sensitivity",
        expectedValue: 0.91,
        benchmarkValue: 0.94,
        nonInferiorityMargin: 0.05,
        alpha: 0.025,
        power: 0.8,
        positiveCaseRate: 0.3,
        dropout: 0.1,
      },
      exampleText:
        "예시: 양성 케이스 비율 30%인 검증셋에서 AI 민감도 0.91이 benchmark 0.94 대비 비열등한지 평가",
    },
    specificity: {
      labels: {
        expectedValue: "예상 Specificity",
        benchmarkValue: "비교 기준 Specificity",
        positiveCaseRate: "평가셋 내 양성 케이스 비율",
      },
      visibleFields: ["positiveCaseRate"],
      help: "정상 케이스를 얼마나 잘 정상으로 판단하는지 보는 지표입니다. 먼저 필요한 음성 케이스 수를 구합니다.",
      exampleValues: {
        metric: "specificity",
        expectedValue: 0.95,
        benchmarkValue: 0.97,
        nonInferiorityMargin: 0.03,
        alpha: 0.025,
        power: 0.8,
        positiveCaseRate: 0.25,
        dropout: 0.1,
      },
      exampleText:
        "예시: 양성 케이스 비율 25%인 검증셋에서 AI 특이도 0.95가 benchmark 0.97 대비 비열등한지 평가",
    },
    auc: {
      labels: {
        expectedValue: "예상 AUC",
        benchmarkValue: "비교 기준 AUC",
        positiveCaseRate: "평가셋 내 양성 케이스 비율",
      },
      visibleFields: ["positiveCaseRate"],
      help: "AUC는 AI가 양성과 음성을 전반적으로 얼마나 잘 구분하는지 보는 값입니다. 양성과 음성의 비율이 결과에 영향을 줍니다.",
      exampleValues: {
        metric: "auc",
        expectedValue: 0.94,
        benchmarkValue: 0.96,
        nonInferiorityMargin: 0.03,
        alpha: 0.025,
        power: 0.8,
        positiveCaseRate: 0.35,
        dropout: 0.1,
      },
      exampleText:
        "예시: 양성 케이스 비율 35%에서 예상 AUC 0.94가 benchmark 0.96 대비 0.03 마진 내 비열등한지 평가",
    },
    f1: {
      labels: {
        expectedValue: "예상 F1-score",
        benchmarkValue: "비교 기준 F1-score",
        standardDeviation: "부트스트랩 SD",
      },
      visibleFields: ["standardDeviation"],
      help: "F1-score는 precision과 sensitivity를 함께 보는 점수입니다. 값의 흔들림 정도를 같이 넣어 샘플 수를 계산합니다.",
      exampleValues: {
        metric: "f1",
        expectedValue: 0.89,
        benchmarkValue: 0.92,
        nonInferiorityMargin: 0.05,
        alpha: 0.025,
        power: 0.8,
        standardDeviation: 0.06,
        dropout: 0.1,
      },
      exampleText:
        "예시: bootstrap SD 0.06을 가정하고 AI F1-score 0.89가 benchmark 0.92 대비 비열등한지 평가",
    },
    precision: {
      labels: {
        expectedValue: "예상 Precision (PPV)",
        benchmarkValue: "비교 기준 Precision (PPV)",
        predictedPositiveRate: "예상 양성 판정 비율",
      },
      visibleFields: ["predictedPositiveRate"],
      help: "Precision/PPV는 AI가 양성이라고 표시한 케이스 중 실제로 양성일 비율입니다. 예상 양성 판정 비율을 이용해 전체 케이스 수를 환산합니다.",
      exampleValues: {
        metric: "precision",
        expectedValue: 0.84,
        benchmarkValue: 0.87,
        nonInferiorityMargin: 0.05,
        alpha: 0.025,
        power: 0.8,
        predictedPositiveRate: 0.28,
        dropout: 0.1,
      },
      exampleText:
        "예시: 예상 양성 판정 비율 28%인 CAD 모델에서 Precision 0.84가 benchmark 0.87 대비 비열등한지 평가",
    },
    npv: {
      labels: {
        expectedValue: "예상 NPV",
        benchmarkValue: "비교 기준 NPV",
        predictedNegativeRate: "예상 음성 판정 비율",
      },
      visibleFields: ["predictedNegativeRate"],
      help: "정상이라고 판정한 케이스 중 실제로 정상일 가능성을 보는 지표입니다. 예상 정상 판정 비율을 이용해 전체 케이스 수를 계산합니다.",
      exampleValues: {
        metric: "npv",
        expectedValue: 0.97,
        benchmarkValue: 0.98,
        nonInferiorityMargin: 0.03,
        alpha: 0.025,
        power: 0.8,
        predictedNegativeRate: 0.65,
        dropout: 0.1,
      },
      exampleText:
        "예시: 예상 음성 판정 비율 65%인 모델에서 NPV 0.97이 benchmark 0.98 대비 비열등한지 평가",
    },
  },
  segmentation: {
    accuracy: {
      labels: {
        expectedValue: "예상 Segmentation Accuracy",
        benchmarkValue: "비교 기준 Segmentation Accuracy",
        standardDeviation: "케이스별 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "세그멘테이션 Accuracy는 케이스별 pixel accuracy 평균을 연속형 endpoint로 두고 계산합니다. 그래서 proportion 공식이 아니라 표준편차 입력이 필요한 mean 기반 설계를 사용합니다.",
      exampleValues: {
        metric: "accuracy",
        expectedValue: 0.94,
        benchmarkValue: 0.96,
        nonInferiorityMargin: 0.04,
        standardDeviation: 0.08,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: 세그멘테이션 Accuracy 0.94가 benchmark 0.96 대비 0.04 마진 안에서 비열등한지 평가",
    },
    dsc: {
      labels: {
        expectedValue: "예상 DSC",
        benchmarkValue: "비교 기준 DSC",
        standardDeviation: "케이스별 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "AI가 그린 영역이 정답 영역과 얼마나 비슷한지 보는 값입니다. 1에 가까울수록 좋습니다.",
      exampleValues: {
        metric: "dsc",
        expectedValue: 0.9,
        benchmarkValue: 0.92,
        nonInferiorityMargin: 0.05,
        standardDeviation: 0.1,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: 폐 결절 세그멘테이션에서 DSC 0.90이 benchmark 0.92 대비 비열등한지 평가",
    },
    iou: {
      labels: {
        expectedValue: "예상 IoU",
        benchmarkValue: "비교 기준 IoU",
        standardDeviation: "케이스별 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "AI가 찾은 영역과 정답 영역이 얼마나 겹치는지 보는 값입니다. 높을수록 좋습니다.",
      exampleValues: {
        metric: "iou",
        expectedValue: 0.83,
        benchmarkValue: 0.86,
        nonInferiorityMargin: 0.05,
        standardDeviation: 0.09,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: 세그멘테이션 IoU 0.83이 benchmark 0.86 대비 0.05 마진 안에서 비열등한지 평가",
    },
  },
  detection: {
    accuracy: {
      labels: {
        expectedValue: "예상 Detection Accuracy",
        benchmarkValue: "비교 기준 Detection Accuracy",
      },
      visibleFields: [],
      help: "영상 단위로 AI가 맞게 판단한 비율을 기준으로 샘플 수를 계산합니다.",
      exampleValues: {
        metric: "accuracy",
        expectedValue: 0.91,
        benchmarkValue: 0.94,
        nonInferiorityMargin: 0.05,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: image-level Detection Accuracy 0.91이 benchmark 0.94 대비 비열등한지 평가",
    },
    iou: {
      labels: {
        expectedValue: "예상 Detection IoU",
        benchmarkValue: "비교 기준 Detection IoU",
        standardDeviation: "부트스트랩 또는 케이스별 SD",
      },
      visibleFields: ["standardDeviation"],
      help: "AI가 찾은 위치가 정답 위치와 얼마나 잘 겹치는지 보는 값입니다.",
      exampleValues: {
        metric: "iou",
        expectedValue: 0.78,
        benchmarkValue: 0.82,
        nonInferiorityMargin: 0.06,
        standardDeviation: 0.1,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: Detection IoU 0.78이 benchmark 0.82 대비 0.06 마진 안에서 비열등한지 평가",
    },
    lesion_sensitivity: {
      labels: {
        expectedValue: "예상 Lesion-level Sensitivity",
        benchmarkValue: "비교 기준 Lesion-level Sensitivity",
        positiveCaseRate: "평가셋 내 양성 케이스 비율",
        lesionsPerPositiveCase: "양성 케이스당 평균 병변 수",
      },
      visibleFields: ["positiveCaseRate", "lesionsPerPositiveCase"],
      help: "병변 하나하나를 AI가 얼마나 잘 찾는지 보는 지표입니다. 필요한 병변 수를 먼저 구한 뒤 케이스 수로 바꿉니다.",
      exampleValues: {
        metric: "lesion_sensitivity",
        expectedValue: 0.9,
        benchmarkValue: 0.92,
        nonInferiorityMargin: 0.07,
        alpha: 0.025,
        power: 0.8,
        positiveCaseRate: 0.4,
        lesionsPerPositiveCase: 1.4,
        dropout: 0.1,
      },
      exampleText:
        "예시: 양성 케이스 비율 40%, 병변 수/양성 케이스 1.4에서 lesion sensitivity 0.90이 benchmark 0.92 대비 비열등한지 평가",
    },
    fp_per_image: {
      labels: {
        expectedValue: "예상 FP per Image",
        benchmarkValue: "비교 기준 FP per Image",
        standardDeviation: "케이스별 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "영상 1장당 AI가 잘못 표시하는 개수를 보는 값입니다. 낮을수록 좋습니다.",
      exampleValues: {
        metric: "fp_per_image",
        expectedValue: 0.18,
        benchmarkValue: 0.15,
        nonInferiorityMargin: 0.08,
        standardDeviation: 0.2,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: FP per Image 0.18이 benchmark 0.15에 비해 0.08 이내 열세만 허용하는 비열등성 설계",
    },
    map: {
      labels: {
        expectedValue: "예상 mAP",
        benchmarkValue: "비교 기준 mAP",
        standardDeviation: "부트스트랩 SD",
      },
      visibleFields: ["standardDeviation"],
      help: "탐지 성능을 전체적으로 요약한 점수입니다. 값의 흔들림 정도를 같이 넣어 샘플 수를 계산합니다.",
      exampleValues: {
        metric: "map",
        expectedValue: 0.81,
        benchmarkValue: 0.85,
        nonInferiorityMargin: 0.06,
        standardDeviation: 0.08,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: detection mAP 0.81이 benchmark 0.85 대비 0.06 마진 안에서 비열등한지 평가",
    },
  },
  measurement: {
    accuracy: {
      labels: {
        expectedValue: "예상 Accuracy (허용오차 내 비율)",
        benchmarkValue: "비교 기준 Accuracy",
      },
      visibleFields: [],
      help: "측정값이 허용 범위 안에 들어오는 비율을 기준으로 계산할 때 사용합니다.",
      exampleValues: {
        metric: "accuracy",
        expectedValue: 0.9,
        benchmarkValue: 0.94,
        nonInferiorityMargin: 0.05,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: 허용오차 내 비율 기준 Accuracy 0.90이 benchmark 0.94 대비 비열등한지 평가",
    },
    mae: {
      labels: {
        expectedValue: "예상 MAE",
        benchmarkValue: "비교 기준 MAE",
        standardDeviation: "오차 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "평균적으로 얼마나 틀리는지 보는 값입니다. 낮을수록 좋습니다.",
      exampleValues: {
        metric: "mae",
        expectedValue: 1.5,
        benchmarkValue: 1.4,
        nonInferiorityMargin: 0.5,
        standardDeviation: 1.2,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: MAE 1.5가 benchmark 1.4 대비 0.5 이내 열세만 허용하는 비열등성 설계",
    },
    rmse: {
      labels: {
        expectedValue: "예상 RMSE",
        benchmarkValue: "비교 기준 RMSE",
        standardDeviation: "오차 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "큰 오차에 더 민감하게 반응하는 오차 지표입니다. 낮을수록 좋습니다. 이 계산은 RMSE를 연속형 평균 endpoint로 보는 정규 근사 기반 planning입니다.",
      exampleValues: {
        metric: "rmse",
        expectedValue: 2.1,
        benchmarkValue: 1.9,
        nonInferiorityMargin: 0.6,
        standardDeviation: 1.4,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: RMSE 2.1이 benchmark 1.9 대비 0.6 마진 안에서 비열등한지 평가",
    },
    mape: {
      labels: {
        expectedValue: "예상 MAPE",
        benchmarkValue: "비교 기준 MAPE",
        standardDeviation: "오차 표준편차",
      },
      visibleFields: ["standardDeviation"],
      help: "오차를 퍼센트로 본 값입니다. 낮을수록 좋습니다. 다만 reference value가 0 또는 0에 가까우면 MAPE가 불안정해질 수 있습니다.",
      exampleValues: {
        metric: "mape",
        expectedValue: 7.5,
        benchmarkValue: 6.8,
        nonInferiorityMargin: 2,
        standardDeviation: 3,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: MAPE 7.5%가 benchmark 6.8% 대비 2%p 마진 안에서 비열등한지 평가",
    },
    r_squared: {
      labels: {
        expectedValue: "예상 R-squared",
        benchmarkValue: "비교 기준 R-squared",
        standardDeviation: "부트스트랩 SD",
      },
      visibleFields: ["standardDeviation"],
      help: "AI 측정값이 정답값과 얼마나 비슷한 흐름을 보이는지 보는 값입니다. 높을수록 좋습니다.",
      exampleValues: {
        metric: "r_squared",
        expectedValue: 0.88,
        benchmarkValue: 0.91,
        nonInferiorityMargin: 0.06,
        standardDeviation: 0.08,
        alpha: 0.025,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: R-squared 0.88이 benchmark 0.91 대비 0.06 마진 안에서 비열등한지 평가",
    },
    bland_altman: {
      labels: {
        expectedValue: "예상 평균 차이 (bias)",
        benchmarkValue: "최대 허용 차이 (Δ)",
        alpha: "양측 alpha (95% LoA CI)",
        standardDeviation: "차이값 표준편차",
      },
      visibleFields: ["standardDeviation"],
      hiddenFields: ["nonInferiorityMargin"],
      help:
        "Lu et al. (2016)의 Bland-Altman sample size 방법을 따라, 고정된 95% LoA(mean ± 1.96 SD)의 신뢰구간이 임상 허용 차이 Δ 안에 들어오도록 필요한 paired 케이스 수를 non-central t 기반으로 계산합니다.",
      exampleValues: {
        metric: "bland_altman",
        expectedValue: 0.001167,
        benchmarkValue: 0.004,
        standardDeviation: 0.001129,
        alpha: 0.05,
        power: 0.8,
        dropout: 0.1,
      },
      exampleText:
        "예시: Lu et al. (2016) FPSA worked example 스타일로 평균 차이 0.001167, 차이값 SD 0.001129, 최대 허용 차이 0.004에서 Bland-Altman agreement 샘플수 계산",
    },
  },
};

const referenceLibrary = {
  fdaAI: {
    label: "FDA: Evaluation Methods for AI-Enabled Medical Devices",
    url: "https://www.fda.gov/medical-devices/medical-device-regulatory-science-research-programs-conducted-osel/evaluation-methods-artificial-intelligence-ai-enabled-medical-devices-performance-assessment-and",
  },
  fdaNI: {
    label: "FDA: Non-Inferiority Clinical Trials",
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/non-inferiority-clinical-trials",
  },
  mfdsAI: {
    label: "MFDS: 생성형 인공지능 의료기기 허가·심사 가이드라인",
    url: "https://www.mfds.go.kr/brd/m_1060/view.do?seq=15628",
  },
  hicks: {
    label: "Hicks et al., Evaluation metrics for medical AI",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8993826/",
  },
  sayers: {
    label: "Sayers et al., One-sample non-inferiority against a benchmark",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5652499/",
  },
  hanley: {
    label: "Hanley and McNeil, The meaning and use of the AUC",
    url: "https://pubmed.ncbi.nlm.nih.gov/7063747/",
  },
  obuchowski: {
    label: "Obuchowski, Computing sample size for ROC studies",
    url: "https://pubmed.ncbi.nlm.nih.gov/8169102/",
  },
  sampleReview: {
    label: "Simplified sample size formulas for medically important effects",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11198523/",
  },
  blandAltman: {
    label: "Bland and Altman, agreement between two methods of clinical measurement",
    url: "https://pubmed.ncbi.nlm.nih.gov/2868172/",
  },
  luBlandAltman: {
    label: "Lu et al., Sample Size for Assessing Agreement by Bland-Altman Method",
    url: "https://www.degruyterbrill.com/document/doi/10.1515/ijb-2015-0039/html",
  },
};

const sharedReferences = {
  proportion: [
    referenceLibrary.fdaAI,
    referenceLibrary.fdaNI,
    referenceLibrary.sayers,
    referenceLibrary.sampleReview,
    referenceLibrary.mfdsAI,
  ],
  meanHigher: [
    referenceLibrary.fdaAI,
    referenceLibrary.fdaNI,
    referenceLibrary.hicks,
    referenceLibrary.sampleReview,
    referenceLibrary.mfdsAI,
  ],
  meanLower: [
    referenceLibrary.fdaAI,
    referenceLibrary.fdaNI,
    referenceLibrary.hicks,
    referenceLibrary.sampleReview,
    referenceLibrary.mfdsAI,
  ],
  auc: [
    referenceLibrary.fdaAI,
    referenceLibrary.fdaNI,
    referenceLibrary.hanley,
    referenceLibrary.obuchowski,
    referenceLibrary.mfdsAI,
  ],
  blandAltman: [
    referenceLibrary.fdaAI,
    referenceLibrary.blandAltman,
    referenceLibrary.luBlandAltman,
    referenceLibrary.mfdsAI,
  ],
};

const sharedAssumptions = {
  proportion: [
    "독립적인 검증셋과 이진 endpoint 근사를 가정합니다.",
    "benchmark와 비열등성 마진은 통계분석계획서에서 사전 정의되어야 합니다.",
    "민감도, 특이도, NPV처럼 부분집합 기반 지표는 유병률 또는 판정 비율 가정에 따라 총 케이스 수가 달라집니다.",
  ],
  meanHigher: [
    "케이스별 metric 분포를 평균과 표준편차로 요약할 수 있다고 가정합니다.",
    "표준편차는 파일럿 데이터 또는 bootstrap resampling에서 추정하는 것이 바람직합니다.",
    "higher-is-better endpoint에 대한 one-sample 비열등성 근사식을 사용합니다.",
  ],
  meanLower: [
    "케이스별 오차 분포를 평균과 표준편차로 요약할 수 있다고 가정합니다.",
    "표준편차는 파일럿 데이터 또는 bootstrap resampling에서 추정하는 것이 바람직합니다.",
    "lower-is-better endpoint에 대한 one-sample 비열등성 근사식을 사용합니다.",
  ],
  auc: [
    "양성/음성 케이스 비율이 사전에 계획 가능한 검증셋이라고 가정합니다.",
    "AUC 분산은 Hanley-McNeil 근사를 사용합니다.",
    "one-sided alpha 0.025는 통상 양측 95% 신뢰구간 해석과 대응됩니다.",
  ],
  blandAltman: [
    "paired measurement 차이값이 평균과 표준편차로 요약 가능한 연속형 분포라고 가정합니다.",
    "Lu et al. (2016) 방식처럼 fixed 95% LoA의 신뢰구간과 two-sided alpha, power를 함께 반영합니다.",
    "계산은 non-central t 기반 power search를 사용하고, 기존 sqrt(3s²/n) 근사식은 비교용 legacy 참고값으로만 남깁니다.",
    "현재 계산기는 95% LoA(mean ± 1.96×SD)를 고정 가정합니다.",
    "임상 허용 차이 Δ는 expected bias와 1.96×SD를 모두 넘는 값으로 사전에 정의되어야 합니다.",
    "pilot 또는 pre-experiment에서 얻은 bias와 SD를 바탕으로 method comparison study를 planning하는 상황에 적합합니다.",
  ],
};

function createResultMeta(config) {
  return config;
}

const resultMetaMap = {
  "classification:accuracy": createResultMeta({
    metricLabel: "Accuracy",
    endpointLabelKo: "분류 정확도",
    endpointLabelEn: "classification accuracy",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: sharedAssumptions.proportion,
    noteKo: "전체 평가 케이스를 binary proportion endpoint로 근사해 계산합니다.",
    noteEn: "The endpoint is approximated as a binary proportion over all evaluation cases.",
  }),
  "classification:sensitivity": createResultMeta({
    metricLabel: "Sensitivity",
    endpointLabelKo: "민감도",
    endpointLabelEn: "sensitivity",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: [
      ...sharedAssumptions.proportion,
      "총 샘플수는 양성 케이스 비율을 이용해 환산합니다.",
    ],
    noteKo: "양성 케이스 수를 먼저 계산한 뒤 양성 케이스 비율로 전체 케이스 수를 환산합니다.",
    noteEn: "The positive-case requirement is calculated first and then converted to total cases using the assumed positive-case rate.",
  }),
  "classification:specificity": createResultMeta({
    metricLabel: "Specificity",
    endpointLabelKo: "특이도",
    endpointLabelEn: "specificity",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: [
      ...sharedAssumptions.proportion,
      "총 샘플수는 음성 케이스 비율(1-양성 비율)을 이용해 환산합니다.",
    ],
    noteKo: "음성 케이스 수를 먼저 계산한 뒤 음성 케이스 비율로 전체 케이스 수를 환산합니다.",
    noteEn: "The negative-case requirement is calculated first and then converted to total cases using the assumed negative-case rate.",
  }),
  "classification:auc": createResultMeta({
    metricLabel: "AUC",
    endpointLabelKo: "ROC AUC",
    endpointLabelEn: "ROC AUC",
    family: "auc",
    references: sharedReferences.auc,
    assumptions: sharedAssumptions.auc,
    noteKo: "AUC endpoint에 대해 Hanley-McNeil 분산 근사를 사용하여 양성/음성 case mix를 반영합니다.",
    noteEn: "The Hanley-McNeil variance approximation is used for the AUC endpoint while accounting for the positive/negative case mix.",
  }),
  "classification:f1": createResultMeta({
    metricLabel: "F1-score",
    endpointLabelKo: "F1-score",
    endpointLabelEn: "F1-score",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "집계형 지표이므로 파일럿 또는 bootstrap 기반 표준편차 입력이 중요합니다.",
    noteEn: "Because this is an aggregate metric, the standard deviation should preferably come from pilot data or bootstrap resampling.",
  }),
  "classification:precision": createResultMeta({
    metricLabel: "Precision (PPV)",
    endpointLabelKo: "양성예측도",
    endpointLabelEn: "positive predictive value",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: [
      ...sharedAssumptions.proportion,
      "총 샘플수는 예상 양성 판정 비율을 이용해 환산합니다.",
    ],
    noteKo: "예상 양성 판정 비율을 이용해 필요한 predicted positive 수를 총 케이스 수로 환산합니다.",
    noteEn: "The required number of predicted positives is converted to total cases using the assumed predicted-positive rate.",
  }),
  "classification:npv": createResultMeta({
    metricLabel: "NPV",
    endpointLabelKo: "음성예측도",
    endpointLabelEn: "negative predictive value",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: [
      ...sharedAssumptions.proportion,
      "총 샘플수는 예상 음성 판정 비율을 이용해 환산합니다.",
    ],
    noteKo: "예상 음성 판정 비율을 이용해 필요한 predicted negative 수를 총 케이스 수로 환산합니다.",
    noteEn: "The required number of predicted negatives is converted to total cases using the assumed predicted-negative rate.",
  }),
  "segmentation:accuracy": createResultMeta({
    metricLabel: "Accuracy",
    endpointLabelKo: "세그멘테이션 정확도",
    endpointLabelEn: "segmentation accuracy",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "케이스별 pixel accuracy 평균을 이용한 continuous endpoint로 계산합니다.",
    noteEn: "The calculation treats the case-level mean pixel accuracy as a continuous endpoint.",
  }),
  "segmentation:dsc": createResultMeta({
    metricLabel: "Dice Similarity Coefficient (DSC)",
    endpointLabelKo: "Dice Similarity Coefficient",
    endpointLabelEn: "Dice Similarity Coefficient",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "케이스별 Dice score 평균과 표준편차를 기반으로 계산합니다.",
    noteEn: "The calculation is based on the case-level mean and standard deviation of the Dice score.",
  }),
  "segmentation:iou": createResultMeta({
    metricLabel: "IoU",
    endpointLabelKo: "Intersection over Union",
    endpointLabelEn: "intersection over union",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "케이스별 IoU 평균과 표준편차를 기반으로 계산합니다.",
    noteEn: "The calculation is based on the case-level mean and standard deviation of IoU.",
  }),
  "detection:accuracy": createResultMeta({
    metricLabel: "Accuracy",
    endpointLabelKo: "디텍션 정확도",
    endpointLabelEn: "detection accuracy",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: sharedAssumptions.proportion,
    noteKo: "영상 단위 detection accuracy를 binary proportion endpoint로 근사합니다.",
    noteEn: "The image-level detection accuracy is approximated as a binary proportion endpoint.",
  }),
  "detection:iou": createResultMeta({
    metricLabel: "IoU",
    endpointLabelKo: "디텍션 IoU",
    endpointLabelEn: "detection IoU",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "매칭된 detection의 IoU 분포를 continuous endpoint로 근사합니다.",
    noteEn: "The IoU distribution for matched detections is treated as a continuous endpoint.",
  }),
  "detection:lesion_sensitivity": createResultMeta({
    metricLabel: "Lesion-level Sensitivity",
    endpointLabelKo: "병변별 민감도",
    endpointLabelEn: "lesion-level sensitivity",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: [
      ...sharedAssumptions.proportion,
      "병변 수를 먼저 계산하고 양성 케이스당 병변 수와 양성 비율로 총 케이스 수를 환산합니다.",
    ],
    noteKo: "lesion 단위 endpoint를 먼저 계산한 뒤 병변 수와 케이스 수 사이를 환산합니다.",
    noteEn: "The lesion-level requirement is calculated first and then converted to positive and total case counts.",
  }),
  "detection:fp_per_image": createResultMeta({
    metricLabel: "FP per Image",
    endpointLabelKo: "영상당 위양성 수",
    endpointLabelEn: "false positives per image",
    family: "mean-lower",
    references: sharedReferences.meanLower,
    assumptions: sharedAssumptions.meanLower,
    noteKo: "낮을수록 좋은 lower-better error-type endpoint로 처리합니다.",
    noteEn: "This is treated as a lower-is-better error-type endpoint.",
  }),
  "detection:map": createResultMeta({
    metricLabel: "mAP",
    endpointLabelKo: "mean Average Precision",
    endpointLabelEn: "mean average precision",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "bootstrap 또는 파일럿 기반 표준편차를 사용하는 집계형 지표로 가정합니다.",
    noteEn: "This is treated as an aggregate metric requiring a bootstrap- or pilot-based standard deviation.",
  }),
  "measurement:accuracy": createResultMeta({
    metricLabel: "Accuracy",
    endpointLabelKo: "허용오차 내 비율 기반 정확도",
    endpointLabelEn: "accuracy defined as the within-tolerance proportion",
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: sharedAssumptions.proportion,
    noteKo: "측정값이 허용오차 내에 들어오는 비율을 binary endpoint로 정의한 경우에 사용합니다.",
    noteEn: "This is used when accuracy is defined as the proportion of measurements that fall within a pre-specified tolerance.",
  }),
  "measurement:mae": createResultMeta({
    metricLabel: "MAE",
    endpointLabelKo: "평균절대오차",
    endpointLabelEn: "mean absolute error",
    family: "mean-lower",
    references: sharedReferences.meanLower,
    assumptions: sharedAssumptions.meanLower,
    noteKo: "paired reference measurement와의 오차 분포를 continuous lower-better endpoint로 처리합니다.",
    noteEn: "The paired measurement error distribution is treated as a continuous lower-is-better endpoint.",
  }),
  "measurement:rmse": createResultMeta({
    metricLabel: "RMSE",
    endpointLabelKo: "제곱평균제곱근오차",
    endpointLabelEn: "root mean squared error",
    family: "mean-lower",
    references: sharedReferences.meanLower,
    assumptions: sharedAssumptions.meanLower,
    noteKo: "paired reference measurement와의 오차 분포를 continuous lower-better endpoint로 처리하되, RMSE는 정규 근사 기반 planning으로 해석합니다.",
    noteEn: "The paired measurement error distribution is treated as a continuous lower-is-better endpoint using a normal approximation for RMSE planning.",
  }),
  "measurement:mape": createResultMeta({
    metricLabel: "MAPE",
    endpointLabelKo: "평균절대백분율오차",
    endpointLabelEn: "mean absolute percentage error",
    family: "mean-lower",
    references: sharedReferences.meanLower,
    assumptions: sharedAssumptions.meanLower,
    noteKo: "percentage error 분포를 continuous lower-better endpoint로 처리하지만, reference value가 0에 가까운 경우에는 불안정할 수 있습니다.",
    noteEn: "The percentage error distribution is treated as a continuous lower-is-better endpoint, but MAPE can be unstable when the reference value is close to zero.",
  }),
  "measurement:r_squared": createResultMeta({
    metricLabel: "R-squared",
    endpointLabelKo: "결정계수",
    endpointLabelEn: "R-squared",
    family: "mean-higher",
    references: sharedReferences.meanHigher,
    assumptions: sharedAssumptions.meanHigher,
    noteKo: "회귀 적합도 지표를 continuous higher-better endpoint로 처리합니다.",
    noteEn: "The goodness-of-fit endpoint is treated as a continuous higher-is-better endpoint.",
  }),
  "measurement:bland_altman": createResultMeta({
    metricLabel: "Bland-Altman (LoA)",
    endpointLabelKo: "Bland-Altman 일치도",
    endpointLabelEn: "Bland-Altman agreement",
    family: "bland-altman",
    references: sharedReferences.blandAltman,
    assumptions: sharedAssumptions.blandAltman,
    noteKo:
      "paired difference의 평균과 표준편차를 이용해 95% limits of agreement 신뢰구간이 허용 차이 안에 들어오도록 Lu et al.의 non-central t power 방식으로 계획합니다.",
    noteEn:
      "The planning uses the Lu et al. non-central t power approach so that the confidence interval around the fixed 95% limits of agreement remains within the pre-specified acceptable difference.",
  }),
};

const basicFormTooltips = {
  "single-proportion": {
    proportion: "미리 예상하는 비율입니다. 예를 들어 성공률이나 민감도가 80% 정도일 것 같으면 0.8을 넣습니다.",
    margin: "어느 정도 오차까지 괜찮은지 정하는 값입니다. 예를 들어 0.10이면 결과가 대략 ±10% 범위 안에 들어오도록 보겠다는 뜻입니다.",
    confidence: "결과를 얼마나 믿을 수 있게 잡을지 정하는 값입니다. 보통 95%를 많이 사용합니다.",
    dropout: "중간 탈락이나 제외될 사람을 미리 예상한 비율입니다. 실제 모집 인원을 조금 더 크게 잡을 때 사용합니다.",
  },
  "two-proportion": {
    p1: "기존 방법이나 대조군에서 예상하는 비율입니다.",
    p2: "새 방법이나 시험군에서 예상하는 비율입니다.",
    alpha: "양측 alpha입니다. 우연한 차이를 진짜 차이로 잘못 판단할 가능성을 얼마나 낮게 둘지 정하는 값이며, 보통 0.05를 씁니다.",
    power: "정말 차이가 있을 때 그 차이를 찾아낼 가능성입니다. 보통 80%나 90%를 사용합니다.",
    dropout: "중간 탈락이나 분석 제외를 미리 예상한 비율입니다.",
  },
  "two-mean": {
    sigma: "값이 사람마다 얼마나 들쭉날쭉한지 나타내는 값입니다. 보통 이전 연구나 파일럿 결과를 참고해 넣습니다.",
    delta: "두 그룹 사이에서 최소 어느 정도 차이는 보여야 의미 있다고 볼지 정하는 값입니다.",
    alpha: "양측 alpha입니다. 우연한 차이를 진짜 차이로 잘못 판단할 가능성을 얼마나 낮게 둘지 정하는 값이며, 보통 0.05를 씁니다.",
    power: "정말 평균 차이가 있을 때 그 차이를 찾아낼 가능성입니다.",
    dropout: "중간 탈락이나 분석 제외를 미리 예상한 비율입니다.",
  },
};

const aiFieldTooltipBuilders = {
  metric: () =>
    "어떤 성능값으로 샘플 수를 계산할지 고르는 항목입니다. 지표를 바꾸면 필요한 입력값도 함께 바뀝니다.",
  expectedValue: ({ meta, metricLabel }) =>
    meta?.family === "bland-altman"
      ? "두 측정 방법 차이의 예상 평균값입니다. bias가 0에 가까울수록 보통 더 유리합니다."
      : `이번 시험에서 AI의 ${metricLabel}가 어느 정도 나올 것으로 예상하는지 적는 값입니다.`,
  benchmarkValue: ({ meta, metricLabel }) =>
    meta?.family === "bland-altman"
      ? "임상적으로 허용 가능한 최대 절대 차이 Δ입니다. expected bias와 95% LoA 상한보다 커야 하며, 보통 파일럿 결과를 보고 임상팀과 함께 정합니다."
      : `${metricLabel}에서 비교 기준으로 삼을 값입니다. 기존 제품, 기존 모델, 목표 성능 등을 넣으면 됩니다.`,
  nonInferiorityMargin: ({ meta }) =>
    meta?.family === "mean-lower"
      ? "기준값보다 얼마나 더 나빠져도 괜찮다고 볼지 정하는 여유 범위입니다. 숫자가 작을수록 기준을 더 엄격하게 잡는 것입니다."
      : "기준값보다 얼마나 낮아도 괜찮다고 볼지 정하는 여유 범위입니다. 숫자가 작을수록 기준을 더 엄격하게 잡는 것입니다.",
  power: ({ meta }) =>
    meta?.family === "bland-altman"
      ? "고정된 95% LoA 신뢰구간이 임상 허용 차이 안에 들어왔다는 결론을 실제로 얻어낼 확률입니다. 보통 80% 또는 90%를 많이 씁니다."
      : "기준을 만족했을 때 그것을 실제로 확인해낼 가능성입니다. 보통 80% 또는 90%를 많이 씁니다.",
  positiveCaseRate: () =>
    "전체 데이터 중 실제로 이상이나 질환이 있는 케이스의 비율입니다.",
  predictedNegativeRate: () =>
    "전체 데이터 중 AI가 정상이라고 판단할 것으로 예상되는 비율입니다.",
  standardDeviation: ({ meta }) =>
    meta?.family === "bland-altman"
      ? "두 방법 차이값이 케이스마다 얼마나 흔들리는지 보여주는 표준편차입니다. 파일럿 데이터에서 추정하는 것이 좋습니다."
      : meta?.family === "mean-lower"
      ? "오차값이 케이스마다 얼마나 들쭉날쭉한지 보여주는 값입니다. 이전 데이터가 있으면 그 값을 참고해 넣습니다."
      : "성능값이 케이스마다 얼마나 들쭉날쭉한지 보여주는 값입니다. 이전 데이터가 있으면 그 값을 참고해 넣습니다.",
  lesionsPerPositiveCase: () =>
    "이상이 있는 영상 1건에 병변이 평균 몇 개쯤 있는지 적는 값입니다.",
  dropout: () =>
    "중간 탈락, 라벨 문제, 분석 제외 등을 미리 예상한 비율입니다. 실제 모집 인원을 더 크게 잡을 때 사용합니다.",
  designEffect: () =>
    "Reader, site, frame, or repeated-measure clustering이 있으면 필요한 전체 케이스 수를 키우는 보정계수입니다.",
  subgroupCount: () =>
    "성능을 따로 확인하고 싶은 보호 subgroup 또는 핵심 임상 subgroup 개수입니다.",
  minCasesPerSubgroup: () =>
    "각 subgroup 안에서 최소 확보하고 싶은 analyzable case 수입니다. 0이면 subgroup floor를 적용하지 않습니다.",
  referenceReviewFailureRate: () =>
    "Reference standard가 missing, equivocal, adjudication failure, quality exclusion으로 빠질 것으로 예상되는 비율입니다.",
  alpha: ({ meta }) =>
    meta?.family === "bland-altman"
      ? "Bland-Altman에서는 고정된 95% LoA(mean ± 1.96 SD) 신뢰구간에 대한 양측 alpha입니다. Lu et al. 방식에서 power와 함께 들어가며 보통 0.05를 많이 사용합니다."
      : meta?.family === "auc"
      ? "단측 alpha입니다. 판정을 너무 쉽게 하지 않도록 정하는 기준이며, AUC에서는 보통 0.025를 많이 사용합니다."
      : "단측 alpha입니다. 판정을 너무 쉽게 하지 않도록 정하는 기준이며, 보통 0.025나 0.05를 사용합니다.",
  predictedPositiveRate: () =>
    "전체 데이터 중 AI가 양성이라고 판단할 것으로 예상되는 비율입니다. Precision/PPV 계산에서 total case 환산에 사용합니다.",
};

const basicDemoValues = {
  "single-proportion": {
    proportion: 0.8,
    margin: 0.1,
    confidence: 0.95,
    dropout: 0.1,
  },
  "two-proportion": {
    p1: 0.7,
    p2: 0.85,
    alpha: 0.05,
    power: 0.8,
    dropout: 0.1,
  },
  "two-mean": {
    sigma: 12,
    delta: 8,
    alpha: 0.05,
    power: 0.8,
    dropout: 0.1,
  },
};

const workspacePlanPresets = {
  baseline: {
    "single-proportion": {
      confidence: 0.95,
      dropout: 0.1,
    },
    "two-proportion": {
      alpha: 0.05,
      power: 0.8,
      dropout: 0.1,
    },
    "two-mean": {
      alpha: 0.05,
      power: 0.8,
      dropout: 0.1,
    },
    metricAware: {
      alpha: 0.025,
      power: 0.8,
      dropout: 0.1,
      designEffect: 1,
      subgroupCount: 1,
      minCasesPerSubgroup: 0,
      referenceReviewFailureRate: 0,
    },
  },
  highAssurance: {
    "single-proportion": {
      confidence: 0.99,
      dropout: 0.15,
    },
    "two-proportion": {
      alpha: 0.01,
      power: 0.9,
      dropout: 0.15,
    },
    "two-mean": {
      alpha: 0.01,
      power: 0.9,
      dropout: 0.15,
    },
    metricAware: {
      alpha: 0.01,
      power: 0.9,
      dropout: 0.15,
      designEffect: 1.1,
      subgroupCount: 3,
      minCasesPerSubgroup: 30,
      referenceReviewFailureRate: 0.05,
    },
  },
};

const protocolCommonDefaults = {
  researchQuestion:
    "Among patients undergoing ultrasound within the intended use setting, does the selected AI function deliver clinically acceptable performance and workflow fit versus the prespecified comparator?",
  backgroundRationale:
    "Summarize the unmet clinical need, why current ultrasound interpretation or measurement remains variable, what prior evidence already exists, and which uncertainty this study is intended to resolve for the labeled use.",
  specificAims:
    "Aim 1: Estimate the primary performance endpoint against the prespecified comparator.\nAim 2: Evaluate performance across clinically important subgroups, sites, devices, and operator experience levels.\nAim 3: Document workflow fit, usability, and operational limitations relevant to the intended use.",
  studyDesign: "prospective-diagnostic-accuracy",
  accessiblePopulation:
    "Consecutive patients presenting to participating hospitals or clinics for protocol-defined ultrasound examinations within the intended use setting.",
  inclusionCriteria:
    "Patients in the intended-use setting with protocol-acceptable ultrasound acquisition, available clinical metadata, and a feasible path to reference-standard determination.",
  exclusionCriteria:
    "Cases outside the intended use, technically uninterpretable images, protocol-prohibited prior interventions, and unresolved missing reference-standard data.",
  samplingPlan:
    "Use prospective consecutive enrollment whenever feasible, with prespecified quotas or monitoring for site, device, operator experience, disease spectrum, and key clinical subgroups.",
  recruitmentPlan:
    "Maintain a screening log for approached, eligible, enrolled, and analyzable subjects; record refusal and withdrawal reasons; and minimize unnecessary exclusions that reduce generalizability.",
  followUpPlan:
    "Index ultrasound encounter plus completion of the prespecified reference standard, blinded review, and any required short-term follow-up before database lock.",
  predictorVariables:
    "AI output, acquisition metadata, operator experience, device and preset, image quality, and clinically relevant baseline characteristics.",
  confoundingVariables:
    "Disease prevalence, case-mix differences, site workflow, device generation, probe type, operator skill, prior testing, and reference-standard timing.",
  outcomeVariables:
    "Primary performance endpoint, secondary subgroup performance, agreement or reproducibility measures, workflow outcomes, and protocol deviations affecting analyzability.",
  blindingPlan:
    "Use blinded independent review when feasible, separate AI development personnel from validation review, and prespecify adjudication rules for disagreements, uncertainty, and equivocal findings.",
  dataCollectionPlan: "prospective-consecutive",
  validationDatasetPlan: "external-site-sequestered",
  analysisPopulation: "intention-to-diagnose",
  subgroupFocus: "Sex, age, disease severity, site, device, acquisition preset",
  dataManagementPlan:
    "Define the data dictionary, role-based access, audit trail, query resolution, version control, missing-data coding, and database lock procedures before first enrollment.",
  qualityControlPlan:
    "Include site initiation training, acquisition audits, reader calibration, central monitoring, protocol deviation review, and predefined corrective actions for quality drift.",
  acceptanceCriteria:
    "Primary endpoint with 95% CI meets the prespecified threshold and no clinically unacceptable subgroup degradation",
  humanFactorsPlan: "usability-evaluation",
  monitoringPlan: "quarterly-review",
  changeControlPlan: "locked-model",
  limitationsPlan:
    "Prespecify how the protocol will address disease-spectrum imbalance, missing or uncertain truth, device heterogeneity, workflow deviations, and fallback analyses if assumptions fail.",
  ethicsPlan:
    "Describe IRB or ethics approval, consent or waiver logic, privacy protections, adverse-event handling, and protections for vulnerable subjects or incidental findings.",
};

const protocolWorkflowDefaults = {
  stored: {
    humanFactorsPlan: "usability-evaluation",
    monitoringPlan: "quarterly-review",
  },
  realtime: {
    humanFactorsPlan: "human-factors-validation",
    monitoringPlan: "site-drift-dashboard",
  },
};

const protocolCapabilityConfigs = {
  classification: {
    label: "Classification",
    workflowType: "stored",
    description:
      "저장된 초음파 이미지 또는 cine loop를 기준으로 질환 여부, 위험군, view quality 등을 분류하는 임상시험 설계를 제안합니다.",
    workflowSummary: "Saved image review",
    endpointSummary: "AUC / sensitivity / specificity",
    designSummary: "Prospective multicenter diagnostic performance study",
    banner:
      "저장형 classification 기능입니다. 검사자가 스캔 후 대표 이미지 또는 cine loop를 저장하면 AI가 저장본을 기반으로 분류 결과를 생성하는 구조를 전제로 합니다.",
    help:
      "일반적인 clinical trial design 흐름에 따라 intended use, target population, comparator, reference standard, primary endpoint를 먼저 고정한 뒤 reader blinding과 저장 규칙을 정리하세요.",
    defaults: {
      indication: "갑상선 결절 악성 위험 분류 보조",
      intendedUse: "저장된 대표 초음파 영상을 기반으로 결절 위험도를 분류하도록 보조",
      population: "갑상선 결절 평가가 필요한 성인 외래 환자",
      comparator: "expert-consensus",
      hypothesis: "non-inferiority",
      sites: 5,
      readers: 3,
      primaryEndpoint: "환자 또는 영상 단위 AUC, sensitivity, specificity",
      referenceStandard: "전문가 합의 판독과 병리 또는 추적 결과 기반 truth set",
      savedWorkflow: "representative-image",
      overlayMode: "bounding-box",
      latencyTarget: 200,
    },
    timingNotes: [
      "스캔 후 검사자가 임상적으로 대표성이 있는 정지영상 또는 cine loop를 저장한 뒤 AI가 해당 저장본을 분류합니다.",
      "저장 시점과 저장 기준을 프로토콜에 명확히 정의해야 selection bias를 줄일 수 있습니다.",
      "분류 결과는 환자 단위, 병변 단위, 저장 이미지 단위 중 어떤 단위를 primary analysis로 둘지 사전에 고정해야 합니다.",
    ],
    workflowBullets: [
      "초음파 검사자는 표준 진료 흐름에 따라 스캔을 완료하고 사전 정의된 규칙에 따라 대표 저장본을 남깁니다.",
      "AI는 저장된 이미지 또는 clip에 대해서만 실행되며 live scanning 단계에는 영향을 주지 않습니다.",
      "저장본에 대한 AI 분류 결과는 blinded reader 결과 및 reference standard와 비교합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 AUC, sensitivity, specificity, PPV/NPV 중 하나 또는 조합으로 정의할 수 있습니다.",
      "Secondary endpoint로 subgroup 성능, view quality별 성능, operator 경험도별 성능을 둘 수 있습니다.",
      "환자 단위 endpoint와 저장 이미지 단위 endpoint가 다를 경우 hierarchy를 명시합니다.",
    ],
    ultrasoundBullets: [
      "프로브 종류, 제조사, preset, cine length, 저장 규칙을 시험기관 간 표준화해야 합니다.",
      "갑상선, 유방, 복부 등 적응증별로 대표 이미지 선정 규칙과 해부학적 landmark를 정의해야 합니다.",
      "병변이 여러 개인 경우 patient-level adjudication rule을 미리 정합니다.",
    ],
    safetyBullets: [
      "저장형 기능은 live scanning workflow를 직접 바꾸지 않지만, 저장 선택 편향과 reviewer expectation bias를 관리해야 합니다.",
      "AI 출력이 진료 의사결정에 직접 사용된다면 결과 열람 시점과 확인 책임자를 문서화해야 합니다.",
      "분류 불확실 또는 low-confidence case 처리 원칙을 정해야 합니다.",
    ],
    statBullets: [
      "주분석은 전향적 다기관 진단 성능 시험 구조를 권장합니다.",
      "기관 간 성능 이질성을 보기 위한 site-stratified analysis를 계획하는 것이 바람직합니다.",
      "샘플수는 별도의 performance planning 또는 diagnostic accuracy framework와 연결해 산정합니다.",
    ],
  },
  detection: {
    label: "Detection",
    workflowType: "stored",
    description:
      "저장된 초음파 이미지 또는 cine loop에서 병변이나 해부학 구조의 위치를 탐지하는 AI 기능을 위한 프로토콜 초안을 구성합니다.",
    workflowSummary: "Saved lesion detection review",
    endpointSummary: "Sensitivity / FP image / localization accuracy",
    designSummary: "Prospective multicenter detection performance study",
    banner:
      "저장형 detection 기능입니다. 사용자가 스캔 후 저장한 영상에서 AI가 병변 위치를 탐지하며, 판독 정확도와 false positive burden을 함께 평가하도록 설계합니다.",
    help:
      "Detection trial에서는 patient-level 성능뿐 아니라 lesion-level endpoint, false positives, localization rule을 함께 정의해야 합니다.",
    defaults: {
      indication: "유방 병변 탐지 보조",
      intendedUse: "저장된 초음파 영상에서 의심 병변 위치를 탐지해 판독을 보조",
      population: "유방 병변 평가가 필요한 성인 여성 환자",
      comparator: "expert-consensus",
      hypothesis: "non-inferiority",
      sites: 6,
      readers: 3,
      primaryEndpoint: "Lesion-level sensitivity와 FP per image",
      referenceStandard: "전문가 annotation 합의와 추적 또는 병리 결과",
      savedWorkflow: "representative-image",
      overlayMode: "bounding-box",
      latencyTarget: 200,
    },
    timingNotes: [
      "저장형 detection은 사용자가 저장한 정지영상 또는 cine loop에 대해서만 AI가 위치 정보를 생성합니다.",
      "Lesion matching rule과 acceptable overlap 기준을 프로토콜에 명확히 넣어야 합니다.",
      "병변 수가 환자마다 다를 수 있어 patient-level과 lesion-level 분석 체계를 함께 계획해야 합니다.",
    ],
    workflowBullets: [
      "검사자는 표준 진료대로 스캔을 수행하고 의심 병변이 포함된 저장본을 남깁니다.",
      "AI는 저장된 frame 또는 clip에서 detection marker를 생성하며 탐지 위치와 confidence를 기록합니다.",
      "독립 전문가 panel이 lesion annotation과 matching adjudication을 수행합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 lesion-level sensitivity, localization accuracy, FP per image 조합을 권장합니다.",
      "Secondary endpoint로 patient-level detection success, subgroup별 lesion size 성능을 둘 수 있습니다.",
      "Matching threshold와 multiple detections 처리 규칙을 SAP에 반영해야 합니다.",
    ],
    ultrasoundBullets: [
      "초음파 병변은 스캔 평면과 각도에 따라 모양이 크게 달라지므로 저장 규칙과 clip length를 표준화해야 합니다.",
      "Calcification, shadowing, artifact가 detection에 미치는 영향을 별도 subgroup로 검토하는 것이 유용합니다.",
      "병변 annotation은 최소 2인 이상 전문가 합의 기반으로 구성하는 것이 바람직합니다.",
    ],
    safetyBullets: [
      "False positive가 많을 경우 불필요한 저장, 추가 판독, 불필요한 biopsy referral 가능성을 모니터링해야 합니다.",
      "탐지 누락이 진료에 미치는 영향을 평가하기 위해 missed lesion review workflow를 두는 것이 좋습니다.",
      "Detection overlay를 reader가 언제 확인하는지와 판독 순서를 사전 고정해야 합니다.",
    ],
    statBullets: [
      "Lesion clustering과 환자 내 상관성을 고려한 분석 전략을 사전에 기술해야 합니다.",
      "Lesion prevalence와 patient prevalence가 모두 중요하므로 두 수준의 모집 가정을 명시합니다.",
      "False positive burden는 mean endpoint 또는 rate endpoint로 정의할 수 있습니다.",
    ],
  },
  segmentation: {
    label: "Segmentation",
    workflowType: "stored",
    description:
      "저장된 초음파 영상에서 병변이나 구조의 경계를 분할하는 AI 기능을 위한 clinical trial protocol 초안을 생성합니다.",
    workflowSummary: "Saved contour review",
    endpointSummary: "DSC / IoU / contour agreement",
    designSummary: "Prospective multicenter segmentation performance study",
    banner:
      "저장형 segmentation 기능입니다. 저장된 초음파 영상에 대해 AI가 contour를 생성하고, 전문가 segmentation과의 일치도를 기반으로 임상 성능을 평가합니다.",
    help:
      "Segmentation trial에서는 contour quality와 downstream clinical use를 함께 정의해야 하며, annotation protocol의 일관성이 매우 중요합니다.",
    defaults: {
      indication: "간 병변 경계 분할 보조",
      intendedUse: "저장된 초음파 영상에서 병변 또는 구조 경계를 자동으로 분할해 판독과 후속 측정을 보조",
      population: "간 병변 평가가 필요한 성인 환자",
      comparator: "expert-consensus",
      hypothesis: "non-inferiority",
      sites: 5,
      readers: 3,
      primaryEndpoint: "DSC와 IoU 기반 contour agreement",
      referenceStandard: "전문가 수동 segmentation 합의안",
      savedWorkflow: "representative-image",
      overlayMode: "heatmap",
      latencyTarget: 200,
    },
    timingNotes: [
      "저장형 segmentation은 저장된 이미지 또는 clip에서 contour를 생성하며 실시간 조작은 포함하지 않습니다.",
      "어떤 frame을 segmentation 대상으로 삼는지와 contour adjudication rule을 사전에 정의해야 합니다.",
      "측정 또는 면적 계산에 segmentation을 활용한다면 downstream endpoint를 secondary로 둘 수 있습니다.",
    ],
    workflowBullets: [
      "초음파 검사 후 대표 저장본을 선택하고 AI가 해당 저장본에 contour를 생성합니다.",
      "전문가 panel은 동일 저장본에 수동 contour를 작성해 reference mask를 생성합니다.",
      "AI contour는 reader assist 전후 workflow로 사용할지, 독립 성능 평가로 둘지 프로토콜에서 구분합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 DSC, IoU, boundary distance와 같은 contour agreement metric을 권장합니다.",
      "Secondary endpoint로 면적, volume, downstream measurement accuracy를 둘 수 있습니다.",
      "복수 구조를 동시에 분할하는 경우 structure-wise hierarchy를 명시해야 합니다.",
    ],
    ultrasoundBullets: [
      "초음파 경계는 speckle noise와 low contrast의 영향을 크게 받아 annotation variation이 크므로 교육된 annotator 기준이 필요합니다.",
      "기관별 장비와 probe 차이에 따른 image texture shift를 고려한 stratification이 필요합니다.",
      "Contour가 임상적으로 허용 가능한 오차 범위를 넘는 경우 failure definition을 정해야 합니다.",
    ],
    safetyBullets: [
      "Segmentation overlay가 사용자의 측정 행동을 바꿀 수 있다면 사용 시점과 reviewer training을 문서화해야 합니다.",
      "불완전 contour 또는 contour leakage case의 처리 규칙을 마련해야 합니다.",
      "판독자가 AI contour를 수정할 수 있는지 여부를 시험 목적에 맞게 고정합니다.",
    ],
    statBullets: [
      "케이스별 segmentation metric distribution과 multi-structure correlation을 고려해야 합니다.",
      "기관 및 장비군별 sensitivity analysis를 계획하는 것이 바람직합니다.",
      "Reader-assisted design이면 reader effect를 모델에 반영하는 방법을 정의해야 합니다.",
    ],
  },
  measurement: {
    label: "Measurement",
    workflowType: "stored",
    description:
      "저장된 초음파 영상에서 길이, 면적, 각도, 생체계측값을 계산하는 AI measurement 기능의 임상시험 프로토콜을 작성합니다.",
    workflowSummary: "Saved measurement review",
    endpointSummary: "MAE / RMSE / within-tolerance accuracy",
    designSummary: "Prospective multicenter measurement accuracy study",
    banner:
      "저장형 measurement 기능입니다. 사용자가 저장한 초음파 영상에 대해 AI가 측정값을 계산하고, 전문가 또는 reference measurement와의 일치도를 평가합니다.",
    help:
      "Measurement trial에서는 tolerance band, 반복 측정 규칙, reference measurement 생성 방식이 핵심입니다.",
    defaults: {
      indication: "태아 biometry 측정 보조",
      intendedUse: "저장된 표준 평면 초음파 영상에서 길이와 직경을 자동 측정해 검사자를 보조",
      population: "정기 산전 진료를 받는 임신부",
      comparator: "expert-consensus",
      hypothesis: "agreement",
      sites: 6,
      readers: 3,
      primaryEndpoint: "MAE와 허용오차 내 accuracy",
      referenceStandard: "전문가 반복 측정 평균 또는 adjudicated reference measurement",
      savedWorkflow: "representative-image",
      overlayMode: "measurement-guide",
      latencyTarget: 200,
    },
    timingNotes: [
      "저장형 measurement는 사용자가 표준 평면을 저장한 뒤 해당 저장본에서 AI가 자동 측정을 수행합니다.",
      "대표 평면 선정 규칙이 measurement 성능에 직접 영향을 주므로 acquisition criteria를 상세히 써야 합니다.",
      "반복 측정과 intra-reader variability를 고려한 reference generation 전략이 필요합니다.",
    ],
    workflowBullets: [
      "검사자가 표준 평면을 획득하고 저장한 뒤 AI가 저장된 frame에서 측정값을 생성합니다.",
      "Reference measurement는 독립 전문가 반복 측정 또는 adjudication process로 생성합니다.",
      "AI value는 자동 measurement 그대로 비교할지, reviewer confirm 후 값을 비교할지 정의합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 MAE, RMSE, Bland-Altman agreement, 허용오차 내 accuracy를 권장합니다.",
      "Secondary endpoint로 측정 시간 단축, 재측정 횟수 감소, operator variability 감소를 둘 수 있습니다.",
      "Tolerance band는 clinical relevance와 guideline 기반으로 사전 정의해야 합니다.",
    ],
    ultrasoundBullets: [
      "표준 평면 적합성, fetal position, shadowing, obesity 등 acquisition difficulty 요인을 기록해야 합니다.",
      "태아 계측처럼 gestational age별 허용오차가 다를 경우 subgroup analysis가 필요합니다.",
      "Measurement landmark 정의와 caliper placement rule을 annotator training에 포함해야 합니다.",
    ],
    safetyBullets: [
      "부정확한 measurement가 추적 계획이나 치료 결정에 미치는 영향 범위를 risk section에 기술해야 합니다.",
      "Outlier measurement에 대해 사용자 확인 절차와 재측정 rule을 명시해야 합니다.",
      "자동 measurement 결과가 확정값으로 저장되는 시점을 운영적으로 정의해야 합니다.",
    ],
    statBullets: [
      "측정 오차는 lower-is-better endpoint로 계획할 수 있으며 tolerance-based endpoint를 함께 둘 수 있습니다.",
      "반복 측정이 있으면 mixed model 또는 repeated-measure framework를 고려합니다.",
      "Reader 및 site variation을 반영한 sensitivity analysis를 계획하는 것이 좋습니다.",
    ],
  },
  "realtime-classification": {
    label: "실시간 Classification",
    workflowType: "realtime",
    description:
      "스캔 중 연속 프레임에서 AI가 실시간으로 분류 결과를 표시하는 초음파 기능을 위한 프로토콜을 제안합니다.",
    workflowSummary: "Live classification overlay",
    endpointSummary: "Frame/patient classification + workflow impact",
    designSummary: "Prospective real-time usability and performance study",
    banner:
      "실시간 classification 기능입니다. 사용자가 스캔 중일 때 AI가 즉시 view 또는 lesion classification을 수행하고 화면에 결과를 보여주는 구조를 평가합니다.",
    help:
      "실시간 시험은 정확도뿐 아니라 latency, operator behavior change, 화면 표시 안전성, freeze/capture rule을 함께 설계해야 합니다.",
    defaults: {
      indication: "표준 평면 분류 및 quality check 보조",
      intendedUse: "스캔 중 현재 프레임이 목표 view 또는 위험군에 해당하는지 실시간으로 제시",
      population: "정기 초음파 검사를 받는 외래 환자 또는 산전 환자",
      comparator: "standard-of-care",
      hypothesis: "non-inferiority",
      sites: 5,
      readers: 3,
      primaryEndpoint: "실시간 classification accuracy와 workflow completion rate",
      referenceStandard: "저장된 clip의 전문가 frame-level adjudication과 clinical reference",
      savedWorkflow: "representative-image",
      overlayMode: "heatmap",
      latencyTarget: 150,
    },
    timingNotes: [
      "실시간 기능은 live scan 동안 연속 프레임을 처리하고 결과를 즉시 화면에 표시합니다.",
      "AI 표시가 operator의 probe movement와 frame selection에 영향을 줄 수 있으므로 행동 변화까지 관찰해야 합니다.",
      "Latency target, frame drop logging, freeze event capture rule을 프로토콜에 넣는 것이 중요합니다.",
    ],
    workflowBullets: [
      "사용자는 통상적인 초음파 스캔을 수행하며 AI는 live stream에서 실시간 classification 결과를 overlay합니다.",
      "주요 의사결정 시점의 frame과 AI confidence를 자동 로그로 저장합니다.",
      "Reference evaluation은 저장된 full clip 또는 key frame에 대해 독립 전문가가 수행합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 real-time classification accuracy, operator-level success rate, workflow completion time을 권장합니다.",
      "Secondary endpoint로 frame-level latency, user trust, recapture rate, manual override rate를 둘 수 있습니다.",
      "실시간 표시를 켠 상태와 끈 상태를 비교하는 crossover design도 고려 가능합니다.",
    ],
    ultrasoundBullets: [
      "Probe motion, respiration, fetal movement처럼 frame stability를 떨어뜨리는 요소를 기록해야 합니다.",
      "표준 평면 탐색 시간이 중요한 적응증에서는 time-to-target view를 핵심 운영 지표로 둘 수 있습니다.",
      "실시간 view classification은 clip-level truth와 frame-level truth 간 차이를 설명해야 합니다.",
    ],
    safetyBullets: [
      "오버레이가 중요 해부학 구조를 가리거나 과도한 신뢰를 유발하지 않는지 사용성 관점에서 검토해야 합니다.",
      "Low-confidence 또는 unavailable 상태를 어떻게 표시할지 명확히 정의해야 합니다.",
      "사용자 override와 AI off fallback workflow를 반드시 포함해야 합니다.",
    ],
    statBullets: [
      "Frame-level correlation과 operator-level clustering을 고려한 분석 계획이 필요합니다.",
      "실시간 기능은 performance endpoint와 usability endpoint를 함께 설계하는 것이 일반적입니다.",
      "비교군이 존재하면 randomized crossover 또는 sequence-balanced design을 고려할 수 있습니다.",
    ],
  },
  "realtime-detection": {
    label: "실시간 Detection",
    workflowType: "realtime",
    description:
      "초음파 스캔 중 실시간으로 병변 또는 구조 위치를 탐지해 화면에 표시하는 AI 기능에 맞는 임상시험 프로토콜 초안을 제공합니다.",
    workflowSummary: "Live lesion detection overlay",
    endpointSummary: "Real-time sensitivity / FP burden / latency",
    designSummary: "Prospective real-time detection study",
    banner:
      "실시간 detection 기능입니다. live scan 중 AI가 병변이나 구조를 실시간으로 강조 표시하므로 정확도와 false positive burden, latency를 동시에 평가해야 합니다.",
    help:
      "실시간 detection은 탐지 정확도뿐 아니라 overlay가 scanning behavior와 lesion capture rate를 어떻게 바꾸는지까지 포함해 설계하는 것이 좋습니다.",
    defaults: {
      indication: "간 종괴 실시간 탐지 보조",
      intendedUse: "스캔 중 의심 병변 위치를 실시간으로 표시해 검사자의 탐지 누락을 줄이도록 보조",
      population: "간 병변 평가가 필요한 성인 환자",
      comparator: "standard-of-care",
      hypothesis: "non-inferiority",
      sites: 6,
      readers: 3,
      primaryEndpoint: "Lesion-level sensitivity, FP burden, latency",
      referenceStandard: "저장된 clip에 대한 전문가 lesion annotation과 추적/병리 결과",
      savedWorkflow: "representative-image",
      overlayMode: "bounding-box",
      latencyTarget: 120,
    },
    timingNotes: [
      "실시간 detection은 스캔 중 연속 프레임에서 병변 후보를 즉시 표시합니다.",
      "Live false positive는 사용자의 탐촉자 움직임과 저장 판단에 직접 영향을 줄 수 있어 별도 모니터링이 필요합니다.",
      "AI detection이 켜진 상태와 꺼진 상태의 lesion capture rate 차이를 시험 목적에 맞게 설계할 수 있습니다.",
    ],
    workflowBullets: [
      "사용자는 일반적인 scanning protocol에 따라 영상을 획득하고 AI는 live stream에서 탐지 marker를 표시합니다.",
      "AI alert가 발생한 frame과 사용자가 실제 저장한 frame을 함께 기록해 workflow impact를 평가합니다.",
      "Reference truth는 독립 전문가 panel이 저장된 full clip과 임상 결과를 이용해 adjudication합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 lesion-level sensitivity와 FP per minute 또는 FP per clip을 조합하는 것이 일반적입니다.",
      "Secondary endpoint로 lesion capture time, additional saved frame count, operator confidence를 둘 수 있습니다.",
      "Latency와 alert persistence rule을 secondary operational endpoint로 명시해야 합니다.",
    ],
    ultrasoundBullets: [
      "Real-time detection은 probe sweep speed와 insonation angle 영향을 크게 받으므로 acquisition variability 기록이 중요합니다.",
      "병변 크기와 깊이, echogenicity에 따른 subgroup stratification을 계획하는 것이 좋습니다.",
      "Clip-based truth와 instantaneous overlay truth 사이 차이를 해소하는 adjudication rule을 둬야 합니다.",
    ],
    safetyBullets: [
      "과도한 false alert가 scanning distraction을 유발하는지 human factors 관점에서 확인해야 합니다.",
      "No detection 상태가 지속될 때 fallback scanning rule을 명시해야 합니다.",
      "오버레이가 깊은 구조나 acoustic shadow 영역을 가리지 않도록 UI safety requirement를 기술합니다.",
    ],
    statBullets: [
      "Live stream 단위 자료는 frame clustering이 크므로 patient-level summary measure를 함께 설계하는 것이 유리합니다.",
      "Operator learning effect가 생길 수 있어 초기 적응 구간을 정의할 수 있습니다.",
      "성능 endpoint와 workflow endpoint를 분리한 hierarchical testing 전략도 고려 가능합니다.",
    ],
  },
  "realtime-segmentation": {
    label: "실시간 Segmentation",
    workflowType: "realtime",
    description:
      "스캔 중 AI가 구조 또는 병변 경계를 실시간으로 표시하는 기능을 위한 초음파 clinical trial protocol을 구성합니다.",
    workflowSummary: "Live contour overlay",
    endpointSummary: "Real-time contour agreement / usability / latency",
    designSummary: "Prospective real-time segmentation study",
    banner:
      "실시간 segmentation 기능입니다. AI contour가 live scan 중 표시되므로 contour accuracy뿐 아니라 overlay 안정성과 사용성까지 함께 다루는 프로토콜이 필요합니다.",
    help:
      "실시간 contour overlay가 measurement나 lesion localization을 보조하는 경우 downstream task를 secondary endpoint로 함께 두는 것이 좋습니다.",
    defaults: {
      indication: "실시간 신경 구조 경계 표시 보조",
      intendedUse: "스캔 중 목표 구조의 경계를 실시간으로 표시해 위치 확인과 후속 절차를 보조",
      population: "표적 구조 확인이 필요한 시술 또는 진단 환자",
      comparator: "standard-of-care",
      hypothesis: "non-inferiority",
      sites: 4,
      readers: 3,
      primaryEndpoint: "실시간 contour agreement와 user task success",
      referenceStandard: "저장된 clip의 전문가 frame-level contour adjudication",
      savedWorkflow: "representative-image",
      overlayMode: "heatmap",
      latencyTarget: 120,
    },
    timingNotes: [
      "실시간 segmentation은 연속 프레임마다 contour를 업데이트하며 화면에 즉시 표시합니다.",
      "Contour jitter, tracking loss, frame lag 같은 real-time failure mode를 별도로 정의해야 합니다.",
      "사용자가 contour를 보고 probe를 재조정할 수 있으므로 interaction effect를 고려해야 합니다.",
    ],
    workflowBullets: [
      "AI는 live scan 동안 목표 구조 또는 병변의 contour를 overlay하고 사용자는 이를 참고해 스캔을 지속합니다.",
      "Key frame과 contour quality log, latency log를 자동 수집합니다.",
      "Reference contour는 저장된 representative clip을 기반으로 전문가 panel이 생성합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 frame- 또는 clip-level contour agreement, task success rate, latency를 권장합니다.",
      "Secondary endpoint로 measurement completion time, repositioning 횟수, user confidence를 둘 수 있습니다.",
      "Contour instability를 operational failure endpoint로 정의하는 것이 좋습니다.",
    ],
    ultrasoundBullets: [
      "실시간 경계는 speckle noise와 motion artifact의 영향을 크게 받아 contour smoothing rule이 중요합니다.",
      "시술 보조 목적이라면 needle/path visibility와 overlay interference를 함께 평가해야 합니다.",
      "Anatomy-specific landmark와 acceptable contour deviation 범위를 명확히 써야 합니다.",
    ],
    safetyBullets: [
      "Contour가 실제 구조를 과신하게 만들 수 있으므로 on/off control과 confidence communication을 포함해야 합니다.",
      "Tracking loss 또는 unstable contour 발생 시 사용자에게 명확히 알려주는 fail-safe가 필요합니다.",
      "실시간 overlay가 중요한 구조를 가리지 않도록 UI layering requirement를 문서화합니다.",
    ],
    statBullets: [
      "Frame-level metric은 상관성이 매우 크므로 clip-level summary endpoint를 주분석으로 둘 수 있습니다.",
      "실시간 contour quality와 task performance를 공동 primary 또는 key secondary endpoint로 설계할 수 있습니다.",
      "Operator 숙련도와 anatomy subgroup을 반영한 탐색적 분석이 유용합니다.",
    ],
  },
  "realtime-measurement": {
    label: "실시간 Measurement",
    workflowType: "realtime",
    description:
      "초음파 스캔 중 AI가 실시간으로 길이, 직경, 면적 등을 제안하거나 자동 계산하는 기능을 위한 clinical trial protocol을 작성합니다.",
    workflowSummary: "Live measurement assistance",
    endpointSummary: "Measurement error / completion time / latency",
    designSummary: "Prospective real-time measurement study",
    banner:
      "실시간 measurement 기능입니다. scanning 중 AI가 즉시 caliper placement 또는 measurement guide를 제공하므로 정확도와 workflow efficiency를 동시에 설계해야 합니다.",
    help:
      "실시간 measurement는 measurement accuracy, time saving, repeat capture 감소, user override frequency를 함께 보는 것이 일반적입니다.",
    defaults: {
      indication: "실시간 fetal biometry 측정 보조",
      intendedUse: "스캔 중 표준 평면에서 자동 caliper guide와 measurement 값을 실시간 제시",
      population: "정기 산전 초음파를 받는 임신부",
      comparator: "standard-of-care",
      hypothesis: "agreement",
      sites: 6,
      readers: 3,
      primaryEndpoint: "Measurement error와 completion time",
      referenceStandard: "전문가 adjudicated measurement와 추적 임상 데이터",
      savedWorkflow: "representative-image",
      overlayMode: "measurement-guide",
      latencyTarget: 100,
    },
    timingNotes: [
      "실시간 measurement는 live scan 중 표준 평면 인지, caliper 위치 제안, measurement 계산이 연속적으로 동작합니다.",
      "사용자가 AI guide를 그대로 수용하는지 수정하는지에 따라 결과가 달라지므로 interaction logging이 중요합니다.",
      "Freeze 시점, value lock rule, final save rule을 명확히 정의해야 합니다.",
    ],
    workflowBullets: [
      "사용자는 AI guide를 보며 표준 평면을 맞추고 AI는 caliper 또는 measurement overlay를 실시간 제공합니다.",
      "사용자가 measurement를 승인하거나 수정한 이력, final saved value, latency log를 저장합니다.",
      "Reference measurement는 독립 전문가 반복 측정 또는 adjudicated reference set으로 구성합니다.",
    ],
    endpointBullets: [
      "Primary endpoint는 measurement error, 허용오차 내 accuracy, task completion time을 권장합니다.",
      "Secondary endpoint로 재시도 횟수, manual adjustment frequency, user confidence를 둘 수 있습니다.",
      "실시간 guide의 효율성을 보기 위해 AI on/off crossover design을 고려할 수 있습니다.",
    ],
    ultrasoundBullets: [
      "Fetal biometry나 chamber size처럼 표준 평면 정의가 중요한 적응증에서는 plane adequacy rule을 반드시 포함해야 합니다.",
      "Patient motion, fetal position, breathing artifact에 따른 measurement difficulty를 기록하는 것이 좋습니다.",
      "Caliper placement 허용오차와 clinically acceptable deviation을 적응증별로 명시해야 합니다.",
    ],
    safetyBullets: [
      "부정확한 실시간 measurement가 진료 판단에 미치는 영향을 risk analysis에 포함해야 합니다.",
      "사용자 confirm 없이 값이 저장되지 않도록 human confirmation gate를 둘 수 있습니다.",
      "Latency나 value flicker가 과도한 경우 사용자 distraction 가능성을 평가해야 합니다.",
    ],
    statBullets: [
      "정확도 endpoint와 workflow efficiency endpoint를 함께 설계하는 것이 일반적입니다.",
      "Repeated measures와 operator learning effect를 모델에 반영할 수 있습니다.",
      "임상적 허용오차 기준은 guideline, expert consensus, historical data를 이용해 사전 정의해야 합니다.",
    ],
  },
};

let activeProtocolCapability = "classification";
let hasGeneratedProtocolDraft = false;
let protocolGenerateFeedbackTimer = null;
let lastGeneratedProtocolPackage = null;
let activeChecklistPackage = null;

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tab;

    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === targetId));
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const calculator = form.dataset.calculator;
    const resultContainer = document.querySelector(`[data-result="${calculator}"]`);
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = serializeForm(form);

    setLoadingState(resultContainer, submitButton, true);

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calculator,
          inputs,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "서버 계산 중 오류가 발생했습니다.");
      }

      const context = form.dataset.formKind ? buildResultContext(form, inputs, payload) : null;
      renderSuccess(resultContainer, payload, context);
    } catch (error) {
      renderError(resultContainer, error.message);
    } finally {
      setLoadingState(resultContainer, submitButton, false);
    }
  });
});

metricAwareForms.forEach((form) => {
  initializeMetricAwareForm(form);
});

forms.forEach((form) => {
  applyFormTooltips(form);
});

initializeThemePicker();
initializeResultDefaults();
initializeProtocolPlanner();
initializeChecklistPage();
initializeWorkspaceTools();
checkServerHealth();

async function checkServerHealth() {
  if (!serverStatus) {
    return {
      ok: false,
      message: "서버 상태 배지가 없습니다.",
    };
  }

  serverStatus.classList.remove("connected", "disconnected");

  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error("health check failed");
    }
    const payload = await response.json();
    serverStatus.textContent = `서버 연결됨 · ${payload.service} · port ${payload.port}`;
    serverStatus.classList.add("connected");
    return {
      ok: true,
      message: serverStatus.textContent,
    };
  } catch (error) {
    serverStatus.textContent = "서버 연결 실패 · python main.py로 서버를 실행해주세요.";
    serverStatus.classList.add("disconnected");
    return {
      ok: false,
      message: serverStatus.textContent,
    };
  }
}

function initializeMetricAwareForm(form) {
  const metricSelect = form.querySelector("[data-metric-select]");
  if (!metricSelect) {
    return;
  }

  const applyButton = form.parentElement.querySelector("[data-example-apply]");
  const update = () => applyMetricConfig(form);

  metricSelect.addEventListener("change", update);
  applyButton?.addEventListener("click", () => {
    applyExampleValues(form);
  });

  update();
}

function initializeResultDefaults() {
  resultContainers.forEach((container) => {
    container.dataset.defaultHtml = container.innerHTML.trim();
  });
}

function initializeProtocolPlanner() {
  if (!protocolPlanningView || !protocolForm) {
    return;
  }

  protocolCapabilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setProtocolCapability(button.dataset.protocolCapability, true);
    });
  });

  protocolGenerateButton?.addEventListener("click", () => {
    generateProtocolDraft({
      announce: true,
      scrollToOutput: true,
      showFeedback: true,
    });
  });

  protocolExampleButton?.addEventListener("click", () => {
    applyProtocolExamplePreset();
  });

  protocolResetButton?.addEventListener("click", () => {
    resetProtocolPlannerState();
  });

  protocolCopyButton?.addEventListener("click", async () => {
    if (!hasGeneratedProtocolDraft) {
      if (protocolHelp) {
        protocolHelp.textContent = "먼저 '프로토콜 초안 생성' 버튼을 눌러 초안을 만든 뒤 복사할 수 있습니다.";
      }
      return;
    }

    const text = String(protocolOutput?.innerText || "").trim();
    if (!text) {
      return;
    }

    try {
      await copyTextToClipboard(text);
      const config = protocolCapabilityConfigs[activeProtocolCapability];
      if (config && protocolHelp) {
        protocolHelp.textContent = `${config.help} 현재 생성된 프로토콜 초안을 클립보드에 복사했습니다.`;
      }
    } catch (error) {
      const config = protocolCapabilityConfigs[activeProtocolCapability];
      if (config && protocolHelp) {
        protocolHelp.textContent = `${config.help} 브라우저 권한 문제로 복사는 완료되지 않았습니다.`;
      }
    }
  });

  protocolOpenChecklistButton?.addEventListener("click", () => {
    openProtocolChecklistPage();
  });

  setProtocolCapability(activeProtocolCapability, true, false);
}

function getProtocolConfigDefaults(config) {
  return {
    ...protocolCommonDefaults,
    ...(protocolWorkflowDefaults[config.workflowType] || {}),
    ...config.defaults,
  };
}

function setProtocolCapability(capabilityId, resetFormValues = false, shouldGenerate = hasGeneratedProtocolDraft) {
  const config = protocolCapabilityConfigs[capabilityId];
  if (!config || !protocolForm) {
    return;
  }

  activeProtocolCapability = capabilityId;

  protocolCapabilityButtons.forEach((button) => {
    const isActive = button.dataset.protocolCapability === capabilityId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (resetFormValues) {
    setFormValues(protocolForm, getProtocolConfigDefaults(config));
  }

  toggleProtocolFields(config.workflowType);
  updateProtocolPlannerMeta(config);

  if (shouldGenerate) {
    generateProtocolDraft();
  } else {
    renderProtocolPlaceholder(config);
  }
}

function toggleProtocolFields(workflowType) {
  protocolDynamicFields.forEach((fieldWrapper) => {
    const fieldName = fieldWrapper.dataset.protocolField;
    const shouldShow =
      workflowType === "realtime"
        ? ["overlayMode", "latencyTarget"].includes(fieldName)
        : fieldName === "savedWorkflow";

    fieldWrapper.classList.toggle("field-hidden", !shouldShow);
    fieldWrapper.toggleAttribute("hidden", !shouldShow);
    fieldWrapper.setAttribute("aria-hidden", String(!shouldShow));
    fieldWrapper.style.display = shouldShow ? "" : "none";
    fieldWrapper.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !shouldShow;
    });
  });
}

function updateProtocolPlannerMeta(config) {
  if (protocolModeBanner) {
    protocolModeBanner.textContent = config.banner;
  }

  if (protocolHelp) {
    protocolHelp.textContent = config.help;
  }

  if (protocolCapabilityTitle) {
    protocolCapabilityTitle.textContent = config.label;
  }

  if (protocolCapabilityDescription) {
    protocolCapabilityDescription.textContent = config.description;
  }

  if (protocolSummaryWorkflow) {
    protocolSummaryWorkflow.textContent = config.workflowSummary;
  }

  if (protocolSummaryEndpoint) {
    protocolSummaryEndpoint.textContent = config.endpointSummary;
  }

  if (protocolSummaryDesign) {
    protocolSummaryDesign.textContent = config.designSummary;
  }

  if (protocolTimingNotes) {
    protocolTimingNotes.innerHTML = config.timingNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("");
  }
}

function renderProtocolPlaceholder(config = protocolCapabilityConfigs[activeProtocolCapability]) {
  if (!protocolOutput || !config) {
    return;
  }

  hasGeneratedProtocolDraft = false;
  protocolOutput.classList.remove("is-generated");
  protocolOutput.classList.add("is-placeholder");
  protocolOutput.innerHTML = `
    <div class="protocol-output-header">
      <div>
        <p class="section-kicker">Protocol Draft</p>
        <h2>${escapeHtml(config.label)} 프로토콜 초안 준비</h2>
        <p class="result-meta">입력값을 조정한 뒤 '프로토콜 초안 생성' 버튼을 누르면 초음파 임상시험용 구조화된 초안을 아래에 생성합니다.</p>
      </div>
      <div class="protocol-tag-row">
        <span class="protocol-tag">${escapeHtml(config.workflowType === "realtime" ? "Real-time AI" : "Stored-image AI")}</span>
        <span class="protocol-tag">${escapeHtml(config.designSummary)}</span>
      </div>
    </div>

    <div class="protocol-placeholder">
      <p class="protocol-placeholder-title">생성 전 안내</p>
      <ul class="protocol-section-list">
        <li>AI 기능 유형과 intended use를 먼저 고정하세요.</li>
        <li>저장형인지 실시간형인지에 따라 workflow와 endpoint가 달라집니다.</li>
        <li>초안 생성 후 아래 결과 영역으로 자동 이동합니다.</li>
      </ul>
    </div>
  `;
}

function generateProtocolDraft(options = {}) {
  if (!protocolOutput || !protocolForm) {
    return;
  }

  const context = buildProtocolContext();
  if (!context) {
    return;
  }

  const protocolPackage = buildProtocolPackage(context);

  hasGeneratedProtocolDraft = true;
  lastGeneratedProtocolPackage = protocolPackage;
  saveProtocolPackage(protocolPackage);
  protocolOutput.classList.remove("is-placeholder");
  protocolOutput.classList.add("is-generated");
  protocolOutput.innerHTML = renderProtocolDraft(context, protocolPackage);

  if (options.announce && protocolHelp) {
    protocolHelp.textContent = `${context.config.help} 아래에 ${context.config.label} 프로토콜 초안을 생성했습니다.`;
  }

  if (options.showFeedback) {
    showProtocolGenerateFeedback();
  }

  if (options.scrollToOutput) {
    scrollToElement(protocolOutput, "start");
  }
}

function showProtocolGenerateFeedback() {
  if (!protocolGenerateButton) {
    return;
  }

  clearTimeout(protocolGenerateFeedbackTimer);
  protocolGenerateButton.textContent = "초안 생성 완료";
  protocolGenerateButton.classList.add("is-success");

  protocolGenerateFeedbackTimer = window.setTimeout(() => {
    if (!protocolGenerateButton) {
      return;
    }
    protocolGenerateButton.textContent = "프로토콜 초안 생성";
    protocolGenerateButton.classList.remove("is-success");
  }, 1400);
}

function buildProtocolContext() {
  if (!protocolForm) {
    return null;
  }

  const config = protocolCapabilityConfigs[activeProtocolCapability];
  if (!config) {
    return null;
  }

  const inputs = serializeForm(protocolForm);
  return {
    config,
    inputs,
    studyDesignLabel: getSelectValueLabel(protocolForm, "studyDesign"),
    comparatorLabel: getSelectValueLabel(protocolForm, "comparator"),
    hypothesisLabel: getSelectValueLabel(protocolForm, "hypothesis"),
    dataCollectionPlanLabel: getSelectValueLabel(protocolForm, "dataCollectionPlan"),
    validationDatasetPlanLabel: getSelectValueLabel(protocolForm, "validationDatasetPlan"),
    analysisPopulationLabel: getSelectValueLabel(protocolForm, "analysisPopulation"),
    humanFactorsPlanLabel: getSelectValueLabel(protocolForm, "humanFactorsPlan"),
    monitoringPlanLabel: getSelectValueLabel(protocolForm, "monitoringPlan"),
    changeControlPlanLabel: getSelectValueLabel(protocolForm, "changeControlPlan"),
    savedWorkflowLabel: getSelectValueLabel(protocolForm, "savedWorkflow"),
    overlayModeLabel: getSelectValueLabel(protocolForm, "overlayMode"),
  };
}

function applyProtocolPreset(presetKey) {
  if (!protocolForm) {
    return "";
  }

  const config = protocolCapabilityConfigs[activeProtocolCapability];
  if (!config) {
    return "";
  }

  const nextValues = {
    ...getProtocolConfigDefaults(config),
  };

  if (presetKey === "highAssurance") {
    const configDefaults = getProtocolConfigDefaults(config);
    nextValues.sites = Number(configDefaults.sites || 1) + 2;
    nextValues.readers = Number(configDefaults.readers || 1) + 2;
    nextValues.comparator = "expert-consensus";
    nextValues.validationDatasetPlan = "external-site-sequestered";
    nextValues.analysisPopulation = "both-primary-itt";
    nextValues.humanFactorsPlan =
      config.workflowType === "realtime" ? "human-factors-validation" : "usability-evaluation";
    nextValues.monitoringPlan =
      config.workflowType === "realtime" ? "site-drift-dashboard" : "quarterly-review";

    if (config.workflowType === "realtime") {
      nextValues.latencyTarget = Math.max(80, Number(configDefaults.latencyTarget || 150) - 40);
      nextValues.changeControlPlan = "pccp-performance";
    } else {
      nextValues.changeControlPlan = "locked-model";
    }
  }

  setFormValues(protocolForm, nextValues);
  toggleProtocolFields(config.workflowType);
  if (hasGeneratedProtocolDraft) {
    generateProtocolDraft();
  } else {
    renderProtocolPlaceholder(config);
  }
  return config.label;
}

function buildProtocolExampleValues(config) {
  const defaults = getProtocolConfigDefaults(config);
  const indication = defaults.indication || "초음파 판독 보조";
  const intendedUse = defaults.intendedUse || `${config.label} AI intended use`;
  const population = defaults.population || "의도된 사용 환경의 초음파 대상자";
  const primaryEndpoint = defaults.primaryEndpoint || config.endpointSummary || "primary performance endpoint";
  const referenceStandard = defaults.referenceStandard || "blinded expert consensus truth set";
  const isRealtime = config.workflowType === "realtime";
  const studyDesign = isRealtime ? "pragmatic-workflow" : "prospective-diagnostic-accuracy";
  const sites = Math.max(Number(defaults.sites || 5), isRealtime ? 6 : 5);
  const readers = Math.max(Number(defaults.readers || 3), isRealtime ? 3 : 4);
  const subgroupFocus = defaults.subgroupFocus || protocolCommonDefaults.subgroupFocus;

  return {
    ...defaults,
    studyDesign,
    sites,
    readers,
    researchQuestion: `Among patients undergoing ultrasound for ${indication}, does the ${config.label} AI provide clinically acceptable performance for ${intendedUse} compared with the prespecified comparator in the intended use setting?`,
    backgroundRationale: `${indication} remains vulnerable to inter-operator variation, device heterogeneity, and inconsistent interpretation. This example protocol assumes a multicenter validation study intended to show that the ${config.label} function improves consistency or maintains acceptable performance within the labeled workflow.`,
    specificAims: `Aim 1: Estimate ${primaryEndpoint} against the prespecified comparator and reference standard.\nAim 2: Assess performance across sex, age, disease severity, site, device, preset, and operator-experience subgroups.\nAim 3: Document workflow fit, usability, and known operational limitations for the ${config.label} workflow.`,
    accessiblePopulation: `Consecutive eligible patients presenting to ${sites} participating ultrasound sites for examinations matching the intended use of ${config.label}.`,
    inclusionCriteria: `Patients receiving the protocol-defined ultrasound examination for ${indication}.\nProtocol-acceptable acquisition quality and required clinical metadata available.\nReference-standard determination feasible within the planned study window.`,
    exclusionCriteria: `Cases outside the intended use population.\nTechnically uninterpretable or corrupted image acquisitions.\nReference-standard determination unavailable or permanently indeterminate after adjudication.`,
    samplingPlan: `Use prospective consecutive enrollment with monitoring quotas for site, device, operator experience, and disease-spectrum coverage. Preserve representativeness first and use enrichment only when it is prespecified and justified in the SAP.`,
    recruitmentPlan: `Maintain a screening log for approached, eligible, enrolled, and analyzable cases. Record refusal, withdrawal, and non-analyzability reasons and review weekly during start-up and monthly thereafter.`,
    followUpPlan: `Index ultrasound visit followed by completion of the reference standard, blinded review, adjudication, and database lock before primary analysis. ${isRealtime ? "Capture workflow observations during the live scan session." : "Capture stored-image selection metadata at the time of post-scan review."}`,
    predictorVariables: `Primary AI output for ${config.label}, confidence or score output, device and preset metadata, operator experience, image-quality markers, and baseline clinical characteristics relevant to ${indication}.`,
    confoundingVariables: `Disease prevalence, case-mix imbalance, site workflow, probe type, device generation, operator skill, prior testing, and the timing or quality of the reference standard.`,
    outcomeVariables: `${primaryEndpoint}; subgroup performance for ${subgroupFocus}; ${isRealtime ? "latency, workflow completion, and user override behavior" : "saved-image selection consistency and post-scan review behavior"}; protocol deviations affecting analyzability.`,
    blindingPlan: `Use blinded independent review and prespecified adjudication. Readers defining the reference standard should not see validation-phase AI outputs whenever feasible, and equivocal or discordant cases should follow a locked adjudication rule.`,
    dataManagementPlan: `Define a study data dictionary, role-based access, audit trail, query management, deviation coding, version control, and database-lock procedures before first enrollment. Freeze the validation dataset before final analysis.`,
    qualityControlPlan: `Run site initiation training, acquisition audits, reader calibration, central monitoring, and periodic review of protocol deviations, image-quality failures, and subgroup balance. Escalate corrective actions when drift is detected.`,
    limitationsPlan: `This example protocol assumes realistic variation in site workflow, disease prevalence, and image quality. Sensitivity analyses should address non-analyzable cases, uncertain truth, subgroup instability, and any gap between the target and accessible populations.`,
    ethicsPlan: `Obtain ethics or IRB approval before enrollment, document consent or waiver logic, protect privacy, track adverse events and incidental findings, and define escalation pathways for clinically significant unexpected observations.`,
    subgroupFocus,
    acceptanceCriteria: `The lower confidence bound for the primary endpoint must meet the prespecified threshold, with no clinically unacceptable degradation across key subgroups (${subgroupFocus}).`,
    savedWorkflow: isRealtime ? defaults.savedWorkflow : defaults.savedWorkflow || "representative-image",
    overlayMode: isRealtime ? defaults.overlayMode || "bounding-box" : defaults.overlayMode,
    latencyTarget: isRealtime ? Number(defaults.latencyTarget || 150) : defaults.latencyTarget,
  };
}

function applyProtocolExamplePreset() {
  if (!protocolForm) {
    return "";
  }

  const config = protocolCapabilityConfigs[activeProtocolCapability];
  if (!config) {
    return "";
  }

  setFormValues(protocolForm, buildProtocolExampleValues(config));
  toggleProtocolFields(config.workflowType);
  updateProtocolPlannerMeta(config);
  generateProtocolDraft({
    scrollToOutput: true,
    showFeedback: true,
  });

  if (protocolHelp) {
    protocolHelp.textContent = `${config.label} capability에 맞는 예시 프로토콜 입력값을 적용하고 초안을 다시 생성했습니다.`;
  }

  return config.label;
}

function resetProtocolPlannerState() {
  if (!protocolForm) {
    return "";
  }

  const config = protocolCapabilityConfigs[activeProtocolCapability];
  if (!config) {
    return "";
  }

  lastGeneratedProtocolPackage = null;
  clearStoredProtocolPackage();
  setFormValues(protocolForm, getProtocolConfigDefaults(config));
  toggleProtocolFields(config.workflowType);
  updateProtocolPlannerMeta(config);
  renderProtocolPlaceholder(config);

  if (protocolHelp) {
    protocolHelp.textContent = `${config.label} capability의 기본 입력 상태로 복원했습니다.`;
  }

  return config.label;
}

function renderProtocolDraft(context, protocolPackage = buildProtocolPackage(context)) {
  const {
    config,
    inputs,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
    savedWorkflowLabel,
    overlayModeLabel,
  } = context;
  const siteText = `${formatCount(inputs.sites)}개 기관`;
  const readerText = `${formatCount(inputs.readers)}명 전문가 판독`;
  const workflowSpecificText =
    config.workflowType === "realtime"
      ? `AI는 live scanning 중 ${escapeHtml(overlayModeLabel)} 형태로 결과를 표시하고, 반응 기준은 ${escapeHtml(
          String(inputs.latencyTarget)
        )}ms 이하로 관리합니다.`
      : `AI 실행 시점은 "${escapeHtml(savedWorkflowLabel)}"로 정의하며, 사용자가 저장한 이미지 또는 cine loop에 대해서만 분석합니다.`;

  const synopsis = `본 시험은 ${escapeHtml(inputs.indication)}를 위한 ${escapeHtml(
    config.label
  )} AI 기능을 평가하기 위한 전향적 다기관 초음파 clinical trial로 계획한다. Intended use는 ${escapeHtml(
    inputs.intendedUse
  )}이며, 주요 비교 기준은 ${escapeHtml(comparatorLabel)}이고 주가설은 ${escapeHtml(
    hypothesisLabel
  )}이다. 대상 환자군은 ${escapeHtml(inputs.population)}로 정의하며, ${escapeHtml(
    inputs.primaryEndpoint
  )}를 주요 평가변수로 설정한다.`;

  const designBullets = [
    `${escapeHtml(config.designSummary)} 구조를 기본 설계로 사용하고, 최소 ${escapeHtml(siteText)}에서 자료를 수집합니다.`,
    `기관 간 장비, probe, preset 차이를 반영할 수 있도록 site-stratified enrollment 및 quality control plan을 둡니다.`,
    `${escapeHtml(readerText)} 체계를 두고 blinded independent review 또는 adjudication workflow를 운영합니다.`,
    `Comparator는 ${escapeHtml(comparatorLabel)} 기준으로 정의하고, reference standard는 ${escapeHtml(
      inputs.referenceStandard
    )}로 고정합니다.`,
  ];

  const workflowBullets = [
    workflowSpecificText,
    ...config.workflowBullets,
    config.workflowType === "realtime"
      ? "실시간 모드에서는 AI on/off 상태, user override, key capture 시점을 모두 로그로 남기도록 합니다."
      : "저장형 모드에서는 어떤 사용자가 어떤 규칙으로 저장했는지 audit trail을 남기도록 합니다.",
  ];

  const endpointBullets = [
    `Primary endpoint는 ${escapeHtml(inputs.primaryEndpoint)} 중심으로 정의합니다.`,
    ...config.endpointBullets,
    config.workflowType === "realtime"
      ? "실시간 기능은 latency, task completion time, user interaction metrics를 key secondary endpoint로 추가하는 것이 바람직합니다."
      : "저장형 기능은 저장 시점 bias와 image selection bias를 탐색하는 sensitivity analysis를 포함하는 것이 좋습니다.",
  ];

  const populationBullets = [
    `주 대상자는 ${escapeHtml(inputs.population)}이며, inclusion/exclusion 기준은 적응증과 표준 진료 흐름에 맞춰 세부화합니다.`,
    "기관별 검사자 숙련도와 장비 종류를 기록해 operator- and device-level subgroup analysis를 가능하게 합니다.",
    "질환 prevalence 또는 구조 난이도에 따라 screening log와 enrolled cohort의 차이를 별도로 모니터링합니다.",
  ];

  const ultrasoundBullets = [...config.ultrasoundBullets];
  const safetyBullets = [...config.safetyBullets];
  const dataValidationBullets = [
    `Data collection will follow ${dataCollectionPlanLabel}.`,
    `Performance validation will use ${validationDatasetPlanLabel}.`,
    `The primary analysis population will be ${analysisPopulationLabel}.`,
    `Key subgroup analyses will cover ${inputs.subgroupFocus}.`,
    "Validation data will remain independent or sequestered from development and tuning data, and any overlap will require explicit justification before analysis.",
    "Reference standard establishment, blinding, adjudication, uncertainty, and the handling of equivocal or missing cases will be documented before database lock.",
  ];
  const humanFactorsBullets = [
    `Human factors and usability strategy: ${humanFactorsPlanLabel}.`,
    config.workflowType === "realtime"
      ? "The usability package should evaluate whether users correctly interpret overlays, confidence states, latency behavior, and fallback conditions during active scanning."
      : "The usability package should evaluate image selection, post-scan review behavior, confidence communication, and any risk of overreliance on stored-image outputs.",
    "Labeling should disclose known limitations, subgroup performance caveats, compatible acquisition conditions, and user responsibilities for final clinical decision-making.",
    "Version-specific behavior and any clinically meaningful differences from prior validated versions should be transparent to users and reviewers.",
  ];
  const changeControlSpecificNote =
    inputs.changeControlPlan === "locked-model"
      ? "The current plan assumes a locked model, and modifications that materially affect safety, effectiveness, intended use, population, or compatible inputs should be routed through a new submission strategy."
      : inputs.changeControlPlan === "pccp-performance"
        ? "A bounded PCCP strategy should pre-specify which performance improvements are allowed, how updated data are collected, and what acceptance criteria must be met before release."
        : inputs.changeControlPlan === "pccp-input-compatibility"
          ? "A bounded PCCP strategy should define the compatible new devices, presets, or acquisition inputs and require validation on representative holdout data before deployment."
          : "A bounded PCCP strategy should define the limits of any population expansion, the subgroup evidence required, and the criteria for when a new submission becomes necessary.";
  const monitoringBullets = [
    `Device performance monitoring plan: ${monitoringPlanLabel}.`,
    `Change control strategy: ${changeControlPlanLabel}.`,
    "Monitoring should track adverse events, subgroup drift, site-specific degradation, and any meaningful change in device performance after deployment or update.",
    changeControlSpecificNote,
  ];
  const statBullets = [
    ...config.statBullets,
    `Acceptance criteria will be pre-specified as follows: ${inputs.acceptanceCriteria}.`,
    `All primary performance estimates should be reported with confidence intervals and subgroup breakdowns across ${inputs.subgroupFocus}.`,
    "Sample-size justification should address repeated measurements or clustering, missing data and outliers, and variability in the clinical reference standard when reader interpretation is used.",
    "샘플수 산정은 별도 performance planning page 또는 SAP에서 endpoint 특성에 맞춰 계산합니다.",
  ];

  return `
    <div class="protocol-output-header">
      <div>
        <p class="section-kicker">Protocol Draft</p>
        <h2>${escapeHtml(config.label)} 초음파 임상시험 프로토콜 초안</h2>
        <p class="result-meta">${escapeHtml(synopsis)}</p>
      </div>
      <div class="protocol-tag-row">
        <span class="protocol-tag">${escapeHtml(config.workflowType === "realtime" ? "Real-time AI" : "Stored-image AI")}</span>
        <span class="protocol-tag">${escapeHtml(hypothesisLabel)}</span>
        <span class="protocol-tag">${escapeHtml(siteText)}</span>
        <span class="protocol-tag">${escapeHtml(readerText)}</span>
      </div>
    </div>

    <div class="protocol-output-grid">
      <article class="protocol-output-section is-wide">
        <h3>1. Study Synopsis</h3>
        <p>${escapeHtml(synopsis)}</p>
      </article>

      <article class="protocol-output-section">
        <h3>2. Study Design</h3>
        <ul class="protocol-section-list">${designBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>3. Clinical Workflow</h3>
        <ul class="protocol-section-list">${workflowBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>4. Population And Eligibility</h3>
        <ul class="protocol-section-list">${populationBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>5. Endpoints And Hypothesis</h3>
        <ul class="protocol-section-list">${endpointBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>6. Ultrasound-Specific Operations</h3>
        <ul class="protocol-section-list">${ultrasoundBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>7. Safety And Human Factors</h3>
        <ul class="protocol-section-list">${safetyBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>8. Statistical And Operational Notes</h3>
        <ul class="protocol-section-list">${statBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>9. Data Management And Validation Controls</h3>
        <ul class="protocol-section-list">${dataValidationBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>10. Human Factors, Labeling, And Transparency</h3>
        <ul class="protocol-section-list">${humanFactorsBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>11. Monitoring And Change Control</h3>
        <ul class="protocol-section-list">${monitoringBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>12. Study Flowchart</h3>
        ${renderProtocolFlowchart(protocolPackage.flowchartSteps, protocolPackage.workflowType)}
      </article>
    </div>
  `;
}

function initializeChecklistPage() {
  if (!protocolChecklistView) {
    return;
  }

  checklistCopyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!activeChecklistPackage) {
        return;
      }

      try {
        await copyTextToClipboard(buildChecklistCopyText(activeChecklistPackage));
      } catch (error) {
        // Keep the current page state when clipboard access is blocked.
      }
    });
  });

  checklistResetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!activeChecklistPackage) {
        return;
      }

      saveChecklistProgress(activeChecklistPackage.signature, {});
      renderChecklistPage(activeChecklistPackage);
    });
  });

  const storedPackage = loadProtocolPackage();
  if (!storedPackage) {
    renderChecklistEmptyState();
    return;
  }

  activeChecklistPackage = storedPackage;
  renderChecklistPage(storedPackage);
}

function openProtocolChecklistPage() {
  if (!protocolForm) {
    return;
  }

  if (!hasGeneratedProtocolDraft) {
    generateProtocolDraft({
      showFeedback: true,
    });
  }

  const context = buildProtocolContext();
  if (!context) {
    return;
  }

  const protocolPackage = lastGeneratedProtocolPackage || buildProtocolPackage(context);
  lastGeneratedProtocolPackage = protocolPackage;

  if (!saveProtocolPackage(protocolPackage)) {
    if (protocolHelp) {
      protocolHelp.textContent = `${context.config.help} Checklist page could not be opened because local browser storage is unavailable.`;
    }
    return;
  }

  window.location.href = "/protocol-checklist";
}

function buildProtocolPackage(context) {
  const {
    config,
    inputs,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
    savedWorkflowLabel,
    overlayModeLabel,
  } = context;
  const siteCount = Math.max(Number(inputs.sites) || 0, 0);
  const readerCount = Math.max(Number(inputs.readers) || 0, 0);
  const siteText = `${formatCount(siteCount)} ${siteCount === 1 ? "site" : "sites"}`;
  const readerText = `${formatCount(readerCount)} expert ${readerCount === 1 ? "reader" : "readers"}`;
  const workflowLabel = config.workflowType === "realtime" ? "Real-time AI" : "Stored-image AI";
  const workflowExecution =
    config.workflowType === "realtime"
      ? `Run ${config.label} during live scanning as a ${overlayModeLabel || "visual overlay"} workflow and keep response time within ${formatDisplayNumber(Number(inputs.latencyTarget) || 0, 0)} ms.`
      : `Run ${config.label} only after the operator stores the representative image or cine loop using the "${savedWorkflowLabel || "saved image"}" trigger.`;
  const synopsis = normalizeWhitespace(
    `${config.label} ultrasound clinical trial for ${inputs.indication}. Intended use: ${inputs.intendedUse}. Target population: ${inputs.population}. Primary endpoint focus: ${inputs.primaryEndpoint}.`
  );
  const signature = buildProtocolSignature(context);
  const flowchartSteps = buildProtocolFlowchartSteps(context, {
    siteText,
    readerText,
    workflowExecution,
  });
  const checklistSections = buildProtocolChecklistSections(context, {
    siteText,
    readerText,
    workflowExecution,
    signature,
  });

  return {
    version: 1,
    signature,
    generatedAt: new Date().toISOString(),
    capabilityId: activeProtocolCapability,
    label: config.label,
    capabilityDescription: config.description,
    workflowType: config.workflowType,
    workflowLabel,
    designSummary: config.designSummary,
    endpointSummary: config.endpointSummary,
    inputs: { ...inputs },
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
    savedWorkflowLabel,
    overlayModeLabel,
    siteText,
    readerText,
    workflowExecution,
    synopsis,
    flowchartSteps,
    checklistSections,
  };
}

function buildProtocolSignature(context) {
  const { inputs } = context;

  return [
    activeProtocolCapability,
    normalizeWhitespace(inputs.indication || ""),
    normalizeWhitespace(inputs.intendedUse || ""),
    normalizeWhitespace(inputs.population || ""),
    normalizeWhitespace(inputs.primaryEndpoint || ""),
  ]
    .join("|")
    .toLowerCase();
}

function buildProtocolFlowchartSteps(context, summary = {}) {
  const { config, inputs, comparatorLabel, hypothesisLabel } = context;
  const baseSteps = [
    {
      title: "Protocol freeze",
      detail: `Lock indication, intended use, comparator (${comparatorLabel}), and hypothesis (${hypothesisLabel}).`,
    },
    {
      title: "Site start-up",
      detail: `Qualify ${summary.siteText || "sites"}, train operators and ${summary.readerText || "readers"}, and align device logging.`,
    },
    {
      title: "Screen and enroll",
      detail: `Enroll the intended-use population (${inputs.population}) with a screening log and eligibility checks.`,
    },
    {
      title: config.workflowType === "realtime" ? "Live scan with AI" : "Scan, save, then run AI",
      detail: summary.workflowExecution || "Execute the AI workflow exactly as described in the generated protocol draft.",
    },
    {
      title: "Reference standard review",
      detail: `Assemble ${inputs.referenceStandard} and complete blinded review or adjudication before database lock.`,
    },
    {
      title: "Endpoint package and close-out",
      detail: `Finalize ${inputs.primaryEndpoint}, resolve deviations, complete the SAP handoff, and prepare the study report.`,
    },
    {
      title: "Monitor and govern changes",
      detail: `Run ${context.monitoringPlanLabel} and follow ${context.changeControlPlanLabel} for post-validation monitoring, versioning, and future model updates.`,
    },
  ];

  return baseSteps.map((step, index) => ({
    id: `${activeProtocolCapability}-flow-${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
    ...step,
  }));
}

function buildProtocolChecklistSections(context, summary = {}) {
  const {
    config,
    inputs,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
  } = context;
  const makeItems = (sectionKey, items) =>
    items.map((item, index) => ({
      id: `${summary.signature}:${sectionKey}:${index + 1}`,
      ...item,
    }));

  return [
    {
      key: "startup",
      title: "Study start-up and governance",
      description: "Freeze the clinical question and governance package before sites begin enrollment.",
      items: makeItems("startup", [
        {
          title: "Confirm the study indication and intended use",
          note: `Current draft: ${inputs.indication} / ${inputs.intendedUse}.`,
        },
        {
          title: "Lock comparator, hypothesis, and reference standard",
          note: `Comparator: ${comparatorLabel}. Hypothesis: ${hypothesisLabel}. Reference standard: ${inputs.referenceStandard}.`,
        },
        {
          title: "Approve the final site and reader footprint",
          note: `Current plan: ${summary.siteText || "sites"} and ${summary.readerText || "readers"}.`,
        },
      ]),
    },
    {
      key: "validation-controls",
      title: "Validation data and reference-standard controls",
      description: "Protect dataset independence and document how truth and subgroup coverage are controlled.",
      items: makeItems("validation-controls", [
        {
          title: "Lock the data collection and validation-set strategy",
          note: `Current plan: ${dataCollectionPlanLabel} with ${validationDatasetPlanLabel}.`,
        },
        {
          title: "Keep the validation dataset independent or sequestered from development data",
          note: "Any overlap between training, tuning, and validation use should be justified before final analysis.",
        },
        {
          title: "Document subgroup coverage, reference standard uncertainty, and missing/equivocal-case handling",
          note: `Primary analysis population: ${analysisPopulationLabel}. Key subgroup plan: ${inputs.subgroupFocus}.`,
        },
      ]),
    },
    {
      key: "readiness",
      title: "Site readiness and training",
      description: "Prepare operators, readers, and the data capture workflow before the first subject is enrolled.",
      items: makeItems("readiness", [
        {
          title: "Train sonographers and investigators on the acquisition workflow",
          note: config.workflowType === "realtime" ? "Training must include live scan behavior, overlay review, and user override handling." : "Training must include saved-image trigger rules and representative image selection rules.",
        },
        {
          title: "Train blinded readers and adjudicators",
          note: "Keep reader instructions, blinding rules, and adjudication criteria version-controlled.",
        },
        {
          title: "Verify probe, preset, device, and operator logging",
          note: "The checklist should capture device-level and operator-level metadata for subgroup and quality reviews.",
        },
      ]),
    },
    {
      key: "enrollment",
      title: "Screening and enrollment",
      description: "Keep the enrolled cohort aligned with the intended-use population and document exclusions consistently.",
      items: makeItems("enrollment", [
        {
          title: "Apply inclusion and exclusion criteria consistently",
          note: `Target population in the current draft: ${inputs.population}.`,
        },
        {
          title: "Maintain a screening log with exclusion reasons",
          note: "Track the gap between screened, eligible, enrolled, and analyzable subjects.",
        },
        {
          title: "Monitor prevalence and cohort balance across sites",
          note: "Use site-level tracking so enrollment does not drift away from the intended use case mix.",
        },
      ]),
    },
    {
      key: "execution",
      title: "Acquisition and AI execution",
      description: "Execute the ultrasound scan and the AI workflow exactly as written in the draft protocol.",
      items: makeItems("execution", [
        {
          title: "Perform the ultrasound scan according to the protocol-defined acquisition rules",
          note: "Record any device, preset, or operator deviations that could affect endpoint quality.",
        },
        {
          title: config.workflowType === "realtime" ? "Run AI during live scanning and capture on-screen behavior" : "Save the representative image or cine loop before AI analysis",
          note: summary.workflowExecution,
        },
        {
          title: config.workflowType === "realtime" ? "Log AI on/off state, overrides, and latency-related events" : "Maintain an audit trail of who saved the image, when it was saved, and why it was selected",
          note: config.workflowType === "realtime" ? `Use the target latency threshold of ${formatDisplayNumber(Number(inputs.latencyTarget) || 0, 0)} ms for operational review.` : `Stored-image workflow selected: ${context.savedWorkflowLabel || "saved image review"}.`,
        },
      ]),
    },
    {
      key: "review",
      title: "Reference standard and endpoint assembly",
      description: "Assemble the read package, finalize truth, and make the endpoint dataset analysis-ready.",
      items: makeItems("review", [
        {
          title: "Complete blinded review and adjudication",
          note: "Resolve disagreements using the pre-specified adjudication workflow before analysis lock.",
        },
        {
          title: "Assemble the endpoint package",
          note: `Primary endpoint focus: ${inputs.primaryEndpoint}.`,
        },
        {
          title: "Review missing data, protocol deviations, and image quality exceptions",
          note: "Document which cases remain analyzable for the primary and secondary endpoint sets.",
        },
      ]),
    },
    {
      key: "monitoring",
      title: "Monitoring, labeling, and change control",
      description: "Carry the study into a lifecycle-ready operating model with transparent communication and bounded updates.",
      items: makeItems("monitoring", [
        {
          title: "Prepare usability and labeling evidence",
          note: `Current plan: ${humanFactorsPlanLabel}. Labeling should describe workflow limitations, compatible inputs, and subgroup caveats.`,
        },
        {
          title: "Prepare the performance monitoring plan",
          note: `Current plan: ${monitoringPlanLabel}. Monitoring should cover subgroup drift, site-specific degradation, and post-release safety issues.`,
        },
        {
          title: "Document the bounded change-control strategy",
          note: `Current plan: ${changeControlPlanLabel}. Ensure future performance or compatibility changes stay within the documented update path.`,
        },
      ]),
    },
    {
      key: "closeout",
      title: "Safety, human factors, and close-out",
      description: "Close the operational loop before statistical analysis and final reporting.",
      items: makeItems("closeout", [
        {
          title: "Review safety and usability observations",
          note: config.workflowType === "realtime" ? "Include display behavior, user interpretation, and any workflow interruptions caused by live AI output." : "Include issues related to image selection, delayed analysis, and post-scan review usability.",
        },
        {
          title: "Lock the analysis dataset and hand off to statistics",
          note: `Keep the SAP aligned with the ${config.designSummary.toLowerCase()} plan.`,
        },
        {
          title: "Archive the audit trail and reporting package",
          note: "Preserve training records, deviations, adjudication outputs, and the final report inputs together.",
        },
      ]),
    },
  ];
}

function renderProtocolDraft(context, protocolPackage = buildProtocolPackage(context)) {
  const {
    config,
    inputs,
    studyDesignLabel,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
    savedWorkflowLabel,
    overlayModeLabel,
  } = context;
  const siteText = `${formatCount(inputs.sites)} ${Number(inputs.sites) === 1 ? "site" : "sites"}`;
  const readerText = `${formatCount(inputs.readers)} expert ${Number(inputs.readers) === 1 ? "reader" : "readers"}`;
  const workflowSpecificText =
    config.workflowType === "realtime"
      ? `Run the AI during live scanning using ${overlayModeLabel} and keep the operational response time at or below ${formatDisplayNumber(Number(inputs.latencyTarget) || 0, 0)} ms.`
      : `Run the AI only after the operator saves the representative image or cine loop using the "${savedWorkflowLabel}" trigger.`;

  const specificAims = splitProtocolField(inputs.specificAims);
  const inclusionCriteria = splitProtocolField(inputs.inclusionCriteria);
  const exclusionCriteria = splitProtocolField(inputs.exclusionCriteria);
  const synopsis = normalizeWhitespace(
    `${config.label} ultrasound clinical trial for ${inputs.indication}. Research question: ${inputs.researchQuestion}. Intended use: ${inputs.intendedUse}. Primary endpoint focus: ${inputs.primaryEndpoint}.`
  );

  const questionBullets = [
    `Research question: ${inputs.researchQuestion}`,
    `Study design: ${studyDesignLabel}. Intended use: ${inputs.intendedUse}.`,
    `Target population: ${inputs.population}. Accessible population: ${inputs.accessiblePopulation}.`,
    `FINER checkpoint: confirm feasibility for ${siteText} and ${readerText}, novelty versus current workflow, ethical acceptability, and clinical relevance before protocol freeze.`,
    ...specificAims.map((aim, index) => `Specific aim ${index + 1}: ${aim}`),
  ];
  const backgroundBullets = [
    inputs.backgroundRationale,
    `The significance section should explain why ${config.label} matters for ${inputs.indication}, what gap remains after prior evidence, and how the proposed study will change clinical or operational decision-making.`,
    "Because this is an ultrasound AI study, the rationale should address operator dependence, device and preset variation, and the disease spectrum expected across participating sites.",
  ];
  const designBullets = [
    `${config.designSummary} using a ${studyDesignLabel} framework.`,
    `Comparator: ${comparatorLabel}. Primary hypothesis: ${hypothesisLabel}. Reference standard: ${inputs.referenceStandard}.`,
    `Planned footprint: ${siteText} and ${readerText}, with site, operator, device, and preset metadata captured for heterogeneity assessment.`,
    `Data capture will follow ${dataCollectionPlanLabel}, and the primary analysis population will be ${analysisPopulationLabel}.`,
  ];
  const subjectsBullets = [
    `Target population: ${inputs.population}. Accessible population: ${inputs.accessiblePopulation}.`,
    ...inclusionCriteria.map((item) => `Inclusion criterion: ${item}`),
    ...exclusionCriteria.map((item) => `Exclusion criterion: ${item}`),
    `Sampling plan: ${inputs.samplingPlan}`,
    `Recruitment and retention plan: ${inputs.recruitmentPlan}`,
    `Visit or follow-up schedule: ${inputs.followUpPlan}`,
  ];
  const measurementBullets = [
    `Predictor variables: ${inputs.predictorVariables}`,
    `Potential confounding variables: ${inputs.confoundingVariables}`,
    `Outcome variables: ${inputs.outcomeVariables}`,
    `Primary endpoint focus: ${inputs.primaryEndpoint}`,
    `Blinding and adjudication plan: ${inputs.blindingPlan}`,
    "Measurements should be defined to maximize precision, accuracy, validity, and reproducibility, with pre-specified handling of low-quality, missing, or equivocal images.",
  ];
  const workflowBullets = [
    workflowSpecificText,
    ...config.workflowBullets,
    config.workflowType === "realtime"
      ? "Capture AI on or off state, user override, key-frame logging, and latency excursions as part of the operational audit trail."
      : "Preserve an audit trail of who saved each image, why it was selected, and whether post-scan review changed the interpretation.",
  ];
  const endpointBullets = [
    `Primary endpoint focus: ${inputs.primaryEndpoint}.`,
    ...config.endpointBullets,
    `Prespecified acceptance criteria: ${inputs.acceptanceCriteria}.`,
    `Key subgroup analyses should cover ${inputs.subgroupFocus}.`,
    config.workflowType === "realtime"
      ? "Real-time studies should treat latency, task completion, user interaction, and fallback conditions as key secondary endpoints."
      : "Stored-image studies should predefine sensitivity analyses for image-selection bias and non-analyzable saved-image cases.",
    "Sample-size justification should align the unit of analysis with the endpoint and address clustering, repeated measures, missing data, reader variability, and reference-standard uncertainty.",
    ...config.statBullets,
  ];
  const ultrasoundBullets = [
    "Ultrasound test-method studies should explicitly address spectrum bias, device heterogeneity, and operator dependence.",
    `Reference standard: ${inputs.referenceStandard}.`,
    ...config.ultrasoundBullets,
    "Avoid incorporation bias by separating index AI output from truth determination whenever feasible, and document any unavoidable overlap before analysis.",
  ];
  const dataValidationBullets = [
    `Data collection plan: ${dataCollectionPlanLabel}.`,
    `Validation dataset control: ${validationDatasetPlanLabel}.`,
    `Data management plan: ${inputs.dataManagementPlan}.`,
    `Quality control plan: ${inputs.qualityControlPlan}.`,
    "Keep validation data independent or sequestered from development and tuning datasets, and document any overlap before analysis.",
    "Define the data dictionary, query workflow, audit trail, database lock, and protocol-deviation review process before first subject enrollment.",
  ];
  const humanFactorsBullets = [
    ...config.safetyBullets,
    `Human factors and usability strategy: ${humanFactorsPlanLabel}.`,
    config.workflowType === "realtime"
      ? "The usability package should test whether users correctly interpret overlays, confidence states, latency behavior, and fallback conditions during active scanning."
      : "The usability package should evaluate image selection, post-scan review behavior, confidence communication, and risk of overreliance on stored-image outputs.",
    `Ethics and human-subject protections: ${inputs.ethicsPlan}.`,
    "Labeling should disclose known limitations, compatible acquisition conditions, user responsibilities, and clinically important subgroup caveats.",
  ];
  const changeControlSpecificNote =
    inputs.changeControlPlan === "locked-model"
      ? "The current plan assumes a locked model, and modifications that materially affect safety, effectiveness, intended use, population, or compatible inputs should be routed through a new submission strategy."
      : inputs.changeControlPlan === "pccp-performance"
        ? "A bounded PCCP strategy should pre-specify which performance improvements are allowed, how updated data are collected, and what acceptance criteria must be met before release."
        : inputs.changeControlPlan === "pccp-input-compatibility"
          ? "A bounded PCCP strategy should define the compatible new devices, presets, or acquisition inputs and require validation on representative holdout data before deployment."
          : "A bounded PCCP strategy should define the limits of any population expansion, the subgroup evidence required, and the criteria for when a new submission becomes necessary.";
  const limitationsBullets = [
    `Limitations and alternatives: ${inputs.limitationsPlan}.`,
    "Sensitivity analyses should address non-analyzable cases, missing truth, uncertain adjudication, and performance shifts across sites, devices, and operators.",
    "If recruitment, prevalence, or truth availability diverges from the original assumptions, the protocol should define escalation rules and alternative analytic approaches before unblinding.",
  ];
  const monitoringBullets = [
    `Device performance monitoring plan: ${monitoringPlanLabel}.`,
    `Change control strategy: ${changeControlPlanLabel}.`,
    "Lifecycle monitoring should track adverse events, subgroup drift, site-specific degradation, and any meaningful performance change after deployment or update.",
    changeControlSpecificNote,
  ];

  return `
    <div class="protocol-output-header">
      <div>
        <p class="section-kicker">Protocol Draft</p>
        <h2>${escapeHtml(config.label)} Ultrasound Clinical Trial Protocol Draft</h2>
        <p class="result-meta">${escapeHtml(synopsis)}</p>
      </div>
      <div class="protocol-tag-row">
        <span class="protocol-tag">${escapeHtml(config.workflowType === "realtime" ? "Real-time AI" : "Stored-image AI")}</span>
        <span class="protocol-tag">${escapeHtml(hypothesisLabel)}</span>
        <span class="protocol-tag">${escapeHtml(siteText)}</span>
        <span class="protocol-tag">${escapeHtml(readerText)}</span>
      </div>
    </div>

    <div class="protocol-output-grid">
      <article class="protocol-output-section is-wide">
        <h3>1. Study Synopsis</h3>
        <p>${escapeHtml(synopsis)}</p>
      </article>

      <article class="protocol-output-section">
        <h3>2. Research Question And Specific Aims</h3>
        <ul class="protocol-section-list">${questionBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>3. Background And Significance</h3>
        <ul class="protocol-section-list">${backgroundBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>4. Study Design Overview</h3>
        <ul class="protocol-section-list">${designBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>5. Subjects, Sampling, And Follow-up</h3>
        <ul class="protocol-section-list">${subjectsBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>6. Measurements And Variable Framework</h3>
        <ul class="protocol-section-list">${measurementBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>7. Clinical Workflow</h3>
        <ul class="protocol-section-list">${workflowBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>8. Endpoint, Hypothesis, And Sample-Size Notes</h3>
        <ul class="protocol-section-list">${endpointBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>9. Ultrasound Test-Method Considerations</h3>
        <ul class="protocol-section-list">${ultrasoundBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>10. Data Management And Quality Control</h3>
        <ul class="protocol-section-list">${dataValidationBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>11. Human Factors, Safety, And Ethics</h3>
        <ul class="protocol-section-list">${humanFactorsBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>12. Limitations And Alternative Approaches</h3>
        <ul class="protocol-section-list">${limitationsBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section">
        <h3>13. Monitoring And Change Control</h3>
        <ul class="protocol-section-list">${monitoringBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>

      <article class="protocol-output-section is-wide">
        <h3>14. Study Flowchart</h3>
        ${renderProtocolFlowchart(protocolPackage.flowchartSteps, protocolPackage.workflowType)}
      </article>
    </div>
  `;
}

function buildProtocolPackage(context) {
  const {
    config,
    inputs,
    studyDesignLabel,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
    savedWorkflowLabel,
    overlayModeLabel,
  } = context;
  const siteCount = Math.max(Number(inputs.sites) || 0, 0);
  const readerCount = Math.max(Number(inputs.readers) || 0, 0);
  const siteText = `${formatCount(siteCount)} ${siteCount === 1 ? "site" : "sites"}`;
  const readerText = `${formatCount(readerCount)} expert ${readerCount === 1 ? "reader" : "readers"}`;
  const workflowLabel = config.workflowType === "realtime" ? "Real-time AI" : "Stored-image AI";
  const workflowExecution =
    config.workflowType === "realtime"
      ? `Run ${config.label} during live scanning as a ${overlayModeLabel || "visual overlay"} workflow and keep response time within ${formatDisplayNumber(Number(inputs.latencyTarget) || 0, 0)} ms.`
      : `Run ${config.label} only after the operator stores the representative image or cine loop using the "${savedWorkflowLabel || "saved image"}" trigger.`;
  const synopsis = normalizeWhitespace(
    `${config.label} ultrasound clinical trial for ${inputs.indication}. Research question: ${inputs.researchQuestion}. Intended use: ${inputs.intendedUse}. Study design: ${studyDesignLabel}. Primary endpoint focus: ${inputs.primaryEndpoint}.`
  );
  const signature = buildProtocolSignature(context);
  const flowchartSteps = buildProtocolFlowchartSteps(context, {
    siteText,
    readerText,
    workflowExecution,
  });
  const checklistSections = buildProtocolChecklistSections(context, {
    siteText,
    readerText,
    workflowExecution,
    signature,
  });

  return {
    version: 2,
    signature,
    generatedAt: new Date().toISOString(),
    capabilityId: activeProtocolCapability,
    label: config.label,
    capabilityDescription: config.description,
    workflowType: config.workflowType,
    workflowLabel,
    designSummary: config.designSummary,
    endpointSummary: config.endpointSummary,
    inputs: { ...inputs },
    studyDesignLabel,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
    savedWorkflowLabel,
    overlayModeLabel,
    siteText,
    readerText,
    workflowExecution,
    synopsis,
    flowchartSteps,
    checklistSections,
  };
}

function buildProtocolSignature(context) {
  const { inputs } = context;

  return [
    activeProtocolCapability,
    normalizeWhitespace(inputs.researchQuestion || ""),
    normalizeWhitespace(inputs.indication || ""),
    normalizeWhitespace(inputs.intendedUse || ""),
    normalizeWhitespace(inputs.population || ""),
    normalizeWhitespace(inputs.primaryEndpoint || ""),
  ]
    .join("|")
    .toLowerCase();
}

function buildProtocolFlowchartSteps(context, summary = {}) {
  const { config, inputs, studyDesignLabel, comparatorLabel, hypothesisLabel } = context;
  const baseSteps = [
    {
      title: "Freeze question and aims",
      detail: `Lock the research question, specific aims, study design (${studyDesignLabel}), comparator (${comparatorLabel}), and hypothesis (${hypothesisLabel}).`,
    },
    {
      title: "Start-up and governance",
      detail: `Qualify ${summary.siteText || "sites"}, train operators and ${summary.readerText || "readers"}, finalize data management and quality-control procedures, and secure ethics approval.`,
    },
    {
      title: "Screen and enroll",
      detail: `Enroll the intended-use population (${inputs.population}) using the sampling plan and maintain a screening log for exclusions, refusals, and non-analyzable cases.`,
    },
    {
      title: config.workflowType === "realtime" ? "Live scan with AI" : "Scan, save, then run AI",
      detail: summary.workflowExecution || "Execute the AI workflow exactly as described in the generated protocol draft.",
    },
    {
      title: "Reference standard and blinded review",
      detail: `Assemble ${inputs.referenceStandard}, apply the blinding and adjudication plan, and complete truth determination before database lock.`,
    },
    {
      title: "Clean, lock, and analyze",
      detail: `Resolve data queries, review deviations, lock the database, and analyze ${inputs.primaryEndpoint} in the ${context.analysisPopulationLabel} population.`,
    },
    {
      title: "Interpret limits and report",
      detail: `Report subgroup findings for ${inputs.subgroupFocus}, document limitations, and finalize the clinical study report with confidence intervals and operational findings.`,
    },
    {
      title: "Monitor and govern changes",
      detail: `Run ${context.monitoringPlanLabel} and follow ${context.changeControlPlanLabel} for post-validation monitoring, versioning, and future model updates.`,
    },
  ];

  return baseSteps.map((step, index) => ({
    id: `${activeProtocolCapability}-flow-${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
    ...step,
  }));
}

function buildProtocolChecklistSections(context, summary = {}) {
  const {
    config,
    inputs,
    studyDesignLabel,
    comparatorLabel,
    hypothesisLabel,
    dataCollectionPlanLabel,
    validationDatasetPlanLabel,
    analysisPopulationLabel,
    humanFactorsPlanLabel,
    monitoringPlanLabel,
    changeControlPlanLabel,
  } = context;
  const makeItems = (sectionKey, items) =>
    items.map((item, index) => ({
      id: `${summary.signature}:${sectionKey}:${index + 1}`,
      ...item,
    }));

  return [
    {
      key: "question-aims",
      title: "Research question and aims",
      description: "Freeze the research question, significance, and specific aims before locking operations.",
      items: makeItems("question-aims", [
        {
          title: "Confirm the study question, design, and intended use",
          note: `Question: ${inputs.researchQuestion}. Design: ${studyDesignLabel}. Intended use: ${inputs.intendedUse}.`,
        },
        {
          title: "Run a FINER check before final protocol freeze",
          note: `Verify feasibility for ${summary.siteText || "sites"} and ${summary.readerText || "readers"}, confirm novelty and relevance, and document ethical acceptability.`,
        },
        {
          title: "Lock the specific aims and primary endpoint hierarchy",
          note: `Primary endpoint focus: ${inputs.primaryEndpoint}. Acceptance criteria: ${inputs.acceptanceCriteria}.`,
        },
      ]),
    },
    {
      key: "subjects-sampling",
      title: "Subjects, eligibility, and sampling",
      description: "Keep the intended sample aligned with the target population and document the path from screening to analyzable cases.",
      items: makeItems("subjects-sampling", [
        {
          title: "Confirm target and accessible populations",
          note: `Target population: ${inputs.population}. Accessible population: ${inputs.accessiblePopulation}.`,
        },
        {
          title: "Lock inclusion, exclusion, and sampling rules",
          note: `Sampling plan: ${inputs.samplingPlan}.`,
        },
        {
          title: "Prepare recruitment, retention, and follow-up procedures",
          note: `Recruitment plan: ${inputs.recruitmentPlan}. Follow-up plan: ${inputs.followUpPlan}.`,
        },
      ]),
    },
    {
      key: "measurement-framework",
      title: "Measurements and variable framework",
      description: "Define what will be measured and how the study will protect precision, accuracy, validity, and reproducibility.",
      items: makeItems("measurement-framework", [
        {
          title: "Lock predictor, confounding, and outcome variables",
          note: `Predictors: ${inputs.predictorVariables}. Confounders: ${inputs.confoundingVariables}. Outcomes: ${inputs.outcomeVariables}.`,
        },
        {
          title: "Finalize the blinding and adjudication package",
          note: `Comparator: ${comparatorLabel}. Reference standard: ${inputs.referenceStandard}. Blinding plan: ${inputs.blindingPlan}.`,
        },
        {
          title: "Document how missing, equivocal, and poor-quality cases will be handled",
          note: `Primary analysis population: ${analysisPopulationLabel}. Key subgroup plan: ${inputs.subgroupFocus}.`,
        },
      ]),
    },
    {
      key: "startup-qc",
      title: "Start-up, data management, and quality control",
      description: "Operationalize the study so site-to-site execution remains consistent.",
      items: makeItems("startup-qc", [
        {
          title: "Finalize site initiation and reader training",
          note: `Current plan: ${summary.siteText || "sites"} and ${summary.readerText || "readers"}.`,
        },
        {
          title: "Freeze the data collection and validation-set strategy",
          note: `Collection plan: ${dataCollectionPlanLabel}. Validation plan: ${validationDatasetPlanLabel}.`,
        },
        {
          title: "Approve the data-management and quality-control package",
          note: `Data management: ${inputs.dataManagementPlan}. Quality control: ${inputs.qualityControlPlan}.`,
        },
      ]),
    },
    {
      key: "execution",
      title: "Acquisition and AI execution",
      description: "Perform the scan and AI workflow exactly as written in the draft protocol.",
      items: makeItems("execution", [
        {
          title: "Perform ultrasound acquisition according to protocol",
          note: "Capture device, preset, operator, and image-quality metadata needed for subgroup and QC review.",
        },
        {
          title: config.workflowType === "realtime" ? "Run AI during live scanning" : "Save the representative image or cine loop before AI analysis",
          note: summary.workflowExecution,
        },
        {
          title: config.workflowType === "realtime" ? "Log overlays, overrides, and latency events" : "Maintain a stored-image selection audit trail",
          note: config.workflowType === "realtime" ? `Use the latency target of ${formatDisplayNumber(Number(inputs.latencyTarget) || 0, 0)} ms for operational review.` : `Stored-image workflow: ${context.savedWorkflowLabel || "saved image review"}.`,
        },
      ]),
    },
    {
      key: "review-analysis",
      title: "Reference standard, analysis, and reporting",
      description: "Assemble truth, lock the database, and produce an analysis-ready endpoint package.",
      items: makeItems("review-analysis", [
        {
          title: "Complete blinded review and adjudication before database lock",
          note: `Reference standard: ${inputs.referenceStandard}.`,
        },
        {
          title: "Review endpoint analyzability, deviations, and subgroup coverage",
          note: `Primary endpoint: ${inputs.primaryEndpoint}. Subgroups: ${inputs.subgroupFocus}.`,
        },
        {
          title: "Interpret limitations and finalize the report package",
          note: `Limitations plan: ${inputs.limitationsPlan}.`,
        },
      ]),
    },
    {
      key: "ethics-lifecycle",
      title: "Ethics, human factors, and lifecycle monitoring",
      description: "Close the loop from human-subject protections to post-validation monitoring and updates.",
      items: makeItems("ethics-lifecycle", [
        {
          title: "Confirm ethics and human-subject protections",
          note: `Ethics plan: ${inputs.ethicsPlan}.`,
        },
        {
          title: "Prepare usability, labeling, and operator guidance evidence",
          note: `Human factors plan: ${humanFactorsPlanLabel}.`,
        },
        {
          title: "Document monitoring and bounded change control",
          note: `Monitoring: ${monitoringPlanLabel}. Change control: ${changeControlPlanLabel}.`,
        },
      ]),
    },
  ];
}

function renderProtocolFlowchart(steps, workflowType) {
  return `
    <div class="protocol-flowchart ${workflowType === "realtime" ? "is-realtime" : "is-stored"}" role="img" aria-label="Study flowchart">
      ${steps
        .map(
          (step, index) => `
            <div class="protocol-flow-step">
              <div class="protocol-flow-badge">${escapeHtml(step.number)}</div>
              <div class="protocol-flow-card">
                <p class="protocol-flow-title">${escapeHtml(step.title)}</p>
                <p class="protocol-flow-detail">${escapeHtml(step.detail)}</p>
              </div>
              ${index < steps.length - 1 ? '<div class="protocol-flow-arrow" aria-hidden="true"></div>' : ""}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderChecklistEmptyState() {
  activeChecklistPackage = null;
  setChecklistActionAvailability(false);

  if (checklistTitle) {
    checklistTitle.textContent = "Study Execution Checklist";
  }

  if (checklistSummary) {
    checklistSummary.textContent =
      "Generate a protocol in Protocol Planning first, then open this page to turn that draft into a step-by-step execution checklist.";
  }

  if (checklistCapability) {
    checklistCapability.textContent = "Not loaded";
  }

  if (checklistWorkflow) {
    checklistWorkflow.textContent = "Awaiting protocol";
  }

  if (checklistEndpoint) {
    checklistEndpoint.textContent = "Not loaded";
  }

  if (checklistSites) {
    checklistSites.textContent = "0 sites";
  }

  if (checklistReaders) {
    checklistReaders.textContent = "0 readers";
  }

  if (checklistGeneratedAt) {
    checklistGeneratedAt.textContent = "Generated package not available.";
  }

  if (checklistTags) {
    checklistTags.innerHTML = `
      <li>Protocol package not loaded yet.</li>
      <li>Return to Protocol Planning, generate a draft, then reopen this checklist page.</li>
    `;
  }

  if (checklistProgressCount) {
    checklistProgressCount.textContent = "0 / 0";
  }

  if (checklistProgressText) {
    checklistProgressText.textContent = "0% complete";
  }

  if (checklistProgressBar) {
    checklistProgressBar.style.width = "0%";
  }

  if (checklistSections) {
    checklistSections.innerHTML = `
      <section class="protocol-placeholder checklist-empty-state">
        <p class="protocol-placeholder-title">Protocol package required</p>
        <p class="result-meta">Go to Protocol Planning, generate the draft, then use "체크리스트 페이지 열기" to load the study execution checklist.</p>
      </section>
    `;
  }

  if (checklistFlowchart) {
    checklistFlowchart.innerHTML = `
      <div class="protocol-placeholder">
        <p class="protocol-placeholder-title">Flowchart will appear here</p>
        <p class="result-meta">Once a protocol package is loaded, the protocol order will be rendered as a visual flow diagram.</p>
      </div>
    `;
  }
}

function renderChecklistPage(protocolPackage) {
  activeChecklistPackage = protocolPackage;
  setChecklistActionAvailability(true);

  if (checklistTitle) {
    checklistTitle.textContent = `${protocolPackage.label} Study Execution Checklist`;
  }

  if (checklistSummary) {
    checklistSummary.textContent = protocolPackage.synopsis;
  }

  if (checklistCapability) {
    checklistCapability.textContent = protocolPackage.label;
  }

  if (checklistWorkflow) {
    checklistWorkflow.textContent = protocolPackage.workflowLabel;
  }

  if (checklistEndpoint) {
    checklistEndpoint.textContent = normalizeWhitespace(protocolPackage.inputs.primaryEndpoint || protocolPackage.endpointSummary);
  }

  if (checklistSites) {
    checklistSites.textContent = protocolPackage.siteText;
  }

  if (checklistReaders) {
    checklistReaders.textContent = protocolPackage.readerText;
  }

  if (checklistGeneratedAt) {
    checklistGeneratedAt.textContent = `Generated ${formatTimestamp(protocolPackage.generatedAt)}`;
  }

  if (checklistTags) {
    const tagItems = [
      `Workflow: ${protocolPackage.workflowLabel}`,
      `Comparator: ${protocolPackage.comparatorLabel}`,
      `Hypothesis: ${protocolPackage.hypothesisLabel}`,
      `Primary endpoint: ${protocolPackage.inputs.primaryEndpoint}`,
      `Validation set: ${protocolPackage.validationDatasetPlanLabel}`,
      `Change control: ${protocolPackage.changeControlPlanLabel}`,
    ];
    checklistTags.innerHTML = tagItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  if (checklistFlowchart) {
    checklistFlowchart.innerHTML = renderProtocolFlowchart(protocolPackage.flowchartSteps, protocolPackage.workflowType);
  }

  const progress = loadChecklistProgress(protocolPackage.signature);

  if (checklistSections) {
    checklistSections.innerHTML = protocolPackage.checklistSections
      .map((section, index) => renderChecklistSection(section, index, progress))
      .join("");

    checklistSections.querySelectorAll("[data-checklist-item]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const nextProgress = {
          ...loadChecklistProgress(protocolPackage.signature),
          [event.currentTarget.dataset.checklistItem]: event.currentTarget.checked,
        };
        saveChecklistProgress(protocolPackage.signature, nextProgress);
        event.currentTarget.closest(".checklist-item")?.classList.toggle("is-checked", event.currentTarget.checked);
        updateChecklistProgress(protocolPackage, nextProgress);
      });
    });
  }

  updateChecklistProgress(protocolPackage, progress);
}

function renderChecklistSection(section, index, progress) {
  return `
    <section class="checklist-section">
      <div class="checklist-section-header">
        <p class="section-kicker">Checklist Section ${String(index + 1).padStart(2, "0")}</p>
        <h3>${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.description)}</p>
      </div>
      <div class="checklist-items">
        ${section.items
          .map((item) => {
            const checked = Boolean(progress[item.id]);
            return `
              <label class="checklist-item${checked ? " is-checked" : ""}">
                <input type="checkbox" data-checklist-item="${escapeHtml(item.id)}"${checked ? " checked" : ""}>
                <span class="checklist-item-copy">
                  <span class="checklist-item-title">${escapeHtml(item.title)}</span>
                  <span class="checklist-item-note">${escapeHtml(item.note)}</span>
                </span>
              </label>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function updateChecklistProgress(protocolPackage, progress) {
  const total = protocolPackage.checklistSections.reduce((sum, section) => sum + section.items.length, 0);
  const completed = protocolPackage.checklistSections.reduce(
    (sum, section) => sum + section.items.filter((item) => Boolean(progress[item.id])).length,
    0
  );
  const percent = total ? Math.round((completed / total) * 100) : 0;

  if (checklistProgressCount) {
    checklistProgressCount.textContent = `${completed} / ${total}`;
  }

  if (checklistProgressText) {
    checklistProgressText.textContent = `${percent}% complete`;
  }

  if (checklistProgressBar) {
    checklistProgressBar.style.width = `${percent}%`;
  }
}

function buildChecklistCopyText(protocolPackage) {
  const progress = loadChecklistProgress(protocolPackage.signature);
  const lines = [
    `[${protocolPackage.label} Study Execution Checklist]`,
    `Generated: ${formatTimestamp(protocolPackage.generatedAt)}`,
    `Workflow: ${protocolPackage.workflowLabel}`,
    `Comparator: ${protocolPackage.comparatorLabel}`,
    `Hypothesis: ${protocolPackage.hypothesisLabel}`,
    `Primary endpoint: ${protocolPackage.inputs.primaryEndpoint}`,
    `Sites: ${protocolPackage.siteText}`,
    `Readers: ${protocolPackage.readerText}`,
    "",
  ];

  protocolPackage.checklistSections.forEach((section, sectionIndex) => {
    lines.push(`${sectionIndex + 1}. ${section.title}`);
    section.items.forEach((item) => {
      const mark = progress[item.id] ? "[x]" : "[ ]";
      lines.push(`- ${mark} ${item.title}`);
      lines.push(`  Note: ${item.note}`);
    });
    lines.push("");
  });

  return lines.join("\n").trim();
}

function setChecklistActionAvailability(isEnabled) {
  checklistCopyButtons.forEach((button) => {
    button.disabled = !isEnabled;
  });

  checklistResetButtons.forEach((button) => {
    button.disabled = !isEnabled;
  });
}

function loadProtocolPackage() {
  return readJsonFromStorage(protocolPackageStorageKey);
}

function saveProtocolPackage(protocolPackage) {
  return writeJsonToStorage(protocolPackageStorageKey, protocolPackage);
}

function clearStoredProtocolPackage() {
  removeStorageValue(protocolPackageStorageKey);
}

function buildChecklistProgressStorageKey(signature) {
  return `${checklistProgressStoragePrefix}${signature}`;
}

function loadChecklistProgress(signature) {
  return readJsonFromStorage(buildChecklistProgressStorageKey(signature)) || {};
}

function saveChecklistProgress(signature, progress) {
  writeJsonToStorage(buildChecklistProgressStorageKey(signature), progress);
}

function readJsonFromStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function writeJsonToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function removeStorageValue(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    // Ignore storage cleanup failures.
  }
}

function initializeThemePicker() {
  const initialTheme = readThemeFromStorage() || document.documentElement.dataset.theme || defaultTheme;
  applyTheme(initialTheme, { persist: false });

  themeOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption || defaultTheme);
    });
  });
}

function applyTheme(theme, options = {}) {
  const nextTheme = theme === "neo-dark" ? "neo-dark" : defaultTheme;

  document.documentElement.dataset.theme = nextTheme;

  if (document.body) {
    document.body.dataset.theme = nextTheme;
  }

  themeOptionButtons.forEach((button) => {
    const isActive = button.dataset.themeOption === nextTheme;
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("is-active", isActive);
  });

  if (options.persist !== false) {
    writeThemeToStorage(nextTheme);
  }
}

function readThemeFromStorage() {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

function writeThemeToStorage(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
    return true;
  } catch (error) {
    return false;
  }
}

function formatTimestamp(value) {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return String(value || "");
  }

  return timestamp.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initializeWorkspaceTools() {
  if (!workspaceModeButtons.length) {
    return;
  }

  workspaceModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setWorkspaceMode(button.dataset.workspaceMode);
    });
  });

  workspaceActionButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      await handleWorkspaceAction(button.dataset.workspaceAction);
    });
  });
}

function setWorkspaceMode(mode) {
  workspaceModeButtons.forEach((button) => {
    const isActive = button.dataset.workspaceMode === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  workspacePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.workspacePanel === mode);
  });
}

async function handleWorkspaceAction(action) {
  switch (action) {
    case "copy-summary": {
      const snapshot = buildWorkspaceSnapshot();
      try {
        await copyTextToClipboard(snapshot);
        setWorkspaceStatus("현재 화면의 입력값과 결과 요약을 클립보드에 복사했습니다.");
      } catch (error) {
        setWorkspaceStatus("브라우저에서 복사를 허용하지 않아 요약 복사에 실패했습니다.");
      }
      break;
    }
    case "focus-calculator": {
      const moved = focusActiveCalculator();
      setWorkspaceStatus(
        moved
          ? isProtocolPlannerActive()
            ? "현재 선택된 프로토콜 입력 영역으로 이동했습니다."
            : "현재 활성 계산기의 첫 입력 필드로 이동했습니다."
          : isProtocolPlannerActive()
            ? "이동할 프로토콜 입력 영역을 찾지 못했습니다."
            : "이동할 활성 계산기를 찾지 못했습니다."
      );
      break;
    }
    case "open-assumptions": {
      const target = isProtocolPlannerActive() ? protocolTimingNotes : document.querySelector(".warning-card");
      const opened = scrollToElement(target);
      setWorkspaceStatus(
        opened
          ? isProtocolPlannerActive()
            ? "초음파 운영 포인트와 실시간/저장형 구분 영역으로 이동했습니다."
            : "핵심 가정과 주의사항 영역으로 이동했습니다."
          : isProtocolPlannerActive()
            ? "운영 포인트 영역을 찾지 못했습니다."
            : "가정 영역을 찾지 못했습니다."
      );
      break;
    }
    case "apply-baseline-plan": {
      const label = applyPlanPreset("baseline");
      setWorkspaceStatus(
        label
          ? isProtocolPlannerActive()
            ? `${label} 프로토콜에 기본 설계값을 적용했습니다.`
            : `${label} 계산기에 baseline 기본값을 적용했습니다.`
          : isProtocolPlannerActive()
            ? "기본 설계값을 적용할 프로토콜을 찾지 못했습니다."
            : "기본값을 적용할 활성 계산기를 찾지 못했습니다."
      );
      break;
    }
    case "apply-high-assurance": {
      const label = applyPlanPreset("highAssurance");
      setWorkspaceStatus(
        label
          ? isProtocolPlannerActive()
            ? `${label} 프로토콜에 보수적 설정을 적용했습니다.`
            : `${label} 계산기에 high-assurance 기본값을 적용했습니다.`
          : isProtocolPlannerActive()
            ? "보수적 설정을 적용할 프로토콜을 찾지 못했습니다."
            : "기본값을 적용할 활성 계산기를 찾지 못했습니다."
      );
      break;
    }
    case "open-formula": {
      const target = isProtocolPlannerActive() ? protocolOutput : document.querySelector(".formula-block");
      const opened = scrollToElement(target);
      setWorkspaceStatus(
        opened
          ? isProtocolPlannerActive()
            ? "생성된 프로토콜 초안 영역으로 이동했습니다."
            : "공식 설명 영역으로 이동했습니다."
          : isProtocolPlannerActive()
            ? "프로토콜 초안 영역을 찾지 못했습니다."
            : "공식 영역을 찾지 못했습니다."
      );
      break;
    }
    case "load-demo": {
      const label = loadDemoValuesIntoActiveForm();
      setWorkspaceStatus(
        label
          ? isProtocolPlannerActive()
            ? `${label} 프로토콜의 예시 입력값을 적용했습니다.`
            : `${label} 계산기에 예시 입력값을 적용했습니다.`
          : isProtocolPlannerActive()
            ? "예시값을 적용할 프로토콜을 찾지 못했습니다."
            : "예시값을 넣을 활성 계산기를 찾지 못했습니다."
      );
      break;
    }
    case "clear-results": {
      const count = clearResultCards();
      setWorkspaceStatus(
        count
          ? isProtocolPlannerActive()
            ? "생성된 프로토콜 초안을 초기화했습니다."
            : `${count}개의 결과 카드를 초기 상태로 되돌렸습니다.`
          : isProtocolPlannerActive()
            ? "초기화할 프로토콜 초안이 없습니다."
            : "초기화할 결과 카드가 없습니다."
      );
      break;
    }
    case "refresh-health": {
      const health = await checkServerHealth();
      setWorkspaceStatus(`서버 상태를 다시 확인했습니다. ${health.message}`);
      break;
    }
    default:
      break;
  }
}

function setWorkspaceStatus(message) {
  const statusNode = document.querySelector("[data-workspace-panel].active [data-workspace-status]");
  if (statusNode) {
    statusNode.textContent = message;
  }
}

function focusActiveCalculator() {
  const form = getCurrentPrimaryForm();
  if (!form) {
    return false;
  }

  const firstField = Array.from(form.querySelectorAll("input, select, textarea")).find(
    (field) => !field.disabled && field.offsetParent !== null
  );

  scrollToElement(form.closest(".tab-panel") || form, "center");
  firstField?.focus({ preventScroll: true });
  return true;
}

function applyPlanPreset(presetKey) {
  if (isProtocolPlannerActive()) {
    return applyProtocolPreset(presetKey);
  }

  const form = getActiveForm();
  if (!form) {
    return "";
  }

  const formKey = form.dataset.formKind ? "metricAware" : form.dataset.calculator;
  const preset = workspacePlanPresets[presetKey]?.[formKey];
  if (!preset) {
    return "";
  }

  setFormValues(form, preset);
  if (form.dataset.formKind) {
    applyMetricConfig(form);
  } else {
    applyFormTooltips(form);
  }

  return getActiveTabLabel();
}

function loadDemoValuesIntoActiveForm() {
  if (isProtocolPlannerActive()) {
    setProtocolCapability(activeProtocolCapability, true);
    return protocolCapabilityConfigs[activeProtocolCapability]?.label || "";
  }

  const form = getActiveForm();
  if (!form) {
    return "";
  }

  if (form.dataset.formKind) {
    applyExampleValues(form);
    return getActiveTabLabel();
  }

  const defaults = basicDemoValues[form.dataset.calculator];
  if (!defaults) {
    return "";
  }

  setFormValues(form, defaults);
  applyFormTooltips(form);
  return getActiveTabLabel();
}

function clearResultCards() {
  if (isProtocolPlannerActive()) {
    if (!protocolOutput) {
      return 0;
    }

    lastGeneratedProtocolPackage = null;
    clearStoredProtocolPackage();
    renderProtocolPlaceholder(protocolCapabilityConfigs[activeProtocolCapability]);
    return 1;
  }

  let clearedCount = 0;

  resultContainers.forEach((container) => {
    if (!container.dataset.defaultHtml) {
      return;
    }

    container.innerHTML = container.dataset.defaultHtml;
    clearedCount += 1;
  });

  return clearedCount;
}

function buildWorkspaceSnapshot() {
  const title = normalizeWhitespace(
    document.querySelector("h1")?.textContent || document.querySelector(".workspace-title")?.textContent || document.title
  );
  const activeTrack = getActiveTabLabel() || "활성 트랙 미확인";
  const statusText = normalizeWhitespace(serverStatus?.textContent || "서버 상태 미확인");
  const form = getCurrentPrimaryForm();
  const inputs = form ? buildInputSnapshot(form) : [];
  const results = buildResultSnapshot();

  return [
    `[${title}]`,
    `활성 트랙: ${activeTrack}`,
    `서버 상태: ${statusText}`,
    "",
    "현재 입력값",
    ...(inputs.length ? inputs : ["- 입력값 없음"]),
    "",
    "현재 결과",
    ...(results.length ? results : ["- 계산 결과 없음"]),
  ].join("\n");
}

function buildInputSnapshot(form) {
  return Array.from(form.querySelectorAll("label"))
    .filter((label) => label.offsetParent !== null)
    .map((label) => {
      const field = label.querySelector("input, select, textarea");
      if (!field || field.disabled) {
        return "";
      }

      const labelText = getFieldLabelText(label, field);
      const value =
        field.tagName === "SELECT"
          ? field.options[field.selectedIndex]?.textContent?.trim() || field.value
          : field.value;

      return `- ${labelText}: ${normalizeWhitespace(value)}`;
    })
    .filter(Boolean);
}

function buildResultSnapshot() {
  if (isProtocolPlannerActive()) {
    const text = String(protocolOutput?.innerText || "")
      .split(/\r?\n/)
      .map((line) => normalizeWhitespace(line))
      .filter(Boolean)
      .slice(0, 8);
    return text.map((line) => `- ${line}`);
  }

  const container = getActiveResultContainer();
  if (!container) {
    return [];
  }

  const headline =
    container.querySelector(".result-text")?.textContent ||
    container.querySelector(".error-text")?.textContent ||
    container.querySelector(".result-placeholder")?.textContent ||
    "";
  const summaryItems = Array.from(container.querySelectorAll(".summary-card")).map((card) => {
    const label = normalizeWhitespace(card.querySelector(".summary-label")?.textContent || "");
    const value = normalizeWhitespace(card.querySelector(".summary-value")?.textContent || "");
    return label && value ? `- ${label}: ${value}` : "";
  });

  return [headline ? `- ${normalizeWhitespace(headline)}` : "", ...summaryItems.filter(Boolean)].filter(Boolean);
}

function getCurrentPrimaryForm() {
  if (isProtocolPlannerActive()) {
    return protocolForm;
  }

  return getActiveForm();
}

function getActiveForm() {
  return document.querySelector(".tab-panel.active .calc-form");
}

function getActiveResultContainer() {
  const calculator = getActiveForm()?.dataset.calculator;
  if (!calculator) {
    return null;
  }

  return document.querySelector(`[data-result="${calculator}"]`);
}

function getActiveTabLabel() {
  if (isProtocolPlannerActive()) {
    return protocolCapabilityConfigs[activeProtocolCapability]?.label || "Protocol Planning";
  }

  return normalizeWhitespace(document.querySelector(".tab-button.active")?.textContent || "");
}

function isProtocolPlannerActive() {
  return Boolean(protocolPlanningView && !protocolPlanningView.hidden);
}

function getSelectValueLabel(form, fieldName) {
  const field = form.elements.namedItem(fieldName);
  if (!field || field.tagName !== "SELECT") {
    return "";
  }

  return normalizeWhitespace(field.options[field.selectedIndex]?.textContent || field.value);
}

function setFormValues(form, values) {
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = String(value);
    }
  });
}

function getFieldLabelText(label, field) {
  const inlineLabel = label.querySelector("span[data-label-key]")?.textContent?.trim();
  if (inlineLabel) {
    return inlineLabel;
  }

  const directTextNode = Array.from(label.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  );
  return normalizeWhitespace(directTextNode?.textContent || field.name);
}

function normalizeWhitespace(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function splitProtocolField(value) {
  return String(value || "")
    .split(/\r?\n|;/)
    .map((entry) => normalizeWhitespace(entry))
    .filter(Boolean);
}

function scrollToElement(element, block = "start") {
  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block,
  });
  return true;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // Fallback below for browsers that block async clipboard access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("copy failed");
  }
}

function applyMetricConfig(form) {
  const formKind = form.dataset.formKind;
  const metric = form.querySelector("[data-metric-select]")?.value;
  const config = metricConfigs[formKind]?.[metric];

  if (!config) {
    return;
  }

  form.querySelectorAll("[data-label-key]").forEach((labelNode) => {
    const key = labelNode.dataset.labelKey;
    if (!labelNode.dataset.defaultLabel) {
      labelNode.dataset.defaultLabel = labelNode.textContent;
    }
    labelNode.textContent = config.labels[key] || labelNode.dataset.defaultLabel;
  });

  form.querySelectorAll("[data-core-field]").forEach((fieldWrapper) => {
    const fieldName = fieldWrapper.dataset.coreField;
    const isHidden = (config.hiddenFields || []).includes(fieldName);
    fieldWrapper.classList.toggle("field-hidden", isHidden);
    fieldWrapper.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = isHidden;
    });
  });

  form.querySelectorAll("[data-optional-field]").forEach((fieldWrapper) => {
    const fieldName = fieldWrapper.dataset.optionalField;
    const isVisible = config.visibleFields.includes(fieldName);
    fieldWrapper.classList.toggle("field-hidden", !isVisible);
    fieldWrapper.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !isVisible;
    });
  });

  const helpText = form.parentElement.querySelector("[data-dynamic-help]");
  if (helpText) {
    helpText.textContent = config.help;
  }

  const exampleText = form.parentElement.querySelector("[data-example-text]");
  if (exampleText) {
    exampleText.textContent = config.exampleText;
  }

  applyFormTooltips(form);
}

function applyExampleValues(form) {
  const formKind = form.dataset.formKind;
  const metric = form.querySelector("[data-metric-select]")?.value;
  const config = metricConfigs[formKind]?.[metric];

  if (!config) {
    return;
  }

  Object.entries(config.exampleValues).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = String(value);
    }
  });

  applyMetricConfig(form);
}

function serializeForm(form) {
  const formData = new FormData(form);
  return Object.fromEntries(
    Array.from(formData.entries(), ([key, value]) => {
      const normalized =
        typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))
          ? Number(value)
          : value;
      return [key, normalized];
    })
  );
}

function applyFormTooltips(form) {
  form.querySelectorAll("label").forEach((label) => {
    const field = label.querySelector("input, select, textarea");
    if (!field?.name) {
      return;
    }

    const tooltip = getTooltipText(form, field.name);
    if (tooltip) {
      label.classList.add("has-tooltip");
      label.dataset.tooltip = tooltip;
      label.title = tooltip;
    } else {
      label.classList.remove("has-tooltip");
      delete label.dataset.tooltip;
      label.removeAttribute("title");
    }
  });
}

function getTooltipText(form, fieldName) {
  const formKind = form.dataset.formKind;
  if (!formKind) {
    return basicFormTooltips[form.dataset.calculator]?.[fieldName] || "";
  }

  const metric = form.querySelector("[data-metric-select]")?.value;
  const meta = resultMetaMap[`${formKind}:${metric}`];
  const selectedOption = form.querySelector("[data-metric-select] option:checked");
  const metricLabel = meta?.metricLabel || selectedOption?.textContent.trim() || "metric";
  const builder = aiFieldTooltipBuilders[fieldName];

  return typeof builder === "function" ? builder({ formKind, metric, meta, metricLabel }) : "";
}

function setLoadingState(container, button, isLoading) {
  if (button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? "계산 중..." : "계산하기";
  }

  if (isLoading) {
    container.innerHTML = '<p class="result-meta">서버에서 샘플수를 계산하고 있습니다...</p>';
  }
}

function renderSuccess(container, result, context) {
  const detailsHtml = (result.details || [])
    .map((detail) => `<li>${escapeHtml(detail)}</li>`)
    .join("");

  container.innerHTML = `
    <p class="result-text">${escapeHtml(result.headline)}</p>
    ${renderSummaryMetrics(result.metrics || {})}
    ${detailsHtml ? `<ul class="result-list result-detail-list">${detailsHtml}</ul>` : ""}
    ${context ? renderRegulatoryWriting(context) : ""}
    ${context ? renderTheorySection(context) : ""}
  `;
}

function renderError(container, message) {
  container.innerHTML = `<p class="error-text">${message}</p>`;
}

function buildResultContext(form, inputs, result) {
  const formKind = form.dataset.formKind;
  const metric = inputs.metric;
  if (!formKind || !metric) {
    return null;
  }
  const key = `${formKind}:${metric}`;
  const selectedOption = form.querySelector("[data-metric-select] option:checked");
  const fallbackMetricLabel = selectedOption ? selectedOption.textContent.trim() : metric;
  const meta = resultMetaMap[key] || {
    metricLabel: fallbackMetricLabel,
    endpointLabelKo: fallbackMetricLabel,
    endpointLabelEn: fallbackMetricLabel.toLowerCase(),
    family: "proportion",
    references: sharedReferences.proportion,
    assumptions: sharedAssumptions.proportion,
    noteKo: "",
    noteEn: "",
  };
  const guidancePlanning = buildGuidancePlanningModel(inputs, result.metrics || {});

  return {
    formKind,
    categoryLabel: toTitleCase(formKind),
    metric,
    meta,
    inputs,
    result,
    guidancePlanning,
  };
}

function buildGuidancePlanningModel(inputs, metrics) {
  const baseTarget = getGuidancePlanningBaseTarget(metrics);
  if (!baseTarget) {
    return null;
  }

  const designEffect = Math.max(Number(inputs.designEffect) || 1, 1);
  const subgroupCount = Math.max(Number(inputs.subgroupCount) || 1, 1);
  const minCasesPerSubgroup = Math.max(Number(inputs.minCasesPerSubgroup) || 0, 0);
  const referenceReviewFailureRate = clampNumber(Number(inputs.referenceReviewFailureRate) || 0, 0, 0.9);
  const baseCases = Math.ceil(baseTarget.value);
  const clusterAdjustedCases = Math.ceil(baseCases * designEffect);
  const analyzableFraction = Math.max(1 - referenceReviewFailureRate, 0.05);
  const referenceAdjustedCases = Math.ceil(clusterAdjustedCases / analyzableFraction);
  const subgroupFloorCases = minCasesPerSubgroup > 0 ? subgroupCount * minCasesPerSubgroup : 0;
  const finalPlanningCases = Math.max(referenceAdjustedCases, subgroupFloorCases);
  const notes = [
    "Validation data should remain independent or sequestered from development and tuning data.",
    "Pre-specify subgroup coverage across clinically important patient, site, device, and acquisition strata.",
    "Document missing, equivocal, or failed reference-standard reviews before database lock so analyzable counts are preserved.",
  ];

  if (designEffect > 1) {
    notes.unshift("Design effect increases the target to cover reader, site, scan, or frame-level clustering.");
  }

  if (referenceReviewFailureRate > 0) {
    notes.unshift("Reference-standard attrition inflates the target so the final locked dataset still meets the analyzable-case goal.");
  }

  if (subgroupFloorCases > referenceAdjustedCases) {
    notes.unshift("The subgroup floor dominates the final planning target, which means representation requirements are stricter than the base statistical estimate.");
  }

  return {
    baseLabel: baseTarget.label,
    baseCases,
    designEffect,
    subgroupCount,
    minCasesPerSubgroup,
    referenceReviewFailureRate,
    clusterAdjustedCases,
    referenceAdjustedCases,
    subgroupFloorCases,
    finalPlanningCases,
    incrementalCases: Math.max(finalPlanningCases - baseCases, 0),
    notes,
  };
}

function getGuidancePlanningBaseTarget(metrics) {
  const candidates = [
    ["adjustedTotalCases", "Base target enrollment"],
    ["adjustedCases", "Base target enrollment"],
    ["estimatedTotalCases", "Base evaluable total"],
    ["requiredCases", "Base evaluable total"],
  ];

  for (const [key, label] of candidates) {
    const value = Number(metrics[key]);
    if (Number.isFinite(value) && value > 0) {
      return { key, label, value };
    }
  }

  return null;
}

function renderGuidancePlanningOverlay(context) {
  const planning = context.guidancePlanning;
  if (!planning) {
    return "";
  }

  const cards = [
    { label: planning.baseLabel, value: formatCount(planning.baseCases) },
    { label: "Cluster-adjusted target", value: formatCount(planning.clusterAdjustedCases) },
    { label: "Reference-adjusted target", value: formatCount(planning.referenceAdjustedCases) },
    { label: "Subgroup floor", value: planning.subgroupFloorCases ? formatCount(planning.subgroupFloorCases) : "Not applied" },
    { label: "Final planning target", value: formatCount(planning.finalPlanningCases) },
  ]
    .map(
      (item) => `
        <div class="summary-card">
          <p class="summary-label">${escapeHtml(item.label)}</p>
          <p class="summary-value">${escapeHtml(item.value)}</p>
        </div>
      `
    )
    .join("");

  const notes = planning.notes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    <div class="result-subsection">
      <p class="result-subtitle">Guidance-aligned planning overlay</p>
      <p class="result-meta">The base statistical sample size is stress-tested with clustering, reference-review attrition, and subgroup minimum coverage drawn from the AI device guidance themes.</p>
      <div class="summary-grid">${cards}</div>
      <ul class="result-list">${notes}</ul>
    </div>
  `;
}

function buildEnhancedRegulatoryTextSafe(context) {
  const { categoryLabel, meta, inputs, result, guidancePlanning } = context;
  if (meta.family === "bland-altman") {
    const counts = buildRequirementPhrase(result.metrics || {});
    const dropoutText = formatPercentValue(inputs.dropout);
    const agreementLimit = formatDisplayNumber(inputs.benchmarkValue);
    const bias = formatDisplayNumber(inputs.expectedValue);
    const sd = formatDisplayNumber(inputs.standardDeviation);
    const alphaText = formatDisplayNumber(inputs.alpha);
    const powerText = formatPercentValue(inputs.power);

    const koParts = [
      `본 ${categoryLabel} 성능평가 샘플수는 Lu et al. (2016)의 Bland-Altman limits of agreement sample size 접근을 사용하여 paired difference의 평균 ${bias}와 표준편차 ${sd}를 가정하고, 최대 허용 차이 Δ ${agreementLimit} 안에서 고정된 95% LoA 신뢰구간을 확보하도록 산출하였다.`,
      `계산에는 양측 alpha ${alphaText}와 검정력 ${powerText}를 적용하고, non-central t 기반 power search로 최소 n을 탐색하였다.`,
      `기본 계산 결과 ${counts.koRequired}이며, 예상 탈락률 ${dropoutText}를 반영한 목표 모집 수는 ${counts.koAdjusted}로 설정하였다.`,
      `${meta.noteKo}`,
    ];

    const enParts = [
      `The sample size for the ${categoryLabel.toLowerCase()} performance evaluation was determined using the Lu et al. Bland-Altman limits-of-agreement sample-size approach, assuming an expected mean paired difference of ${bias}, a standard deviation of differences of ${sd}, and a maximum acceptable difference of ${agreementLimit}.`,
      `A two-sided alpha of ${alphaText} and ${powerText} power were applied, and the minimum n was searched with a non-central t based power criterion for the fixed 95% limits of agreement.`,
      `The base calculation showed that ${counts.enRequired}, and the target enrollment was set at ${counts.enAdjusted} after allowing for an anticipated dropout rate of ${dropoutText}.`,
      `${meta.noteEn}`,
    ];

    if (guidancePlanning) {
      koParts.push(
        `추가 planning overlay에서는 design effect ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, reference standard failure rate ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, subgroup floor를 반영하여 최종 권고 모집 수를 ${formatCount(guidancePlanning.finalPlanningCases)}건으로 조정하였다.`
      );
      enParts.push(
        `In a guidance-aligned planning overlay, the enrollment target was further stress-tested with a design effect of ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, a reference-standard failure rate of ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, and subgroup floors, yielding a final recommended planning target of ${formatCount(guidancePlanning.finalPlanningCases)} cases.`
      );
    }

    return {
      ko: koParts.join(" "),
      en: enParts.join(" "),
    };
  }

  const counts = buildRequirementPhrase(result.metrics || {});
  const threshold = result.metrics?.nonInferiorityThreshold;
  const method = buildMethodPresentation(context);
  const thresholdText = threshold !== undefined ? formatDisplayNumber(threshold) : "-";
  const dropoutText = formatPercentValue(inputs.dropout);

  const koParts = [
    `본 ${categoryLabel} 성능평가 샘플수는 ${meta.endpointLabelKo}를 주요 endpoint로 두고, benchmark ${formatDisplayNumber(inputs.benchmarkValue)}와 non-inferiority margin ${formatDisplayNumber(inputs.nonInferiorityMargin)}을 기준으로 산정하였다.`,
    `통계 방법은 ${method.nameKo}를 사용했고, one-sided alpha ${formatDisplayNumber(inputs.alpha)}와 power ${formatPercentValue(inputs.power)}를 적용하였다.`,
    `기본 계산 결과 ${counts.koRequired}이며, 예상 탈락률 ${dropoutText}를 반영한 목표 모집 수는 ${counts.koAdjusted}로 설정하였다.`,
    `적용된 non-inferiority threshold는 ${thresholdText}이며, ${meta.noteKo}`,
  ];

  const enParts = [
    `The sample size for the ${categoryLabel.toLowerCase()} performance evaluation was determined using ${meta.endpointLabelEn} as the primary endpoint, with a pre-specified benchmark of ${formatDisplayNumber(inputs.benchmarkValue)} and a non-inferiority margin of ${formatDisplayNumber(inputs.nonInferiorityMargin)}.`,
    `A ${method.nameEn} with a one-sided alpha of ${formatDisplayNumber(inputs.alpha)} and ${formatPercentValue(inputs.power)} power was applied.`,
    `The base calculation showed that ${counts.enRequired}, and the target enrollment was set at ${counts.enAdjusted} after allowing for an anticipated dropout rate of ${dropoutText}.`,
    `The resulting non-inferiority threshold was ${thresholdText}. ${meta.noteEn}`,
  ];

  if (guidancePlanning) {
    const subgroupTextKo = guidancePlanning.subgroupFloorCases
      ? `${formatCount(guidancePlanning.subgroupFloorCases)} cases as a subgroup floor`
      : "no subgroup floor";
    const subgroupTextEn = guidancePlanning.subgroupFloorCases
      ? `a subgroup floor of ${formatCount(guidancePlanning.subgroupFloorCases)} cases`
      : "no subgroup floor";

    koParts.push(
      `추가 planning overlay에서는 design effect ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, reference standard failure rate ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, ${subgroupTextKo}를 반영하여 최종 권고 모집 수를 ${formatCount(guidancePlanning.finalPlanningCases)}건으로 상향 또는 유지하였다.`
    );
    enParts.push(
      `In a guidance-aligned planning overlay, the enrollment target was stress-tested with a design effect of ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, a reference-standard failure rate of ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, and ${subgroupTextEn}, yielding a final recommended planning target of ${formatCount(guidancePlanning.finalPlanningCases)} cases.`
    );
  }

  return {
    ko: koParts.join(" "),
    en: enParts.join(" "),
  };
}

function buildEnhancedRegulatoryText(context) { return buildEnhancedRegulatoryTextSafe(context); } /*
  const { categoryLabel, meta, inputs, result, guidancePlanning } = context;
  const counts = buildRequirementPhrase(result.metrics || {});
  const threshold = result.metrics?.nonInferiorityThreshold;
  const method = buildMethodPresentation(context);
  const thresholdText = threshold !== undefined ? formatDisplayNumber(threshold) : "-";
  const dropoutText = formatPercentValue(inputs.dropout);

  const koParts = [
    `본 ${categoryLabel} 성능평가 샘플수는 ${meta.endpointLabelKo}를 주요 endpoint로 두고, benchmark ${formatDisplayNumber(inputs.benchmarkValue)}와 non-inferiority margin ${formatDisplayNumber(inputs.nonInferiorityMargin)}을 기준으로 산정하였다.`,
    `통계 방법은 ${method.nameKo}를 사용했고, one-sided alpha ${formatDisplayNumber(inputs.alpha)}와 power ${formatPercentValue(inputs.power)}를 적용하였다.`,
    `기본 계산 결과 ${counts.koRequired}이며, 예상 탈락률 ${dropoutText}를 반영한 목표 모집 수는 ${counts.koAdjusted}로 설정하였다.`,
    `적용된 non-inferiority threshold는 ${thresholdText}이며, ${meta.noteKo}`,
  ];

  const enParts = [
    `The sample size for the ${categoryLabel.toLowerCase()} performance evaluation was determined using ${meta.endpointLabelEn} as the primary endpoint, with a pre-specified benchmark of ${formatDisplayNumber(inputs.benchmarkValue)} and a non-inferiority margin of ${formatDisplayNumber(inputs.nonInferiorityMargin)}.`,
    `A ${method.nameEn} with a one-sided alpha of ${formatDisplayNumber(inputs.alpha)} and ${formatPercentValue(inputs.power)} power was applied.`,
    `The base calculation showed that ${counts.enRequired}, and the target enrollment was set at ${counts.enAdjusted} after allowing for an anticipated dropout rate of ${dropoutText}.`,
    `The resulting non-inferiority threshold was ${thresholdText}. ${meta.noteEn}`,
  ];

  if (guidancePlanning) { /*
    const subgroupTextKo = guidancePlanning.subgroupFloorCases
      ? `${formatCount(guidancePlanning.subgroupFloorCases)}건 subgroup floor`
      : "subgroup floor 미적용";
    const subgroupTextEn = guidancePlanning.subgroupFloorCases
      ? `a subgroup floor of ${formatCount(guidancePlanning.subgroupFloorCases)} cases`
      : "no subgroup floor";

    koParts.push(
      `추가 planning overlay에서는 design effect ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, reference standard failure rate ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, ${subgroupTextKo}를 반영하여 최종 권고 모집 수를 ${formatCount(guidancePlanning.finalPlanningCases)}건으로 상향 또는 유지하였다.`
    );
    enParts.push(
      `In a guidance-aligned planning overlay, the enrollment target was stress-tested with a design effect of ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, a reference-standard failure rate of ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, and ${subgroupTextEn}, yielding a final recommended planning target of ${formatCount(guidancePlanning.finalPlanningCases)} cases.`
    );
  }

  legacy separator
  if (guidancePlanning) { /*
    const subgroupTextKo = guidancePlanning.subgroupFloorCases
      ? `${formatCount(guidancePlanning.subgroupFloorCases)}건 subgroup floor`
      : "subgroup floor 미적용";
    const subgroupTextEn = guidancePlanning.subgroupFloorCases
      ? `a subgroup floor of ${formatCount(guidancePlanning.subgroupFloorCases)} cases`
      : "no subgroup floor";

    koParts.push(
      `추가 planning overlay에서는 design effect ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, reference standard failure rate ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, ${subgroupTextKo}를 반영하여 최종 권고 모집 수를 ${formatCount(guidancePlanning.finalPlanningCases)}건으로 상향 또는 유지하였다.`
    );
    enParts.push(
      `In a guidance-aligned planning overlay, the enrollment target was stress-tested with a design effect of ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, a reference-standard failure rate of ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, and ${subgroupTextEn}, yielding a final recommended planning target of ${formatCount(guidancePlanning.finalPlanningCases)} cases.`
    );
  }

  legacy separator
  if (guidancePlanning) {
    const subgroupTextKo = guidancePlanning.subgroupFloorCases
      ? `${formatCount(guidancePlanning.subgroupFloorCases)} cases as a subgroup floor`
      : "no subgroup floor";
    const subgroupTextEn = guidancePlanning.subgroupFloorCases
      ? `a subgroup floor of ${formatCount(guidancePlanning.subgroupFloorCases)} cases`
      : "no subgroup floor";

    koParts.push(
      `추가 planning overlay에서는 design effect ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, reference standard failure rate ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, ${subgroupTextKo}를 반영하여 최종 권고 모집 수를 ${formatCount(guidancePlanning.finalPlanningCases)}건으로 상향 또는 유지하였다.`
    );
    enParts.push(
      `In a guidance-aligned planning overlay, the enrollment target was stress-tested with a design effect of ${formatDisplayNumber(guidancePlanning.designEffect, 2)}, a reference-standard failure rate of ${formatPercentValue(guidancePlanning.referenceReviewFailureRate)}, and ${subgroupTextEn}, yielding a final recommended planning target of ${formatCount(guidancePlanning.finalPlanningCases)} cases.`
    );
  }

  return {
    ko: koParts.join(" "),
    en: enParts.join(" "),
  };
}

*/

function buildEnhancedParameterRows(context) {
  const { categoryLabel, meta, inputs, result, guidancePlanning } = context;
  if (meta.family === "bland-altman") {
    const rows = [
      {
        item: "Category",
        value: categoryLabel,
        note: "AI performance domain under evaluation",
      },
      {
        item: "Primary endpoint",
        value: meta.metricLabel,
        note: meta.endpointLabelKo,
      },
      {
        item: "Expected mean difference",
        value: formatDisplayNumber(inputs.expectedValue),
        note: "Planned average paired difference (bias)",
      },
      {
        item: "SD of paired differences",
        value: formatDisplayNumber(inputs.standardDeviation),
        note: "Pilot or historical estimate of variability in paired differences",
      },
      {
        item: "Maximum allowed difference",
        value: formatDisplayNumber(inputs.benchmarkValue),
        note: "Clinical agreement limit Δ",
      },
      {
        item: "Two-sided alpha",
        value: formatDisplayNumber(inputs.alpha),
        note: "Two-sided alpha for the confidence interval around the fixed 95% LoA",
      },
      {
        item: "Power",
        value: formatPercentValue(inputs.power),
        note: "Target probability from the Lu et al. non-central t agreement criterion",
      },
      {
        item: "Dropout rate",
        value: formatPercentValue(inputs.dropout),
        note: "Expected loss before the final analyzable dataset",
      },
    ];

    if (result.metrics?.expectedUpperLoA !== undefined) {
      rows.push({
        item: "Expected upper LoA",
        value: formatDisplayNumber(result.metrics.expectedUpperLoA),
        note: "Upper limit of agreement implied by the expected bias and SD",
      });
    }

    if (result.metrics?.expectedLowerLoA !== undefined) {
      rows.push({
        item: "Expected lower LoA",
        value: formatDisplayNumber(result.metrics.expectedLowerLoA),
        note: "Lower limit of agreement implied by the expected bias and SD",
      });
    }

    if (result.metrics?.criticalLoA !== undefined) {
      rows.push({
        item: "Critical |LoA|",
        value: formatDisplayNumber(result.metrics.criticalLoA),
        note: "Worst-case absolute limit of agreement used against the acceptable difference",
      });
    }

    if (result.metrics?.agreementGap !== undefined) {
      rows.push({
        item: "Agreement gap",
        value: formatDisplayNumber(result.metrics.agreementGap),
        note: "Remaining distance between the acceptable difference and the worst-case |LoA|",
      });
    }

    if (result.metrics?.achievedPower !== undefined) {
      rows.push({
        item: "Achieved power",
        value: formatPercentValue(result.metrics.achievedPower),
        note: "Exact power at the recommended n from the non-central t search",
      });
    }

    if (result.metrics?.upperSideBeta !== undefined) {
      rows.push({
        item: "Upper-side β",
        value: formatDisplayNumber(result.metrics.upperSideBeta),
        note: "Type II error for the upper LoA side of the agreement decision",
      });
    }

    if (result.metrics?.lowerSideBeta !== undefined) {
      rows.push({
        item: "Lower-side β",
        value: formatDisplayNumber(result.metrics.lowerSideBeta),
        note: "Type II error for the lower LoA side of the agreement decision",
      });
    }

    if (result.metrics?.legacyApproximateN !== undefined) {
      rows.push({
        item: "Legacy approximate n",
        value: formatDisplayNumber(result.metrics.legacyApproximateN, 2),
        note: "Older sqrt(3s²/n)-based approximation shown for comparison only",
      });
    }

    if (result.metrics?.standardizedBiasRatio !== undefined) {
      rows.push({
        item: "|Bias| / SD",
        value: formatDisplayNumber(result.metrics.standardizedBiasRatio),
        note: "Standardized mean-difference ratio used in the Lu et al. framing",
      });
    }

    if (result.metrics?.standardizedAgreementRatio !== undefined) {
      rows.push({
        item: "Δ / SD",
        value: formatDisplayNumber(result.metrics.standardizedAgreementRatio),
        note: "Standardized clinical agreement limit used in the Lu et al. framing",
      });
    }

    if (inputs.designEffect !== undefined) {
      rows.push({
        item: "Design effect",
        value: formatDisplayNumber(inputs.designEffect, 2),
        note: "Cluster inflation for site, reader, exam, or frame-level dependence",
      });
    }

    if (inputs.subgroupCount !== undefined) {
      rows.push({
        item: "Protected subgroups",
        value: formatCount(inputs.subgroupCount),
        note: "Number of key subgroups planned for separate coverage review",
      });
    }

    if (inputs.minCasesPerSubgroup !== undefined) {
      rows.push({
        item: "Minimum cases per subgroup",
        value: formatCount(inputs.minCasesPerSubgroup),
        note: "Floor applied to preserve minimum subgroup analyzability",
      });
    }

    if (inputs.referenceReviewFailureRate !== undefined) {
      rows.push({
        item: "Reference review failure rate",
        value: formatPercentValue(inputs.referenceReviewFailureRate),
        note: "Loss due to missing, equivocal, or failed truth adjudication",
      });
    }

    if (result.metrics?.rawSample !== undefined) {
      rows.push({
        item: "Raw sample size",
        value: formatDisplayNumber(result.metrics.rawSample, 4),
        note: "Direct formula output before rounding and operational inflation",
      });
    }

    if (guidancePlanning) {
      rows.push({
        item: "Guidance planning target",
        value: formatCount(guidancePlanning.finalPlanningCases),
        note: "Final recommendation after clustering, review attrition, and subgroup floors",
      });
    }

    return rows;
  }

  const rows = [
    {
      item: "Category",
      value: categoryLabel,
      note: "AI performance domain under evaluation",
    },
    {
      item: "Primary endpoint",
      value: meta.metricLabel,
      note: meta.endpointLabelKo,
    },
    {
      item: "Expected value",
      value: formatDisplayNumber(inputs.expectedValue),
      note: "Planned AI performance to be demonstrated in validation",
    },
    {
      item: "Benchmark",
      value: formatDisplayNumber(inputs.benchmarkValue),
      note: "Pre-specified benchmark or comparator performance",
    },
    {
      item: "NI margin",
      value: formatDisplayNumber(inputs.nonInferiorityMargin),
      note: "Clinically acceptable performance loss boundary",
    },
    {
      item: "One-sided alpha",
      value: formatDisplayNumber(inputs.alpha),
      note: "Type I error rate for the non-inferiority test",
    },
    {
      item: "Power",
      value: formatPercentValue(inputs.power),
      note: "Target probability of detecting non-inferiority",
    },
    {
      item: "Dropout rate",
      value: formatPercentValue(inputs.dropout),
      note: "Expected loss before the final analyzable dataset",
    },
  ];

  if (inputs.positiveCaseRate !== undefined) {
    rows.push({
      item: "Positive-case rate",
      value: formatPercentValue(inputs.positiveCaseRate),
      note: "Case-mix assumption used for positive-case driven planning",
    });
  }

  if (inputs.predictedPositiveRate !== undefined) {
    rows.push({
      item: "Predicted-positive rate",
      value: formatPercentValue(inputs.predictedPositiveRate),
      note: "Planning assumption used when the endpoint depends on predicted positives",
    });
  }

  if (inputs.predictedNegativeRate !== undefined) {
    rows.push({
      item: "Predicted-negative rate",
      value: formatPercentValue(inputs.predictedNegativeRate),
      note: "Planning assumption used when the endpoint depends on predicted negatives",
    });
  }

  if (inputs.standardDeviation !== undefined) {
    rows.push({
      item: "Standard deviation",
      value: formatDisplayNumber(inputs.standardDeviation),
      note: "Dispersion estimate from pilot data or bootstrap resampling",
    });
  }

  if (inputs.lesionsPerPositiveCase !== undefined) {
    rows.push({
      item: "Lesions per positive case",
      value: formatDisplayNumber(inputs.lesionsPerPositiveCase),
      note: "Used when lesion-level sensitivity is converted to case-level planning",
    });
  }

  if (inputs.designEffect !== undefined) {
    rows.push({
      item: "Design effect",
      value: formatDisplayNumber(inputs.designEffect, 2),
      note: "Cluster inflation for site, reader, exam, or frame-level dependence",
    });
  }

  if (inputs.subgroupCount !== undefined) {
    rows.push({
      item: "Protected subgroups",
      value: formatCount(inputs.subgroupCount),
      note: "Number of key subgroups planned for separate coverage review",
    });
  }

  if (inputs.minCasesPerSubgroup !== undefined) {
    rows.push({
      item: "Minimum cases per subgroup",
      value: formatCount(inputs.minCasesPerSubgroup),
      note: "Floor applied to preserve minimum subgroup analyzability",
    });
  }

  if (inputs.referenceReviewFailureRate !== undefined) {
    rows.push({
      item: "Reference review failure rate",
      value: formatPercentValue(inputs.referenceReviewFailureRate),
      note: "Loss due to missing, equivocal, or failed truth adjudication",
    });
  }

  if (result.metrics?.nonInferiorityThreshold !== undefined) {
    rows.push({
      item: "NI threshold",
      value: formatDisplayNumber(result.metrics.nonInferiorityThreshold),
      note: "Benchmark adjusted by the non-inferiority margin",
    });
  }

  if (result.metrics?.rawSample !== undefined) {
    rows.push({
      item: "Raw sample size",
      value: formatDisplayNumber(result.metrics.rawSample, 4),
      note: "Direct formula output before rounding and operational inflation",
    });
  }

  if (guidancePlanning) {
    rows.push({
      item: "Guidance planning target",
      value: formatCount(guidancePlanning.finalPlanningCases),
      note: "Final recommendation after clustering, review attrition, and subgroup floors",
    });
  }

  return rows;
}

function renderSummaryMetrics(metrics) {
  const orderedKeys = [
    "requiredCases",
    "requiredPositiveCases",
    "requiredPositivePredictions",
    "requiredNegativeCases",
    "requiredNegativePredictions",
    "requiredLesions",
    "estimatedTotalCases",
    "adjustedCases",
    "adjustedTotalCases",
    "expectedUpperLoA",
    "expectedLowerLoA",
    "criticalLoA",
    "maxAllowedDifference",
    "agreementGap",
    "achievedPower",
    "upperSideBeta",
    "lowerSideBeta",
    "legacyApproximateN",
    "standardizedBiasRatio",
    "standardizedAgreementRatio",
    "nonInferiorityThreshold",
    "rawSample",
  ];
  const labels = {
    requiredCases: "최소 케이스 / Required cases",
    requiredPositiveCases: "양성 케이스 / Positive cases",
    requiredPositivePredictions: "양성 판정 수 / Predicted positives",
    requiredNegativeCases: "음성 케이스 / Negative cases",
    requiredNegativePredictions: "음성 판정 수 / Predicted negatives",
    requiredLesions: "병변 수 / Lesions",
    estimatedTotalCases: "총 케이스 환산 / Estimated total",
    adjustedCases: "목표 모집 수 / Target enrollment",
    adjustedTotalCases: "목표 모집 수 / Target enrollment",
    expectedUpperLoA: "예상 upper LoA / Expected upper LoA",
    expectedLowerLoA: "예상 lower LoA / Expected lower LoA",
    criticalLoA: "worst-case |LoA| / Critical |LoA|",
    maxAllowedDifference: "허용 차이 Δ / Allowed difference",
    agreementGap: "허용 여유 / Agreement gap",
    achievedPower: "달성 검정력 / Achieved power",
    upperSideBeta: "상한 β / Upper-side β",
    lowerSideBeta: "하한 β / Lower-side β",
    legacyApproximateN: "기존 근사 n / Legacy approximate n",
    standardizedBiasRatio: "|Bias|/SD / Standardized bias",
    standardizedAgreementRatio: "Δ/SD / Standardized limit",
    nonInferiorityThreshold: "비열등성 한계값 / NI threshold",
    rawSample: "원계산 n / Raw n",
  };

  const cards = orderedKeys
    .filter((key) => metrics[key] !== undefined)
    .map((key) => {
      const value = formatMetricValue(key, metrics[key]);
      return `
        <div class="summary-card">
          <p class="summary-label">${escapeHtml(labels[key])}</p>
          <p class="summary-value">${escapeHtml(value)}</p>
        </div>
      `;
    })
    .join("");

  return cards ? `<div class="summary-grid">${cards}</div>` : "";
}

function renderRegulatoryWriting(context) {
  const regulatoryText = buildEnhancedRegulatoryText(context);
  return `
    <section class="result-section">
      <h4 class="result-section-title">인허가 문서 예시 문장 / Regulatory Writing Example</h4>
      <div class="doc-grid">
        <article class="doc-card">
          <p class="doc-lang">한국어</p>
          <p class="doc-body">${escapeHtml(regulatoryText.ko)}</p>
        </article>
        <article class="doc-card">
          <p class="doc-lang">English</p>
          <p class="doc-body">${escapeHtml(regulatoryText.en)}</p>
        </article>
      </div>
    </section>
  `;
}

function renderTheorySection(context) {
  const method = buildMethodPresentation(context);
  const planningOverlay = renderGuidancePlanningOverlay(context);
  const parameterRows = buildEnhancedParameterRows(context)
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.item)}</td>
          <td>${escapeHtml(row.value)}</td>
          <td>${escapeHtml(row.note)}</td>
        </tr>
      `
    )
    .join("");
  const assumptions = context.meta.assumptions
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const references = context.meta.references
    .map(
      (reference) =>
        `<li><a href="${reference.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(reference.label)}</a></li>`
    )
    .join("");

  return `
    <section class="result-section">
      <h4 class="result-section-title">이론적 방법 / Theoretical Method</h4>
      <p class="result-meta">${escapeHtml(method.summary)}</p>
      <div class="inline-formula-card">
        <p class="formula-title">${escapeHtml(method.name)}</p>
        <code>${method.hypothesis}</code>
        <code>${method.formula}</code>
      </div>
      <div class="figure-card">
        <p class="figure-title">이론 그림 / Concept Figure</p>
        <div class="theory-figure">${renderTheoryFigure(context)}</div>
        <p class="figure-caption">${escapeHtml(method.figureCaption)}</p>
      </div>
      <div class="parameter-table-wrap">
        <table class="parameter-table">
          <thead>
            <tr>
              <th>항목 / Item</th>
              <th>값 / Value</th>
              <th>설명 / Note</th>
            </tr>
          </thead>
          <tbody>${parameterRows}</tbody>
        </table>
      </div>
      ${planningOverlay}
      <div class="result-subsection">
        <p class="result-subtitle">가정 / Assumptions</p>
        <ul class="result-list">${assumptions}</ul>
      </div>
      <div class="result-subsection">
        <p class="result-subtitle">참고문헌 / References</p>
        <ul class="reference-list inline-reference-list">${references}</ul>
      </div>
    </section>
  `;
}

function buildRegulatoryText(context) {
  const { categoryLabel, meta, inputs, result } = context;
  const counts = buildRequirementPhrase(result.metrics || {});
  const threshold = result.metrics?.nonInferiorityThreshold;
  const methodNameEn = buildMethodPresentation(context).nameEn;
  const thresholdText = threshold !== undefined ? formatDisplayNumber(threshold) : "-";
  const dropoutText = formatPercentValue(inputs.dropout);

  const ko = [
    `본 ${categoryLabel} 성능평가의 샘플수는 ${meta.endpointLabelKo}를 주요 평가변수로 하여 사전 정의한 benchmark ${formatDisplayNumber(inputs.benchmarkValue)}와 비열등성 마진 ${formatDisplayNumber(inputs.nonInferiorityMargin)}를 기준으로 산출하였다.`,
    `샘플수 계산에는 one-sided alpha ${formatDisplayNumber(inputs.alpha)}와 검정력 ${formatPercentValue(inputs.power)}를 적용한 ${buildMethodPresentation(context).nameKo}을 사용하였다.`,
    `계산 결과 ${counts.koRequired}였고, 예상 탈락률 ${dropoutText}를 반영한 목표 모집 수는 ${counts.koAdjusted}로 설정하였다.`,
    `본 설계에서 적용한 비열등성 한계값은 ${thresholdText}이며, ${meta.noteKo}`,
  ].join(" ");

  const en = [
    `The sample size for the ${categoryLabel.toLowerCase()} performance evaluation was determined using ${meta.endpointLabelEn} as the primary endpoint, with a pre-specified benchmark of ${formatDisplayNumber(inputs.benchmarkValue)} and a non-inferiority margin of ${formatDisplayNumber(inputs.nonInferiorityMargin)}.`,
    `A ${methodNameEn} with a one-sided alpha of ${formatDisplayNumber(inputs.alpha)} and ${formatPercentValue(inputs.power)} power was applied.`,
    `The calculation showed that ${counts.enRequired}, and the target enrollment was set at ${counts.enAdjusted} after allowing for an anticipated dropout rate of ${dropoutText}.`,
    `The resulting non-inferiority threshold was ${thresholdText}. ${meta.noteEn}`,
  ].join(" ");

  return { ko, en };
}

function buildMethodPresentation(context) {
  const { meta } = context;

  if (meta.family === "bland-altman") {
    return {
      name: "Bland-Altman agreement design",
      nameKo: "Bland-Altman limits of agreement 기반 일치도 설계",
      nameEn: "Bland-Altman limits-of-agreement design",
      summary:
        "paired difference의 평균과 표준편차를 이용해 fixed 95% LoA 신뢰구간이 사전 정의한 허용 차이 Δ 안에 들어오도록 Lu et al.의 non-central t power search 방식으로 필요한 샘플 수를 계산합니다.",
      hypothesis: "Agreement goal: Upper LoA CI < Δ and Lower LoA CI > -Δ",
      formula:
        "SE(LoA) = s√(1/n + z<sub>1-γ/2</sub><sup>2</sup> / 2(n-1)), β = β<sub>1</sub> + β<sub>2</sub>, choose the smallest n with 1 - β ≥ target power using non-central t",
      figureCaption:
        "Expected upper and lower limits of agreement should remain inside the clinically acceptable difference band while the exact non-central t power for the fixed 95% LoA reaches the target.",
    };
  }

  if (meta.family === "auc") {
    return {
      name: "AUC 비열등성 설계 / AUC non-inferiority design",
      nameKo: "AUC에 대한 one-sample 비열등성 설계",
      nameEn: "one-sample non-inferiority design for AUC",
      summary:
        "AUC는 ROC 곡선 면적을 성능 endpoint로 두고 Hanley-McNeil 분산 근사를 이용해 양성/음성 case mix를 반영하여 샘플수를 계산합니다.",
      hypothesis: "H<sub>0</sub>: AUC<sub>AI</sub> ≤ AUC<sub>BM</sub> - Δ<sub>NI</sub>",
      formula:
        "n ~ ((z<sub>1-α</sub> × √V<sub>0</sub> + z<sub>1-β</sub> × √V<sub>1</sub>) / (AUC<sub>1</sub> - AUC<sub>0</sub>))²",
      figureCaption:
        "AUC는 expected AI value가 비열등성 한계값을 넘고, 동시에 계획한 양성/음성 case mix가 유지된다는 가정 아래 계산됩니다.",
    };
  }

  if (meta.family === "mean-higher") {
    return {
      name: "평균 기반 비열등성 설계 / Mean-based non-inferiority design",
      nameKo: "higher-is-better endpoint에 대한 평균 기반 비열등성 설계",
      nameEn: "mean-based non-inferiority design for a higher-is-better endpoint",
      summary:
        "케이스별 continuous metric의 평균 성능을 benchmark와 비교하는 one-sample 비열등성 근사식을 사용하며, 표준편차는 파일럿 또는 bootstrap 추정치를 가정합니다.",
      hypothesis: "H<sub>0</sub>: μ<sub>AI</sub> ≤ μ<sub>BM</sub> - Δ<sub>NI</sub>",
      formula:
        "n = ((z<sub>1-α</sub> + z<sub>1-β</sub>) × σ / (μ<sub>1</sub> - μ<sub>0</sub>))²",
      figureCaption:
        "higher-is-better endpoint에서는 expected AI metric이 비열등성 한계값보다 오른쪽에 위치해야 비열등성을 주장할 수 있습니다.",
    };
  }

  if (meta.family === "mean-lower") {
    return {
      name: "오차 기반 비열등성 설계 / Error-based non-inferiority design",
      nameKo: "lower-is-better endpoint에 대한 평균 기반 비열등성 설계",
      nameEn: "mean-based non-inferiority design for a lower-is-better endpoint",
      summary:
        "MAE, RMSE, MAPE, FP per Image처럼 낮을수록 좋은 endpoint는 오차 평균을 기준으로 하는 one-sample 비열등성 근사식으로 계산합니다.",
      hypothesis: "H<sub>0</sub>: μ<sub>AI</sub> ≥ μ<sub>BM</sub> + Δ<sub>NI</sub>",
      formula:
        "n = ((z<sub>1-α</sub> + z<sub>1-β</sub>) × σ / (μ<sub>0</sub> - μ<sub>1</sub>))²",
      figureCaption:
        "lower-is-better endpoint에서는 expected AI error가 비열등성 한계값보다 왼쪽에 위치해야 비열등성을 주장할 수 있습니다.",
    };
  }

  return {
    name: "비율 기반 비열등성 설계 / Proportion-based non-inferiority design",
    nameKo: "binary proportion endpoint에 대한 one-sample 비열등성 설계",
    nameEn: "one-sample non-inferiority design for a proportion endpoint",
    summary:
      "Accuracy, Sensitivity, Specificity, NPV 같은 binary proportion endpoint는 one-sample 비열등성 비율 공식으로 계산합니다.",
    hypothesis: "H<sub>0</sub>: p<sub>AI</sub> ≤ p<sub>BM</sub> - Δ<sub>NI</sub>",
    formula:
      "n = (z<sub>1-α</sub> × √(p<sub>0</sub>(1-p<sub>0</sub>)) + z<sub>1-β</sub> × √(p<sub>1</sub>(1-p<sub>1</sub>)))² / (p<sub>1</sub> - p<sub>0</sub>)²",
    figureCaption:
      "higher-is-better proportion endpoint에서는 expected AI performance가 비열등성 한계값보다 오른쪽에 있어야 비열등성을 주장할 수 있습니다.",
  };
}

function buildParameterRows(context) {
  const { categoryLabel, meta, inputs, result } = context;
  const rows = [
    {
      item: "분석 범주 / Category",
      value: categoryLabel,
      note: "평가하려는 AI 성능 범주",
    },
    {
      item: "성능지표 / Endpoint",
      value: meta.metricLabel,
      note: meta.endpointLabelKo,
    },
    {
      item: "예상 성능 / Expected value",
      value: formatDisplayNumber(inputs.expectedValue),
      note: "검증셋에서 기대하는 AI 성능값",
    },
    {
      item: "비교 기준 / Benchmark",
      value: formatDisplayNumber(inputs.benchmarkValue),
      note: "사전 정의한 benchmark 또는 comparator 성능",
    },
    {
      item: "비열등성 마진 / NI margin",
      value: formatDisplayNumber(inputs.nonInferiorityMargin),
      note: "허용 가능한 성능 열세 범위",
    },
    {
      item: "one-sided alpha",
      value: formatDisplayNumber(inputs.alpha),
      note: "제1종 오류 확률",
    },
    {
      item: "검정력 / Power",
      value: formatPercentValue(inputs.power),
      note: "비열등성을 검출할 목표 검정력",
    },
    {
      item: "예상 탈락률 / Dropout rate",
      value: formatPercentValue(inputs.dropout),
      note: "모집 목표수 보정에 사용한 탈락 가정",
    },
  ];

  if (inputs.positiveCaseRate !== undefined) {
    rows.push({
      item: "양성 케이스 비율 / Positive-case rate",
      value: formatPercentValue(inputs.positiveCaseRate),
      note: "민감도 또는 AUC 계산의 case mix 가정",
    });
  }

  if (inputs.predictedPositiveRate !== undefined) {
    rows.push({
      item: "양성 판정 비율 / Predicted-positive rate",
      value: formatPercentValue(inputs.predictedPositiveRate),
      note: "Precision/PPV 계산에서 predicted positive 비율 가정",
    });
  }

  if (inputs.predictedNegativeRate !== undefined) {
    rows.push({
      item: "음성 판정 비율 / Predicted-negative rate",
      value: formatPercentValue(inputs.predictedNegativeRate),
      note: "NPV 계산에서 predicted negative 비율 가정",
    });
  }

  if (inputs.standardDeviation !== undefined) {
    rows.push({
      item: "표준편차 / Standard deviation",
      value: formatDisplayNumber(inputs.standardDeviation),
      note: "파일럿 또는 bootstrap 기반 분산 추정치",
    });
  }

  if (inputs.lesionsPerPositiveCase !== undefined) {
    rows.push({
      item: "양성당 병변 수 / Lesions per positive case",
      value: formatDisplayNumber(inputs.lesionsPerPositiveCase),
      note: "병변 수를 케이스 수로 환산하는 데 사용",
    });
  }

  if (result.metrics?.nonInferiorityThreshold !== undefined) {
    rows.push({
      item: "비열등성 한계값 / NI threshold",
      value: formatDisplayNumber(result.metrics.nonInferiorityThreshold),
      note: "benchmark와 NI margin으로부터 계산된 기준값",
    });
  }

  if (result.metrics?.rawSample !== undefined) {
    rows.push({
      item: "원계산 샘플수 / Raw sample size",
      value: formatDisplayNumber(result.metrics.rawSample, 4),
      note: "올림 처리 전 계산식 결과",
    });
  }

  return rows;
}

function renderTheoryFigure(context) {
  const { inputs, result, meta } = context;
  if (meta.family === "bland-altman") {
    const allowedDifference = result.metrics?.maxAllowedDifference;
    const expectedUpperLoA = result.metrics?.expectedUpperLoA;
    const expectedLowerLoA = result.metrics?.expectedLowerLoA;
    const expectedBias = result.metrics?.expectedBias;

    if (
      allowedDifference === undefined ||
      expectedUpperLoA === undefined ||
      expectedLowerLoA === undefined ||
      expectedBias === undefined
    ) {
      return "";
    }

    const markers = [
      { label: "-Δ", value: -allowedDifference, color: "#b54f2c" },
      { label: "Lower LoA", value: expectedLowerLoA, color: "#244466" },
      { label: "Bias", value: expectedBias, color: "#0f6d63" },
      { label: "Upper LoA", value: expectedUpperLoA, color: "#244466" },
      { label: "+Δ", value: allowedDifference, color: "#b54f2c" },
    ];
    const axis = computeAxisRange(markers.map((marker) => marker.value));
    const startX = 64;
    const endX = 676;
    const axisY = 108;
    const topLabelY = 42;
    const bottomLabelY = 186;
    const width = 740;
    const height = 220;
    const mapX = (value) => startX + ((value - axis.min) / (axis.max - axis.min)) * (endX - startX);
    const ticks = Array.from({ length: 5 }, (_, index) => axis.min + ((axis.max - axis.min) * index) / 4);
    const badges = buildFigureBadges(context)
      .map((badge) => `<span class="figure-badge">${escapeHtml(`${badge.label}: ${badge.value}`)}</span>`)
      .join("");

    const tickMarkup = ticks
      .map((tick) => {
        const x = mapX(tick);
        return `
          <line x1="${x}" y1="${axisY - 8}" x2="${x}" y2="${axisY + 8}" stroke="rgba(36, 68, 102, 0.35)" stroke-width="1.5" />
          <text x="${x}" y="${axisY + 28}" text-anchor="middle" font-size="12" fill="#52606d">${escapeHtml(formatDisplayNumber(tick))}</text>
        `;
      })
      .join("");

    const markerMarkup = markers
      .map((marker, index) => {
        const x = mapX(marker.value);
        const labelY = index % 2 === 0 ? topLabelY : bottomLabelY;
        const connectorEndY = labelY < axisY ? axisY - 20 : axisY + 20;
        return `
          <line x1="${x}" y1="${connectorEndY}" x2="${x}" y2="${axisY}" stroke="${marker.color}" stroke-width="2" stroke-dasharray="4 4" />
          <circle cx="${x}" cy="${axisY}" r="6" fill="${marker.color}" />
          <text x="${x}" y="${labelY}" text-anchor="middle" font-size="13" font-weight="700" fill="${marker.color}">${escapeHtml(marker.label)}</text>
          <text x="${x}" y="${labelY + 16}" text-anchor="middle" font-size="12" fill="#18222f">${escapeHtml(formatDisplayNumber(marker.value))}</text>
        `;
      })
      .join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bland-Altman agreement concept figure">
        <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="#ffffff" />
        <line x1="${startX}" y1="${axisY}" x2="${endX}" y2="${axisY}" stroke="#244466" stroke-width="4" stroke-linecap="round" />
        ${tickMarkup}
        ${markerMarkup}
        <text x="${startX}" y="26" font-size="12" fill="#52606d">${escapeHtml(meta.metricLabel)}</text>
        <text x="${endX}" y="26" text-anchor="end" font-size="12" fill="#52606d">Agreement region: [-Δ, +Δ]</text>
      </svg>
      ${badges ? `<div class="figure-meta">${badges}</div>` : ""}
    `;
  }

  const threshold = result.metrics?.nonInferiorityThreshold;
  if (threshold === undefined) {
    return "";
  }

  const direction = meta.family === "mean-lower" ? "lower" : "higher";
  const markers = [
    {
      label: "NI threshold",
      value: threshold,
      color: "#b54f2c",
    },
    {
      label: "Expected AI",
      value: inputs.expectedValue,
      color: "#0f6d63",
    },
    {
      label: "Benchmark",
      value: inputs.benchmarkValue,
      color: "#244466",
    },
  ];
  const axis = computeAxisRange(markers.map((marker) => marker.value));
  const startX = 64;
  const endX = 676;
  const axisY = 108;
  const topLabelY = 42;
  const bottomLabelY = 186;
  const width = 740;
  const height = 220;
  const mapX = (value) => startX + ((value - axis.min) / (axis.max - axis.min)) * (endX - startX);
  const ticks = Array.from({ length: 5 }, (_, index) => axis.min + ((axis.max - axis.min) * index) / 4);
  const directionText = direction === "higher" ? "Higher is better" : "Lower is better";
  const badges = buildFigureBadges(context)
    .map((badge) => `<span class="figure-badge">${escapeHtml(`${badge.label}: ${badge.value}`)}</span>`)
    .join("");

  const tickMarkup = ticks
    .map((tick) => {
      const x = mapX(tick);
      return `
        <line x1="${x}" y1="${axisY - 8}" x2="${x}" y2="${axisY + 8}" stroke="rgba(36, 68, 102, 0.35)" stroke-width="1.5" />
        <text x="${x}" y="${axisY + 28}" text-anchor="middle" font-size="12" fill="#52606d">${escapeHtml(formatDisplayNumber(tick))}</text>
      `;
    })
    .join("");

  const markerMarkup = markers
    .map((marker, index) => {
      const x = mapX(marker.value);
      const labelY = index % 2 === 0 ? topLabelY : bottomLabelY;
      const connectorEndY = labelY < axisY ? axisY - 20 : axisY + 20;
      return `
        <line x1="${x}" y1="${connectorEndY}" x2="${x}" y2="${axisY}" stroke="${marker.color}" stroke-width="2" stroke-dasharray="4 4" />
        <circle cx="${x}" cy="${axisY}" r="6" fill="${marker.color}" />
        <text x="${x}" y="${labelY}" text-anchor="middle" font-size="13" font-weight="700" fill="${marker.color}">${escapeHtml(marker.label)}</text>
        <text x="${x}" y="${labelY + 16}" text-anchor="middle" font-size="12" fill="#18222f">${escapeHtml(formatDisplayNumber(marker.value))}</text>
      `;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Non-inferiority concept figure">
      <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="#ffffff" />
      <line x1="${startX}" y1="${axisY}" x2="${endX}" y2="${axisY}" stroke="#244466" stroke-width="4" stroke-linecap="round" />
      ${tickMarkup}
      ${markerMarkup}
      <text x="${startX}" y="26" font-size="12" fill="#52606d">${escapeHtml(meta.metricLabel)}</text>
      <text x="${endX}" y="26" text-anchor="end" font-size="12" fill="#52606d">${escapeHtml(directionText)}</text>
    </svg>
    ${badges ? `<div class="figure-meta">${badges}</div>` : ""}
  `;
}

function buildFigureBadges(context) {
  const { inputs, result, meta } = context;
  const badges = [];

  if (inputs.positiveCaseRate !== undefined) {
    badges.push({
      label: "Positive rate",
      value: formatPercentValue(inputs.positiveCaseRate),
    });
  }

  if (inputs.predictedPositiveRate !== undefined) {
    badges.push({
      label: "Predicted-positive rate",
      value: formatPercentValue(inputs.predictedPositiveRate),
    });
  }

  if (inputs.predictedNegativeRate !== undefined) {
    badges.push({
      label: "Predicted-negative rate",
      value: formatPercentValue(inputs.predictedNegativeRate),
    });
  }

  if (inputs.standardDeviation !== undefined) {
    badges.push({
      label: "SD",
      value: formatDisplayNumber(inputs.standardDeviation),
    });
  }

  if (inputs.lesionsPerPositiveCase !== undefined) {
    badges.push({
      label: "Lesions/positive case",
      value: formatDisplayNumber(inputs.lesionsPerPositiveCase),
    });
  }

  if (meta.family === "auc" && result.metrics?.requiredPositiveCases !== undefined) {
    badges.push({
      label: "Positive cases",
      value: formatCount(result.metrics.requiredPositiveCases),
    });
  }

  if (meta.family === "auc" && result.metrics?.requiredNegativeCases !== undefined) {
    badges.push({
      label: "Negative cases",
      value: formatCount(result.metrics.requiredNegativeCases),
    });
  }

  if (meta.family === "bland-altman" && result.metrics?.expectedUpperLoA !== undefined) {
    badges.push({
      label: "Upper LoA",
      value: formatDisplayNumber(result.metrics.expectedUpperLoA),
    });
  }

  if (meta.family === "bland-altman" && result.metrics?.criticalLoA !== undefined) {
    badges.push({
      label: "Critical |LoA|",
      value: formatDisplayNumber(result.metrics.criticalLoA),
    });
  }

  if (meta.family === "bland-altman" && result.metrics?.maxAllowedDifference !== undefined) {
    badges.push({
      label: "Allowed diff",
      value: formatDisplayNumber(result.metrics.maxAllowedDifference),
    });
  }

  if (meta.family === "bland-altman" && result.metrics?.achievedPower !== undefined) {
    badges.push({
      label: "Achieved power",
      value: formatPercentValue(result.metrics.achievedPower),
    });
  }

  return badges;
}

function buildRequirementPhrase(metrics) {
  const adjusted = metrics.adjustedTotalCases ?? metrics.adjustedCases;

  if (metrics.requiredLesions !== undefined) {
    return {
      koRequired: `최소 병변 수는 ${formatCount(metrics.requiredLesions)}개이고, 이는 양성 케이스 ${formatCount(metrics.requiredPositiveCases)}건과 총 평가 케이스 ${formatCount(metrics.estimatedTotalCases)}건에 해당한다`,
      enRequired: `at least ${formatCount(metrics.requiredLesions)} lesions were required, corresponding to ${formatCount(metrics.requiredPositiveCases)} positive cases and ${formatCount(metrics.estimatedTotalCases)} total evaluation cases`,
      koAdjusted: `${formatCount(adjusted)}건`,
      enAdjusted: `${formatCount(adjusted)} cases`,
    };
  }

  if (metrics.requiredNegativePredictions !== undefined) {
    return {
      koRequired: `최소 음성 판정 수는 ${formatCount(metrics.requiredNegativePredictions)}건이고, 이는 총 평가 케이스 ${formatCount(metrics.estimatedTotalCases)}건에 해당한다`,
      enRequired: `at least ${formatCount(metrics.requiredNegativePredictions)} predicted negatives were required, corresponding to ${formatCount(metrics.estimatedTotalCases)} total evaluation cases`,
      koAdjusted: `${formatCount(adjusted)}건`,
      enAdjusted: `${formatCount(adjusted)} cases`,
    };
  }

  if (
    metrics.requiredCases !== undefined &&
    metrics.requiredPositiveCases !== undefined &&
    metrics.requiredNegativeCases !== undefined
  ) {
    return {
      koRequired: `최소 총 평가 케이스 수는 ${formatCount(metrics.requiredCases)}건이며, 이 중 양성 ${formatCount(metrics.requiredPositiveCases)}건과 음성 ${formatCount(metrics.requiredNegativeCases)}건이 필요하다`,
      enRequired: `a minimum of ${formatCount(metrics.requiredCases)} total evaluation cases were required, including ${formatCount(metrics.requiredPositiveCases)} positive and ${formatCount(metrics.requiredNegativeCases)} negative cases`,
      koAdjusted: `${formatCount(adjusted)}건`,
      enAdjusted: `${formatCount(adjusted)} cases`,
    };
  }

  if (metrics.requiredPositiveCases !== undefined && metrics.estimatedTotalCases !== undefined) {
    return {
      koRequired: `최소 양성 케이스 수는 ${formatCount(metrics.requiredPositiveCases)}건이고, 이는 총 평가 케이스 ${formatCount(metrics.estimatedTotalCases)}건에 해당한다`,
      enRequired: `at least ${formatCount(metrics.requiredPositiveCases)} positive cases were required, corresponding to ${formatCount(metrics.estimatedTotalCases)} total evaluation cases`,
      koAdjusted: `${formatCount(adjusted)}건`,
      enAdjusted: `${formatCount(adjusted)} cases`,
    };
  }

  if (metrics.requiredNegativeCases !== undefined && metrics.estimatedTotalCases !== undefined) {
    return {
      koRequired: `최소 음성 케이스 수는 ${formatCount(metrics.requiredNegativeCases)}건이고, 이는 총 평가 케이스 ${formatCount(metrics.estimatedTotalCases)}건에 해당한다`,
      enRequired: `at least ${formatCount(metrics.requiredNegativeCases)} negative cases were required, corresponding to ${formatCount(metrics.estimatedTotalCases)} total evaluation cases`,
      koAdjusted: `${formatCount(adjusted)}건`,
      enAdjusted: `${formatCount(adjusted)} cases`,
    };
  }

  return {
    koRequired: `최소 평가 케이스 수는 ${formatCount(metrics.requiredCases)}건이다`,
    enRequired: `a minimum of ${formatCount(metrics.requiredCases)} evaluation cases were required`,
    koAdjusted: `${formatCount(adjusted)}건`,
    enAdjusted: `${formatCount(adjusted)} cases`,
  };
}

function computeAxisRange(values) {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const unitInterval = values.every((value) => value >= 0 && value <= 1);
  const baseSpan = Math.max(maxValue - minValue, unitInterval ? 0.12 : Math.max(Math.abs(maxValue), 1) * 0.18);
  let min = minValue - baseSpan * 0.28;
  let max = maxValue + baseSpan * 0.28;

  if (unitInterval) {
    min = Math.max(0, min);
    max = Math.min(1, max);
    if (max - min < 0.15) {
      const center = (max + min) / 2;
      min = Math.max(0, center - 0.075);
      max = Math.min(1, center + 0.075);
    }
  }

  if (max === min) {
    max = min + 1;
  }

  return { min, max };
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatMetricValue(key, value) {
  if (
    [
      "rawSample",
      "nonInferiorityThreshold",
      "expectedUpperLoA",
      "expectedLowerLoA",
      "criticalLoA",
      "maxAllowedDifference",
      "agreementGap",
      "upperSideBeta",
      "lowerSideBeta",
      "legacyApproximateN",
      "standardizedBiasRatio",
      "standardizedAgreementRatio",
    ].includes(
      key
    )
  ) {
    return formatDisplayNumber(value, key === "rawSample" || key === "legacyApproximateN" ? 4 : 3);
  }

  if (key === "achievedPower") {
    return formatPercentValue(value);
  }

  return formatCount(value);
}

function formatDisplayNumber(value, digits = 3) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return String(value);
  }

  if (Math.abs(numeric) >= 1000) {
    return numeric.toLocaleString("en-US", {
      maximumFractionDigits: digits,
    });
  }

  return numeric
    .toFixed(digits)
    .replace(/\.?0+$/, "");
}

function formatPercentValue(value, digits = 1) {
  return `${(Number(value) * 100).toFixed(digits).replace(/\.?0+$/, "")}%`;
}

function formatCount(value) {
  return Number(value).toLocaleString("en-US");
}

function toTitleCase(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
