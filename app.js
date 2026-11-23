const STORAGE_KEY = "pecados-ficha-v1";

const SKILLS = [
  { label: "Combate", valueName: "COMBATE", woundStart: 1 },
  { label: "Destreza", valueName: "DESTREZA", woundStart: 4 },
  { label: "Infiltración", valueName: "infiltración", woundStart: 7 },
  { label: "Labia", valueName: "labia", woundStart: 10 },
  { label: "Manitas", valueName: "manitas", woundStart: 13 },
  { label: "Ocultismo", valueName: "ocultismpo", woundStart: 16 },
  { label: "Percepción", valueName: "percep", woundStart: 19 },
  { label: "Resistencia", valueName: "resis", woundStart: 22 },
  { label: "Saber", valueName: "sab", woundStart: 25 },
  { label: "Supervivencia", valueName: "super", woundStart: 28 },
];

const statusEl = document.getElementById("status");
const skillsEl = document.getElementById("skills");

function setStatus(message) {
  statusEl.textContent = message;
}

function buildSkills() {
  const frag = document.createDocumentFragment();
  for (const skill of SKILLS) {
    const row = document.createElement("div");
    row.className = "skill";

    const name = document.createElement("span");
    name.className = "skill-name";
    name.textContent = skill.label;

    const value = document.createElement("input");
    value.type = "text";
    value.className = "skill-value";
    value.name = skill.valueName;
    value.inputMode = "numeric";
    value.setAttribute("aria-label", `Valor de ${skill.label}`);

    const wounds = document.createElement("div");
    wounds.className = "wounds";
    wounds.setAttribute("aria-label", `Heridas de ${skill.label}`);
    for (let i = 0; i < 3; i += 1) {
      const id = `H${skill.woundStart + i}`;
      const label = document.createElement("label");
      label.title = id;
      const box = document.createElement("input");
      box.type = "checkbox";
      box.name = id;
      box.setAttribute("aria-label", `Herida ${i + 1} de ${skill.label}`);
      label.appendChild(box);
      wounds.appendChild(label);
    }

    row.append(name, value, wounds);
    frag.appendChild(row);
  }
  skillsEl.appendChild(frag);
}

function fieldElements() {
  return [
    ...document.querySelectorAll("input[name], textarea[name]"),
  ];
}

function readState() {
  const data = {};
  for (const el of fieldElements()) {
    if (el.type === "checkbox") {
      data[el.name] = el.checked;
    } else {
      data[el.name] = el.value;
    }
  }
  return data;
}

function writeState(data) {
  if (!data || typeof data !== "object") return;
  for (const el of fieldElements()) {
    if (!(el.name in data)) continue;
    if (el.type === "checkbox") {
      el.checked = Boolean(data[el.name]);
    } else {
      el.value = data[el.name] ?? "";
    }
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readState()));
  const stamp = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  setStatus(`Guardado a las ${stamp} (este navegador).`);
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setStatus("Ficha vacía. Se guarda sola al escribir.");
      return;
    }
    writeState(JSON.parse(raw));
    setStatus("Datos restaurados de este navegador.");
  } catch {
    setStatus("No se pudieron restaurar los datos guardados.");
  }
}

function resetSheet() {
  if (!confirm("¿Borrar todos los datos de esta ficha en este navegador?")) {
    return;
  }
  for (const el of fieldElements()) {
    if (el.type === "checkbox") el.checked = false;
    else el.value = "";
  }
  localStorage.removeItem(STORAGE_KEY);
  setStatus("Ficha borrada.");
}

buildSkills();
load();

let saveTimer;
document.addEventListener("input", () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 150);
});
document.addEventListener("change", save);

document.getElementById("resetBtn").addEventListener("click", resetSheet);
