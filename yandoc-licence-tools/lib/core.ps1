# yandoc-licence-tools.ps1
using module './Modules/ConfigModule.psm1'
using module './Modules/GuiModule.psm1'
using module './Modules/UserModule.psm1'
using module './Modules/LicenseModule.psm1'
using module './Modules/FileModule.psm1'
using module './Modules/AuthModule.psm1'
using module './Modules/MenuModule.psm1'

param (
    [string]$server = "http://localhost:8036",
    [string]$client = "",
    [string]$expiry = "",
    [int]$users = 0,
    [int]$sessions = 0,
    [string]$output = "",
    [switch]$help,
    [switch]$import,
    [string]$file = "",
    [switch]$gui
)

[Console]::TreatControlCAsInput = $true
$exitKeys = @(3, 17)

Import-Module "$PSScriptRoot\Modules\ConfigModule.psm1"
Import-Module "$PSScriptRoot\Modules\GuiModule.psm1"
Import-Module "$PSScriptRoot\Modules\UserModule.psm1"
Import-Module "$PSScriptRoot\Modules\LicenseModule.psm1"
Import-Module "$PSScriptRoot\Modules\FileModule.psm1"
Import-Module "$PSScriptRoot\Modules\AuthModule.psm1"
Import-Module "$PSScriptRoot\Modules\MenuModule.psm1"

function Show-OperationResult {
    param (
        [string]$message,
        [string]$color,
        [switch]$gui
    )

    Write-Host $message -ForegroundColor $color
    if ($gui) {
        [System.Windows.Forms.MessageBox]::Show($message, "Operation Result", [System.Windows.Forms.MessageBoxButtons]::OK)
    } else {
        Write-Host "`nPress any key to continue..." -ForegroundColor DarkGray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Start-LicenseManager {
    Show-Banner
    
    if (-not (Start-Authentication -gui:$gui)) {
        Show-OperationResult "Authentication failed. Exiting..." "Red" -gui:$gui
        return $false
    }

    if ($help) {
        Show-Usage
        return $true
    }

    $running = $true
    while ($running) {
        Clear-Host
        $choice = Show-MainMenu -gui:$gui

        switch ($choice) {
            "generate" {
                $params = Get-RequiredParameters -gui:$gui -client $client -expiry $expiry -users $users -sessions $sessions
                if ($null -eq $params) {
                    Show-OperationResult "Operation cancelled." "Yellow" -gui:$gui
                    continue
                }

                $success = New-License -client $params.client -server $server -gui:$gui `
                    -expiry $params.expiry -users $params.users -sessions $params.sessions `
                    -selectedUsers @()

                if ($success) {
                    Show-OperationResult "License generation completed successfully!" "Green" -gui:$gui
                } else {
                    Show-OperationResult "License generation failed." "Red" -gui:$gui
                }
            }
            "import" {
                $success = Import-License -importFile $file -serverUrl $server
                if ($success) {
                    Show-OperationResult "License import completed successfully!" "Green" -gui:$gui
                } else {
                    Show-OperationResult "License import failed." "Red" -gui:$gui
                }
            }
            "exit" {
                $running = $false
            }
        }

        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            
            if ($key.KeyChar -in $exitKeys) {
                Write-Host "`nExiting License Manager..." -ForegroundColor Yellow
                $running = $false
                continue
            }
        }
        
        Start-Sleep -Milliseconds 100
    }

    return $true
}

if ($gui) {
    Initialize-Gui
}

$result = Start-LicenseManager

if ($result) {
    Show-OperationResult "`nThank you for using Yandoc License Manager" "Green" -gui:$gui
    exit 0
} else {
    exit 1
}