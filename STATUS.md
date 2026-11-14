# Status

Last updated November 14, 2026.

| Area | State |
| --- | --- |
| Application | Relaybox generates disposable addresses and supports copying, refreshing, reading incoming mail, and switching or removing the active address. |
| Deployment | The initial Sites deployment succeeded with owner-only access. |
| Provider | Guerrilla Mail supplies inbound mail and temporary addresses. Removing an address clears the current browser session. |
| Verification | JavaScript syntax and the provider operations for creating an address, listing mail, reading a welcome message, and creating a different address were checked. |
| Pending verification | Send a message from an independent mailbox and confirm it appears and opens in the deployed inbox. |

## Run locally

Serve the `dist` directory with a static HTTP server and open its loopback URL in a browser. The application uses the Guerrilla Mail API directly and needs an internet connection.

See the [Record Register](RECORD_REGISTER.md) for the project history.
