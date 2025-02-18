export const detectLanguage = async (text) => {
    if ('ai' in self && 'languageDetector' in self.ai) {
      const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.available;
      let detector;
  
      if (canDetect === 'no') {
        console.error("Language detector is not usable.");
        return;
      }
  
      if (canDetect === 'readily') {
        detector = await self.ai.languageDetector.create();
      } else {
        detector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
  
      const results = await detector.detect(text);
      if (results.length > 0) {
        console.log("Language Detected:", results[0].detectedLanguage, "with confidence:", results[0].confidence);
        return results[0].detectedLanguage;
      } else {
        console.warn("No language detected.");
        return "unknown";
      }
    } else {
      console.error("Language Detection API is not supported on this browser.");
      return "unsupported";
    }
  };
  