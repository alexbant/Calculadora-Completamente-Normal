const display = document.querySelector("#display");
const offerScreen = document.querySelector("#offer-screen");
const submittedExpression = document.querySelector("#submitted-expression");
const backButton = document.querySelector("#back-button");
const skipButton = document.querySelector("#skip-button");
const toast = document.querySelector("#toast");

let expression = "";
let toastTimeout;

function renderDisplay() {
  display.textContent = expression || "0";
}

function appendValue(value) {
  expression += value;
  renderDisplay();
}

function clearExpression() {
  expression = "";
  renderDisplay();
}

function showOffer() {
  if (!expression.trim()) return;

  submittedExpression.textContent = expression;
  offerScreen.classList.add("is-visible");
  offerScreen.setAttribute("aria-hidden", "false");
  backButton.focus();
}

function closeOffer() {
  offerScreen.classList.remove("is-visible");
  offerScreen.setAttribute("aria-hidden", "true");
  document.querySelector('[data-action="equals"]').focus();
}

function showToast(planName) {
  toast.textContent = `¡Buen intento! El Plan ${planName} todavía no acepta pagos. 😄`;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
}

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, value } = button.dataset;
  if (action === "clear") {
    clearExpression();
  } else if (action === "backspace") {
    expression = expression.slice(0, -1);
    renderDisplay();
  } else if (action === "sign") {
    if (expression) {
      expression = expression.startsWith("−")
        ? expression.slice(1)
        : `−${expression}`;
      renderDisplay();
    }
  } else if (action === "equals") {
    showOffer();
  } else if (value) {
    appendValue(value);
  }
});

backButton.addEventListener("click", closeOffer);
skipButton.addEventListener("click", closeOffer);

document.querySelectorAll(".plan-button").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.plan));
});

document.addEventListener("keydown", (event) => {
  if (offerScreen.classList.contains("is-visible")) {
    if (event.key === "Escape") closeOffer();
    return;
  }

  if (/^[0-9.]$/.test(event.key)) {
    appendValue(event.key);
  } else if (event.key === "+") {
    appendValue("+");
  } else if (event.key === "-") {
    appendValue("−");
  } else if (event.key === "*") {
    appendValue("×");
  } else if (event.key === "/") {
    event.preventDefault();
    appendValue("÷");
  } else if (event.key === "%") {
    appendValue("%");
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    showOffer();
  } else if (event.key === "Backspace") {
    expression = expression.slice(0, -1);
    renderDisplay();
  } else if (event.key === "Escape" || event.key === "Delete") {
    clearExpression();
  }
});