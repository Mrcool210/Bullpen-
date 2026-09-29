# Community Vault

A community character gallery for the Bullpen. Users browse it in the app's Community Vault section (Vault tab), where they can view a character's sheet, import the character into their own vault, or download its PDF.

## How it works

1. In the Bullpen, a user picks a hero and hits "Submit to Community Vault". The app opens a pre-filled GitHub issue (label vault-submission) containing their BPCH1- character code.
2. Ben reviews the issue. If the character is approved, he adds the vault-approved label.
3. The Community Vault intake GitHub Action validates the code with the same checks the app uses, publishes it to gallery/, and closes the issue.
4. The app fetches gallery/index.json from GitHub Pages / raw and caches it for offline use.

Nothing is published without Ben's approval — the label is the moderation gate.

## Ground rules (for Ben's moderation)

- Original characters only. No stat blocks copied from Marvel books, and no uploading book text.
- No personal info in bios — reject anything with real names, addresses, or contact details.
- The intake Action validates the code's structure, not its taste. Ben's label is the quality gate.
