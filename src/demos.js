import { calculateExpression, elapsedTime } from "./calculations.mjs";

const number = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 14 });
const integer = new Intl.NumberFormat();

function setError(input, hasError) {
  if (hasError) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

function calculator(panel) {
  const form = panel.querySelector("form");
  const input = form.elements.expression;
  const output = form.querySelector("output");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      output.textContent = `Result: ${number.format(calculateExpression(input.value))}`;
      setError(input, false);
    } catch (error) {
      output.textContent = error.message;
      setError(input, true);
    }
  });
  form.addEventListener("reset", (event) => {
    event.preventDefault();
    input.value = "";
    output.textContent = "";
    setError(input, false);
    input.focus();
  });
}

function life(panel) {
  const form = panel.querySelector("form");
  const input = form.elements.start;
  const units = form.querySelector(".elapsed-units");
  const message = form.querySelector("[data-message]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const result = elapsedTime(input.value);
      for (const item of units.querySelectorAll("[data-unit]")) {
        item.textContent = integer.format(result[item.dataset.unit]);
      }
      setError(input, false);
      units.hidden = false;
      message.textContent = `Elapsed time calculated. ${integer.format(result.days)} days.`;
    } catch (error) {
      setError(input, true);
      units.hidden = true;
      message.textContent = error.message;
    }
  });
  form.addEventListener("reset", () => {
    setError(input, false);
    units.hidden = true;
    message.textContent = "";
  });
}

const configurations = {
  coast: [{ label: "Berth", type: "text" }, { label: "Callback window", type: "time" }],
  highlands: [{ label: "Site", type: "text" }, { label: "Access notes", type: "textarea" }],
};

function regions(panel) {
  const select = panel.querySelector("select");
  const config = panel.querySelector("[data-config]");
  const fields = panel.querySelector("[data-fields]");
  const status = panel.querySelector(".demo-status");
  function render() {
    const selected = configurations[select.value];
    config.textContent = JSON.stringify({ fields: selected }, null, 2);
    fields.replaceChildren(...selected.map(({ label, type }) => {
      const wrapper = document.createElement("label");
      wrapper.textContent = label;
      const input = document.createElement(type === "textarea" ? "textarea" : "input");
      if (type !== "textarea") input.type = type;
      input.autocomplete = "off";
      wrapper.append(input);
      return wrapper;
    }));
    status.textContent = `${select.selectedOptions[0].text}: ${selected.map(({ label }) => label).join(" and ")}.`;
  }
  select.addEventListener("change", render);
  render();
}

const shipmentTasks = {
  standard: [["Review filing", "Documentation"], ["Confirm handoff", "Dispatch"]],
  cooled: [["Review filing", "Documentation"], ["Check temperature range", "Cold-chain coordinator"], ["Confirm handoff", "Dispatch"]],
};

function shipment(panel) {
  const select = panel.querySelector("select");
  const list = panel.querySelector("[data-tasks]");
  const status = panel.querySelector(".demo-status");
  function updateProgress() {
    const checked = list.querySelectorAll(":checked").length;
    status.textContent = `${checked} of ${list.children.length} example tasks complete.`;
  }
  function render() {
    list.replaceChildren(...shipmentTasks[select.value].map(([task, role]) => {
      const item = document.createElement("li");
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      label.append(input, `${task} · ${role}`);
      item.append(label);
      return item;
    }));
    updateProgress();
  }
  select.addEventListener("change", render);
  list.addEventListener("change", updateProgress);
  render();
}

export function mountDemo(element) {
  const panel = element.querySelector(".demo-interactive");
  const mount = { calculator, life, regions, shipment }[element.dataset.demo];
  mount(panel);
  panel.hidden = false;
}
