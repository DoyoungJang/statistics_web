(function () {
  const view = document.querySelector("[data-ai-stat-example-view]");

  if (!view) {
    return;
  }

  const capabilityButtons = Array.from(document.querySelectorAll("[data-ai-stat-capability]"));
  const regionButtons = Array.from(document.querySelectorAll("[data-ai-stat-region]"));
  const actionButtons = Array.from(document.querySelectorAll("[data-ai-stat-action]"));
  const form = document.querySelector("[data-ai-stat-form]");
  const generateButton = document.querySelector("[data-ai-stat-generate]");
  const copyButton = document.querySelector("[data-ai-stat-copy]");
  const helpNode = document.querySelector("[data-ai-stat-help]");
  const outputNode = document.querySelector("[data-ai-stat-output]");
  const capabilityTitleNode = document.querySelector("[data-ai-stat-capability-title]");
  const capabilityDescriptionNode = document.querySelector("[data-ai-stat-capability-description]");
  const workflowNode = document.querySelector("[data-ai-stat-summary-workflow]");
  const endpointNode = document.querySelector("[data-ai-stat-summary-endpoint]");
  const frameNode = document.querySelector("[data-ai-stat-summary-frame]");
  const reviewListNode = document.querySelector("[data-ai-stat-review-list]");
  const sourceListNode = document.querySelector("[data-ai-stat-source-list]");
  const realtimeField = document.querySelector('[data-ai-stat-field="latencyTarget"]');
  const reviewLens = document.querySelector("[data-ai-stat-review-lens]");
  const workspaceStatuses = Array.from(document.querySelectorAll("[data-workspace-status]"));

  const aiStatJurisdictions = {
    fda: {
      label: "FDA",
      shortLabel: "FDA",
      sources: [
        {
          title: "Artificial Intelligence-Enabled Device Software Functions: Lifecycle Management and Marketing Submission Recommendations",
          href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/artificial-intelligence-enabled-device-software-functions-lifecycle-management-and-marketing",
          note: "Draft guidance, January 2025",
        },
        {
          title: "Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence-Enabled Device Software Functions",
          href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence",
          note: "Final guidance, August 2025",
        },
        {
          title: "Performance Evaluation Methods for Evolving Artificial Intelligence (AI)-Enabled Medical Devices",
          href: "https://www.fda.gov/medical-devices/medical-device-regulatory-science-research-programs-conducted-osel/performance-evaluation-methods-evolving-artificial-intelligence-ai-enabled-medical-devices",
          note: "Regulatory science page on evaluation methods",
        },
      ],
      principles: [
        "임상 주장과 직접 연결된 task-specific endpoint를 사전에 고정하고, 독립 검증 데이터셋과 신뢰구간 중심으로 제시",
        "reference standard, subgroup performance, uncertainty, human factors를 함께 설명",
        "업데이트 가능성이 있으면 PCCP와 post-market monitoring 가정까지 같이 제시",
      ],
    },
    mfds: {
      label: "한국 식약처",
      shortLabel: "MFDS",
      sources: [
        {
          title: "독립형 디지털의료기기소프트웨어 사용적합성 허가·심사 가이드라인",
          href: "https://www.mfds.go.kr/brd/m_1060/view.do?seq=15627",
          note: "민원인안내서, 2025-01-24",
        },
        {
          title: "생성형 인공지능 의료기기 허가·심사 가이드라인",
          href: "https://www.mfds.go.kr/brd/m_1060/view.do?seq=15628",
          note: "민원인안내서, 2025-01-24",
        },
      ],
      principles: [
        "의도된 사용, 사용자, 임상환경, 입력자료 관리와 acceptance criteria를 문서화",
        "검증용 데이터의 적절성, 분석집단, 사용적합성, 표시 해석 가능성을 함께 제시",
        "국내 허가 심사 문서에서는 통과/실패 기준과 샘플수 정당화를 더 명확히 적는 편이 안전",
      ],
    },
    ce: {
      label: "CE / EU",
      shortLabel: "CE",
      sources: [
        {
          title: "Regulation (EU) 2017/745 on medical devices",
          href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745",
          note: "MDR Article 62 and Annex XV",
        },
        {
          title: "MDCG 2024-3 - Guidance on content of the Clinical Investigation Plan for clinical investigations of medical devices",
          href: "https://health.ec.europa.eu/latest-updates/mdcg-2024-3-guidance-content-clinical-investigation-plan-clinical-investigations-medical-devices-2024-03-12_en",
          note: "March 2024",
        },
        {
          title: "Guidance - MDCG endorsed documents and other guidance",
          href: "https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en",
          note: "Lists MDCG 2020-1 for MDSW clinical evaluation",
        },
      ],
      principles: [
        "Clinical Investigation Plan 안에 objectives, hypotheses, bias control, representativeness, statistical design을 명시",
        "adequate number of observations, monitoring plan, 분석방법과 confounding control을 함께 설명",
        "software clinical evaluation과 clinical investigation 문서 간 정합성을 맞추는 구성이 중요",
      ],
    },
  };

  const aiStatCapabilityConfigs = {
    classification: {
      label: "Classification",
      workflowType: "stored",
      description: "저장된 이미지 또는 cine loop를 기반으로 질환 범주를 분류하는 AI 기능입니다.",
      workflowSummary: "Stored-image review",
      endpointSummary: "AUC, sensitivity, specificity",
      exampleFrame: "Benchmark-based non-inferiority",
      primaryEndpoint: "AUC 또는 사전 고정 sensitivity / specificity",
      analysisSet: "독립 검증 세트, case-level 분석",
      referenceStandard: "전문가 3인 합의 또는 pathology / follow-up",
      sampleSizeMethod: "독립 검증 코호트에서 AUC 또는 sensitivity의 신뢰구간/비열등성 기준 충족",
      sampleUnit: "subjects",
      baseCases: 260,
      subgroupFloorPerGroup: 45,
      positiveRate: 0.35,
      defaults: {
        indication: "Thyroid nodule risk assessment on ultrasound",
        intendedUse: "Provide decision support during diagnostic ultrasound review",
        population: "Adults undergoing diagnostic thyroid ultrasound in routine care",
        comparator: "Three-reader consensus adjudication",
        claimStyle: "non-inferiority",
        sites: 6,
        readers: 3,
        dropout: 0.1,
        designEffect: 1.05,
        subgroupCount: 3,
        latencyTarget: 150,
      },
    },
    detection: {
      label: "Detection",
      workflowType: "stored",
      description: "저장된 이미지에서 병변의 존재를 찾거나 위치 후보를 제시하는 AI 기능입니다.",
      workflowSummary: "Stored-image lesion review",
      endpointSummary: "Sensitivity, FP / image, localization",
      exampleFrame: "Sensitivity with prespecified false positive control",
      primaryEndpoint: "Lesion-level sensitivity with image-level FP constraint",
      analysisSet: "독립 검증 세트, case-level + lesion-level 분석",
      referenceStandard: "전문가 판독 + 합의 localization annotation",
      sampleSizeMethod: "양성 증례와 총 lesion 수를 함께 계획하고, FP / image 상한을 병행 제시",
      sampleUnit: "positive subjects",
      baseCases: 220,
      subgroupFloorPerGroup: 40,
      positiveRate: 0.42,
      lesionsPerPositiveCase: 1.8,
      defaults: {
        indication: "Focal liver lesion detection on ultrasound",
        intendedUse: "Highlight candidate lesion locations on saved ultrasound images",
        population: "Adults with focal liver lesion workup in diagnostic ultrasound",
        comparator: "Reader panel with lesion-level adjudication",
        claimStyle: "precision",
        sites: 7,
        readers: 3,
        dropout: 0.12,
        designEffect: 1.08,
        subgroupCount: 4,
        latencyTarget: 150,
      },
    },
    segmentation: {
      label: "Segmentation",
      workflowType: "stored",
      description: "저장된 초음파 영상에서 구조물 경계 또는 관심영역을 분할하는 AI 기능입니다.",
      workflowSummary: "Stored-image contouring",
      endpointSummary: "Dice, boundary error, acceptance rate",
      exampleFrame: "Agreement / precision design",
      primaryEndpoint: "Mean Dice with lower confidence bound or pass-rate above threshold",
      analysisSet: "독립 검증 세트, paired contour 분석",
      referenceStandard: "전문가 수동 segmentation + 합의 annotation",
      sampleSizeMethod: "paired agreement 설계로 Dice와 경계오차를 함께 제시",
      sampleUnit: "paired studies",
      baseCases: 180,
      subgroupFloorPerGroup: 35,
      defaults: {
        indication: "Thyroid volume segmentation on ultrasound",
        intendedUse: "Automatically delineate the target structure on saved ultrasound frames",
        population: "Adults undergoing thyroid ultrasound",
        comparator: "Consensus manual contour by expert sonographers",
        claimStyle: "agreement",
        sites: 5,
        readers: 2,
        dropout: 0.08,
        designEffect: 1.04,
        subgroupCount: 3,
        latencyTarget: 150,
      },
    },
    measurement: {
      label: "Measurement",
      workflowType: "stored",
      description: "저장된 초음파 이미지에서 길이, 면적, 체적 등 정량 측정을 수행하는 AI 기능입니다.",
      workflowSummary: "Stored-image quantification",
      endpointSummary: "Bias, limits of agreement, ICC",
      exampleFrame: "Agreement with clinical tolerance",
      primaryEndpoint: "Mean bias and proportion within tolerance band",
      analysisSet: "독립 검증 세트, paired measurement 분석",
      referenceStandard: "전문가 측정 평균 또는 core lab measurement",
      sampleSizeMethod: "Bland-Altman + ICC 또는 tolerance pass-rate 기반 설계",
      sampleUnit: "paired studies",
      baseCases: 160,
      subgroupFloorPerGroup: 30,
      defaults: {
        indication: "Fetal biometry support on ultrasound",
        intendedUse: "Automatically quantify measurement parameters from saved ultrasound images",
        population: "Pregnant patients undergoing routine obstetric ultrasound",
        comparator: "Core lab measurement and expert reader average",
        claimStyle: "agreement",
        sites: 6,
        readers: 2,
        dropout: 0.1,
        designEffect: 1.05,
        subgroupCount: 4,
        latencyTarget: 150,
      },
    },
    "realtime-classification": {
      label: "실시간 Classification",
      workflowType: "realtime",
      description: "스캔 중 실시간으로 분류 결과를 표시하는 AI 기능입니다.",
      workflowSummary: "Real-time scan assistance",
      endpointSummary: "Case accuracy, latency, display success",
      exampleFrame: "Clinical workflow assistance with latency control",
      primaryEndpoint: "Case-level accuracy with prespecified display latency threshold",
      analysisSet: "독립 검증 세트, scan-level 분석",
      referenceStandard: "전문가 최종 판정 + stored review adjudication",
      sampleSizeMethod: "scan-level 성능과 latency / display 성공률을 함께 계획",
      sampleUnit: "scans",
      baseCases: 280,
      subgroupFloorPerGroup: 45,
      positiveRate: 0.35,
      defaults: {
        indication: "Real-time thyroid nodule risk support on ultrasound",
        intendedUse: "Provide real-time category suggestion during live ultrasound scanning",
        population: "Adults undergoing diagnostic thyroid ultrasound",
        comparator: "Reader panel plus stored review adjudication",
        claimStyle: "non-inferiority",
        sites: 7,
        readers: 3,
        dropout: 0.12,
        designEffect: 1.1,
        subgroupCount: 4,
        latencyTarget: 150,
      },
    },
    "realtime-detection": {
      label: "실시간 Detection",
      workflowType: "realtime",
      description: "스캔 중 화면 위에 병변 후보를 실시간 표시하는 AI 기능입니다.",
      workflowSummary: "Real-time lesion highlighting",
      endpointSummary: "Scan sensitivity, FP / minute, latency",
      exampleFrame: "Sensitivity with operational false-positive control",
      primaryEndpoint: "Scan-level lesion detection sensitivity with FP / minute limit",
      analysisSet: "독립 검증 세트, scan-level + lesion-level 분석",
      referenceStandard: "Stored cine review with adjudicated lesion localization",
      sampleSizeMethod: "scan 수와 positive lesion burden을 함께 계획하고 latency를 추가 제어",
      sampleUnit: "positive scans",
      baseCases: 260,
      subgroupFloorPerGroup: 45,
      positiveRate: 0.45,
      lesionsPerPositiveCase: 2.0,
      defaults: {
        indication: "Real-time focal liver lesion detection on ultrasound",
        intendedUse: "Highlight candidate lesion locations during live ultrasound scanning",
        population: "Adults undergoing abdominal ultrasound for focal lesion workup",
        comparator: "Expert review with lesion localization adjudication",
        claimStyle: "precision",
        sites: 8,
        readers: 3,
        dropout: 0.12,
        designEffect: 1.12,
        subgroupCount: 4,
        latencyTarget: 120,
      },
    },
    "realtime-segmentation": {
      label: "실시간 Segmentation",
      workflowType: "realtime",
      description: "스캔 중 구조물의 경계를 실시간 overlay로 제시하는 AI 기능입니다.",
      workflowSummary: "Real-time contour overlay",
      endpointSummary: "Dice, contour stability, latency",
      exampleFrame: "Agreement design with display performance",
      primaryEndpoint: "Real-time contour agreement with lower confidence bound",
      analysisSet: "독립 검증 세트, frame cluster 보정 scan-level 분석",
      referenceStandard: "Stored frame expert contour and scan-level acceptability review",
      sampleSizeMethod: "scan 단위 대표 frame cluster를 고려한 agreement 설계",
      sampleUnit: "scans",
      baseCases: 220,
      subgroupFloorPerGroup: 40,
      defaults: {
        indication: "Real-time fetal head segmentation on ultrasound",
        intendedUse: "Overlay target contour during live scanning to support acquisition",
        population: "Pregnant patients undergoing obstetric ultrasound",
        comparator: "Expert contour review with frame sampling adjudication",
        claimStyle: "agreement",
        sites: 7,
        readers: 2,
        dropout: 0.1,
        designEffect: 1.12,
        subgroupCount: 4,
        latencyTarget: 100,
      },
    },
    "realtime-measurement": {
      label: "실시간 Measurement",
      workflowType: "realtime",
      description: "스캔 중 실시간으로 측정값을 계산하고 표시하는 AI 기능입니다.",
      workflowSummary: "Real-time quantitative assistance",
      endpointSummary: "Tolerance pass-rate, bias, latency",
      exampleFrame: "Agreement within clinical tolerance",
      primaryEndpoint: "Proportion of measurements within prespecified clinical tolerance",
      analysisSet: "독립 검증 세트, scan-level paired measurement 분석",
      referenceStandard: "Core lab or expert measurement after stored review",
      sampleSizeMethod: "허용오차 내 비율과 평균 bias, latency / override 이벤트를 함께 계획",
      sampleUnit: "measurements",
      baseCases: 210,
      subgroupFloorPerGroup: 40,
      defaults: {
        indication: "Real-time fetal biometry support on ultrasound",
        intendedUse: "Display automated measurements during live ultrasound scanning",
        population: "Pregnant patients undergoing routine obstetric ultrasound",
        comparator: "Expert review and core lab measurement",
        claimStyle: "agreement",
        sites: 8,
        readers: 2,
        dropout: 0.12,
        designEffect: 1.12,
        subgroupCount: 4,
        latencyTarget: 120,
      },
    },
  };

  let activeCapability = "classification";
  let activeRegion = "all";
  let hasGenerated = false;

  initializeAiStatExamples();

  function initializeAiStatExamples() {
    capabilityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setAiStatCapability(button.dataset.aiStatCapability, { applyDefaults: true });
      });
    });

    regionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setAiStatRegion(button.dataset.aiStatRegion);
      });
    });

    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        handleAiStatAction(button.dataset.aiStatAction);
      });
    });

    if (generateButton) {
      generateButton.addEventListener("click", () => {
        generateAiStatExample({ scrollIntoView: true });
      });
    }

    if (copyButton) {
      copyButton.addEventListener("click", copyAiStatOutput);
    }

    if (form) {
      form.addEventListener("input", () => {
        updateAiStatHelp();
      });
    }

    setAiStatCapability(activeCapability, { applyDefaults: true, silent: true });
    renderAiStatPlaceholder(aiStatCapabilityConfigs[activeCapability]);
    updateAiStatStatus("기능을 선택하고 통계 예시 생성을 누르면 권역별 비교 패키지가 아래에 생성됩니다.");
  }

  function clampAiNumber(value, fallback, minimum) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(minimum, parsed);
  }

  function formatAiNumber(value) {
    return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value);
  }

  function formatAiDecimal(value, digits) {
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }

  function formatAiPercent(value) {
    return `${formatAiDecimal(value * 100, 1)}%`;
  }

  function escapeAiHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizeAiWhitespace(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function scrollAiElement(element) {
    if (!element) {
      return;
    }
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyAiText(value) {
    const text = String(value ?? "").trim();
    if (!text) {
      return false;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "readonly");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    const success = document.execCommand("copy");
    helper.remove();
    return success;
  }

  function getVisibleAiStatRegions() {
    if (activeRegion === "all") {
      return ["fda", "mfds", "ce"];
    }
    return [activeRegion];
  }

  function setAiStatCapability(nextCapability, options = {}) {
    const config = aiStatCapabilityConfigs[nextCapability];

    if (!config) {
      return;
    }

    activeCapability = nextCapability;

    capabilityButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.aiStatCapability === nextCapability);
    });

    toggleAiStatFields(config.workflowType);
    updateAiStatSideMeta(config);

    if (options.applyDefaults) {
      setAiStatFormValues(config.defaults);
    }

    updateAiStatHelp();

    if (!options.silent) {
      renderAiStatPlaceholder(config);
      updateAiStatStatus(`${config.label} 통계 예시 빌더로 전환했습니다.`);
    }
  }

  function setAiStatRegion(nextRegion) {
    activeRegion = (aiStatJurisdictions[nextRegion] || nextRegion === "all") ? nextRegion : "all";

    regionButtons.forEach((button) => {
      const isActive = button.dataset.aiStatRegion === activeRegion;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    updateAiStatHelp();
    updateAiStatSourceList();

    if (hasGenerated) {
      generateAiStatExample({ scrollIntoView: false });
      return;
    }

    updateAiStatStatus(
      activeRegion === "all"
        ? "FDA, 식약처, CE 관점을 한 번에 비교하도록 설정했습니다."
        : `${aiStatJurisdictions[activeRegion].label} 관점에 집중해 예시를 생성하도록 설정했습니다.`,
    );
  }

  function toggleAiStatFields(workflowType) {
    if (!realtimeField) {
      return;
    }

    const showRealtime = workflowType === "realtime";
    realtimeField.hidden = !showRealtime;
    realtimeField.classList.toggle("field-hidden", !showRealtime);
    realtimeField.setAttribute("aria-hidden", String(!showRealtime));
    realtimeField.style.display = showRealtime ? "" : "none";

    const input = realtimeField.querySelector("input");
    if (input) {
      input.disabled = !showRealtime;
    }
  }

  function updateAiStatSideMeta(config) {
    if (capabilityTitleNode) {
      capabilityTitleNode.textContent = config.label;
    }
    if (capabilityDescriptionNode) {
      capabilityDescriptionNode.textContent = config.description;
    }
    if (workflowNode) {
      workflowNode.textContent = config.workflowSummary;
    }
    if (endpointNode) {
      endpointNode.textContent = config.endpointSummary;
    }
    if (frameNode) {
      frameNode.textContent = config.exampleFrame;
    }
    if (reviewListNode) {
      reviewListNode.innerHTML = buildAiStatReviewBullets(config)
        .map((item) => `<li>${escapeAiHtml(item)}</li>`)
        .join("");
    }
    updateAiStatSourceList();
  }

  function updateAiStatSourceList() {
    if (!sourceListNode) {
      return;
    }

    const regionIds = getVisibleAiStatRegions();
    sourceListNode.innerHTML = regionIds
      .map((regionId) => {
        const region = aiStatJurisdictions[regionId];
        const items = region.sources
          .map(
            (source) =>
              `<li><a href="${source.href}" target="_blank" rel="noreferrer">${escapeAiHtml(source.title)}</a><br><span class="result-meta">${escapeAiHtml(source.note)}</span></li>`,
          )
          .join("");
        return `<li><strong>${escapeAiHtml(region.label)}</strong><ul class="reference-list inline-reference-list">${items}</ul></li>`;
      })
      .join("");
  }

  function buildAiStatReviewBullets(config) {
    const baseItems = [
      `Primary endpoint: ${config.primaryEndpoint}`,
      `Analysis set: ${config.analysisSet}`,
      `Reference standard: ${config.referenceStandard}`,
      "Independent validation data, subgroup coverage, acceptance criteria를 protocol에 고정",
    ];

    if (config.workflowType === "realtime") {
      baseItems.push("Real-time latency, display persistence, user override, usability / human factors를 함께 계획");
    }

    return baseItems;
  }

  function serializeAiStatForm() {
    const formData = new FormData(form);
    return {
      indication: normalizeAiWhitespace(formData.get("indication")),
      intendedUse: normalizeAiWhitespace(formData.get("intendedUse")),
      population: normalizeAiWhitespace(formData.get("population")),
      comparator: normalizeAiWhitespace(formData.get("comparator")),
      claimStyle: normalizeAiWhitespace(formData.get("claimStyle")) || "non-inferiority",
      sites: clampAiNumber(formData.get("sites"), 1, 1),
      readers: clampAiNumber(formData.get("readers"), 1, 1),
      dropout: Math.min(clampAiNumber(formData.get("dropout"), 0, 0), 0.45),
      designEffect: clampAiNumber(formData.get("designEffect"), 1, 1),
      subgroupCount: clampAiNumber(formData.get("subgroupCount"), 1, 1),
      latencyTarget: clampAiNumber(formData.get("latencyTarget"), 150, 30),
    };
  }

  function setAiStatFormValues(values) {
    if (!form || !values) {
      return;
    }

    Object.entries(values).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) {
        field.value = String(value);
      }
    });
  }

  function getAiStatClaimStyleLabel(value) {
    if (value === "precision") {
      return "Precision / confidence interval";
    }
    if (value === "agreement") {
      return "Agreement / concordance";
    }
    return "Benchmark-based non-inferiority";
  }

  function updateAiStatHelp() {
    if (!helpNode) {
      return;
    }

    const config = aiStatCapabilityConfigs[activeCapability];
    const inputs = serializeAiStatForm();
    const regionLabel = activeRegion === "all" ? "FDA + 식약처 + CE 비교" : aiStatJurisdictions[activeRegion].label;
    const realtimeText =
      config.workflowType === "realtime"
        ? `실시간 기능이므로 latency target ${formatAiNumber(inputs.latencyTarget)} ms와 display 성공률을 함께 설명하는 것이 안전합니다.`
        : "저장형 기능이므로 실시간 표시 성능 대신 case-level / lesion-level endpoint와 독립 검증 세트를 강조하면 됩니다.";

    helpNode.textContent = `${regionLabel} 기준으로 ${config.label} 예시를 생성합니다. 현재 claim style은 ${getAiStatClaimStyleLabel(
      inputs.claimStyle,
    )}이며, ${realtimeText}`;
  }

  function buildAiStatPlanning(config, inputs) {
    const baseCases = config.baseCases;
    const dropoutAdjustedCases = Math.ceil(baseCases / (1 - inputs.dropout));
    const clusterAdjustedCases = Math.ceil(dropoutAdjustedCases * inputs.designEffect);
    const subgroupFloorCases = Math.ceil(inputs.subgroupCount * config.subgroupFloorPerGroup);
    const finalCases = Math.max(clusterAdjustedCases, subgroupFloorCases);
    const positiveRate = config.positiveRate ?? null;
    const positiveCases = positiveRate ? Math.ceil(finalCases * positiveRate) : null;
    const negativeCases = positiveRate ? Math.max(1, finalCases - positiveCases) : null;
    const lesions =
      positiveCases && config.lesionsPerPositiveCase
        ? Math.ceil(positiveCases * config.lesionsPerPositiveCase)
        : null;
    const scansPerSite = Math.ceil(finalCases / Math.max(1, inputs.sites));

    return {
      baseCases,
      dropoutAdjustedCases,
      clusterAdjustedCases,
      subgroupFloorCases,
      finalCases,
      positiveCases,
      negativeCases,
      lesions,
      scansPerSite,
      unitLabel: config.sampleUnit,
    };
  }

  function generateAiStatExample(options = {}) {
    const config = aiStatCapabilityConfigs[activeCapability];
    const inputs = serializeAiStatForm();
    const planning = buildAiStatPlanning(config, inputs);
    const regions = getVisibleAiStatRegions();
    const tags = [
      config.label,
      config.workflowType === "realtime" ? "Real-time workflow" : "Stored workflow",
      getAiStatClaimStyleLabel(inputs.claimStyle),
      activeRegion === "all" ? "FDA + MFDS + CE" : aiStatJurisdictions[activeRegion].shortLabel,
    ];

    outputNode.classList.remove("is-placeholder");
    outputNode.classList.add("is-generated");
    outputNode.innerHTML = `
      <div class="protocol-output-header">
        <div>
          <p class="section-kicker">Statistics Example Pack</p>
          <h2>${escapeAiHtml(config.label)} 통계 예시 패키지</h2>
          <p class="result-meta">${escapeAiHtml(inputs.indication)} 적응증을 기준으로 ${escapeAiHtml(
            inputs.intendedUse,
          )} claim을 설명하는 예시입니다.</p>
        </div>
        <div class="protocol-tag-row">
          ${tags.map((tag) => `<span class="protocol-tag">${escapeAiHtml(tag)}</span>`).join("")}
        </div>
      </div>

      <div class="result-section">
        <h3 class="result-section-title">Study Synopsis</h3>
        <ul class="result-list">
          <li>대상 적응증: ${escapeAiHtml(inputs.indication)}</li>
          <li>대상 집단: ${escapeAiHtml(inputs.population)}</li>
          <li>비교 기준: ${escapeAiHtml(inputs.comparator)}</li>
          <li>Primary endpoint: ${escapeAiHtml(config.primaryEndpoint)}</li>
          <li>Analysis set: ${escapeAiHtml(config.analysisSet)}</li>
          <li>Reference standard: ${escapeAiHtml(config.referenceStandard)}</li>
        </ul>
      </div>

      <div class="result-section">
        <h3 class="result-section-title">Sample-Size Planning Overlay</h3>
        <div class="tool-strip">
          <article class="tool-strip-card">
            <p class="tool-strip-label">Base Cases</p>
            <p class="tool-strip-value">${formatAiNumber(planning.baseCases)}</p>
            <p class="tool-strip-note">Capability-specific starting point</p>
          </article>
          <article class="tool-strip-card">
            <p class="tool-strip-label">Dropout + Design</p>
            <p class="tool-strip-value">${formatAiNumber(planning.clusterAdjustedCases)}</p>
            <p class="tool-strip-note">Dropout ${formatAiPercent(inputs.dropout)} and design effect ${formatAiDecimal(inputs.designEffect, 2)}</p>
          </article>
          <article class="tool-strip-card">
            <p class="tool-strip-label">Final Recommendation</p>
            <p class="tool-strip-value">${formatAiNumber(planning.finalCases)}</p>
            <p class="tool-strip-note">${escapeAiHtml(planning.unitLabel)} across ${formatAiNumber(inputs.sites)} sites</p>
          </article>
        </div>
        <div class="parameter-table-wrap">
          <table class="parameter-table">
            <thead>
              <tr>
                <th>Planning Item</th>
                <th>Example Value</th>
                <th>How to explain it</th>
              </tr>
            </thead>
            <tbody>
              ${buildAiStatPlanningRows(config, inputs, planning)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="result-section">
        <h3 class="result-section-title">Statistical Analysis Frame</h3>
        <div class="doc-grid">
          <article class="doc-card">
            <p class="doc-lang">Endpoints</p>
            <div class="doc-body">${buildAiStatListMarkup(buildAiStatAnalysisBullets(config, inputs, planning))}</div>
          </article>
          <article class="doc-card">
            <p class="doc-lang">Sample Size</p>
            <div class="doc-body">${buildAiStatListMarkup(buildAiStatSampleBullets(config, inputs, planning))}</div>
          </article>
          <article class="doc-card">
            <p class="doc-lang">SAP Notes</p>
            <div class="doc-body">${buildAiStatListMarkup(buildAiStatSapBullets(config, inputs, planning))}</div>
          </article>
        </div>
      </div>

      <div class="result-section">
        <h3 class="result-section-title">Jurisdiction Comparison</h3>
        <div class="doc-grid">
          ${regions.map((regionId) => renderAiStatRegionCard(regionId, config, inputs, planning)).join("")}
        </div>
      </div>

      <div class="result-section">
        <h3 class="result-section-title">Reviewer-Facing Example Text</h3>
        <div class="doc-grid">
          ${buildAiStatWritingExamples(config, inputs, planning)}
        </div>
      </div>

      <div class="result-section">
        <h3 class="result-section-title">Official Sources</h3>
        <ul class="reference-list inline-reference-list">
          ${regions
            .flatMap((regionId) =>
              aiStatJurisdictions[regionId].sources.map(
                (source) =>
                  `<li><a href="${source.href}" target="_blank" rel="noreferrer">${escapeAiHtml(source.title)}</a> <span class="result-meta">${escapeAiHtml(
                    source.note,
                  )}</span></li>`,
              ),
            )
            .join("")}
        </ul>
      </div>
    `;

    hasGenerated = true;
    updateAiStatStatus(`${config.label} 예시 패키지를 생성했습니다.`);

    if (generateButton) {
      const previousLabel = generateButton.textContent;
      generateButton.textContent = "예시 생성 완료";
      window.setTimeout(() => {
        generateButton.textContent = previousLabel;
      }, 1400);
    }

    if (options.scrollIntoView) {
      scrollAiElement(outputNode);
    }
  }

  function buildAiStatPlanningRows(config, inputs, planning) {
    const rows = [
      {
        label: "Base cases",
        value: `${formatAiNumber(planning.baseCases)} ${planning.unitLabel}`,
        note: config.sampleSizeMethod,
      },
      {
        label: "Dropout-adjusted",
        value: `${formatAiNumber(planning.dropoutAdjustedCases)} ${planning.unitLabel}`,
        note: `예상 dropout ${formatAiPercent(inputs.dropout)} 반영`,
      },
      {
        label: "Cluster / site adjustment",
        value: `${formatAiNumber(planning.clusterAdjustedCases)} ${planning.unitLabel}`,
        note: `site / frame correlation을 design effect ${formatAiDecimal(inputs.designEffect, 2)}로 보정`,
      },
      {
        label: "Protected subgroup floor",
        value: `${formatAiNumber(planning.subgroupFloorCases)} ${planning.unitLabel}`,
        note: `${formatAiNumber(inputs.subgroupCount)}개 subgroup에서 group당 최소 ${formatAiNumber(
          config.subgroupFloorPerGroup,
        )} ${planning.unitLabel}`,
      },
      {
        label: "Per-site allocation",
        value: `${formatAiNumber(planning.scansPerSite)} ${planning.unitLabel} / site`,
        note: `${formatAiNumber(inputs.sites)}개 site에 균형 배분`,
      },
    ];

    if (planning.positiveCases) {
      rows.push({
        label: "Positive / negative mix",
        value: `${formatAiNumber(planning.positiveCases)} positive + ${formatAiNumber(planning.negativeCases)} negative`,
        note: "질환 유병률과 review feasibility를 함께 설명",
      });
    }

    if (planning.lesions) {
      rows.push({
        label: "Lesion burden",
        value: `${formatAiNumber(planning.lesions)} lesions`,
        note: "lesion-level endpoint 및 localization analysis용",
      });
    }

    if (config.workflowType === "realtime") {
      rows.push({
        label: "Latency target",
        value: `${formatAiNumber(inputs.latencyTarget)} ms`,
        note: "display persistence, user override, usable frame rate와 함께 기술",
      });
    }

    return rows
      .map(
        (row) => `
          <tr>
            <td>${escapeAiHtml(row.label)}</td>
            <td>${escapeAiHtml(row.value)}</td>
            <td>${escapeAiHtml(row.note)}</td>
          </tr>
        `,
      )
      .join("");
  }

  function buildAiStatAnalysisBullets(config, inputs, planning) {
    const bullets = [
      `${config.primaryEndpoint}를 primary endpoint로 고정하고 95% confidence interval 또는 사전 고정 비열등 margin으로 평가`,
      `${config.analysisSet}를 주분석 집단으로 사용하고, protocol deviation 제외 sensitivity analysis를 별도로 제시`,
      `${config.referenceStandard}와 AI 출력의 불일치 사례는 adjudication rule을 사전에 정의`,
      `${formatAiNumber(inputs.subgroupCount)}개 protected subgroup에 대해 subgroup-specific point estimate와 confidence interval을 병기`,
    ];

    if (config.workflowType === "realtime") {
      bullets.push(`실시간 성능은 latency ${formatAiNumber(inputs.latencyTarget)} ms 이하 달성률과 display 성공률을 부평가 변수로 포함`);
    }

    if (config.label.includes("Detection")) {
      bullets.push("lesion-level sensitivity와 image/scan-level false positive burden을 함께 제시");
    } else if (config.label.includes("Segmentation")) {
      bullets.push("Dice score 외 boundary error, clinical acceptability pass-rate를 보조 endpoint로 제시");
    } else if (config.label.includes("Measurement")) {
      bullets.push("Bland-Altman mean bias, limits of agreement, tolerance pass-rate를 함께 제시");
    } else {
      bullets.push("AUC 외 sensitivity / specificity operating point를 임상 사용 시나리오에 맞춰 함께 제시");
    }

    return bullets;
  }

  function buildAiStatSampleBullets(config, inputs, planning) {
    const bullets = [
      `Capability baseline ${formatAiNumber(planning.baseCases)} ${planning.unitLabel}에서 시작`,
      `dropout ${formatAiPercent(inputs.dropout)}와 design effect ${formatAiDecimal(inputs.designEffect, 2)}를 반영해 ${formatAiNumber(
        planning.clusterAdjustedCases,
      )} ${planning.unitLabel}로 증액`,
      `subgroup floor ${formatAiNumber(planning.subgroupFloorCases)} ${planning.unitLabel}와 비교 후 최종 권고 모집 수는 ${formatAiNumber(
        planning.finalCases,
      )} ${planning.unitLabel}`,
      `${formatAiNumber(inputs.sites)}개 기관 기준 site당 약 ${formatAiNumber(planning.scansPerSite)} ${planning.unitLabel} 계획`,
    ];

    if (planning.positiveCases) {
      bullets.push(`positive case 약 ${formatAiNumber(planning.positiveCases)}건 확보를 전제로 질환 burden을 설명`);
    }

    if (planning.lesions) {
      bullets.push(`lesion-level endpoint용으로 최소 ${formatAiNumber(planning.lesions)} lesions를 annotation 대상으로 계획`);
    }

    return bullets;
  }

  function buildAiStatSapBullets(config, inputs, planning) {
    const bullets = [
      "Primary analysis, sensitivity analysis, subgroup analysis, missing-data handling을 SAP에 사전 명시",
      "기관 간 이질성과 반복 프레임 효과가 예상되면 mixed model 또는 cluster-robust variance를 사용",
      `acceptance criteria는 claim style ${getAiStatClaimStyleLabel(inputs.claimStyle)}에 맞춰 수치로 고정`,
      "final lock 전에 threshold, operating point, exclusion rule을 변경하지 않는다는 점을 명시",
    ];

    if (config.workflowType === "realtime") {
      bullets.push("latency outlier 정의, unusable frame 정의, operator override logging 기준을 SAP 부록에 추가");
    }

    return bullets;
  }

  function renderAiStatRegionCard(regionId, config, inputs, planning) {
    const region = aiStatJurisdictions[regionId];
    return `
      <article class="doc-card">
        <p class="doc-lang">${escapeAiHtml(region.shortLabel)}</p>
        <h4>${escapeAiHtml(region.label)} review focus</h4>
        <div class="doc-body">
          ${buildAiStatListMarkup(buildAiStatRegionBullets(regionId, config, inputs, planning))}
        </div>
      </article>
    `;
  }

  function buildAiStatRegionBullets(regionId, config, inputs, planning) {
    const bullets = [...aiStatJurisdictions[regionId].principles];

    if (regionId === "fda") {
      bullets.push(`예시 문구: independent validation set ${formatAiNumber(planning.finalCases)} ${planning.unitLabel}, primary endpoint ${config.primaryEndpoint}`);
      bullets.push("subgroup estimates와 uncertainty를 labeling / summary 수준까지 연결하는 방식이 설득력 있음");
    } else if (regionId === "mfds") {
      bullets.push("허가 심사 문서에서는 intended user, 사용환경, 입력 제한, 통과/실패 기준을 더 직접적으로 기술");
      bullets.push(`예시 문구: ${formatAiNumber(inputs.sites)}기관 다기관 자료, 분석집단 정의, acceptance criteria를 protocol과 결과보고서에 동일하게 유지`);
    } else if (regionId === "ce") {
      bullets.push("CIP에는 objective, hypothesis, bias control, monitoring, representativeness를 구조적으로 모두 포함");
      bullets.push(`예시 문구: adequate observations로 ${formatAiNumber(planning.finalCases)} ${planning.unitLabel}를 계획하고 confounding control을 함께 기술`);
    }

    if (config.workflowType === "realtime") {
      bullets.push(`실시간 workflow에서는 latency target ${formatAiNumber(inputs.latencyTarget)} ms와 usability evidence를 같이 제시`);
    }

    return bullets;
  }

  function buildAiStatWritingExamples(config, inputs, planning) {
    const korean = `
      <article class="example-card">
        <div class="example-header">
          <p class="example-kicker">KR Example</p>
          <h4>프로토콜 기재 예시</h4>
        </div>
        <p class="example-text">
          본 임상시험은 ${escapeAiHtml(inputs.indication)}에 대한 ${escapeAiHtml(config.label)} AI 기능의 임상적 성능을 평가하기 위한 다기관 독립 검증 연구이다.
          주평가 변수는 ${escapeAiHtml(config.primaryEndpoint)}이며, 총 ${formatAiNumber(planning.finalCases)} ${escapeAiHtml(
            planning.unitLabel,
          )}를 모집하여 사전에 정의된 acceptance criteria를 검증한다.
          비교 기준은 ${escapeAiHtml(inputs.comparator)}로 설정하며, ${escapeAiHtml(config.referenceStandard)}를 reference standard로 사용한다.
          ${config.workflowType === "realtime"
            ? `실시간 기능에 대해서는 latency ${formatAiNumber(inputs.latencyTarget)} ms 이하 달성률, overlay 해석 가능성, 사용자 override 이벤트를 보조 변수로 평가한다.`
            : "저장형 기능에 대해서는 case-level 또는 lesion-level 성능지표와 subgroup performance를 함께 제시한다."}
        </p>
      </article>
    `;

    const english = `
      <article class="example-card">
        <div class="example-header">
          <p class="example-kicker">EN Example</p>
          <h4>Reviewer-facing synopsis</h4>
        </div>
        <p class="example-text">
          This multi-center validation study is designed to evaluate the clinical performance of the ${escapeAiHtml(
            config.label,
          )} ultrasound AI function for ${escapeAiHtml(inputs.indication)}.
          The primary endpoint is ${escapeAiHtml(config.primaryEndpoint)}, assessed against ${escapeAiHtml(
            inputs.comparator,
          )} using ${escapeAiHtml(config.referenceStandard)} as the reference standard.
          A total of ${formatAiNumber(planning.finalCases)} ${escapeAiHtml(
            planning.unitLabel,
          )} will be enrolled after accounting for dropout, site correlation, and subgroup coverage.
          ${config.workflowType === "realtime"
            ? `Secondary endpoints include display latency (target ${formatAiNumber(inputs.latencyTarget)} ms), operational false-positive burden, and user override behavior.`
            : "Secondary endpoints include subgroup performance, confidence interval precision, and operational review consistency."}
        </p>
      </article>
    `;

    return `${korean}${english}`;
  }

  function buildAiStatListMarkup(items) {
    return `<ul class="result-list">${items.map((item) => `<li>${escapeAiHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderAiStatPlaceholder(config) {
    if (!outputNode) {
      return;
    }

    outputNode.classList.add("is-placeholder");
    outputNode.classList.remove("is-generated");
    outputNode.innerHTML = `
      <div class="protocol-placeholder">
        <p class="protocol-placeholder-title">${escapeAiHtml(config.label)} 통계 예시를 생성해보세요</p>
        <p class="result-meta">
          기능, claim style, 권역, site 수, subgroup 수를 정하면 FDA, 식약처, CE 관점의 example design pack이 아래에 생성됩니다.
        </p>
      </div>
    `;
    hasGenerated = false;
  }

  async function copyAiStatOutput() {
    if (!outputNode || !hasGenerated) {
      updateAiStatStatus("먼저 통계 예시를 생성한 뒤 복사할 수 있습니다.");
      return;
    }

    try {
      const copied = await copyAiText(outputNode.innerText);
      updateAiStatStatus(copied ? "현재 통계 예시를 클립보드에 복사했습니다." : "브라우저 복사를 완료하지 못했습니다.");
    } catch (error) {
      updateAiStatStatus("브라우저 복사 권한을 얻지 못해 복사에 실패했습니다.");
    }
  }

  function applyAiStatPreset(presetKey) {
    const config = aiStatCapabilityConfigs[activeCapability];
    const nextValues = { ...config.defaults };

    if (presetKey === "high-assurance") {
      nextValues.sites = Math.max(Number(nextValues.sites) + 2, 8);
      nextValues.readers = Math.max(Number(nextValues.readers), 3);
      nextValues.dropout = Math.min(Number(nextValues.dropout) + 0.05, 0.2);
      nextValues.designEffect = Math.max(Number(nextValues.designEffect) + 0.07, 1.12);
      nextValues.subgroupCount = Math.max(Number(nextValues.subgroupCount) + 1, 4);
      if (config.workflowType === "realtime") {
        nextValues.latencyTarget = Math.max(Number(nextValues.latencyTarget) - 20, 80);
      }
    }

    if (presetKey === "demo") {
      nextValues.sites = Math.max(Number(nextValues.sites), 7);
      nextValues.designEffect = Math.max(Number(nextValues.designEffect), 1.1);
      nextValues.subgroupCount = Math.max(Number(nextValues.subgroupCount), 4);
    }

    setAiStatFormValues(nextValues);
    updateAiStatHelp();
  }

  function handleAiStatAction(action) {
    if (action === "copy-output") {
      copyAiStatOutput();
      return;
    }

    if (action === "focus-builder") {
      scrollAiElement(form);
      updateAiStatStatus("예시 입력 영역으로 이동했습니다.");
      return;
    }

    if (action === "open-review-lens") {
      scrollAiElement(reviewLens);
      updateAiStatStatus("규제 관점 패널로 이동했습니다.");
      return;
    }

    if (action === "apply-baseline-plan") {
      applyAiStatPreset("baseline");
      updateAiStatStatus("현재 기능의 baseline 예시값을 적용했습니다.");
      return;
    }

    if (action === "apply-high-assurance") {
      applyAiStatPreset("high-assurance");
      updateAiStatStatus("보수적인 high-assurance 예시값을 적용했습니다.");
      return;
    }

    if (action === "open-output") {
      scrollAiElement(outputNode);
      updateAiStatStatus("예시 결과 영역으로 이동했습니다.");
      return;
    }

    if (action === "load-demo") {
      applyAiStatPreset("demo");
      updateAiStatStatus("데모 예시 가정을 불러왔습니다.");
      return;
    }

    if (action === "clear-output") {
      renderAiStatPlaceholder(aiStatCapabilityConfigs[activeCapability]);
      updateAiStatStatus("현재 예시 결과를 초기화했습니다.");
      return;
    }

    if (action === "refresh-example") {
      generateAiStatExample({ scrollIntoView: false });
    }
  }

  function updateAiStatStatus(message) {
    workspaceStatuses.forEach((node) => {
      node.textContent = message;
    });
  }
})();
