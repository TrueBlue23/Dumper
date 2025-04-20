document.getElementById("deobfuscate-btn").addEventListener("click", function () {
  const luaInput = document.getElementById("lua-input").value;
  const loadingButtons = document.getElementById("loading-buttons");
  const outputDiv = document.getElementById("output");

  if (!luaInput.trim()) {
    alert("Please paste a Lua script to deobfuscate!");
    return;
  }

  // Show loading buttons
  loadingButtons.style.display = "flex";
  outputDiv.textContent = ""; // Clear previous output

  setTimeout(() => {
    try {
      // Use Fengari to execute the Lua script
      const luaResult = fengari.load(luaInput)();
      loadingButtons.style.display = "none";
      outputDiv.textContent = `Deobfuscated Output:\n${luaResult}`;
    } catch (error) {
      // Handle errors gracefully
      loadingButtons.style.display = "none";
      outputDiv.textContent = `Error: ${error.message}`;
    }
  }, 1000); // Simulate a 1-second delay for processing
});
