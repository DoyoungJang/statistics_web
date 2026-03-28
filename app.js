const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const forms = document.querySelectorAll(".calc-form");
const serverStatus = document.querySelector("[data-server-status]");
const metricAwareForms = document.querySelectorAll(".metric-aware-form");

const metricConfigs = {
  classification: {
    accuracy: {
      labels: {
        expectedValue: "예상 Accuracy",
        benchmarkValue: "비교 기준 Accuracy",
      },
      visibleFields: [],
      help: "Accuracy는 전체 평가 케이스를 기준으로 비열등성 proportion 계산을 수행합니다.",
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
      help: "Sensitivity는 양성 케이스 수를 먼저 계산한 뒤 양성 케이스 비율로 총 케이스 수를 환산합니다.",
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
      help: "Specificity는 음성 케이스 수를 기준으로 계산하므로, 양성 케이스 비율을 이용해 음성 비율을 자동 해석합니다.",
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
      help: "AUC는 Hanley-McNeil 분산 근사를 사용해 양성/음성 케이스 비율을 반영합니다. one-sided alpha 0.025는 통상 양측 95% 신뢰구간 해석과 대응됩니다.",
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
      help: "F1-score는 집계형 metric이므로 파일럿 데이터 또는 bootstrap resampling으로 얻은 SD를 넣어 mean 근사식으로 계산합니다.",
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
    npv: {
      labels: {
        expectedValue: "예상 NPV",
        benchmarkValue: "비교 기준 NPV",
        predictedNegativeRate: "예상 음성 판정 비율",
      },
      visibleFields: ["predictedNegativeRate"],
      help: "NPV는 음성 판정된 케이스를 분석 단위로 사용하므로, 예상 음성 판정 비율을 이용해 총 케이스 수를 환산합니다.",
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
      help: "Segmentation Accuracy는 케이스별 평균 metric으로 보고 mean 비열등성 근사식을 적용합니다.",
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
      help: "DSC는 케이스별 Dice Similarity Coefficient 평균과 표준편차를 기반으로 계산합니다.",
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
      help: "IoU도 케이스별 평균 metric으로 보고 mean 비열등성 근사식을 사용합니다.",
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
      help: "Detection Accuracy는 image-level 정확도를 proportion metric으로 가정합니다.",
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
      help: "Detection IoU는 matched detection들의 평균 IoU 분포를 기반으로 mean 근사식을 적용합니다.",
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
      help: "Lesion-level Sensitivity는 병변 수를 기준으로 계산한 뒤, 양성 케이스 비율과 병변 수/케이스로 전체 검증 규모를 환산합니다.",
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
      help: "FP per Image는 낮을수록 좋은 lower-better 지표로 계산합니다.",
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
      help: "mAP는 집계형 metric이므로 bootstrap SD를 이용한 mean 근사식을 권장합니다.",
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
      help: "Measurement Accuracy는 허용오차 내 비율을 proportion metric으로 정의한 경우에 사용합니다.",
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
      help: "MAE는 낮을수록 좋은 lower-better 지표입니다.",
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
      help: "RMSE도 lower-better 지표로 계산합니다.",
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
      help: "MAPE 역시 lower-better 지표입니다.",
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
      help: "R-squared는 높을수록 좋은 higher-better 지표로 계산합니다.",
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
    noteKo: "케이스별 세그멘테이션 성능 평균을 이용한 continuous endpoint로 계산합니다.",
    noteEn: "The calculation treats the case-level segmentation performance as a continuous endpoint.",
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
    noteKo: "paired reference measurement와의 오차 분포를 continuous lower-better endpoint로 처리합니다.",
    noteEn: "The paired measurement error distribution is treated as a continuous lower-is-better endpoint.",
  }),
  "measurement:mape": createResultMeta({
    metricLabel: "MAPE",
    endpointLabelKo: "평균절대백분율오차",
    endpointLabelEn: "mean absolute percentage error",
    family: "mean-lower",
    references: sharedReferences.meanLower,
    assumptions: sharedAssumptions.meanLower,
    noteKo: "percentage error 분포를 continuous lower-better endpoint로 처리합니다.",
    noteEn: "The percentage error distribution is treated as a continuous lower-is-better endpoint.",
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
};

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

checkServerHealth();

async function checkServerHealth() {
  if (!serverStatus) {
    return;
  }

  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error("health check failed");
    }
    const payload = await response.json();
    serverStatus.textContent = `서버 연결됨 · ${payload.service} · port ${payload.port}`;
    serverStatus.classList.add("connected");
  } catch (error) {
    serverStatus.textContent = "서버 연결 실패 · python main.py로 서버를 실행해주세요.";
    serverStatus.classList.add("disconnected");
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

function applyMetricConfig(form) {
  const formKind = form.dataset.formKind;
  const metric = form.querySelector("[data-metric-select]")?.value;
  const config = metricConfigs[formKind]?.[metric];

  if (!config) {
    return;
  }

  form.querySelectorAll("[data-label-key]").forEach((labelNode) => {
    const key = labelNode.dataset.labelKey;
    if (config.labels[key]) {
      labelNode.textContent = config.labels[key];
    }
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

  return {
    formKind,
    categoryLabel: toTitleCase(formKind),
    metric,
    meta,
    inputs,
    result,
  };
}

function renderSummaryMetrics(metrics) {
  const orderedKeys = [
    "requiredCases",
    "requiredPositiveCases",
    "requiredNegativeCases",
    "requiredNegativePredictions",
    "requiredLesions",
    "estimatedTotalCases",
    "adjustedCases",
    "adjustedTotalCases",
    "nonInferiorityThreshold",
    "rawSample",
  ];
  const labels = {
    requiredCases: "최소 케이스 / Required cases",
    requiredPositiveCases: "양성 케이스 / Positive cases",
    requiredNegativeCases: "음성 케이스 / Negative cases",
    requiredNegativePredictions: "음성 판정 수 / Predicted negatives",
    requiredLesions: "병변 수 / Lesions",
    estimatedTotalCases: "총 케이스 환산 / Estimated total",
    adjustedCases: "목표 모집 수 / Target enrollment",
    adjustedTotalCases: "목표 모집 수 / Target enrollment",
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
  const regulatoryText = buildRegulatoryText(context);
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
  const parameterRows = buildParameterRows(context)
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

function formatMetricValue(key, value) {
  if (["rawSample", "nonInferiorityThreshold"].includes(key)) {
    return formatDisplayNumber(value, key === "rawSample" ? 4 : 3);
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
