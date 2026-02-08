# @bws9000/gh-spam-blocker

A small CLI tool that blocks GitHub users who put star-solicitation spam
(e.g. “give me stars to my repositories”) in their profile.

This tool uses the official GitHub API and only performs actions you could
do manually via the GitHub UI.

---

## Why this exists

GitHub has a growing number of low-effort spam accounts that:
- follow users
- solicit stars
- add no actual value

This tool automates blocking those accounts in a **controlled and transparent**
way.

---

## Features

- Scans your followers
- Detects spam phrases in:
  - user bios
  - profile READMEs
- Supports pagination
- Dry-run mode (no blocking)
- Rate-limit friendly (1s delay per block)

---

## Installation

No global install required.

```bash


npx @bws9000/gh-spam-blocker --dry-run
```

## SETUP

```bash
GITHUB_TOKEN=ghp_your_token_here

```

## DRY RUN FIRST

 ```bash
 npx @bws9000/gh-spam-blocker --dry-run

 ```

 ## LIMIT TO FIRST PAGE

 ```bash

 npx @bws9000/gh-spam-blocker --dry-run --max-pages 1


 ```

  ## BLOCK SOME SPAMMS

 ```bash

npx @bws9000/gh-spam-blocker --max-pages 1



 ```




 | Flag              | Description                                 |
| ----------------- | ------------------------------------------- |
| `--dry-run`       | Show what would be blocked without blocking |
| `--max-pages <n>` | Limit how many follower pages to scan       |
| `--phrase <text>` | Add additional spam phrase (repeatable)     |
