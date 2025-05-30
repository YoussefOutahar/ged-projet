function Show-MainMenu {
    param (
        [switch]$gui
    )

    if ($gui) {
        return Show-GuiMainMenu
    } else {
        return Show-ConsoleMainMenu
    }
}

function Show-ConsoleMainMenu {
    Clear-Host
    Write-Host "`n=== Yandoc License Manager ===`n" -ForegroundColor Cyan
    Write-Host "1. Generate New License"
    Write-Host "2. Import Existing License"
    Write-Host "3. Exit"
    Write-Host "`nPress Ctrl+C or Ctrl+Q to exit at any time"
    Write-Host "`nPlease select an option (1-3):" -NoNewline

    # Enable Ctrl+C handling
    [Console]::TreatControlCAsInput = $true

    do {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            
            # Check for Ctrl + C or Ctrl + Q
            if (($key.Modifiers -band [ConsoleModifiers]::Control) -and 
                ($key.Key -eq 'C' -or $key.Key -eq 'Q')) {
                Write-Host "`nExiting..." -ForegroundColor Yellow
                return "exit"
            }

            # Handle regular number keys
            if ($key.KeyChar -in '1','2','3') {
                Write-Host $key.KeyChar
                switch ($key.KeyChar) {
                    '1' { return "generate" }
                    '2' { return "import" }
                    '3' { return "exit" }
                }
            } else {
                Write-Host "`nInvalid selection. Please choose 1-3:" -NoNewline -ForegroundColor Yellow
            }
        }
        
        Start-Sleep -Milliseconds 100
    } while ($true)
}

function Show-GuiMainMenu {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Yandoc License Manager"
    $form.Size = New-Object System.Drawing.Size(400,300)  # Increased height for new label
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false

    # Title Label
    $labelTitle = New-Object System.Windows.Forms.Label
    $labelTitle.Location = New-Object System.Drawing.Point(20,20)
    $labelTitle.Size = New-Object System.Drawing.Size(360,30)
    $labelTitle.Text = "Welcome to Yandoc License Manager"
    $labelTitle.Font = New-Object System.Drawing.Font("Arial",12,[System.Drawing.FontStyle]::Bold)
    $form.Controls.Add($labelTitle)

    # Shortcut Label
    $labelShortcut = New-Object System.Windows.Forms.Label
    $labelShortcut.Location = New-Object System.Drawing.Point(20,50)
    $labelShortcut.Size = New-Object System.Drawing.Size(360,20)
    $labelShortcut.Text = "Press Ctrl+C or Ctrl+Q to exit at any time"
    $labelShortcut.ForeColor = [System.Drawing.Color]::Gray
    $form.Controls.Add($labelShortcut)

    # Generate Button
    $btnGenerate = New-Object System.Windows.Forms.Button
    $btnGenerate.Location = New-Object System.Drawing.Point(100,90)  # Adjusted position
    $btnGenerate.Size = New-Object System.Drawing.Size(200,40)
    $btnGenerate.Text = "Generate New License"
    $btnGenerate.Add_Click({
        $form.Tag = "generate"
        $form.Close()
    })
    $form.Controls.Add($btnGenerate)

    # Import Button
    $btnImport = New-Object System.Windows.Forms.Button
    $btnImport.Location = New-Object System.Drawing.Point(100,140)  # Adjusted position
    $btnImport.Size = New-Object System.Drawing.Size(200,40)
    $btnImport.Text = "Import Existing License"
    $btnImport.Add_Click({
        $form.Tag = "import"
        $form.Close()
    })
    $form.Controls.Add($btnImport)

    # Exit Button
    $btnExit = New-Object System.Windows.Forms.Button
    $btnExit.Location = New-Object System.Drawing.Point(100,190)  # Adjusted position
    $btnExit.Size = New-Object System.Drawing.Size(200,40)
    $btnExit.Text = "Exit"
    $btnExit.Add_Click({
        $form.Tag = "exit"
        $form.Close()
    })
    $form.Controls.Add($btnExit)

    # Handle Ctrl+C and Ctrl+Q
    $form.KeyPreview = $true
    $form.Add_KeyDown({
        param($sender, $e)
        if ($e.Control -and ($e.KeyCode -eq 'C' -or $e.KeyCode -eq 'Q')) {
            $form.Tag = "exit"
            $form.Close()
        }
    })

    $form.ShowDialog() | Out-Null
    return $form.Tag
}

function Get-RequiredParameters {
    param (
        [switch]$gui,
        [string]$client = "",
        [string]$expiry = "",
        [int]$users = 0,
        [int]$sessions = 0
    )

    $params = @{
        client = $client
        expiry = $expiry
        users = $users
        sessions = $sessions
    }

    if ($gui) {
        return Get-GuiParameters @params
    } else {
        return Get-ConsoleParameters @params
    }
}

