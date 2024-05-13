"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const http = "/api/chat";  // Adjusted to point to your chat API



  const handlePrompt = (e) => setPrompt(e.target.value);

  const handleSubmit = async (e, customTopic = null) => {
    if (e) {
      e.preventDefault();
    }

    try {
      setIsLoading(true);
      const content = customTopic || prompt;

      const response = await fetch(http, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
      });

      if (response.ok) {
        const responseData = await response.json();  // Expect JSON response
        setResponses([responseData.message]);  // Assume response contains { message: "response text" }
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        setResponses([]);
        setError(`Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      console.error('Request Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Chat Interface</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={handlePrompt}
          placeholder="Enter your question..."
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
      {responses.map((response, index) => (
        <p key={index}>Response: {response}</p>
      ))}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
