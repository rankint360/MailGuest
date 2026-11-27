# Record Register

Add a dated entry for each change to the application, documentation, deployment, or verification. Update [STATUS.md](STATUS.md) when the current state changes.

| Date | Area | Update |
| --- | --- | --- |
| 2026-11-14 | Research | Reviewed the supplied temporary email services for address generation, inbox layout, refresh, and address replacement. |
| 2026-11-14 | Application | Built Relaybox with automatic address generation, clipboard copying, inbox polling, manual refresh, message reading, and address replacement and removal. |
| 2026-11-14 | Provider | Evaluated Mail.tm and switched to Guerrilla Mail after checking cross-origin access. Relaybox keeps the active mailbox in browser session storage. |
| 2026-11-14 | Verification | Checked JavaScript syntax and verified address generation, inbox listing, reading the provider welcome message, and getting a different address. |
| 2026-11-14 | Deployment | Published the first owner-private Relaybox deployment through Sites. |
| 2026-11-14 | Repository | Added this register and STATUS.md alongside the application source and hosting manifest in GitHub. |
| 2026-11-14 | Branding and site | Rebranded Relaybox as MailGuest, added the brand tokens, logos, site icons and social assets, and rebuilt the homepage as nine sections with motion that respects reduced-motion preferences. |
| 2026-11-14 | Launch pages | Published Privacy Policy, Terms of Use and Support, linked from the footer. |
| 2026-11-14 | Verification | Confirmed the private release, desktop and mobile layouts, address copying, replacement and removal, and launch-page links. Exercised expiry and provider recovery in a simulated harness. |
| 2026-11-14 | Deployment | Deployed the MailGuest release privately through Sites. An independent Gmail message arrived via auto-refresh. The reader displayed the Gmail sender and empty subject and body. A populated external message is still needed to finish launch verification. |
| 2026-11-14 | Delivery investigation | The sender confirmed both Gmail tests included a subject and body. Direct Guerrilla Mail API checks returned empty subject and excerpt fields for both messages. MailGuest displayed no body text. Public launch remains pending resolution and a successful external test. |
| 2026-11-14 | Provider evaluation | Confirmed both Guerrilla Mail message bodies contained only an empty preformatted block. Added a repeatable TempMail.lol test that verifies sender, subject, and body before a provider migration. |
| 2026-11-14 | Replacement delivery test | TempMail.lol preserved the external sender and subject. The plain-text body did not match the expected test value. |
| 2026-11-14 | Delivery verification | Added HTML body extraction and matching to the replacement provider test. Verified formatted text, entity decoding, and empty body handling locally. |
| 2026-11-14 | Replacement provider retest | Gmail delivery matched sender and subject. Both body formats were present and neither matched the expected test sentence. |
| 2026-11-14 | Replacement delivery test | An independent Gmail message matched the expected sender, subject, and body in both plain text and HTML. |
| 2026-11-14 | Hosted provider test | Fixed Worker redirect handling. TempMail.lol returned HTTP 403 from the hosted deployment. Restored Guerrilla Mail and verified address creation. |
| 2026-11-26 | Website redesign | Applied MailGuest design tokens, logo and favicon, responsive address and inbox cards, and consistent legal pages. Verified local desktop and mobile fit and copying. Private deployment succeeded. |