function Get-ConsoleParameters {
    param (
        [string]$client = "",
        [string]$expiry = "",
        [int]$users = 0,
        [int]$sessions = 0
    )

    Write-Host "`nPlease provide the following information:" -ForegroundColor Cyan

    if ([string]::IsNullOrEmpty($client)) {
        $client = Read-Host "Client Name"
    }

    if ([string]::IsNullOrEmpty($expiry)) {
        do {
            $expiry = Read-Host "Expiration Date (YYYY-MM-DD)"
            try {
                $null = [DateTime]::ParseExact($expiry, "yyyy-MM-dd", $null)
                break
            } catch {
                Write-Host "Invalid date format. Please use YYYY-MM-DD" -ForegroundColor Yellow
            }
        } while ($true)
    }

    if ($users -le 0) {
        do {
            $usersStr = Read-Host "Number of Users"
            if ([int]::TryParse($usersStr, [ref]$users) -and $users -gt 0) {
                break
            }
            Write-Host "Please enter a valid number greater than 0" -ForegroundColor Yellow
        } while ($true)
    }

    if ($sessions -le 0) {
        do {
            $sessionsStr = Read-Host "Max Sessions per User"
            if ([int]::TryParse($sessionsStr, [ref]$sessions) -and $sessions -gt 0) {
                break
            }
            Write-Host "Please enter a valid number greater than 0" -ForegroundColor Yellow
        } while ($true)
    }

    return @{
        client = $client
        expiry = $expiry
        users = $users
        sessions = $sessions
    }
}

function Get-GuiParameters {
    param (
        [string]$client = "",
        [string]$expiry = "",
        [int]$users = 0,
        [int]$sessions = 0
    )

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "License Parameters"
    $form.Size = New-Object System.Drawing.Size(400,300)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false

    # Client Name
    $lblClient = New-Object System.Windows.Forms.Label
    $lblClient.Location = New-Object System.Drawing.Point(20,20)
    $lblClient.Size = New-Object System.Drawing.Size(100,20)
    $lblClient.Text = "Client Name:"
    $form.Controls.Add($lblClient)

    $txtClient = New-Object System.Windows.Forms.TextBox
    $txtClient.Location = New-Object System.Drawing.Point(120,20)
    $txtClient.Size = New-Object System.Drawing.Size(200,20)
    $txtClient.Text = $client
    $form.Controls.Add($txtClient)

    # Expiry Date
    $lblExpiry = New-Object System.Windows.Forms.Label
    $lblExpiry.Location = New-Object System.Drawing.Point(20,60)
    $lblExpiry.Size = New-Object System.Drawing.Size(100,20)
    $lblExpiry.Text = "Expiry Date:"
    $form.Controls.Add($lblExpiry)

    $txtExpiry = New-Object System.Windows.Forms.DateTimePicker
    $txtExpiry.Location = New-Object System.Drawing.Point(120,60)
    $txtExpiry.Size = New-Object System.Drawing.Size(200,20)
    $txtExpiry.Format = [System.Windows.Forms.DateTimePickerFormat]::Custom
    $txtExpiry.CustomFormat = "yyyy-MM-dd"
    if (-not [string]::IsNullOrEmpty($expiry)) {
        try {
            $txtExpiry.Value = [DateTime]::ParseExact($expiry, "yyyy-MM-dd", $null)
        } catch {}
    }
    $form.Controls.Add($txtExpiry)

    # Users
    $lblUsers = New-Object System.Windows.Forms.Label
    $lblUsers.Location = New-Object System.Drawing.Point(20,100)
    $lblUsers.Size = New-Object System.Drawing.Size(100,20)
    $lblUsers.Text = "Users:"
    $form.Controls.Add($lblUsers)

    $numUsers = New-Object System.Windows.Forms.NumericUpDown
    $numUsers.Location = New-Object System.Drawing.Point(120,100)
    $numUsers.Size = New-Object System.Drawing.Size(100,20)
    $numUsers.Minimum = 1
    $numUsers.Maximum = 999999
    $numUsers.Value = [Math]::Max(1, $users)
    $form.Controls.Add($numUsers)

    # Sessions
    $lblSessions = New-Object System.Windows.Forms.Label
    $lblSessions.Location = New-Object System.Drawing.Point(20,140)
    $lblSessions.Size = New-Object System.Drawing.Size(100,20)
    $lblSessions.Text = "Sessions:"
    $form.Controls.Add($lblSessions)

    $numSessions = New-Object System.Windows.Forms.NumericUpDown
    $numSessions.Location = New-Object System.Drawing.Point(120,140)
    $numSessions.Size = New-Object System.Drawing.Size(100,20)
    $numSessions.Minimum = 1
    $numSessions.Maximum = 999999
    $numSessions.Value = [Math]::Max(1, $sessions)
    $form.Controls.Add($numSessions)

    # OK Button
    $btnOK = New-Object System.Windows.Forms.Button
    $btnOK.Location = New-Object System.Drawing.Point(120,200)
    $btnOK.Size = New-Object System.Drawing.Size(75,23)
    $btnOK.Text = "OK"
    $btnOK.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($btnOK)
    $form.AcceptButton = $btnOK

    # Cancel Button
    $btnCancel = New-Object System.Windows.Forms.Button
    $btnCancel.Location = New-Object System.Drawing.Point(205,200)
    $btnCancel.Size = New-Object System.Drawing.Size(75,23)
    $btnCancel.Text = "Cancel"
    $btnCancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $form.Controls.Add($btnCancel)
    $form.CancelButton = $btnCancel

    $result = $form.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        return @{
            client = $txtClient.Text
            expiry = $txtExpiry.Value.ToString("yyyy-MM-dd")
            users = [int]$numUsers.Value
            sessions = [int]$numSessions.Value
        }
    }
    return $null
}

Export-ModuleMember -Function Show-MainMenu, Get-RequiredParameters