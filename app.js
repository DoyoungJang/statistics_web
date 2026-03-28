const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const forms = document.querySelectorAll(".calc-form");
const serverStatus = document.querySelector("[data-server-status]");

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

    setLoadingState(resultContainer, submitButton, true);

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calculator,
          inputs: serializeForm(form),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "서버 계산 중 오류가 발생했습니다.");
      }

      renderSuccess(resultContainer, payload);
    } catch (error) {
      renderError(resultContainer, error.message);
    } finally {
      setLoadingState(resultContainer, submitButton, false);
    }
  });
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

function serializeForm(form) {
  const formData = new FormData(form);
  return Object.fromEntries(
    Array.from(formData.entries(), ([key, value]) => [key, Number.parseFloat(value)])
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

function renderSuccess(container, result) {
  container.innerHTML = `
    <p class="result-text">${result.headline}</p>
    <p class="result-meta">${result.details.join("<br>")}</p>
  `;
}

function renderError(container, message) {
  container.innerHTML = `<p class="error-text">${message}</p>`;
}
