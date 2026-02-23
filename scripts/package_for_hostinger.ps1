param(
    [string]$Out = "deploy.zip"
)

Write-Host "Packaging app for Hostinger..."

# Ensure we are in repo root
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

# Install production dependencies and build
Write-Host "Running npm ci"
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed (exit $LASTEXITCODE)" }

Write-Host "Building Next.js"
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build failed (exit $LASTEXITCODE)" }

Write-Host "Pruning dev dependencies (production only)"
npm prune --production

# Files/folders to include
$items = @(
    ".next",
    "package.json",
    "package-lock.json",
    "node_modules",
    "public",
    "next.config.js"
)

# Keep only existing ones
$existing = @()
foreach ($i in $items) {
    if (Test-Path $i) { $existing += $i }
}

if ($existing.Count -eq 0) { throw "No files found to package." }

Write-Host "Compressing: $($existing -join ', ') -> $Out"
if (Test-Path $Out) { Remove-Item $Out -Force }
Compress-Archive -Path $existing -DestinationPath $Out -Force

Write-Host "Created $Out"
