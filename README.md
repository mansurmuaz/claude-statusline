# claude-statusline

Custom statusline for [Claude Code](https://claude.ai/code) with interactive setup.

```
mobileapps-fe | MOB-26016 ● | [████░░░░░░░░] 42% | Opus 4.7 | $4.41 | [██████░░░░] 67% ↻2h05m
```

When the weekly window also gets close (≥75%), both bars are labelled side-by-side:

```
… | $4.41 | 5h [█████████░] 92% ↻25m | 7d [████████░░] 85% ↻4d00h
```

## Features

- **Directory** — Current project folder name
- **Git branch** — With clickable Jira ticket links (OSC 8)
- **Dirty indicator** — Orange dot when uncommitted changes exist
- **Context progress bar** — Color-coded: dim → gold → red as context fills
- **Model name** — Current Claude model
- **Session cost** — Real cost from Claude Code API
- **Plan usage (5h window)** — Always shown when available; bar color steps through dim → gold → red → bold magenta as usage climbs (≥95%)
- **Plan usage (7d window)** — Only appears when ≥75%; same color ladder; both bars get `5h` / `7d` labels when the weekly bar is visible
- **Reset countdown** — `↻` timer next to each plan bar; independently colored gold / red / bold magenta as the reset gets close (5h: ≤1h gold, ≤30m red, ≤5m magenta · 7d: ≤1d gold, ≤8h red, ≤1h magenta)

## Install

```bash
npx claude-statusline
```

Follow the interactive prompts to configure:

1. **Jira URL** — Your Jira instance base URL (optional)
2. **Ticket prefix** — Branch name pattern (e.g., `MOB`, `PROJ`)
3. **Bar width** — Context progress bar size
4. **Color theme** — Default, Vibrant, Pastel, or Monochrome

Restart Claude Code after setup.

## Reconfigure

Run `npx claude-statusline` again. Your previous config is backed up automatically.

## Color Themes

| Theme | Style |
|-------|-------|
| **Default** | Muted, eye-friendly (recommended for dark terminals) |
| **Vibrant** | High contrast, colorful |
| **Pastel** | Soft, low contrast |
| **Monochrome** | Grayscale only |

## Requirements

- Claude Code v1.0.33+
- `jq` (for JSON parsing)
- `git` (for branch/dirty detection)

## How it works

The CLI generates a bash script at `~/.claude/statusline-command.sh` and configures `~/.claude/settings.json` to use it. Claude Code pipes JSON status data to the script on every assistant turn — including `rate_limits.five_hour` and `rate_limits.seven_day` for Pro/Max subscribers, which power the plan usage bars.

## License

MIT
