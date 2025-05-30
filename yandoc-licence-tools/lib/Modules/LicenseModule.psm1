# Modules/LicenseModule.psm1

function New-License {
    param (
        [string]$client,
        [string]$server,
        [string]$expiry,
        [int]$users,
        [int]$sessions,
        [switch]$gui
    )

    # Display license parameters
    if ($gui) {
        $licenseParams = "License Parameters:`n`n" +
        "Client: $client`n" +
        "Server URL: $server`n" +
        "Expiration: $expiry`n" +
        "Users: $users`n" +
        "Max Sessions: $sessions"
        [System.Windows.Forms.MessageBox]::Show($licenseParams, "License Parameters", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    }
    else {
        Write-Host "`nLicense Parameters:" -ForegroundColor Cyan
        Write-Host "Client: $client" -ForegroundColor Yellow
        Write-Host "Server URL: $server" -ForegroundColor Yellow
        Write-Host "Expiration: $expiry" -ForegroundColor Yellow
        Write-Host "Users: $users" -ForegroundColor Yellow
        Write-Host "Max Sessions: $sessions" -ForegroundColor Yellow
    }

    # Get heavy users first
    $selectedUsers = Select-HeavyUsers -server $server -gui:$gui
    
    # Then get output file location
    $outputPath = Get-OutputFilePath -client $client -gui:$gui -defaultOutput $output
    if ([string]::IsNullOrEmpty($outputPath)) {
        return $false
    }

    # Prepare request body
    $jsonBody = @{
        clientName         = $client
        expirationDate     = $expiry
        numberOfUsers      = $users
        maxSessionsPerUser = $sessions
    }

    if ($selectedUsers.Count -gt 0) {
        $jsonBody.heavyUsers = @($selectedUsers | ForEach-Object { $_.username })
        $jsonBody.heavyUserIds = @($selectedUsers | ForEach-Object { $_.id })
        if ($gui) {
            [System.Windows.Forms.MessageBox]::Show("Selected $($selectedUsers.Count) heavy users", "Heavy Users", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
        }
        else {
            Write-Host "Heavy Users: $($selectedUsers.Count) selected" -ForegroundColor Yellow
        }
    }

    $jsonString = $jsonBody | ConvertTo-Json

    try {
        if ($gui) {
            $progress = New-Object System.Windows.Forms.Form
            $progress.Text = "Generating License"
            $progress.Size = New-Object System.Drawing.Size(300, 100)
            $progress.StartPosition = "CenterScreen"
            $progress.FormBorderStyle = "FixedDialog"
            $progress.ControlBox = $false
            
            $label = New-Object System.Windows.Forms.Label
            $label.Location = New-Object System.Drawing.Point(10, 20)
            $label.Size = New-Object System.Drawing.Size(280, 30)
            $label.Text = "Generating license file..."
            $progress.Controls.Add($label)
            
            $progress.Show()
            $progress.Refresh()
        }

        $null = Invoke-WebRequest -Uri "$server/api/licences/generate-package" `
            -Method Post `
            -ContentType "application/json" `
            -Body $jsonString `
            -OutFile $outputPath

        if ($gui) {
            $progress.Close()
            [System.Windows.Forms.MessageBox]::Show(
                "License successfully generated and saved to:`n$outputPath",
                "Success",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Information)

            $importChoice = [System.Windows.Forms.MessageBox]::Show(
                "Do you want to import this license now?",
                "Import License",
                [System.Windows.Forms.MessageBoxButtons]::YesNo,
                [System.Windows.Forms.MessageBoxIcon]::Question)
            
            if ($importChoice -eq [System.Windows.Forms.DialogResult]::Yes) {
                Import-License -importFile $outputPath -serverUrl $server -gui
            }
        }
        else {
            Write-Host "License successfully generated and saved to $outputPath" -ForegroundColor Green
            $importChoice = Read-Host "Do you want to import this license now? (y/N)"
            if ($importChoice -match '^[yY]') {
                Import-License -importFile $outputPath -serverUrl $server
            }
        }
        return $true
    }
    catch {
        if ($gui) {
            if ($progress) { $progress.Close() }
            [System.Windows.Forms.MessageBox]::Show(
                "Failed to generate license: $($_.Exception.Message)",
                "Error",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Error)
        }
        else {
            Write-Host "Error: Failed to generate license - $($_.Exception.Message)" -ForegroundColor Red
        }
        
        if (Test-Path $outputPath) {
            Remove-Item $outputPath
        }
        return $false
    }
}

function Import-License {
    [CmdletBinding()]
    param (
        [string]$importFile,
        [string]$serverUrl,
        [switch]$gui
    )

    if ([string]::IsNullOrEmpty($importFile)) {
        if ($gui) {
            $importFile = Show-GuiFilePickerDialog -title "Select License File to Import"
        }
        else {
            $importFile = Show-TerminalFilePicker -title "Select License File to Import"
        }
        
        if ([string]::IsNullOrEmpty($importFile)) {
            if ($gui) {
                [System.Windows.Forms.MessageBox]::Show("Import canceled", "Operation Canceled", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
            }
            else {
                Write-Host "Import canceled" -ForegroundColor Yellow
            }
            return $false
        }
    }

    if (-not (Test-Path $importFile)) {
        $message = "Error: File not found - $importFile"
        if ($gui) {
            [System.Windows.Forms.MessageBox]::Show($message, "Error", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        }
        else {
            Write-Host $message -ForegroundColor Red
        }
        return $false
    }

    if ($gui) {
        $progress = New-Object System.Windows.Forms.Form
        $progress.Text = "Importing License"
        $progress.Size = New-Object System.Drawing.Size(300, 100)
        $progress.StartPosition = "CenterScreen"
        $progress.FormBorderStyle = "FixedDialog"
        $progress.ControlBox = $false
        
        $label = New-Object System.Windows.Forms.Label
        $label.Location = New-Object System.Drawing.Point(10, 20)
        $label.Size = New-Object System.Drawing.Size(280, 30)
        $label.Text = "Importing license file..."
        $progress.Controls.Add($label)
        
        $progress.Show()
        $progress.Refresh()
    }
    else {
        Write-Host "Importing license from $importFile..." -ForegroundColor Yellow
    }

    try {
        $fileContent = [System.IO.File]::ReadAllText($importFile)
        $boundary = [System.Guid]::NewGuid().ToString()
        $LF = "`r`n"
        
        $bodyLines = (
            "--$boundary",
            "Content-Disposition: form-data; name=`"file`"; filename=`"$(Split-Path $importFile -Leaf)`"",
            "Content-Type: application/octet-stream$LF",
            $fileContent,
            "--$boundary--$LF"
        ) -join $LF

        $null = Invoke-RestMethod -Uri "$serverUrl/api/licences/import-package" `
            -Method Post `
            -ContentType "multipart/form-data; boundary=`"$boundary`"" `
            -Body $bodyLines

        if ($gui) {
            $progress.Close()
            [System.Windows.Forms.MessageBox]::Show("License successfully imported", "Success", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
        }
        else {
            Write-Host "License successfully imported" -ForegroundColor Green
        }
        return $true
    }
    catch {
        if ($gui) {
            $progress.Close()
            [System.Windows.Forms.MessageBox]::Show("Failed to import license: $($_.Exception.Message)", "Error", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        }
        else {
            Write-Host "Error: Failed to import license - $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

Export-ModuleMember -Function Import-License, New-License