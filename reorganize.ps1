# PowerShell script to reorganize project structure
# This script moves all files to their new locations in /src

Write-Host "Starting project reorganization..." -ForegroundColor Green

# Create all necessary directories
$directories = @(
    "src/presentation/features/auth/components",
    "src/presentation/features/auth/screens",
    "src/presentation/features/onboarding/screens",
    "src/presentation/features/dashboard/screens",
    "src/presentation/features/profile/screens",
    "src/presentation/features/radar-config/screens",
    "src/presentation/features/content-generation/screens",
    "src/presentation/features/content-generation/components",
    "src/presentation/features/content-generation/hooks",
    "src/presentation/features/brand-analysis/screens",
    "src/presentation/features/radar-results/screens",
    "src/presentation/shared/components/ui",
    "src/presentation/shared/components/forms",
    "src/presentation/shared/components/layout",
    "src/presentation/shared/components/editors",
    "src/presentation/shared/components/charts",
    "src/presentation/shared/components/modals",
    "src/presentation/shared/components/radar",
    "src/presentation/context",
    "src/core/config",
    "src/core/types",
    "src/infrastructure/api"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Directories created." -ForegroundColor Yellow

# Move screens to feature modules
Write-Host "Moving screens..." -ForegroundColor Yellow

$screenMoves = @{
    "screens/Login.tsx" = "src/presentation/features/auth/screens/Login.tsx"
    "screens/Register.tsx" = "src/presentation/features/auth/screens/Register.tsx"
    "screens/Landing.tsx" = "src/presentation/features/auth/screens/Landing.tsx"
    "screens/Onboarding.tsx" = "src/presentation/features/onboarding/screens/Onboarding.tsx"
    "screens/Dashboard.tsx" = "src/presentation/features/dashboard/screens/Dashboard.tsx"
    "screens/Profile.tsx" = "src/presentation/features/profile/screens/Profile.tsx"
    "screens/RadarConfig.tsx" = "src/presentation/features/radar-config/screens/RadarConfig.tsx"
    "screens/RadarScanning.tsx" = "src/presentation/features/radar-config/screens/RadarScanning.tsx"
    "screens/ContentGen.tsx" = "src/presentation/features/content-generation/screens/ContentGen.tsx"
    "screens/BrandAnalysis.tsx" = "src/presentation/features/brand-analysis/screens/BrandAnalysis.tsx"
    "screens/Scanning.tsx" = "src/presentation/features/brand-analysis/screens/Scanning.tsx"
    "screens/BrandResults.tsx" = "src/presentation/features/brand-analysis/screens/BrandResults.tsx"
    "screens/RadarResults.tsx" = "src/presentation/features/radar-results/screens/RadarResults.tsx"
    "screens/MarketRadar.tsx" = "src/presentation/features/radar-results/screens/MarketRadar.tsx"
}

foreach ($move in $screenMoves.GetEnumerator()) {
    if (Test-Path $move.Key) {
        Move-Item -Path $move.Key -Destination $move.Value -Force
        Write-Host "  Moved $($move.Key)" -ForegroundColor Gray
    }
}

# Move shared components
Write-Host "Moving shared components..." -ForegroundColor Yellow

# UI components
$uiComponents = @("Input.tsx", "GlassCard.tsx", "EmptyState.tsx", "StatCard.tsx", "FloatingThemeToggle.tsx", "StatusItem.tsx")
foreach ($comp in $uiComponents) {
    if (Test-Path "components/$comp") {
        Move-Item -Path "components/$comp" -Destination "src/presentation/shared/components/ui/$comp" -Force
    }
}

# Form components
$formComponents = @("TagInput.tsx", "ColorPicker.tsx", "CustomDropdown.tsx", "DynamicList.tsx", "SocialLinks.tsx")
foreach ($comp in $formComponents) {
    if (Test-Path "components/$comp") {
        Move-Item -Path "components/$comp" -Destination "src/presentation/shared/components/forms/$comp" -Force
    }
}

# Layout components
$layoutComponents = @("Sidebar.tsx", "SectionCard.tsx")
foreach ($comp in $layoutComponents) {
    if (Test-Path "components/$comp") {
        Move-Item -Path "components/$comp" -Destination "src/presentation/shared/components/layout/$comp" -Force
    }
}

# Editor components
if (Test-Path "components/LogoEditor.tsx") {
    Move-Item -Path "components/LogoEditor.tsx" -Destination "src/presentation/shared/components/editors/LogoEditor.tsx" -Force
}

# Chart components
if (Test-Path "components/RadarChart.tsx") {
    Move-Item -Path "components/RadarChart.tsx" -Destination "src/presentation/shared/components/charts/RadarChart.tsx" -Force
}

# Modal components
if (Test-Path "components/NewsModal.tsx") {
    Move-Item -Path "components/NewsModal.tsx" -Destination "src/presentation/shared/components/modals/NewsModal.tsx" -Force
}

# Radar-specific components
$radarComponents = @("RadarComparisons.tsx", "RadarCompetitors.tsx", "RadarNews.tsx", "RadarTrends.tsx")
foreach ($comp in $radarComponents) {
    if (Test-Path "components/$comp") {
        Move-Item -Path "components/$comp" -Destination "src/presentation/shared/components/radar/$comp" -Force
    }
}

# Move content-gen components
Write-Host "Moving content-gen components..." -ForegroundColor Yellow

if (Test-Path "components/contentgen") {
    Get-ChildItem -Path "components/contentgen" -File | ForEach-Object {
        $dest = "src/presentation/features/content-generation/components/$($_.Name)"
        Move-Item -Path $_.FullName -Destination $dest -Force
    }
    
    # Move hooks separately
    if (Test-Path "components/contentgen/hooks") {
        Get-ChildItem -Path "components/contentgen/hooks" -File | ForEach-Object {
            $dest = "src/presentation/features/content-generation/hooks/$($_.Name)"
            Move-Item -Path $_.FullName -Destination $dest -Force
        }
    }
}

# Move context
Write-Host "Moving context..." -ForegroundColor Yellow
if (Test-Path "src/context/AuthContext.tsx") {
    Move-Item -Path "src/context/AuthContext.tsx" -Destination "src/presentation/context/AuthContext.tsx" -Force
}

# Move core files
Write-Host "Moving core files..." -ForegroundColor Yellow
if (Test-Path "constants.ts") {
    Move-Item -Path "constants.ts" -Destination "src/core/config/constants.ts" -Force
}
if (Test-Path "types.ts") {
    Move-Item -Path "types.ts" -Destination "src/core/types/index.ts" -Force
}

# Move lib to infrastructure
Write-Host "Moving lib to infrastructure..." -ForegroundColor Yellow
if (Test-Path "src/lib/supabase.ts") {
    Move-Item -Path "src/lib/supabase.ts" -Destination "src/infrastructure/api/supabase.ts" -Force
}

# Move App.tsx and index.tsx
Write-Host "Moving root files..." -ForegroundColor Yellow
if (Test-Path "App.tsx") {
    Move-Item -Path "App.tsx" -Destination "src/App.tsx" -Force
}
if (Test-Path "index.tsx") {
    Move-Item -Path "index.tsx" -Destination "src/main.tsx" -Force
}

Write-Host "File reorganization complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update import paths in all files" -ForegroundColor White
Write-Host "  2. Update vite.config.ts path aliases" -ForegroundColor White
Write-Host "  3. Update tsconfig.json paths" -ForegroundColor White
Write-Host "  4. Update index.html to point to src/main.tsx" -ForegroundColor White
