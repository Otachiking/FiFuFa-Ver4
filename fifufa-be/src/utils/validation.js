export const validateTopic = (topic) => {
  if (!topic || typeof topic !== "string") {
    return { isValid: false, error: "TOPIC_REQUIRED" };
  }

  const sanitizedTopic = topic.trim();
  
  if (sanitizedTopic.length < 2) {
    return { isValid: false, error: "TOPIC_TOO_SHORT" };
  }
  
  if (sanitizedTopic.length > 50) {
    return { isValid: false, error: "TOPIC_TOO_LONG" };
  }

  return { isValid: true, sanitizedTopic };
};

export const validateLanguage = (language) => {
  const supportedLanguages = ['en', 'id'];
  return supportedLanguages.includes(language) ? language : 'en';
};