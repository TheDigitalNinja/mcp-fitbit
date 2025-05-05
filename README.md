# Fitbit MCP Server

This project implements a Model Context Protocol (MCP) server that acts as a bridge between an LLM (like Claude) and the Fitbit API.

It allows the LLM to request and retrieve health and fitness data from a user's Fitbit account via defined tools.

## Features

*   **Fitbit API Integration:** Connects securely to the Fitbit API using OAuth 2.0.
*   **MCP Compliance:** Exposes Fitbit data through tools compliant with the Model Context Protocol.
*   **Extensible:** Designed to easily add support for more Fitbit API endpoints.

### Supported Endpoints

*   **Weight:**
    *   `get_weight`: Retrieves raw weight data for a specified period (`1d`, `7d`, `30d`, `3m`, `6m`, `1y`) ending today. Requires a `period` parameter.
*   **Sleep:**
    *   `get_sleep_by_date_range`: Retrieves raw sleep log data for a specific date range (max 100 days). Requires `startDate` and `endDate` parameters in `YYYY-MM-DD` format.
*   **Profile:**
    *   `get_profile`: Retrieves the user's Fitbit profile information, including personal details such as name, age, gender, height, weight, and account information.

### Planned Endpoints

*   Steps
*   Heart Rate
*   Activity

## Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/TheDigitalNinja/mcp-fitbit
    cd MCP-Server
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    *   Create a file named `.env` in the project root (`mcp-fitbit/`).
    *   Add your Fitbit application credentials:
        ```dotenv
        FITBIT_CLIENT_ID=YOUR_FITBIT_CLIENT_ID
        FITBIT_CLIENT_SECRET=YOUR_FITBIT_CLIENT_SECRET
        ```
    *   You can obtain these by registering an application at [dev.fitbit.com](https://dev.fitbit.com/). Ensure the **OAuth 2.0 Application Type** is set to `Personal` and the **Callback URL** is `http://localhost:3000/callback`.

4.  **Build the Project:**
    ```bash
    npm run build
    ```
    This compiles the TypeScript source files (`src/`) into JavaScript files (`build/`).



## Running evals

The evals package loads an mcp client that then runs the index.ts file, so there is no need to rebuild between tests. You can load environment variables by prefixing the npx command. Full documentation can be found [here](https://www.mcpevals.io/docs).

```bash
OPENAI_API_KEY=your-key  npx mcp-eval src/evals/evals.ts src/sleep.ts
```
## Integrating with Claude for Desktop

To use this Fitbit MCP server with Claude for Desktop:

1.  **Locate the Claude Configuration File:**
    *   On Windows, open the file explorer and navigate to `%AppData%\Claude\`.
    *   Open the `claude_desktop_config.json` file in a text editor.

2.  **Add the Server Configuration:**
    *   Find the `mcpServers` key in the JSON file (if it doesn't exist, you might need to add it).
    *   Add an entry for the Fitbit server. Replace `C:\PATH\TO\PARENT\FOLDER\mcp-fitbit` with the **absolute path** to the directory where you cloned this repository.

    ```json
    {
        "mcpServers": {
            "fitbit": {
                "command": "node",
                "args": [
                    "C:\\PATH\\TO\\PARENT\\FOLDER\\mcp-fitbit\\build\\index.js"
                ]
            }
            // Add other servers here if you have them
        }
        // ... other Claude settings ...
    }
    ```

    *   **Important:** Ensure you use double backslashes (`\\`) for paths on Windows in the JSON file.

3.  **Save and Restart:**
    *   Save the `claude_desktop_config.json` file.
    *   Restart the Claude for Desktop application.

4.  **First Run & Authorization:**
    *   The first time Claude connects to the server (e.g., when you ask it a question that requires a Fitbit tool), the server will initiate the Fitbit OAuth 2.0 authorization flow.
    *   A console window for the server might appear briefly.
    *   The server will attempt to open `http://localhost:3000/auth` in your default web browser.
    *   If the browser doesn't open automatically, navigate to that URL manually.
    *   Log in to your Fitbit account and grant the application permission for the requested scopes (Weight and Sleep).
    *   You will be redirected to `http://localhost:3000/callback`.
    *   A success message will appear in the browser tab, which can then be closed.
    *   The server is now authenticated and Claude can use the Fitbit tools.

## Available Tools

Once the server is running and authorized, the following tools will be available to the connected LLM:

*   `get_weight`: Fetches raw weight time series data as a JSON string for a specified period ending today.
    *   **Parameter:** `period` (string, required) - Specifies the duration. Must be one of: `"1d"`, `"7d"`, `"30d"`, `"3m"`, `"6m"`, `"1y"`.
    *   **Example Usage (Conceptual):** `get_weight(period="7d")`
*   `get_sleep_by_date_range`: Fetches raw sleep log data as a JSON string for a specified date range (maximum 100 days).
    *   **Parameters:**
        *   `startDate` (string, required) - Specifies the start date in `YYYY-MM-DD` format.
        *   `endDate` (string, required) - Specifies the end date in `YYYY-MM-DD` format.
    *   **Example Usage (Conceptual):** `get_sleep_by_date_range(startDate="2025-04-01", endDate="2025-04-30")`
*   `get_profile`: Fetches the user's Fitbit profile information as a JSON string.
    *   **Parameters:** None required.
    *   **Example Usage (Conceptual):** `get_profile()`

## Development

*   Source code is located in the `src/` directory.
*   Run `npm run build` after making changes to the TypeScript files.
*   Restart Claude for Desktop to ensure it picks up the latest build if the server was already running via Claude.
