import React, { useState, useEffect } from "react";
import TextInput from "./components/TextInput";
import History from "./components/History";
import axios from "axios";
import nextId from "react-id-generator";
import "./assets/css/layout.scss";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;

const Layout = () => {
  const htmlId = nextId();
  const [to, setTo] = useState("tr");
  const [from, setFrom] = useState("en");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [languageSide, setLanguageSide] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [historyTexts, setHistoryTexts] = useState([]);
  const [micLang, setMicLang] = useState("en-EN");

  mic.lang = micLang;

  const handleChangeInput = (e) => {
    setInput(e.target.value);
  };

  const handleTranslateText = async () => {
    const params = new URLSearchParams();
    params.append("q", input);
    params.append("source", from);
    params.append("target", to);
    params.append("api_key", `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`);
    await axios
      .post("https://libretranslate.de/translate", params, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((data) => {
        const { translatedText } = data.data;
        setOutput(translatedText);
        handleSaveHistory(translatedText);
      });
  };

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {};
    }

    mic.onstart = () => {};

    mic.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setInput(transcript);

      mic.onerror = (e) => {
        console.log(e.error);
      };
    };
  };

  const handleSaveHistory = (translatedText) => {
    setHistoryTexts([
      ...historyTexts,
      {
        id: htmlId,
        input,
        output: translatedText,
      },
    ]);
  };

  const handleChangeLanguageSide = () => {
    setLanguageSide(!languageSide);
    setInput(output);
    setOutput(input);
    if (!languageSide) {
      setFrom("tr");
      setTo("en");
      setMicLang("tr-TR");
    } else {
      setFrom("en");
      setTo("tr");
      setMicLang("en-EN");
    }
  };

  const handleClickMicButton = () => {
    setIsListening((prevState) => !prevState);
  };

  const handleDeleteAllText = () => {
    setInput("");
    setOutput("");
  };

  const handleDeleteSelectedText = (id) => {
    const filteredData = historyTexts.filter((x) => x.id !== id);
    setHistoryTexts(filteredData);
  };

  useEffect(() => {
    handleListen();
  }, [isListening]);

  return (
    <div className="layout">
      <div className="layout-header">
        <h1 className="layout-header-title">Google Translate</h1>
      </div>
      <div className="layout-content">
        <div className="layout-content-selection-area">
          <p className="selection-area-text">
            {languageSide ? "Turkish" : "English"}
          </p>
          <i
            onClick={handleChangeLanguageSide}
            className="fas fa-exchange-alt selection-area-icon"
          />
          <p className="selection-area-text">
            {languageSide ? "English" : "Turkish"}
          </p>
        </div>
      </div>
      <div className="text-area-container">
        <TextInput
          value={input}
          onChange={handleChangeInput}
          isShowButtons={true}
          handleTranslateText={handleTranslateText}
          handleClickMicButton={handleClickMicButton}
          showDeleteButton={true}
          handleDeleteAllText={handleDeleteAllText}
        />
        <TextInput value={output} onChange={() => {}} />
      </div>
      <div className="history-container">
        <h3 className="history-title">Last 3 Translations</h3>
        <History
          historyTexts={historyTexts}
          handleDeleteSelectedText={handleDeleteSelectedText}
        />
      </div>
    </div>
  );
};

export default Layout;
