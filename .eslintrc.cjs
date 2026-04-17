module.exports = {
  plugins: ["boundaries", "import"],

  settings: {
  "boundaries/elements": [
    { type: "apps", pattern: "apps/*" },

    { type: "core", pattern: "packages/core/*" },

    { type: "infra", pattern: "packages/infra/*" },

    { type: "shared", pattern: "packages/shared/*" }
  ]
}
,

  rules: {
  "boundaries/element-types": [
    "error",
    {
      default: "disallow",
      rules: [
        {
          from: "apps",
          allow: ["core", "infra", "shared"]
        },
        {
          from: "core",
          allow: ["infra", "shared"]
        },
        {
          from: "infra",
          allow: ["shared"]
        },
        {
          from: "shared",
          allow: []
        }
      ]
    }
  ],

  "import/no-cycle": "error"
}

};
