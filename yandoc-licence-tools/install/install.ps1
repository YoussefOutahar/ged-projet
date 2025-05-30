# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
    exit 1
}

# Default installation directory
$defaultInstallDir = "$env:ProgramFiles\YandocLicenceTools"
$toolsPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

# Create installation directory
Write-Host "Creating installation directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $defaultInstallDir | Out-Null
New-Item -ItemType Directory -Force -Path "$defaultInstallDir\lib" | Out-Null
New-Item -ItemType Directory -Force -Path "$defaultInstallDir\bin" | Out-Null

# Copy files
Write-Host "Copying files..." -ForegroundColor Yellow
Copy-Item -Path "..\lib\*" -Destination "$defaultInstallDir\lib" -Recurse -Force
Copy-Item -Path "..\bin\yandoc-licence-tools.ps1" -Destination "$defaultInstallDir\bin" -Force

# Add to PATH if not already present
if ($toolsPath -notlike "*$defaultInstallDir\bin*") {
    Write-Host "Adding to PATH..." -ForegroundColor Yellow
    $newPath = "$toolsPath;$defaultInstallDir\bin"
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
}

# Create Start Menu shortcut
$startMenuPath = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\YandocLicenceTools"
New-Item -ItemType Directory -Force -Path $startMenuPath | Out-Null
$shortcutPath = "$startMenuPath\YandocLicenceTools.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "pwsh.exe"
$shortcut.Arguments = "-NoExit -File `"$defaultInstallDir\bin\yandoc-licence-tools.ps1`""
$shortcut.WorkingDirectory = "$defaultInstallDir\bin"
$shortcut.Save()

Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "You can now run 'yandoc-licence-tools.ps1' from anywhere in PowerShell." -ForegroundColor Green