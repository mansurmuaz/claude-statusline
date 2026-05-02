#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const os = require("os");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const suffix = defaultValue ? ` (${defaultValue})` : "";
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

function choose(question, options) {
  return new Promise((resolve) => {
    console.log(`\n${question}`);
    options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt.label}`));
    rl.question(`Choose [1-${options.length}] (1): `, (answer) => {
      const idx = parseInt(answer) - 1;
      resolve(options[idx >= 0 && idx < options.length ? idx : 0].value);
    });
  });
}

const COLOR_THEMES = {
  default: {
    label: "Default (muted, eye-friendly)",
    dir: "\\033[38;5;73m",
    branch: "\\033[38;5;217m",
    barOk: "\\033[38;5;242m",
    barWarn: "\\033[38;5;179m",
    barCrit: "\\033[38;5;203m",
    barAlert: "\\033[1;38;5;197m",
  },
  vibrant: {
    label: "Vibrant (colorful, high contrast)",
    dir: "\\033[0;36m",
    branch: "\\033[0;31m",
    barOk: "\\033[0;32m",
    barWarn: "\\033[0;33m",
    barCrit: "\\033[1;31m",
    barAlert: "\\033[1;35m",
  },
  pastel: {
    label: "Pastel (soft, low contrast)",
    dir: "\\033[38;5;109m",
    branch: "\\033[38;5;181m",
    barOk: "\\033[38;5;245m",
    barWarn: "\\033[38;5;186m",
    barCrit: "\\033[38;5;174m",
    barAlert: "\\033[1;38;5;176m",
  },
  monochrome: {
    label: "Monochrome (grayscale)",
    dir: "\\033[38;5;250m",
    branch: "\\033[38;5;246m",
    barOk: "\\033[38;5;240m",
    barWarn: "\\033[38;5;248m",
    barCrit: "\\033[1;37m",
    barAlert: "\\033[1;38;5;231m",
  },
};

async function main() {
  console.log("\n🔧 Claude Code Statusline Setup\n");
  console.log("This will configure a custom statusline for Claude Code.");
  console.log(
    "Layout: DIR | BRANCH | CONTEXT | MODEL | COST | 5h-PLAN [| 7d-PLAN]\n"
  );

  // Jira
  const jiraUrl = await ask(
    "Jira base URL (leave empty to disable)",
    ""
  );
  let jiraPrefix = "";
  if (jiraUrl) {
    jiraPrefix = await ask("Jira ticket prefix", "MOB");
  }

  // Bar width
  const barWidth = await ask("Context bar width (characters)", "12");

  // Color theme
  const themeOptions = Object.entries(COLOR_THEMES).map(([key, theme]) => ({
    label: theme.label,
    value: key,
  }));
  const themeKey = await choose("Color theme:", themeOptions);
  const theme = COLOR_THEMES[themeKey];

  rl.close();

  // Generate script
  const templatePath = path.join(__dirname, "templates", "statusline.sh");
  let script = fs.readFileSync(templatePath, "utf8");

  script = script.replace("__JIRA_BASE_URL__", jiraUrl);
  script = script.replace("__JIRA_TICKET_PREFIX__", jiraPrefix);
  script = script.replace("__BAR_WIDTH__", barWidth);
  script = script.replace("__C_DIR__", theme.dir);
  script = script.replace("__C_BRANCH__", theme.branch);
  script = script.replace("__C_BAR_OK__", theme.barOk);
  script = script.replace("__C_BAR_WARN__", theme.barWarn);
  script = script.replace("__C_BAR_CRIT__", theme.barCrit);
  script = script.replace("__C_BAR_ALERT__", theme.barAlert);

  // Write statusline script
  const claudeDir = path.join(os.homedir(), ".claude");
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  const scriptPath = path.join(claudeDir, "statusline-command.sh");
  const existed = fs.existsSync(scriptPath);

  if (existed) {
    const backupPath = `${scriptPath}.backup.${Date.now()}`;
    fs.copyFileSync(scriptPath, backupPath);
    console.log(`\n📦 Backup saved: ${backupPath}`);
  }

  fs.writeFileSync(scriptPath, script, { mode: 0o755 });
  console.log(`✅ Statusline script written: ${scriptPath}`);

  // Update settings.json
  const settingsPath = path.join(claudeDir, "settings.json");
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  }

  settings.statusLine = {
    type: "command",
    command: `bash ${scriptPath}`,
  };

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  console.log(`✅ settings.json updated: ${settingsPath}`);

  console.log("\n🎉 Done! Restart Claude Code to see your new statusline.\n");
  console.log("To reconfigure, run: npx claude-statusline");
  console.log("To revert, restore the backup file.\n");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
