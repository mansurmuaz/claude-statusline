# claude-statusline

Custom statusline for [Claude Code](https://claude.ai/code) with interactive setup.

```
mobileapps-fe | MOB-26016 ● | [████░░░░░░░░] 42% | Opus 4.6 | $4.41 | ⏳ 22m
```

## Features

- **Directory** — Current project folder name
- **Git branch** — With clickable Jira ticket links (OSC 8)
- **Dirty indicator** — Orange dot when uncommitted changes exist
- **Context progress bar** — Color-coded: dim → gold → red as context fills
- **Model name** — Current Claude model
- **Session cost** — Real cost from Claude Code API
- **Block timer** — Rate limit countdown, appears only in last 60 minutes

## Install

```bash
npx claude-statusline
```

Follow the interactive prompts to configure:

1. **Jira URL** — Your Jira instance base URL (optional)
2. **Ticket prefix** — Branch name pattern (e.g., `MOB`, `PROJ`)
3. **Block timer** — Timezone and rate limit reset hour
4. **Bar width** — Context progress bar size
5. **Color theme** — Default, Vibrant, Pastel, or Monochrome

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

The CLI generates a bash script at `~/.claude/statusline-command.sh` and configures `~/.claude/settings.json` to use it. Claude Code pipes JSON status data to the script on every assistant turn.

## License

MIT
