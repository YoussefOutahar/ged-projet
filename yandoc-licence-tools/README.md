# Yandoc Licence Tools

An interactive, secure, cross-platform tool for managing Yandoc licenses. Features both GUI and console interfaces with authentication.

## Features

-   Interactive menu-driven interface
-   Secure authentication system
-   GUI and console modes
-   License generation and import capabilities
-   Parameter validation and guided input
-   Secure credential storage
-   Multi-platform support (Windows, macOS, Linux)

## Prerequisites

-   PowerShell 7.0 or later
    -   Windows: Built into Windows 10/11 or download from Microsoft Store
    -   macOS/Linux: Install using the instructions at [Installing PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell)

## Installation

### Windows

1. Open PowerShell as Administrator
2. Navigate to the installation directory
3. Run:

```powershell
.\install\install.ps1
```

### macOS/Linux

1. Open Terminal
2. Navigate to the installation directory
3. Run:

```bash
sudo ./install/install.sh
```

## Authentication

On first run, the tool creates default credentials:

-   Username: `admin`
-   Password: `admin123`

To change the password after login:

```powershell
Set-NewPassword -username "admin" -currentPassword "admin123" -newPassword "your-new-password"
```

## Usage

### Basic Interactive Mode

```bash
yandoc-licence-tools
```

This launches the tool in interactive mode with:

1. Authentication prompt
2. Main menu with options:
    - Generate New License
    - Import Existing License
    - Exit

### GUI Mode

```bash
yandoc-licence-tools -gui
```

Provides graphical interfaces for:

-   Authentication
-   Menu selection
-   Parameter input
-   File selection

### Command Line Options

```bash
yandoc-licence-tools [options]
```

Options:

-   `-server` Server URL (default: http://localhost:8036)
-   `-client` Client name (optional, will prompt if not provided)
-   `-expiry` Expiration date in YYYY-MM-DD format (optional)
-   `-users` Number of users (optional)
-   `-sessions` Max sessions per user (optional)
-   `-output` Output file name (default: client-name-licence.lic)
-   `-import` Switch to import mode
-   `-file` License file to import (optional)
-   `-gui` Use GUI mode for all operations
-   `-help` Show help message

### Examples

Generate license with parameters:

```bash
yandoc-licence-tools -client "Company Name" -expiry "2025-12-31" -users 100 -sessions 2
```

Import license:

```bash
yandoc-licence-tools -import
yandoc-licence-tools -import -file "path/to/licence.lic"
```

### Keyboard Shortcuts

-   `Ctrl+C` or `Ctrl+Q`: Exit the application

### Notes

-   Even when providing command-line parameters, the tool will:
    -   Require authentication
    -   Show the interactive menu
    -   Use provided parameters as defaults
-   The GUI mode provides forms and dialogs for all operations
-   Credentials are stored securely in `config/auth.json`

## Directory Structure

```
yandoc-licence-tools/
├── Modules/
│   ├── AuthModule.psm1    # Authentication functionality
│   ├── ConfigModule.psm1  # Configuration and help
│   ├── FileModule.psm1    # File operations
│   ├── GuiModule.psm1     # GUI components
│   ├── LicenseModule.psm1 # License operations
│   ├── MenuModule.psm1    # Menu system
│   └── UserModule.psm1    # User management
├── config/
│   └── auth.json          # Encrypted credentials
├── install/
│   ├── install.ps1        # Windows installer
│   └── install.sh         # Unix installer
├── uninstall/
│   ├── uninstall.ps1      # Windows uninstaller
│   └── uninstall.sh       # Unix uninstaller
├── banner.txt             # Application banner
├── README.md             # This file
└── yandoc-licence-tools.ps1  # Main script
```

## Security Notes

-   Passwords are stored using salted SHA256 hashing
-   The `config/auth.json` file should have appropriate permissions set
-   Default credentials should be changed after first login
-   No plaintext passwords are stored

## Uninstallation

### Windows

1. Open PowerShell as Administrator
2. Navigate to the installation directory
3. Run:

```powershell
.\uninstall\uninstall.ps1
```

### macOS/Linux

1. Open Terminal
2. Navigate to the installation directory
3. Run:

```bash
sudo ./uninstall/uninstall.sh
```
