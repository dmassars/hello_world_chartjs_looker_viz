let baseConfig = {
    seriesType: {
      type: "string",
      label: "Series Positioning",
      values: [
        {"Grouped": "group"},
        {"Stacked": "stack"}
      ],
      display: "radio",
      default: "group",
      section: "Plot",
      order: 1
    },
    legendDisplay: {
      type: "boolean",
      label: "Show Legend",
      default: 'true',
      section: "Plot",
      order: 2
    },
    legendPosition: {
      type: "string",
      label: "Legend Positions",
      values: [
        {"Top": "top"},
        {"Bottom": "bottom"},
        {"Left": "left"},
        {"Right": "right"}
      ],
      display: "radio",
      default: "top",
      section: "Plot",
      order: 3
    }
  }

  module.exports = {baseConfig}
  