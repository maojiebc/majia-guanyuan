# Security Policy

## Credential handling

`majia-guanyuan` is designed to run locally against a user's own Guandata BI instance.

- As of v3.0.0 this skill no longer ships its own HTTP client. Authentication is handled by the official toolchain via `guancli auth login` (the family of `guancli` / `guanvis` / `guanetl` / `guanwf` / `guands` / `guanadmin` shares one profile). This skill does not read `config.json`.
- All BI network calls are made by the official `@guandata/guanskill` CLIs, which talk only to the host configured by the user.
- This skill does not send BI credentials, tokens, datasets, card data, or ETL payloads to any third-party service.

Before installing any Agent Skill from a public registry, inspect its `SKILL.md`, scripts, and dependencies. For this repository, the only bundled script is [scripts/inject_phone_layout.py](./scripts/inject_phone_layout.py) — a pure local ZIP transform (no network calls). All BI access is delegated to the official Guandata CLIs.

## Reporting a vulnerability

Please report security issues privately to the maintainer before opening a public issue.

- GitHub: [@maojiebc](https://github.com/maojiebc)
- X: [@maojiebc](https://x.com/maojiebc)

Include the affected version, reproduction steps, and the smallest safe snippet needed to understand the issue.
