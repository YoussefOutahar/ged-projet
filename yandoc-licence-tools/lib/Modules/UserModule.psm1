# Modules/UserModule.psm1

function Show-TerminalUserSelection {
    param (
        [array]$users
    )
    
    $selectedUsers = @()
    $sortedUsers = $users | Sort-Object username
    
    Write-Host "`nAvailable users:" -ForegroundColor Yellow
    for ($i = 0; $i -lt $sortedUsers.Count; $i++) {
        Write-Host "$($i + 1). $($sortedUsers[$i].username) ($($sortedUsers[$i].email))"
    }
    
    do {
        Write-Host "`nEnter user numbers to select (comma-separated, or 'done' to finish):"
        $input = Read-Host

        if ($input.ToLower() -eq 'done') {
            break
        }
        
        if (![string]::IsNullOrWhiteSpace($input)) {
            $selections = $input -split ',' | ForEach-Object { $_.Trim() }
            
            foreach ($sel in $selections) {
                if ([int]::TryParse($sel, [ref]$null)) {
                    $index = [int]$sel - 1
                    if ($index -ge 0 -and $index -lt $sortedUsers.Count) {
                        if (-not ($selectedUsers | Where-Object { $_.id -eq $sortedUsers[$index].id })) {
                            $selectedUsers += @{
                                id = $sortedUsers[$index].id
                                username = $sortedUsers[$index].username
                            }
                            Write-Host "Added user: $($sortedUsers[$index].username)" -ForegroundColor Green
                        } else {
                            Write-Host "User $($sortedUsers[$index].username) already selected" -ForegroundColor Yellow
                        }
                    }
                }
            }
        }
        
        Write-Host "`nCurrently selected users:" -ForegroundColor Cyan
        $selectedUsers | ForEach-Object { Write-Host "- $($_.username)" }
        
    } while ($true)
    
    return $selectedUsers
}

function Get-Users {
    param (
        [string]$serverUrl,
        [switch]$gui
    )
    
    try {
        $progressMsg = "Fetching users from server..."
        if ($gui) {
            $progress = New-Object System.Windows.Forms.Form
            $progress.Text = "Loading"
            $progress.Size = New-Object System.Drawing.Size(300,100)
            $progress.StartPosition = "CenterScreen"
            $progress.FormBorderStyle = "FixedDialog"
            $progress.ControlBox = $false
            
            $label = New-Object System.Windows.Forms.Label
            $label.Location = New-Object System.Drawing.Point(10,20)
            $label.Size = New-Object System.Drawing.Size(280,30)
            $label.Text = $progressMsg
            $progress.Controls.Add($label)
            
            $progress.Show()
            $progress.Refresh()
        } else {
            Write-Host $progressMsg -ForegroundColor Yellow
        }

        $response = Invoke-RestMethod -Uri "$serverUrl/api/licences/list-users" -Method Get
        
        if ($gui -and $progress) {
            $progress.Close()
        }
        
        return , @($response)  # Force return as array
    } catch {
        if ($gui -and $progress) {
            $progress.Close()
        }
        
        $errorMsg = "Failed to fetch users: $($_.Exception.Message)"
        if ($gui) {
            [System.Windows.Forms.MessageBox]::Show($errorMsg, "Error", 
                [System.Windows.Forms.MessageBoxButtons]::OK, 
                [System.Windows.Forms.MessageBoxIcon]::Error)
        } else {
            Write-Host $errorMsg -ForegroundColor Red
        }
        return , @()
    }
}

function Select-HeavyUsers {
    param (
        [string]$server,
        [switch]$gui
    )

    if ($gui) {
        $result = [System.Windows.Forms.MessageBox]::Show(
            "Would you like to define heavy users for this license?",
            "Heavy Users Selection",
            [System.Windows.Forms.MessageBoxButtons]::YesNo,
            [System.Windows.Forms.MessageBoxIcon]::Question)
        
        if ($result -eq [System.Windows.Forms.DialogResult]::No) {
            return @()
        }
    } else {
        $heavyUsersChoice = Read-Host "Do you want to define heavy users for this license? (y/N)"
        if ($heavyUsersChoice -notmatch '^[yY]') {
            return @()
        }
    }

    $usersList = Get-Users -serverUrl $server -gui:$gui

    if (-not $usersList -or $usersList.Count -eq 0) {
        $errorMsg = "No users found or unable to fetch user list."
        if ($gui) {
            [System.Windows.Forms.MessageBox]::Show($errorMsg, "Error", 
                [System.Windows.Forms.MessageBoxButtons]::OK, 
                [System.Windows.Forms.MessageBoxIcon]::Error)
        } else {
            Write-Host $errorMsg -ForegroundColor Red
        }
        return @()
    }

    $selectedUsers = if ($gui) {
        Show-GuiUserSelection -users $usersList
    } else {
        Show-TerminalUserSelection -users $usersList
    }

    if ($selectedUsers.Count -gt 0) {
        $summary = "Selected Heavy Users:`n`n" + ($selectedUsers | ForEach-Object { "- $($_.username)" } | Out-String)
        if ($gui) {
            [System.Windows.Forms.MessageBox]::Show($summary, "Selection Summary",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Information)
        } else {
            Write-Host $summary -ForegroundColor Green
        }
    }

    return $selectedUsers
}

Export-ModuleMember -Function Get-Users, Select-HeavyUsers