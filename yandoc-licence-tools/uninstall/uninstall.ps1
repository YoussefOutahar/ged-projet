# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
    exit 1
}

# Default installation directory
$defaultInstallDir = "$env:ProgramFiles\YandocLicenceTools"

# Remove from PATH
$toolsPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$newPath = ($toolsPath.Split(';') | Where-Object { $_ -ne "$defaultInstallDir\bin" }) -join ';'
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

# Remove Start Menu shortcut
$startMenuPath = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\YandocLicenceTools"
if (Test-Path $startMenuPath) {
    Remove-Item -Path $startMenuPath -Recurse -Force
}

# Remove installation directory
if (Test-Path $defaultInstallDir) {
    Remove-Item -Path $defaultInstallDir -Recurse -Force
}

Write-Host "Uninstallation completed successfully!" -ForegroundColor Green