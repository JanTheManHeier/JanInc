# Manual deploy script for janinc.no
# Bypass for når GitHub Actions er nede (https://www.githubstatus.com/).
# Krever: az CLI (innlogget), npm, og SWA CLI (npm i -g @azure/static-web-apps-cli).
#
# Bruk:  pwsh -File .\deploy.ps1

$ErrorActionPreference = "Stop"

$repoRoot   = Split-Path -Parent $MyInvocation.MyCommand.Path
$staging    = Join-Path $env:TEMP "janinc-deploy-$(Get-Random)"
$swaBinary  = Get-ChildItem "$env:USERPROFILE\.swa\deploy\*\StaticSitesClient.exe" -ErrorAction SilentlyContinue |
              Select-Object -First 1 -ExpandProperty FullName

Write-Host "==> Sjekker forutsetninger..." -ForegroundColor Cyan
if (-not (Get-Command az -ErrorAction SilentlyContinue))  { throw "az CLI mangler" }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "npm mangler" }
if (-not (Get-Command swa -ErrorAction SilentlyContinue)) {
    Write-Host "    swa CLI mangler — installerer..." -ForegroundColor Yellow
    npm install -g @azure/static-web-apps-cli | Out-Null
}
if (-not $swaBinary) {
    Write-Host "    StaticSitesClient.exe ikke nedlastet — kjører dummy-deploy for å hente..." -ForegroundColor Yellow
    swa deploy --help | Out-Null
    $swaBinary = Get-ChildItem "$env:USERPROFILE\.swa\deploy\*\StaticSitesClient.exe" |
                 Select-Object -First 1 -ExpandProperty FullName
}

Write-Host "==> Henter deployment-token fra Azure..." -ForegroundColor Cyan
$token = az staticwebapp secrets list -n janinc-site -g rg-janinc --query "properties.apiKey" -o tsv
if (-not $token) { throw "Kunne ikke hente deployment-token. Er du innlogget med 'az login'?" }

Write-Host "==> Lager staging-mappe: $staging" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $staging | Out-Null

Write-Host "==> Kopierer git-trackede filer..." -ForegroundColor Cyan
Push-Location $repoRoot
try {
    $files = git ls-files
    foreach ($f in $files) {
        $src = Join-Path $repoRoot $f
        $dst = Join-Path $staging $f
        $dstDir = Split-Path $dst -Parent
        if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
        if (Test-Path $src) { Copy-Item $src $dst -Force }
    }
    Write-Host "    Kopiert $($files.Count) filer" -ForegroundColor Gray
} finally { Pop-Location }

Write-Host "==> Installerer API-dependencies..." -ForegroundColor Cyan
Push-Location "$staging\api"
try {
    npm install --omit=dev --no-audit --no-fund --silent
} finally { Pop-Location }

Write-Host "==> Deployer til Azure Static Web Apps..." -ForegroundColor Cyan
# StaticSitesClient klager hvis cwd er innenfor staging — kjør fra repo-root i stedet
Push-Location $repoRoot
try {
    $env:DEPLOYMENT_PROVIDER       = "SwaCli"
    $env:REPOSITORY_BASE           = $staging
    $env:DEPLOYMENT_TOKEN          = $token
    $env:APP_LOCATION              = $staging
    $env:API_LOCATION              = "$staging\api"
    $env:SKIP_APP_BUILD            = "true"
    $env:SKIP_API_BUILD            = "true"
    $env:DEPLOYMENT_ACTION         = "upload"
    $env:FUNCTION_LANGUAGE         = "node"
    $env:FUNCTION_LANGUAGE_VERSION = "18"
    & $swaBinary upload
    if ($LASTEXITCODE -ne 0) { throw "Deploy feilet med exit code $LASTEXITCODE" }
} finally {
    Pop-Location
    'DEPLOYMENT_PROVIDER','REPOSITORY_BASE','DEPLOYMENT_TOKEN','APP_LOCATION','API_LOCATION',
    'SKIP_APP_BUILD','SKIP_API_BUILD','DEPLOYMENT_ACTION','FUNCTION_LANGUAGE','FUNCTION_LANGUAGE_VERSION' |
        ForEach-Object { Remove-Item "env:$_" -ErrorAction SilentlyContinue }
}

Write-Host "==> Rydder opp staging..." -ForegroundColor Cyan
Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "==> Verifiserer API..." -ForegroundColor Cyan
try {
    $h = Invoke-RestMethod -Uri "https://janinc.no/api/health" -TimeoutSec 30
    Write-Host "    Health: $($h.status) (database: $($h.database))" -ForegroundColor Green
} catch {
    Write-Host "    Helse-sjekk feilet: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Ferdig! https://janinc.no" -ForegroundColor Green
