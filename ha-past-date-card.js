const CARD_VERSION = "1.0.0";

class HaPastDateCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {
      title: "Past Date",
      days_ago: 7,
      date_format: "long",
      show_days_ago: true,
      show_icon: true,
      icon: "mdi:calendar-clock",
    };
    this._render();
  }

  static getConfigElement() {
    return document.createElement("ha-past-date-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:ha-past-date-card",
      title: "Past Date",
      days_ago: 7,
      date_format: "long",
      show_days_ago: true,
      show_icon: true,
    };
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("A valid configuration is required.");
    }

    const daysAgo = Number(config.days_ago ?? 7);
    if (!Number.isFinite(daysAgo) || daysAgo < 0) {
      throw new Error("days_ago must be a number greater than or equal to 0.");
    }

    this._config = {
      title: config.title ?? "Past Date",
      days_ago: Math.floor(daysAgo),
      date_format: config.date_format ?? "long",
      show_days_ago: config.show_days_ago ?? true,
      show_icon: config.show_icon ?? true,
      icon: config.icon ?? "mdi:calendar-clock",
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 2;
  }

  _getDate() {
    // Use local calendar arithmetic rather than subtracting milliseconds,
    // which avoids daylight-saving-time edge cases.
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - this._config.days_ago);
    return date;
  }

  _formatDate(date) {
    switch (this._config.date_format) {
      case "short":
        return new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(date);
      case "numeric":
        return new Intl.DateTimeFormat(undefined, {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }).format(date);
      case "iso": {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      case "long":
      default:
        return new Intl.DateTimeFormat(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(date);
    }
  }

  _render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          padding: 20px;
          overflow: hidden;
        }
        .content {
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 76px;
        }
        .icon {
          color: var(--state-icon-color, var(--primary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 48px;
        }
        ha-icon {
          --mdc-icon-size: 38px;
        }
        .text {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .title {
          color: var(--secondary-text-color);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.3;
        }
        .date {
          color: var(--primary-text-color);
          font-size: clamp(21px, 5vw, 29px);
          font-weight: 600;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }
        .subtitle {
          color: var(--secondary-text-color);
          font-size: 13px;
          line-height: 1.3;
        }
      </style>
      <ha-card>
        <div class="content">
          <div class="icon"><ha-icon></ha-icon></div>
          <div class="text">
            <div class="title"></div>
            <div class="date"></div>
            <div class="subtitle"></div>
          </div>
        </div>
      </ha-card>
    `;

    const icon = this.shadowRoot.querySelector(".icon");
    const title = this.shadowRoot.querySelector(".title");
    const date = this.shadowRoot.querySelector(".date");
    const subtitle = this.shadowRoot.querySelector(".subtitle");

    icon.hidden = !this._config.show_icon;
    this.shadowRoot.querySelector("ha-icon").icon = this._config.icon;
    title.textContent = this._config.title;
    date.textContent = this._formatDate(this._getDate());

    const days = this._config.days_ago;
    subtitle.textContent = this._config.show_days_ago
      ? days === 0
        ? "Today"
        : `${days} ${days === 1 ? "day" : "days"} ago`
      : "";
    subtitle.hidden = !this._config.show_days_ago;
  }
}

class HaPastDateCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {
      title: "Past Date",
      days_ago: 7,
      date_format: "long",
      show_days_ago: true,
      show_icon: true,
      icon: "mdi:calendar-clock",
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  setConfig(config) {
    this._config = { ...this._config, ...config };
    this._render();
  }

  _schema() {
    return [
      { name: "title", label: "Card title", selector: { text: {} } },
      {
        name: "days_ago",
        label: "Number of days ago",
        selector: {
          number: { min: 0, max: 36500, step: 1, mode: "box" },
        },
      },
      {
        name: "date_format",
        label: "Date format",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { label: "November 10, 2026 (Long)", value: "long" },
              { label: "Nov 10, 2026 (Short)", value: "short" },
              { label: "11/10/2026 (Numeric)", value: "numeric" },
              { label: "2026-11-10 (ISO)", value: "iso" },
            ],
          },
        },
      },
      { name: "show_days_ago", label: "Show days-ago label", selector: { boolean: {} } },
      { name: "show_icon", label: "Show calendar icon", selector: { boolean: {} } },
      { name: "icon", label: "Icon (MDI)", selector: { text: {} } },
    ];
  }

  _render() {
    if (!this.shadowRoot || !this._hass) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-form { display: block; }
      </style>
      <ha-form></ha-form>
    `;

    const form = this.shadowRoot.querySelector("ha-form");
    form.hass = this._hass;
    form.data = { ...this._config };
    form.schema = this._schema();
    form.computeLabel = (schema) => schema.label || schema.name;
    form.addEventListener("value-changed", (event) => {
      event.stopPropagation();
      this._config = { ...this._config, ...event.detail.value };
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          bubbles: true,
          composed: true,
          detail: { config: this._config },
        })
      );
    });
  }
}

if (!customElements.get("ha-past-date-card")) {
  customElements.define("ha-past-date-card", HaPastDateCard);
}
if (!customElements.get("ha-past-date-card-editor")) {
  customElements.define("ha-past-date-card-editor", HaPastDateCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "ha-past-date-card")) {
  window.customCards.push({
    type: "ha-past-date-card",
    name: "Past Date Card",
    description: "Displays the calendar date a configurable number of days in the past.",
    preview: true,
    documentationURL: "https://github.com/anazario93/ha-past-date",
  });
}

console.info(
  `%c HA Past Date Card %c v${CARD_VERSION} `,
  "color: white; background: #039be5; font-weight: bold;",
  "color: #039be5; background: white; font-weight: bold;"
);
