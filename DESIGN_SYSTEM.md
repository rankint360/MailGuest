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

## Color proportions and contrast

Use lavender and white for the majority of each screen. Reserve violet for the primary action and navigation emphasis. Use lime sparingly for the arrival dot and small highlights.

White text on violet, ink on white, muted ink on white, and ink on lime are the approved text combinations. Use the decorative border for card separation and the stronger #8B82A5 border for input boundaries. Use #226344 for success and #8A4B08 for warning messages. Include a written status with every state indicator.

## Type scale

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| Hero | 48–80 px | 800 | 1.05 |
| Section heading | 32–48 px | 700 | 1.15 |
| Card heading | 22–26 px | 700 | 1.25 |
| Body | 16 px | 400 | 1.6 |
| Helper | 14 px | 400 | 1.5 |
| Address | 14–18 px | 400 | 1.5 |

Use DM Sans for the interface, with a system sans-serif fallback. Space Mono distinguishes addresses and expiry times. Keep prose within 65 characters per line where practical.

## Interaction states

Primary buttons use violet with white text, deep violet on hover, and a visible violet focus ring separated by a 3 px gap. Disabled controls retain their labels and use 55% opacity. Use a progress label while generating an address, and announce the outcome through a polite status region.

Address fields remain selectable. Provide keyboard copying when clipboard permission fails. Confirm replacement or removal of an active mailbox. Keep the current address available after a recoverable network error and offer Refresh.

Message rows wrap long subjects and sender addresses. Display a readable timestamp. Give the message dialog a heading, close button, keyboard dismissal, and focus restoration.

## Motion

Use 160 ms for button and focus transitions and 240 ms for component entrances. Keep decorative floating motion within 8 px over a 5-second cycle. Honor prefers-reduced-motion by removing decorative animation and using immediate scroll behavior. Preserve loading and error feedback as readable text.

## Logo and icon delivery

The mark is a white envelope within a violet rounded square, paired with a lime arrival dot. Preserve the proportions and clear space. Use the standalone mark at 24 px or larger. The included 16 px favicon is reserved for browser tabs.

| Asset | Format and dimensions |
| --- | --- |
| Logo for light backgrounds | Transparent PNG, 930 × 192 and editable SVG |
| Logo for dark backgrounds | Transparent PNG, 930 × 192 and editable SVG |
| Standalone mark | Transparent PNG, 512 × 512 and editable SVG |
| Browser favicon | PNG 16 and 32 px, ICO, SVG |
| Apple touch icon | PNG, 180 × 180 |
| App icons | PNG, 192 × 192 and 512 × 512 |
| Social avatar | PNG, 512 × 512 |
| Social link preview | PNG, 1200 × 630 |

## Implementation scope

This kit refines the established MailGuest identity. The palette, logo geometry, and icon family are retained for consistency with the platform. The expanded guidance and tokens are delivered as a separate kit for integration.

The generated brand board illustrates the identity. Its social avatar dimension label is conceptual. The production social-avatar.png is 512 × 512. Lavender highlight #E9E5FF complements the #F7F6FF page canvas. Use the packaged SVG and PNG files for production assets.
