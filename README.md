# Past Date Card

A lightweight Home Assistant Lovelace custom card that calculates and displays the calendar date a configurable number of days in the past.

## Features

- Set any number of days ago, including **0** for today.
- Automatically calculates the date using the Home Assistant user's local browser date.
- Four date formats: long, short, numeric, and ISO.
- Optional calendar icon and days-ago label.
- Configure the card through the Lovelace visual editor.
- No template sensors, helpers, automations, or external dependencies required.

## Installation

### HACS

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu and select **Custom repositories**.
3. Add `https://github.com/anazario93/ha-past-date`.
4. Select **Dashboard** as the category.
5. Install **Past Date Card**.
6. Refresh your browser if the card does not appear immediately.

### Manual

1. Download `ha-past-date-card.js` from the latest release or the repository.
2. Copy it into your Home Assistant `www` directory, for example:
   `/config/www/ha-past-date-card.js`.
3. Add it as a JavaScript module resource under **Settings → Dashboards → Resources**:
   `/local/ha-past-date-card.js`.
4. Add the card to a dashboard.

## Visual editor

Add **Past Date Card** from the dashboard card picker. The visual editor lets you configure:

- Card title
- Number of days ago
- Date format
- Whether to show the days-ago label
- Whether to show the calendar icon
- MDI icon name

## YAML configuration

```yaml
type: custom:ha-past-date-card
title: Date Seven Days Ago
days_ago: 7
date_format: long
show_days_ago: true
show_icon: true
icon: mdi:calendar-clock
```

## Configuration options

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `type` | Yes | — | `custom:ha-past-date-card` |
| `title` | No | `Past Date` | Text displayed above the date |
| `days_ago` | No | `7` | Number of calendar days to subtract; 0 means today |
| `date_format` | No | `long` | `long`, `short`, `numeric`, or `iso` |
| `show_days_ago` | No | `true` | Show the relative days-ago label |
| `show_icon` | No | `true` | Show the calendar icon |
| `icon` | No | `mdi:calendar-clock` | MDI icon displayed by the card |

## Date calculation

The card subtracts calendar days from the browser's local date, rather than subtracting a fixed number of milliseconds. This avoids daylight-saving-time boundary issues. The card recalculates whenever Home Assistant updates the card.

## Support

[Report an issue](https://github.com/anazario93/ha-past-date/issues)
