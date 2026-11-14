# MailGuest

**Temporary email, ready when you are.**

MailGuest helps people receive email without sharing their personal address. Write in short, direct sentences. Give the result first, then offer the next action when one is needed. Use “Address copied,” “Waiting for incoming mail,” and “Create a new address.” Refer to the service as MailGuest and the domain as mailguest.com.

## Visual identity

The mark uses an envelope with a green arrival dot. Use the horizontal logo in headers and the mark alone for icons. Leave at least one quarter of the mark’s width clear around a standalone logo. Use the light wordmark on deep purple or dark backgrounds.

| Color | Hex | Role |
| --- | --- | --- |
| Violet | #5141D9 | Primary actions, focus and brand mark |
| Deep violet | #3F30B4 | Primary hover |
| Ink | #201B39 | Headings and body text |
| Muted ink | #615B73 | Supporting text |
| Lavender | #F7F6FF | Page background |
| White | #FFFFFF | Cards and text on violet |
| Soft border | #DDD9EE | Decorative dividers |
| Lime | #D7F987 | Arrival dot and highlights with ink text |
| Red | #A2243D | Error text |

## Typography and layout

Use DM Sans for interface text and Space Mono for email addresses. Use a 40–64 px responsive display heading, 24 px section headings, 16 px body text, and 14 px for helper text and timestamps. Keep content within roughly 960 px. Use 16 px gutters on mobile and 24 px on wider screens. Use 20 px radius for cards and 10 px for controls. Use the spacing scale and colors in tokens.css.

## Components

- **Address card** pairs a selectable, read-only email field with the primary Copy address button. Put replacement and removal actions below it. Stack the field and copy button on narrow screens.
- **Inbox** places Refresh beside the Inbox heading. Each message row shows sender, subject, and received time. Make the whole row keyboard operable.
- **Message reader** uses a labelled dialog with a visible close control and plain-text message content. Return focus to the opening row on close.
- **Feedback** uses concise messages for loading, success, failure, and expiration. Announce updates through a status region and pair state colors with text.
- **Interaction** uses visible keyboard focus and touch targets of at least 44 × 44 px. Preserve text wrapping for long email addresses and subjects.

## Assets

Use favicon.svg or favicon.ico for browser tabs, apple-touch-icon.png for iOS, and icon-192.png and icon-512.png for web app metadata. Use social-avatar.png for profile imagery and social-card.png for link previews. The SVG logo and mark are editable source assets. Open brand-preview.html for a visual reference.
