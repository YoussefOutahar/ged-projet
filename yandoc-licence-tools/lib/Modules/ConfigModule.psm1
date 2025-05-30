# Modules/ConfigModule.psm1

function Show-Banner {
    $scriptPath = $PSScriptRoot
    $bannerPath = Join-Path $scriptPath "..\banner.txt"
    
    if (Test-Path $bannerPath) {
        $banner = Get-Content $bannerPath -Raw
        Write-Host $banner -ForegroundColor Blue
    } else {
        Write-Host "Warning: Banner file not found at $bannerPath" -ForegroundColor Yellow
    }
}

function Show-Usage {
    Write-Host "Usage: .\yandoc-licence-tools.ps1 [options]"
    Write-Host "`nDescription:"
    Write-Host "  Interactive license management tool for Yandoc with both GUI and console interfaces."
    Write-Host "  Includes authentication and secure license handling capabilities."
    Write-Host "`nAuthentication:"
    Write-Host "  Default credentials on first run:"
    Write-Host "    Username: yandoc"
    Write-Host "    Password: yandoc@2025"
    Write-Host "  Please change these credentials after first login using Set-NewPassword"
    Write-Host "`nOptions:"
    Write-Host "  -server    Server URL (default: http://localhost:8036)"
    Write-Host "  -client    Client name (optional, will prompt if not provided)"
    Write-Host "  -expiry    Expiration date in YYYY-MM-DD format (optional)"
    Write-Host "  -users     Number of users (optional)"
    Write-Host "  -sessions  Max sessions per user (optional)"
    Write-Host "  -output    Output file name (default: client-name-licence.lic)"
    Write-Host "  -import    Switch to import mode"
    Write-Host "  -file      License file to import (optional)"
    Write-Host "  -gui       Use GUI mode for all operations"
    Write-Host "  -help      Show this help message"
    Write-Host "`nInteractive Menu:"
    Write-Host "  The tool provides an interactive menu with options to:"
    Write-Host "  1. Generate New License"
    Write-Host "  2. Import Existing License"
    Write-Host "  3. Exit"
    Write-Host "`nExamples:"
    Write-Host "  Start in interactive mode:"
    Write-Host "    .\yandoc-licence-tools.ps1"
    Write-Host "`n  Start in GUI mode:"
    Write-Host "    .\yandoc-licence-tools.ps1 -gui"
    Write-Host "`n  Generate license with parameters:"
    Write-Host "    .\yandoc-licence-tools.ps1 -client 'Company Name' -expiry '2025-12-31' -users 100 -sessions 2"
    Write-Host "`n  Import license:"
    Write-Host "    .\yandoc-licence-tools.ps1 -import"
    Write-Host "    .\yandoc-licence-tools.ps1 -import -file 'path/to/licence.lic'"
    Write-Host "`n  Change admin password:"
    Write-Host "    Set-NewPassword -username 'admin' -currentPassword 'current' -newPassword 'new'"
    Write-Host "`nShortcuts:"
    Write-Host "  Ctrl+C or Ctrl+Q  Exit the application"
    Write-Host "`nNote:"
    Write-Host "  Even when providing command-line parameters, the tool will still:"
    Write-Host "  - Require authentication"
    Write-Host "  - Show the interactive menu"
    Write-Host "  - Use provided parameters as defaults"
}

Export-ModuleMember -Function Show-Banner, Show-Usage