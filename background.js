// Préfixe fixe de la clé API
const API_PREFIX = "sk-or-v1-";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-5-chat";

let apiKeySuffix = "";      // sera récupéré depuis storage
let currentLevel = "1as";   // valeur par défaut

// Charger les données sauvegardées
chrome.storage.local.get(["apiKeySuffix", "level"], (result) => {
  if (result.apiKeySuffix) apiKeySuffix = result.apiKeySuffix;
  if (result.level) currentLevel = result.level;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Sauvegarde de la partie variable de la clé
  if (request.action === "setApiKeySuffix") {
    apiKeySuffix = request.suffix.trim();
    chrome.storage.local.set({ apiKeySuffix: apiKeySuffix });
    sendResponse({ success: true });
    return true;
  }

  // Sauvegarde du niveau (1as, 2as, 3as)
  if (request.action === "setLevel") {
    currentLevel = request.level;
    chrome.storage.local.set({ level: currentLevel });
    sendResponse({ success: true });
    return true;
  }

  // Demande de réponse IA
  if (request.action === "getAIAnswer") {
    const { question } = request;
    if (!apiKeySuffix) {
      sendResponse({ success: false, error: "Clé API manquante. Veuillez l'ajouter dans le tableau de bord." });
      return true;
    }
    const fullApiKey = API_PREFIX + apiKeySuffix;
    const prompt = `Question: ${question}\n\nChoose the correct answer from the options shown. Respond with ONLY the exact answer text as it appears in the options. No explanations.`;

    const payload = {
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.2
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${fullApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.choices && data.choices[0]) {
          sendResponse({ success: true, answer: data.choices[0].message.content.trim() });
        } else {
          sendResponse({ success: false, error: "Réponse invalide de l'API" });
        }
      })
      .catch(err => sendResponse({ success: false, error: err.message }));

    return true; // canal asynchrone
  }

  // Récupérer la configuration actuelle (pour l'afficher dans le dashboard)
  if (request.action === "getConfig") {
    sendResponse({ apiKeySuffix, level: currentLevel });
    return true;
  }
});