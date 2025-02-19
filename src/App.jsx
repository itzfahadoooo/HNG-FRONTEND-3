import { useState, useEffect } from "react";
import ChatInput from "./components/ChatInput/ChatInput";
import ChatOutput from "./components/ChatOutput/ChatOutput";
import "./App.css";
import { detectLanguage } from "./languagedetection";

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [summarizer, setSummarizer] = useState(null); // Store the summarizer instance

  const initializeTranslator = async (sourceLanguage, targetLanguage) => {
    try {
      if (!("ai" in self && "translator" in self.ai)) {
        alert("❌ Translator API is not supported in this browser.");
        return null;
      }

      console.log("🔍 Checking Translator API capabilities...");
      const capabilities = await self.ai.translator.capabilities();
      console.log("📝 Full Capabilities Data:", capabilities);

      // Check if `capabilities.supportedLanguages` exists and is an object
      if (
        capabilities?.supportedLanguages &&
        typeof capabilities.supportedLanguages === "object"
      ) {
        console.log(
          "🌍 Supported Language Pairs:",
          Object.entries(capabilities.supportedLanguages)
        );

        // Extract and format supported languages
        const supportedLangs = Object.keys(capabilities.supportedLanguages);
        console.log("✅ Final Supported Languages List:", supportedLangs);
      } else {
        console.log("⚠️ No supported languages found.");
      }
      console.log("🔍 Available keys in capabilities:", Object.keys(capabilities));


      console.log(`Supported languages:`, capabilities.supportedLanguages);
      console.log(`Checking ${sourceLanguage} → ${targetLanguage} support...`);

      const availability = capabilities.languagePairAvailable(
        sourceLanguage,
        targetLanguage
      );
      console.log(
        `🛠 Availability for ${sourceLanguage} → ${targetLanguage}:`,
        availability
      );

      if (availability === "no") {
        alert(
          `❌ Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`
        );
        return null;
      }

      const translator = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(
              `📥 Downloading model... ${e.loaded} of ${e.total} bytes.`
            );
          });
        },
      });

      await translator.ready;
      console.log(
        `✅ Translator ready for ${sourceLanguage} → ${targetLanguage}`
      );
      return translator;
    } catch (error) {
      console.error("❌ Error initializing Translator:", error);
      alert("An error occurred while initializing the Translator API.");
      return null;
    }
  };

  // Reinitialize Translator when language changes
  useEffect(() => {
    initializeTranslator("en", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const initializeSummarizer = async () => {
      if ("ai" in self && "summarizer" in self.ai) {
        console.log("✅ Summarizer API is supported! Checking availability...");

        const { available } = await self.ai.summarizer.capabilities();
        if (available === "readily") {
          console.log("✅ Summarizer API is ready to use!");
          const summarizerInstance = await self.ai.summarizer.create();
          setSummarizer(summarizerInstance);
        } else if (available === "after-download") {
          console.log("📥 Model needs to be downloaded...");
          const summarizerInstance = await self.ai.summarizer.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });
          await summarizerInstance.ready;
          console.log("✅ Summarizer model downloaded successfully!");
          setSummarizer(summarizerInstance);
        } else {
          console.error("❌ Summarizer API isn't usable.");
        }
      } else {
        console.error("❌ Summarizer API is not supported in this browser.");
      }
    };

    initializeSummarizer();
  }, []);

  const handleSend = async (text) => {
    const language = await detectLanguage(text);
    console.log("Detected Language:", language);
    setMessages([...messages, { text, type: "user", language }]);
    setInputText("");
  };

  const handleSummarize = async () => {
    if (!summarizer) {
      alert("❌ Summarizer API is not ready. Try again later.");
      return;
    }

    if (!inputText.trim()) {
      alert("❌ Please enter some text to summarize.");
      return;
    }

    try {
      console.log("📜 Summarizing text...");
      const summary = await summarizer.summarize(inputText, {
        context: "Summarizing user input for better understanding.",
      });

      console.log("✅ Summary generated:", summary);
      setOutputText(summary);

      setMessages([
        ...messages,
        { text: summary, type: "bot", language: "en" },
      ]);
    } catch (error) {
      console.error("❌ Error summarizing text:", error);
      alert("❌ An error occurred while summarizing. Please try again.");
    }
  };

  const handleTranslate = () => {
    alert(`Translate to ${selectedLanguage} feature coming soon!`);
  };

  return (
    <div className="app-container">
      <div className="chat-output">
        <ChatOutput messages={messages} />
      </div>
      <div className="chat-input">
        <ChatInput
          onSend={handleSend}
          inputText={inputText}
          setInputText={setInputText}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          onSummarize={handleSummarize}
          onTranslate={handleTranslate}
        />
      </div>
    </div>
  );
}

export default App;
