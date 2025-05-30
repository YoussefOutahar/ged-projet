#!/bin/bash

# Default installation directory
DEFAULT_INSTALL_DIR="/usr/local/yandoc-licence-tools"
BIN_DIR="/usr/local/bin"

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Remove symbolic link
echo "Removing symbolic link..."
rm -f "$BIN_DIR/yandoc-licence-tools"

# Remove installation directory
echo "Removing installation directory..."
rm -rf "$DEFAULT_INSTALL_DIR"

echo "Uninstallation completed successfully!"