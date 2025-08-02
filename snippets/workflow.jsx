import React, { useState, useEffect, useRef } from 'react';

export const Workflow = () => {
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const terminalRef = useRef(null);

  const testConfigs = [
    { model: "gpt-4o", prompt: "summarize", dataset: "news", mcp: "file-system" },
    { model: "gpt-4", prompt: "summarize", dataset: "news", mcp: "file-system" },
    { model: "claude-3-opus", prompt: "summarize", dataset: "news", mcp: "file-system" },
    { model: "gpt-4o", prompt: "summarize", dataset: "academic", mcp: "file-system" },
    { model: "gpt-4o", prompt: "summarize", dataset: "news", mcp: "web-search" },
    { model: "gpt-4o", prompt: "summarize", dataset: "news", mcp: "database" },
    { model: "gpt-4o", prompt: "analyze", dataset: "news", mcp: "file-system" },
    { model: "gpt-4o", prompt: "summarize", dataset: "social", mcp: "file-system" },
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTerminalOutput([]);
    setCurrentTest(0);

    // Initial setup
    addOutput("$ pytest --eval-protocol -n 8", "command");
    addOutput("", "empty");
    addOutput("Platform: darwin -- Python 3.11.0, pytest-7.4.0, pluggy-1.2.0", "info");
    addOutput("plugins: eval-protocol-0.1.0, hypothesis-6.75.3, cov-4.1.0", "info");
    addOutput("collected 8 items", "info");
    addOutput("", "empty");

    // Run tests in parallel
    for (let i = 0; i < testConfigs.length; i++) {
      setCurrentTest(i);
      const config = testConfigs[i];
      
      // Test start
      addOutput(`test_agent_quality.py::test_agent_quality[${config.model}-${config.prompt}-${config.dataset}-${config.mcp}] `, "test-start");
      
      // Simulate test execution time
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      // Test result - some will fail
      const score = 65 + Math.random() * 35; // Wider range to include failures
      const passed = score > 80;
      const result = passed ? "PASSED" : "FAILED";
      const color = passed ? "green" : "red";
      
      addOutput(`[${result}]`, color);
      addOutput(`  accuracy: ${score.toFixed(1)}%`, "metric");
      addOutput(`  completeness: ${(score - 2).toFixed(1)}%`, "metric");
      addOutput(`  relevance: ${(score - 1).toFixed(1)}%`, "metric");
      addOutput(`  fluency: ${(score - 3).toFixed(1)}%`, "metric");
      addOutput("", "empty");
    }

    // Final summary
    await new Promise(resolve => setTimeout(resolve, 500));
    addOutput("", "empty");
    addOutput("============================= test session starts =============================", "divider");
    addOutput("", "empty");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4o-summarize-news-file-system] PASSED [ 12%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4-summarize-news-file-system] FAILED [ 25%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[claude-3-opus-summarize-news-file-system] PASSED [ 37%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4o-summarize-academic-file-system] PASSED [ 50%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4o-summarize-news-web-search] PASSED [ 62%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4o-summarize-news-database] FAILED [ 75%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4o-analyze-news-file-system] PASSED [ 87%]", "summary");
    addOutput("test_agent_quality.py::test_agent_quality[gpt-4o-summarize-social-file-system] FAILED [100%]", "summary");
    addOutput("", "empty");
    addOutput("============================== 5 passed, 3 failed in 2.34s ==============================", "success");
    addOutput("", "empty");
    addOutput("Eval Protocol Results:", "header");
    addOutput("  • 8 configurations tested in parallel", "result");
    addOutput("  • Average accuracy: 82.1%", "result");
    addOutput("  • Best performing: gpt-4o + web-search (94.2%)", "result");
    addOutput("  • Worst performing: gpt-4o + social (67.8%)", "result");
    addOutput("  • Failed configurations: gpt-4, gpt-4o+database, gpt-4o+social", "result");
    addOutput("  • Total evaluation time: 2.34s", "result");
    addOutput("", "empty");

    setIsRunning(false);
  };

  const addOutput = (text, type) => {
    setTerminalOutput(prev => [...prev, { text, type, id: Date.now() + Math.random() }]);
  };

  // Auto-scroll to bottom when terminal output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const getTextColor = (type) => {
    switch (type) {
      case "command": return "text-green-600 dark:text-green-400";
      case "info": return "text-blue-600 dark:text-blue-400";
      case "test-start": return "text-yellow-600 dark:text-yellow-400";
      case "green": return "text-green-600 dark:text-green-400";
      case "red": return "text-red-600 dark:text-red-400";
      case "metric": return "text-gray-700 dark:text-gray-300";
      case "divider": return "text-gray-500 dark:text-gray-500";
      case "summary": return "text-gray-700 dark:text-gray-300";
      case "success": return "text-green-600 dark:text-green-400 font-semibold";
      case "header": return "text-blue-600 dark:text-blue-400 font-semibold";
      case "result": return "text-gray-700 dark:text-gray-300";
      case "prompt": return "text-green-600 dark:text-green-400";
      default: return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full py-4">
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div ref={terminalRef} className="h-96 overflow-y-auto bg-white dark:bg-black rounded p-3 border border-gray-200 dark:border-gray-600">
          {terminalOutput.map((line, index) => (
            <div key={line.id} className={`${getTextColor(line.type)} ${line.type === 'command' ? 'font-semibold' : ''}`}>
              {line.text}
            </div>
          ))}
          {isRunning && (
            <div className="text-green-600 dark:text-green-400 animate-pulse">
              {currentTest < testConfigs.length && `Running test ${currentTest + 1}/8...`}
            </div>
          )}
          {!isRunning && terminalOutput.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400">$</span>
              <span className="ml-2 animate-pulse">█</span>
            </div>
          )}
          {!isRunning && terminalOutput.length > 0 && (
            <div className="text-green-600 dark:text-green-400">
              <span>$</span>
              <span className="ml-2 animate-pulse">█</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            {isRunning ? "Running..." : "Run Evaluations"}
          </button>
        </div>
      </div>
    </div>
  );
};