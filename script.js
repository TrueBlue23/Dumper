-- MoonSec Deobfuscator
-- DISCLAIMER: For educational purposes only. Use responsibly and only on scripts you own or have permission to modify.

local function decodeBase64(encoded)
    local b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    encoded = string.gsub(encoded, "[^" .. b .. "=]", "")
    return (encoded:gsub(".", function(x)
        if x == "=" then return "" end
        local r, f = "", (b:find(x) - 1)
        for i = 6, 1, -1 do r = r .. (f % 2 ^ i - f % 2 ^ (i - 1) > 0 and "1" or "0") end
        return r
    end):gsub("%d%d%d?%d?%d?%d?%d?%d?", function(x)
        if #x < 8 then return "" end
        local c = 0
        for i = 1, 8 do c = c + (x:sub(i, i) == "1" and 2 ^ (8 - i) or 0) end
        return string.char(c)
    end))
end

local function decodeHex(hexString)
    return (hexString:gsub("\\x(%x%x)", function(hex)
        return string.char(tonumber(hex, 16))
    end))
end

local function decodeUnicode(unicodeString)
    return (unicodeString:gsub("\\u(%x%x%x%x)", function(hex)
        return string.char(tonumber(hex, 16))
    end))
end

local function renameVariables(script, variableMap)
    for obfuscated, readable in pairs(variableMap) do
        local pattern = "%f[%w_]" .. obfuscated .. "%f[^%w_]"
        script = script:gsub(pattern, readable)
    end
    return script
end

local function simplifyControlFlow(script)
    -- Remove unnecessary loops
    script = script:gsub("for %w+ = %d+, %d+ do%s+end", "")
    -- Remove empty conditionals
    script = script:gsub("if %b() then%s+end", "")
    return script
end

local function beautifyScript(script)
    local indentLevel = 0
    local formatted = {}
    for line in script:gmatch("[^\r\n]+") do
        if line:find("end") then indentLevel = indentLevel - 1 end
        table.insert(formatted, string.rep("    ", math.max(indentLevel, 0)) .. line)
        if line:find("function") or line:find("do") or line:find("then") then
            indentLevel = indentLevel + 1
        end
    end
    return table.concat(formatted, "\n")
end

local function deobfuscate(script)
    -- Step 1: Decode strings
    script = decodeHex(script)
    script = decodeUnicode(script)
    script = script:gsub('base64.decode%((["\'])(.-)%1%)', function(_, encoded)
        return decodeBase64(encoded)
    end)

    -- Step 2: Rename obfuscated variables
    local variableMap = {
        ["a1"] = "Player",
        ["b2"] = "Health",
        ["c3"] = "Score"
    }
    script = renameVariables(script, variableMap)

    -- Step 3: Simplify control flow
    script = simplifyControlFlow(script)

    -- Step 4: Beautify script
    script = beautifyScript(script)

    return script
end

-- Example usage
local obfuscatedScript = [[
local a1 = base64.decode("Z2FtZS5QbGF5ZXJzLkxvY2FsUGxheWVy") -- Obfuscated Base64 string
local b2 = "\\x48\\x65\\x61\\x6c\\x74\\x68" -- Hex-encoded string
local c3 = "\\u0053\\u0063\\u006f\\u0072\\u0065" -- Unicode-encoded string
for i = 1, 10 do end -- Dummy loop
if true then end -- Dummy conditional
]]

local deobfuscatedScript = deobfuscate(obfuscatedScript)
print("Deobfuscated Script:\n", deobfuscatedScript)
