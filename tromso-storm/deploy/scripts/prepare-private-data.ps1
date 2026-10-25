param(
    [Parameter(Mandatory = $true)]
    [string]$HandoverPath,

    [Parameter(Mandatory = $false)]
    [string]$MediaUploadsPath,

    [Parameter(Mandatory = $false)]
    [string]$LegacyStormPath
)

$ErrorActionPreference = "Stop"

$deployRoot = Split-Path -Parent $PSScriptRoot
$projectRoot = Split-Path -Parent $deployRoot
$privateRoot = Join-Path $deployRoot "private"
$importRoot = Join-Path $privateRoot "import"
$contentRoot = Join-Path $privateRoot "wp-content"
$legacyRoot = Join-Path $privateRoot "storm-legacy"

$dump = Join-Path $HandoverPath "db\wordpress_storm.sanitised.sql"
$themes = Join-Path $HandoverPath "code\themes"
$plugins = Join-Path $HandoverPath "code\plugins"
$stormArenaTheme = Join-Path $projectRoot "wp-theme\storm-arena"

foreach ($requiredPath in @($dump, $themes, $plugins, $stormArenaTheme)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Required handover path not found: $requiredPath"
    }
}

New-Item -ItemType Directory -Force -Path $importRoot | Out-Null
New-Item -ItemType Directory -Force -Path $contentRoot | Out-Null

Copy-Item -LiteralPath $dump -Destination (Join-Path $importRoot "00-wordpress.sql") -Force

$themesRoot = Join-Path $contentRoot "themes"
$pluginsRoot = Join-Path $contentRoot "plugins"
foreach ($generatedRoot in @($themesRoot, $pluginsRoot)) {
    if (Test-Path -LiteralPath $generatedRoot) {
        Remove-Item -LiteralPath $generatedRoot -Recurse -Force
    }
    New-Item -ItemType Directory -Force -Path $generatedRoot | Out-Null
}

Get-ChildItem -LiteralPath $themes -Directory | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $themesRoot -Recurse -Force
}

Copy-Item -LiteralPath $stormArenaTheme -Destination $themesRoot -Recurse -Force

Get-ChildItem -LiteralPath $plugins -Directory |
    Where-Object { $_.Name -like "Storm*" } |
    ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination $pluginsRoot -Recurse -Force
    }

if ($MediaUploadsPath) {
    if (-not (Test-Path -LiteralPath $MediaUploadsPath)) {
        throw "Media uploads path not found: $MediaUploadsPath"
    }

    $uploadsRoot = Join-Path $contentRoot "uploads"
    if (Test-Path -LiteralPath $uploadsRoot) {
        Remove-Item -LiteralPath $uploadsRoot -Recurse -Force
    }
    New-Item -ItemType Directory -Force -Path $uploadsRoot | Out-Null
    Copy-Item -Path (Join-Path $MediaUploadsPath "*") -Destination $uploadsRoot -Recurse -Force
}

if ($LegacyStormPath) {
    if (-not (Test-Path -LiteralPath $LegacyStormPath)) {
        throw "Legacy Storm path not found: $LegacyStormPath"
    }

    if (Test-Path -LiteralPath $legacyRoot) {
        Remove-Item -LiteralPath $legacyRoot -Recurse -Force
    }
    New-Item -ItemType Directory -Force -Path $legacyRoot | Out-Null
    Copy-Item -Path (Join-Path $LegacyStormPath "*") -Destination $legacyRoot -Recurse -Force
}

$secretsRoot = Join-Path $privateRoot "secrets"
New-Item -ItemType Directory -Force -Path $secretsRoot | Out-Null

foreach ($secretName in @("db_password", "db_root_password")) {
    $secretPath = Join-Path $secretsRoot $secretName
    if (-not (Test-Path -LiteralPath $secretPath)) {
        $bytes = New-Object byte[] 32
        [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
        $secret = [Convert]::ToBase64String($bytes)
        Set-Content -LiteralPath $secretPath -Value $secret -NoNewline
    }
}

Write-Host "Private deployment data prepared under $privateRoot"
if (-not $LegacyStormPath -and -not (Test-Path -LiteralPath $legacyRoot)) {
    Write-Warning "The historical /Storm/ archive was not supplied and legacy media URLs will return 404."
}
Write-Host "Add deploy\private\rclone\rclone.conf before starting; external backup is mandatory."
