import { useState, useEffect, useRef } from "react";
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
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") ? localStorage.getItem("theme") === "dark" : true;
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    } else {
      localStorage.setItem("theme", "dark"); // Default to dark
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
        toast.error("❌ Translator API is not supported right now in this browser.", {
          duration: 4000,
          style: {
            background: "#000",
            color: "#fff",
          },
        });
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
          `❌ Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`, {
          duration: 4000,
          style: {
            background: "#000",
            color: "#fff",
          },
        }
        );
        return null;
      }

      const translatorInstance = await self.ai.translator.create({
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

      await translatorInstance.ready;
      console.log(
        `✅ Translator ready for ${sourceLanguage} → ${targetLanguage}`
      );
      setTranslator(translatorInstance); // Store translator instance in state
    } catch (error) {
      console.error("❌ Error initializing Translator:", error);
      toast.error("An error occurred while initializing the Translator API.", {
        duration: 4000,
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    if (selectedLanguage !== "en") {
      initializeTranslator("en", selectedLanguage);
    }
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
      toast.error("❌ Summarizer API is not ready. Try again later.", {
        duration: 4000,
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      return;
    }

    const lastUserMessage = messages.findLast((msg) => msg.type === "user");

    if (!lastUserMessage || !lastUserMessage.text.trim()) {
      toast.error("❌ No user message available to summarize.");
      return;
    }

    if (lastUserMessage.text.length < 150) {
      toast.error("❌ Text must be at least 150 characters to summarize.");
      return;
    }

    try {
      setIsSummarizing(true); // Show Summarizing button state

      console.log("📜 Summarizing text...");
      const summary = await summarizer.summarize(lastUserMessage.text, {
        context: "Summarizing user input for better understanding.",
      });

      console.log("✅ Summary generated:", summary);
      setOutputText(summary);
      toast.success("✅ Summarization completed successfully!", {
        duration: 4000,
        style: {
          background: "#000",
          color: "#fff",
        },
      });

      setMessages([
        ...messages,
        { text: summary, type: "bot", language: "en" },
      ]);
    } catch (error) {
      console.error("❌ Error summarizing text:", error);
      toast.error("❌ An error occurred while summarizing. Please try again.", {
        duration: 4000,
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    } finally {
      setIsSummarizing(false); // Hide loading state
    };
  }

    const handleTranslate = async () => {
      if (selectedLanguage === "en") {
        toast.error("❌ Translation from English to English is not supported.", {
          duration: 4000,
          style: { background: "#000", color: "#fff" },
        });
        return;
      }
  
      if (!translator) {
        toast.error("❌ Translator API is not ready. Try again later.");
        return;
      }
  
      if (!inputText.trim()) {
        toast.error("❌ Please enter some text in the input field to translate.");
        return;
      }
  
      try {
        setIsTranslating(true); // Show Translating button state

        console.log(`🌍 Translating from English to ${selectedLanguage}...`);
        const translatedText = await translator.translate(inputText);
        console.log("✅ Translation completed:", translatedText);
        setOutputText(translatedText);
        toast.success("✅ Translation completed successfully!");
  
        setMessages([
          ...messages,
          { text: translatedText, type: "bot", language: selectedLanguage },
        ]);
      } catch (error) {
        console.error("❌ Error translating text:", error);
        toast.error("❌ An error occurred while translating. Please try again.");
      } finally {
        setIsTranslating(false); // Hide loading state
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

        <div className="chat-output" ref={chatContainerRef} >
          <ChatOutput messages={messages} onSummarize={handleSummarize} onTranslate={handleTranslate} outputText={outputText}
            isSummarizing={isSummarizing} />
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
            isSummarizing={isSummarizing}
            isTranslating={isTranslating}
          />
        </div>
      </div>
    );
  }

export default App;


