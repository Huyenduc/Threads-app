module.exports = {
  "**/*.{js,jsx,ts,tsx}": [
    "yarn check-lint",
    "bash -c \"yarn typecheck\""
  ]
}
