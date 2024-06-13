import { createContext, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const fetchResponse = async (prompt) => {
    const options = {
      method: "POST",
      url: "https://chatgpt-42.p.rapidapi.com/geminipro",
      headers: {
        "x-rapidapi-key": "dc73302c03mshe9e44c209007018p19b909jsn6acad4bbe6a2",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response = "";
    if (prompt !== undefined) {
      const res = await fetchResponse(prompt);
      response = res.result;
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await fetchResponse(input);
    }
    let responseArray = response.result.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("<br/>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      let nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node,
};

export default ContextProvider;
