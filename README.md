# Are you locked into one LLM vendor? A 15-point self-check

Tick each item that is true for your codebase. The more ticks, the harder a switch will be. Free to use, no signup.

- [ ] 1. **Model names are hardcoded.** Strings like `gpt-4o` or `claude-...` are scattered through the code instead of living in one config value.
- [ ] 2. **You call a provider-specific SDK directly.** Business logic imports `openai` or `anthropic` with no thin adapter layer in between.
- [ ] 3. **Prompts depend on one vendor's format.** System/role conventions, XML tags or special tokens are tuned to a single model family.
- [ ] 4. **Tool calling uses one vendor's schema.** Function or tool definitions are written in a single provider's JSON shape.
- [ ] 5. **Your eval harness only runs against one provider.** You cannot score a second model on the same test set today.
- [ ] 6. **Retry and rate-limit code assumes one API.** Error codes, headers and backoff are specific to one vendor.
- [ ] 7. **Embedding dimensions are baked in.** The vector store schema is fixed to one model's dimension, so switching means a re-index.
- [ ] 8. **The streaming parser is vendor-specific.** SSE event names and delta shapes are parsed for one API only.
- [ ] 9. **Your cost table covers one vendor.** Pricing and budget alerts know a single price sheet.
- [ ] 10. **There is no fallback provider.** An outage or deprecation means downtime, not a config flip.
- [ ] 11. **Provider choice lives in code, not config.** Changing it needs a deploy rather than an environment variable.
- [ ] 12. **Tests hit the live API.** There are no recorded or mocked responses, so the suite breaks when you change provider.
- [ ] 13. **The logging format mirrors one vendor's response object.** Dashboards and analytics read provider-specific fields.
- [ ] 14. **Token counting uses one vendor's tokenizer library.** Limits and truncation are wrong for any other model.
- [ ] 15. **Your DPA or subprocessor list names one LLM provider.** Switching also means updating legal documents and telling customers.

## Scoring (rule of thumb, not a guarantee)

- 0–4 ticks: switching is probably a config change plus testing.
- 5–9 ticks: plan for a focused refactor.
- 10+ ticks: a switch is a project, so budget for it before you need it.

This checklist is a self-assessment aid. It is not legal or compliance advice and does not replace an audit.

License: CC BY 4.0. Share it, adapt it, and keep the attribution.

Full CLI audit + pasteable attestation: https://renvt89.gumroad.com/l/vdmrtn?ref=gh
