"use strict";

const form = document.querySelector("#converter-form");
const numberInput = document.querySelector("#number-input");
const resultOutput = document.querySelector("#conversion-result");
const errorOutput = document.querySelector("#conversion-error");

const supportedBases = [2, 8, 10, 16];
const easterEggUrl = "https://www.youtube.com/watch?v=xvFZjo5PgG0";
const easterEggClickLimit = 5;

let resetClickCount = 0;

function parseInteger(value, base) {
  if (!supportedBases.includes(base)) {
    throw new Error("Choisissez une base de départ valide.");
  }

  const match = /^([+-]?)([0-9A-F]+)$/i.exec(value.trim());

  if (!match) {
    throw new Error("Saisissez un nombre entier valide.");
  }

  const [, sign, digits] = match;
  let number = 0n;

  for (const character of digits.toUpperCase()) {
    const digit = "0123456789ABCDEF".indexOf(character);

    if (digit < 0 || digit >= base) {
      throw new Error(`Le chiffre « ${character} » n’est pas valide en base ${base}.`);
    }

    number = number * BigInt(base) + BigInt(digit);
  }

  return sign === "-" ? -number : number;
}

function clearFeedback() {
  resultOutput.textContent = "";
  errorOutput.textContent = "";
}

function resetEasterEggClickCount() {
  resetClickCount = 0;
}

function convertNumber(event) {
  event.preventDefault();
  clearFeedback();
  resetEasterEggClickCount();

  try {
    const selectedSource = form.querySelector('input[name="source"]:checked');
    const selectedTarget = form.querySelector('input[name="target"]:checked');

    if (!selectedSource) {
      throw new Error("Choisissez une base de départ.");
    }

    if (!selectedTarget) {
      throw new Error("Choisissez une base d’arrivée.");
    }

    const sourceBase = Number(selectedSource.value);
    const targetBase = Number(selectedTarget.value);
    const number = parseInteger(numberInput.value, sourceBase);

    if (!supportedBases.includes(targetBase)) {
      throw new Error("Choisissez une base d’arrivée valide.");
    }

    resultOutput.textContent = number.toString(targetBase).toUpperCase();
  } catch (error) {
    resultOutput.textContent = "";
    errorOutput.textContent = error instanceof Error
      ? error.message
      : "Une erreur est survenue pendant la conversion.";
  }
}

function resetFormFeedback() {
  resultOutput.textContent = "Le résultat s’affichera ici.";
  errorOutput.textContent = "";
}

function countResetClicks() {
  resetClickCount += 1;

  if (resetClickCount === easterEggClickLimit) {
    window.open(easterEggUrl, "_blank", "noopener,noreferrer");
  }
}

form.addEventListener("submit", convertNumber);
form.addEventListener("reset", resetFormFeedback);

form.addEventListener("change", () => {
  clearFeedback();
  resetEasterEggClickCount();
});
numberInput.addEventListener("input", () => {
  clearFeedback();
  resetEasterEggClickCount();
});
form.querySelector('button[type="reset"]').addEventListener("click", countResetClicks);
