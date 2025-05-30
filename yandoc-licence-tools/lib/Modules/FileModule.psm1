# Modules/FileModule.psm1

function Show-TerminalFilePicker {
    param (
        [switch]$save,
        [string]$defaultFileName = "",
        [string]$title = "Select File Location"
    )
    
    if ($save) {
        if ([string]::IsNullOrEmpty($defaultFileName)) {
            Write-Host "`n$title"
            Write-Host "Enter the file path (press Enter for Desktop/licence.lic):"
        }
        else {
            Write-Host "`n$title"
            Write-Host "Enter the file path (press Enter for $defaultFileName):"
        }
        $filePath = Read-Host
        
        if ([string]::IsNullOrEmpty($filePath)) {
            if ([string]::IsNullOrEmpty($defaultFileName)) {
                $filePath = Join-Path ([Environment]::GetFolderPath('Desktop')) "licence.lic"
            }
            else {
                $filePath = $defaultFileName
            }
        }

        # Ensure directory exists
        $directory = Split-Path -Parent $filePath
        if (![string]::IsNullOrEmpty($directory) -and !(Test-Path $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
    }
    else {
        Write-Host "`n$title"
        Write-Host "Enter the path to the license file:"
        $filePath = Read-Host
    }
    
    return $filePath
}

function Show-GuiFilePickerDialog {
    param (
        [switch]$save,
        [string]$defaultFileName = "",
        [string]$filter = "License files (*.lic)|*.lic|All files (*.*)|*.*",
        [string]$title = "Select File Location"
    )

    if ($save) {
        $dialog = New-Object System.Windows.Forms.SaveFileDialog
        $dialog.FileName = $defaultFileName
        $dialog.DefaultExt = ".lic"
    }
    else {
        $dialog = New-Object System.Windows.Forms.OpenFileDialog
    }
    
    $dialog.Filter = $filter
    $dialog.Title = $title
    $dialog.InitialDirectory = [Environment]::GetFolderPath('Desktop')

    $result = $dialog.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        # Ensure directory exists
        $directory = Split-Path -Parent $dialog.FileName
        if (![string]::IsNullOrEmpty($directory) -and !(Test-Path $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
        return $dialog.FileName
    }
    return $null
}

function Get-OutputFilePath {
    param (
        [string]$client,
        [switch]$gui,
        [string]$defaultOutput = ""
    )

    # Create default filename based on client name if not provided
    $defaultFileName = if (![string]::IsNullOrEmpty($defaultOutput)) {
        $defaultOutput
    }
    else {
        $safeClientName = $client -replace '[^a-zA-Z0-9]', '-'
        $safeClientName = $safeClientName.ToLower()
        Join-Path ([Environment]::GetFolderPath('Desktop')) "$safeClientName-licence.lic"
    }
        
    if ($gui) {
        $output = Show-GuiFilePickerDialog -save -defaultFileName $defaultFileName -title "Save License File"
        if ([string]::IsNullOrEmpty($output)) {
            Write-Host "Operation canceled" -ForegroundColor Yellow
            return $null
        }
    }
    else {
        $output = Show-TerminalFilePicker -save -defaultFileName $defaultFileName -title "Save License File"
    }

    return $output
}

Export-ModuleMember -Function Show-TerminalFilePicker, Show-GuiFilePickerDialog, Get-OutputFilePath