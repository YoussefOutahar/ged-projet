#!/usr/bin/env pwsh
# yandoc-licence-tools.ps1

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$installPath = Split-Path -Parent $scriptPath
$corePath = Join-Path $installPath "lib/core.ps1"

# Execute the core script with all arguments
& $corePath @args