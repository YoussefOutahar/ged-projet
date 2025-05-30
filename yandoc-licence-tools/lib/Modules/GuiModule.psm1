# Modules/GuiModule.psm1

function Initialize-Gui {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    Add-Type -AssemblyName PresentationFramework
}

function Show-GuiUserSelection {
    param (
        [array]$users
    )
    
    $formattedUsers = $users | ForEach-Object {
        [PSCustomObject]@{
            'ID' = $_.id
            'Username' = $_.username
            'Email' = $_.email
        }
    }

    $selections = $formattedUsers | Sort-Object Username | Out-GridView -Title "Select Heavy Users (Use Ctrl/Shift for multiple selections)" -PassThru
    
    if ($selections) {
        return @($selections | ForEach-Object {
            @{
                id = $_.ID
                username = $_.Username
            }
        })
    }
    return @()
}

function Show-GuiFilePickerDialog {
    param (
        [switch]$save,
        [string]$defaultFileName = "",
        [string]$filter = "License files (*.lic)|*.lic|All files (*.*)|*.*"
    )

    if ($save) {
        $dialog = New-Object System.Windows.Forms.SaveFileDialog
        $dialog.FileName = $defaultFileName
    } else { 
        $dialog = New-Object System.Windows.Forms.OpenFileDialog
    }
    
    $dialog.Filter = $filter
    $dialog.Title = if ($save) { "Save License File" } else { "Select License File" }
    $dialog.InitialDirectory = [Environment]::GetFolderPath('Desktop')

    $result = $dialog.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        return $dialog.FileName
    }
    return $null
}

Export-ModuleMember -Function Initialize-Gui, Show-GuiUserSelection, Show-GuiFilePickerDialog