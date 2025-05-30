#!/bin/bash

# Default installation directory
DEFAULT_INSTALL_DIR="/usr/local/yandoc-licence-tools"
BIN_DIR="/usr/local/bin"

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Check if PowerShell is installed
if ! command -v pwsh &> /dev/null; then
    echo "PowerShell (pwsh) is not installed. Please install PowerShell for Unix systems:"
    echo "Visit: https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell"
    exit 1
fi

# Create installation directory
echo "Creating installation directory..."
mkdir -p "$DEFAULT_INSTALL_DIR"
mkdir -p "$DEFAULT_INSTALL_DIR/lib"
mkdir -p "$DEFAULT_INSTALL_DIR/bin"

# Copy files
echo "Copying files..."
cp -r ../lib/* "$DEFAULT_INSTALL_DIR/lib/"
cp -r ../bin/yandoc-licence-tools "$DEFAULT_INSTALL_DIR/bin/"

# Set permissions
echo "Setting permissions..."
chmod +x "$DEFAULT_INSTALL_DIR/bin/yandoc-licence-tools"
chmod +x "$DEFAULT_INSTALL_DIR/lib/core.ps1"

# Create symbolic link
echo "Creating symbolic link..."
ln -sf "$DEFAULT_INSTALL_DIR/bin/yandoc-licence-tools" "$BIN_DIR/yandoc-licence-tools"

echo "Installation completed successfully!"
echo "You can now run 'yandoc-licence-tools' from anywhere in your terminal."