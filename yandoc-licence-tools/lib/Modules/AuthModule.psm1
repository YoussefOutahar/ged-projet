# Modules/AuthModule.psm1

function Get-SecureCredentials {
    param(
        [switch]$gui
    )

    if ($gui) {
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing

        $form = New-Object System.Windows.Forms.Form
        $form.Text = 'License Manager Authentication'
        $form.Size = New-Object System.Drawing.Size(300,200)
        $form.StartPosition = 'CenterScreen'
        $form.FormBorderStyle = 'FixedDialog'
        $form.MaximizeBox = $false

        $lblUsername = New-Object System.Windows.Forms.Label
        $lblUsername.Location = New-Object System.Drawing.Point(10,20)
        $lblUsername.Size = New-Object System.Drawing.Size(70,20)
        $lblUsername.Text = 'Username:'
        $form.Controls.Add($lblUsername)

        $txtUsername = New-Object System.Windows.Forms.TextBox
        $txtUsername.Location = New-Object System.Drawing.Point(80,20)
        $txtUsername.Size = New-Object System.Drawing.Size(200,20)
        $form.Controls.Add($txtUsername)

        $lblPassword = New-Object System.Windows.Forms.Label
        $lblPassword.Location = New-Object System.Drawing.Point(10,50)
        $lblPassword.Size = New-Object System.Drawing.Size(70,20)
        $lblPassword.Text = 'Password:'
        $form.Controls.Add($lblPassword)

        $txtPassword = New-Object System.Windows.Forms.MaskedTextBox
        $txtPassword.Location = New-Object System.Drawing.Point(80,50)
        $txtPassword.Size = New-Object System.Drawing.Size(200,20)
        $txtPassword.PasswordChar = '*'
        $form.Controls.Add($txtPassword)

        $btnOK = New-Object System.Windows.Forms.Button
        $btnOK.Location = New-Object System.Drawing.Point(80,90)
        $btnOK.Size = New-Object System.Drawing.Size(75,23)
        $btnOK.Text = 'OK'
        $btnOK.DialogResult = [System.Windows.Forms.DialogResult]::OK
        $form.Controls.Add($btnOK)
        $form.AcceptButton = $btnOK

        $btnCancel = New-Object System.Windows.Forms.Button
        $btnCancel.Location = New-Object System.Drawing.Point(165,90)
        $btnCancel.Size = New-Object System.Drawing.Size(75,23)
        $btnCancel.Text = 'Cancel'
        $btnCancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
        $form.Controls.Add($btnCancel)
        $form.CancelButton = $btnCancel

        $form.Topmost = $true
        $result = $form.ShowDialog()

        if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
            return @{
                Username = $txtUsername.Text
                Password = $txtPassword.Text
            }
        }
        return $null
    }
    else {
        Write-Host "Please authenticate to continue:" -ForegroundColor Cyan
        $username = Read-Host "Username"
        $securePassword = Read-Host "Password" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
        $password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

        return @{
            Username = $username
            Password = $password
        }
    }
}

function Get-HashedCredentials {
    param (
        [string]$username,
        [string]$password,
        [string]$salt = $null
    )

    if ($null -eq $salt) {
        $salt = [System.Convert]::ToBase64String((New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes(16))
    }

    $passwordBytes = [System.Text.Encoding]::UTF8.GetBytes($password + $salt)
    $hasher = [System.Security.Cryptography.HashAlgorithm]::Create('SHA256')
    $hashBytes = $hasher.ComputeHash($passwordBytes)
    $hashedPassword = [System.Convert]::ToBase64String($hashBytes)

    return @{
        Username = $username
        HashedPassword = $hashedPassword
        Salt = $salt
    }
}

function Test-Credentials {
    param (
        [string]$username,
        [string]$password,
        [string]$configPath = "$PSScriptRoot\..\config\auth.json"
    )

    $configDir = Split-Path $configPath -Parent
    if (-not (Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }

    if (-not (Test-Path $configPath)) {
        $defaultCreds = Get-HashedCredentials -username "yandoc" -password "yandoc@2025"
        $authConfig = @{
            Users = @($defaultCreds)
        }
        $authConfig | ConvertTo-Json | Set-Content $configPath
        Write-Host "Created default credentials (yandoc/yandoc@2025). Please change them after first login." -ForegroundColor Yellow
    }

    $authConfig = Get-Content $configPath | ConvertFrom-Json

    $user = $authConfig.Users | Where-Object { $_.Username -eq $username }
    if (-not $user) {
        return $false
    }

    $testCreds = Get-HashedCredentials -username $username -password $password -salt $user.Salt
    return $testCreds.HashedPassword -eq $user.HashedPassword
}

function Start-Authentication {
    param (
        [switch]$gui
    )

    $maxAttempts = 3
    $attempts = 0

    while ($attempts -lt $maxAttempts) {
        $credentials = Get-SecureCredentials -gui:$gui
        
        if ($null -eq $credentials) {
            return $false
        }

        if (Test-Credentials -username $credentials.Username -password $credentials.Password) {
            Write-Host "Authentication successful!" -ForegroundColor Green
            return $true
        }

        $attempts++
        $remainingAttempts = $maxAttempts - $attempts
        Write-Host "Invalid credentials. Remaining attempts: $remainingAttempts" -ForegroundColor Red
    }

    Write-Host "Maximum authentication attempts exceeded." -ForegroundColor Red
    return $false
}

function Set-NewPassword {
    param (
        [string]$username,
        [string]$currentPassword,
        [string]$newPassword,
        [string]$configPath = "$PSScriptRoot\..\config\auth.json"
    )

    if (-not (Test-Credentials -username $username -password $currentPassword)) {
        Write-Host "Current password is incorrect." -ForegroundColor Red
        return $false
    }

    $authConfig = Get-Content $configPath | ConvertFrom-Json
    $newCreds = Get-HashedCredentials -username $username -password $newPassword
    
    $userIndex = [array]::IndexOf($authConfig.Users, ($authConfig.Users | Where-Object { $_.Username -eq $username }))
    $authConfig.Users[$userIndex] = $newCreds

    $authConfig | ConvertTo-Json | Set-Content $configPath
    Write-Host "Password changed successfully." -ForegroundColor Green
    return $true
}

Export-ModuleMember -Function Start-Authentication, Set-NewPassword