const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const forms = document.querySelectorAll(".calc-form");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tab;

    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    tabPanels.forEach((panel) => panel.classList.toggle("active", panel.id === targetId));
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const calculator = form.dataset.calculator;
    const resultContainer = document.querySelector(`[data-result="${calculator}"]`);

    try {
      const result = calculators[calculator](new FormData(form));
      renderSuccess(resultContainer, result);
    } catch (error) {
      renderError(resultContainer, error.message);
    }
  });
});

const calculators = {
  "single-proportion": (formData) => {
    const p = parseDecimal(formData.get("proportion"), "예상 비율");
    const d = parseDecimal(formData.get("margin"), "허용 오차");
    const confidence = parseDecimal(formData.get("confidence"), "신뢰수준");
    const dropout = parseDecimal(formData.get("dropout"), "예상 탈락률");

    assertBetweenExclusive(p, 0, 1, "예상 비율은 0과 1 사이여야 합니다.");
    assertBetweenExclusive(d, 0, 1, "허용 오차는 0보다 커야 합니다.");
    assertBetweenExclusive(confidence, 0, 1, "신뢰수준은 0과 1 사이여야 합니다.");
    assertBetweenInclusive(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.");

    const z = inverseStandardNormal(1 - (1 - confidence) / 2);
    const rawN = (z ** 2 * p * (1 - p)) / (d ** 2);
    const minSample = Math.ceil(rawN);
    const adjustedSample = adjustForDropout(minSample, dropout);

    return {
      headline: `권장 최소 샘플수는 총 ${formatNumber(minSample)}명이고, 탈락률 반영 모집 목표수는 총 ${formatNumber(adjustedSample)}명입니다.`,
      details: [
        `계산식: n = z² × p × (1 - p) / d²`,
        `적용값: z = ${z.toFixed(3)}, p = ${p.toFixed(2)}, d = ${d.toFixed(2)}`,
        `원계산값 ${rawN.toFixed(2)}명을 올림 처리했고, 탈락률 ${(dropout * 100).toFixed(1)}%를 반영했습니다.`,
      ],
    };
  },
  "two-proportion": (formData) => {
    const p1 = parseDecimal(formData.get("p1"), "대조군 비율");
    const p2 = parseDecimal(formData.get("p2"), "시험군 비율");
    const alpha = parseDecimal(formData.get("alpha"), "유의수준");
    const power = parseDecimal(formData.get("power"), "검정력");
    const dropout = parseDecimal(formData.get("dropout"), "예상 탈락률");

    assertBetweenExclusive(p1, 0, 1, "대조군 비율은 0과 1 사이여야 합니다.");
    assertBetweenExclusive(p2, 0, 1, "시험군 비율은 0과 1 사이여야 합니다.");
    assertBetweenExclusive(alpha, 0, 1, "유의수준은 0과 1 사이여야 합니다.");
    assertBetweenExclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.");
    assertBetweenInclusive(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.");

    const delta = Math.abs(p1 - p2);
    if (delta === 0) {
      throw new Error("두 비율의 차이가 0이면 필요한 샘플수를 계산할 수 없습니다.");
    }

    const zAlpha = inverseStandardNormal(1 - alpha / 2);
    const zBeta = inverseStandardNormal(power);
    const pooled = (p1 + p2) / 2;
    const numerator =
      zAlpha * Math.sqrt(2 * pooled * (1 - pooled)) +
      zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
    const rawN = (numerator ** 2) / (delta ** 2);
    const perGroup = Math.ceil(rawN);
    const total = perGroup * 2;
    const adjustedPerGroup = adjustForDropout(perGroup, dropout);
    const adjustedTotal = adjustedPerGroup * 2;

    return {
      headline: `권장 최소 샘플수는 군당 ${formatNumber(perGroup)}명, 총 ${formatNumber(total)}명이며, 탈락률 반영 모집 목표수는 군당 ${formatNumber(adjustedPerGroup)}명, 총 ${formatNumber(adjustedTotal)}명입니다.`,
      details: [
        `양측 검정, 동일 배정비(1:1) 가정`,
        `적용값: zα/2 = ${zAlpha.toFixed(3)}, zβ = ${zBeta.toFixed(3)}, |p1 - p2| = ${delta.toFixed(2)}`,
        `원계산값 ${rawN.toFixed(2)}명을 군당 올림 처리했고, 탈락률 ${(dropout * 100).toFixed(1)}%를 반영했습니다.`,
      ],
    };
  },
  "two-mean": (formData) => {
    const sigma = parseDecimal(formData.get("sigma"), "공통 표준편차");
    const delta = parseDecimal(formData.get("delta"), "평균 차이");
    const alpha = parseDecimal(formData.get("alpha"), "유의수준");
    const power = parseDecimal(formData.get("power"), "검정력");
    const dropout = parseDecimal(formData.get("dropout"), "예상 탈락률");

    assertPositive(sigma, "공통 표준편차는 0보다 커야 합니다.");
    assertPositive(delta, "평균 차이는 0보다 커야 합니다.");
    assertBetweenExclusive(alpha, 0, 1, "유의수준은 0과 1 사이여야 합니다.");
    assertBetweenExclusive(power, 0, 1, "검정력은 0과 1 사이여야 합니다.");
    assertBetweenInclusive(dropout, 0, 0.99, "예상 탈락률은 0 이상 0.99 미만이어야 합니다.");

    const zAlpha = inverseStandardNormal(1 - alpha / 2);
    const zBeta = inverseStandardNormal(power);
    const rawN = (2 * (zAlpha + zBeta) ** 2 * sigma ** 2) / (delta ** 2);
    const perGroup = Math.ceil(rawN);
    const total = perGroup * 2;
    const adjustedPerGroup = adjustForDropout(perGroup, dropout);
    const adjustedTotal = adjustedPerGroup * 2;

    return {
      headline: `권장 최소 샘플수는 군당 ${formatNumber(perGroup)}명, 총 ${formatNumber(total)}명이며, 탈락률 반영 모집 목표수는 군당 ${formatNumber(adjustedPerGroup)}명, 총 ${formatNumber(adjustedTotal)}명입니다.`,
      details: [
        `양측 검정, 동일 분산, 동일 배정비(1:1) 가정`,
        `적용값: zα/2 = ${zAlpha.toFixed(3)}, zβ = ${zBeta.toFixed(3)}, σ = ${sigma.toFixed(2)}, Δ = ${delta.toFixed(2)}`,
        `원계산값 ${rawN.toFixed(2)}명을 군당 올림 처리했고, 탈락률 ${(dropout * 100).toFixed(1)}%를 반영했습니다.`,
      ],
    };
  },
};

function renderSuccess(container, result) {
  container.innerHTML = `
    <p class="result-text">${result.headline}</p>
    <p class="result-meta">${result.details.join("<br>")}</p>
  `;
}

function renderError(container, message) {
  container.innerHTML = `<p class="error-text">${message}</p>`;
}

function parseDecimal(value, label) {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) {
    throw new Error(`${label} 값을 확인해주세요.`);
  }
  return number;
}

function assertBetweenExclusive(value, min, max, message) {
  if (value <= min || value >= max) {
    throw new Error(message);
  }
}

function assertBetweenInclusive(value, min, max, message) {
  if (value < min || value >= max) {
    throw new Error(message);
  }
}

function assertPositive(value, message) {
  if (value <= 0) {
    throw new Error(message);
  }
}

function adjustForDropout(sampleSize, dropoutRate) {
  if (dropoutRate === 0) {
    return sampleSize;
  }
  return Math.ceil(sampleSize / (1 - dropoutRate));
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

// Acklam's rational approximation for the inverse standard normal CDF.
function inverseStandardNormal(probability) {
  if (probability <= 0 || probability >= 1) {
    throw new Error("정규분포 분위수 계산 범위를 벗어났습니다.");
  }

  const a = [
    -3.969683028665376e+01,
    2.209460984245205e+02,
    -2.759285104469687e+02,
    1.38357751867269e+02,
    -3.066479806614716e+01,
    2.506628277459239e+00,
  ];
  const b = [
    -5.447609879822406e+01,
    1.615858368580409e+02,
    -1.556989798598866e+02,
    6.680131188771972e+01,
    -1.328068155288572e+01,
  ];
  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
    4.374664141464968e+00,
    2.938163982698783e+00,
  ];
  const d = [
    7.784695709041462e-03,
    3.224671290700398e-01,
    2.445134137142996e+00,
    3.754408661907416e+00,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q;
  let r;

  if (probability < pLow) {
    q = Math.sqrt(-2 * Math.log(probability));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  if (probability <= pHigh) {
    q = probability - 0.5;
    r = q * q;
    return (
      (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }

  q = Math.sqrt(-2 * Math.log(1 - probability));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}
