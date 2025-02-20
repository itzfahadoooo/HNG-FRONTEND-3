import { useState, useEffect } from "react";
import ChatInput from "./components/ChatInput/ChatInput";
import ChatOutput from "./components/ChatOutput/ChatOutput";
import "./App.css";
import { detectLanguage } from "./languagedetection";
import { Toaster, toast } from "react-hot-toast";


function App() {
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [summarizer, setSummarizer] = useState(null);
  const [translator, setTranslator] = useState(null); // Store translator instance
  
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" // Ensure proper theme loading
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  // Toggle light and dark mode
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
  };

  const initializeTranslator = async (sourceLanguage, targetLanguage) => {
    try {
      if (!("ai" in self && "translator" in self.ai)) {
        toast.error("❌ Translator API is not supported in this browser.");
        return null;
      }

      console.log("🔍 Checking Translator API capabilities...");
      const capabilities = await self.ai.translator.capabilities();
      console.log("📝 Full Capabilities Data:", capabilities);

      if (
        capabilities?.supportedLanguages &&
        typeof capabilities.supportedLanguages === "object"
      ) {
        console.log(
          "🌍 Supported Language Pairs:",
          Object.entries(capabilities.supportedLanguages)
        );
      } else {
        console.log("⚠️ No supported languages found.");
      }

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
        toast.error(
          `❌ Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`
        );
        return null;
      }

      const translatorInstance = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`📥 Downloading model... ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });

      await translatorInstance.ready;
      console.log(`✅ Translator ready for ${sourceLanguage} → ${targetLanguage}`);
      setTranslator(translatorInstance); // Store translator instance in state
    } catch (error) {
      console.error("❌ Error initializing Translator:", error);
      toast.error("An error occurred while initializing the Translator API.");
    }
  };

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
      toast.error("❌ Summarizer API is not ready. Try again later.");
      return;
    }

    if (!inputText.trim()) {
      toast.error("❌ Please enter some text to summarize.");
      return;
    }

    try {
      console.log("📜 Summarizing text...");
      const summary = await summarizer.summarize(inputText, {
        context: "Summarizing user input for better understanding.",
      });

      console.log("✅ Summary generated:", summary);
      setOutputText(summary);

      setMessages([...messages, { text: summary, type: "bot", language: "en" }]);
    } catch (error) {
      console.error("❌ Error summarizing text:", error);
      toast.error("❌ An error occurred while summarizing. Please try again.");
    }
  };

  const handleTranslate = async () => {
    if (!translator) {
      toast.error("❌ Translator API is not ready. Try again later.");
      return;
    }

    if (!inputText.trim()) {
      toast.error("❌ Please enter some text to translate.");
      return;
    }

    try {
      console.log("🌍 Translating text...");
      const translatedText = await translator.translate(inputText);
      console.log("✅ Translation completed:", translatedText);
      setOutputText(translatedText);
      setMessages([...messages, { text: translatedText, type: "bot", language: selectedLanguage }]);
    } catch (error) {
      console.error("❌ Error translating text:", error);
      toast.error("❌ An error occurred while translating. Please try again.");
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Toaster position="top-right" reverseOrder={false} />
      <div className={`app-con1 ${darkMode ? "dark-mode" : "light-mode"}`}>
        <h1 className="title-1">Linguify</h1>
      <button className="toggle-btn" onClick={toggleTheme}>
        {darkMode ? (
          <i className="fas fa-sun"></i> // Sun icon for light mode
        ) : (
          <i className="fas fa-moon"></i> // Moon icon for dark mode
        )}
      </button>
      </div>
      
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
