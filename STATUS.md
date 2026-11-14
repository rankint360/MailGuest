# Status

Last updated November 14, 2026.

| Area | Current state |
| --- | --- |
| Product | MailGuest, a receive-only disposable inbox powered by Guerrilla Mail. |
| Website | Nine-section branded homepage with mailbox, timer, motion graphics, FAQ, and footer links to Privacy Policy, Terms of Use and Support. |
| Deployment | [Owner-private Sites release](https://relaybox-kdvumb.stonybrioche1.chatgpt.site/). The planned domain is mailguest.com. Domain connection is pending. |
| Browser verification | Checked desktop and mobile layouts, copying, replacement, removal, and the three footer pages. |
| Recovery verification | Simulated expiration, provider outage, failed initial address generation, and successful retry. |
| Public launch | Two independent Gmail messages arrived through auto-refresh. The sender confirmed both were sent with a subject and body. Guerrilla Mail returned empty subject and excerpt fields and no visible body text for both. The launch is pending resolution and a successful populated-message test. |

Serve `dist` over HTTP to run locally. The browser needs access to the Guerrilla Mail API.

See [the record register](RECORD_REGISTER.md) and [the design system](DESIGN_SYSTEM.md).
