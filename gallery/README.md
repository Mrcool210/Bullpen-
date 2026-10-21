# Community Vault

A community character gallery for the Bullpen. Users browse it in the app's Community Vault section (Vault tab), where they can view a character's sheet, import the character into their own vault, or download its PDF.

## How it works

1. In the Bullpen, a user picks a hero and hits "Submit to Community Vault". The app opens a pre-filled GitHub issue (label vault-submission) containing their BPCH1- character code.
2. The moment the issue opens, the Community Vault intake GitHub Action validates the code with the same checks the app uses. Valid submissions are published to gallery/ automatically and the issue is closed; blank or invalid submissions are rejected.
3. The app fetches gallery/index.json from GitHub Pages / raw and caches it for offline use.

Submissions go live automatically — there is no pre-publication review step.

## Ground rules

- Original characters only. No stat blocks copied from Marvel books, and no uploading book text.
- No personal info in bios — anything with real names, addresses, or contact details gets removed.
- The intake Action validates the code's structure, not its taste. Moderation happens after publication: anything that breaks the rules is taken down.
