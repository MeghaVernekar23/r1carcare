const DIGIT_WORDS = {
  zero: "0",
  oh: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function normalizePhoneTranscript(transcript) {
  const replaced = transcript
    .toLowerCase()
    .split(/\s+/)
    .map((part) => DIGIT_WORDS[part] ?? part)
    .join("");

  return replaced.replace(/\D/g, "");
}

function normalizeNameTranscript(transcript) {
  return transcript.replace(/\s+/g, " ").trim();
}

function formatIndianPlate(raw) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = cleaned.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{1,4})$/);
  if (!match) return cleaned;
  return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
}

function findVehiclePlate(text) {
  const compact = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const matches = compact.match(/[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{1,4}/g);
  if (matches?.length) {
    return formatIndianPlate(matches[0]);
  }

  if (compact.length >= 6) {
    return compact.slice(0, 12);
  }

  return "";
}

export function startSpeechInput({ mode, onResult, onError, onStart, onEnd }) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!Recognition) {
    onError("Voice input is not supported in this browser.");
    return null;
  }

  const recognition = new Recognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => onStart?.();
  recognition.onerror = () => onError("Could not capture voice input. Please try again.");
  recognition.onend = () => onEnd?.();
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript ?? "";
    const value =
      mode === "phone" ? normalizePhoneTranscript(transcript) : normalizeNameTranscript(transcript);

    if (!value) {
      onError("No clear voice input was detected. Please try again.");
      return;
    }

    onResult(value);
  };

  recognition.start();
  return recognition;
}

export async function readVehicleNumberFromImage(file) {
  const Detector = window.TextDetector;

  if (!Detector) {
    throw new Error("Vehicle scan is supported only on browsers with camera text recognition.");
  }

  const imageBitmap = await createImageBitmap(file);
  const detector = new Detector();
  const blocks = await detector.detect(imageBitmap);

  const text = blocks
    .map((block) => block.rawValue || "")
    .filter(Boolean)
    .join(" ");

  const plate = findVehiclePlate(text);

  if (!plate) {
    throw new Error("Could not detect a vehicle number from the image. Try a clearer photo.");
  }

  return plate;
}
