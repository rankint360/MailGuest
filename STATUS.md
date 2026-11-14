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

## Replacement provider evaluation

Guerrilla Mail returned an empty subject and an empty HTML preformatted block for both test messages. TempMail.lol created a test inbox and returned a valid inbox response. Run `node scripts/verify-delivery.mjs sender@example.com` to check independent delivery against the expected sender, subject, and plain-text body. A production integration needs a server endpoint because the provider's browser CORS policy allows its own site.

The live TempMail.lol test matched the external sender and subject. The plain-text body did not match the expected value. Full content verification remains pending.

The delivery check now accepts matching text from either the plain-text or HTML body. HTML checks require Python 3 on PATH. A new independent message is needed because the provider consumes messages on fetch.

The follow-up Gmail test matched the sender and subject. Both plain-text and HTML bodies were present, but neither normalized to the expected test sentence. A comparison with the actual text in Gmail Sent is pending before switching providers.
