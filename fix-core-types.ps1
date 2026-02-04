# Fix @core/types imports in brand-analysis feature
# These should be relative imports to ../types

Write-Host "Fixing @core/types imports in brand-analysis..." -ForegroundColor Green

$files = @(
    "src/presentation/features/brand-analysis/components/GeneralInfo.tsx",
    "src/presentation/features/brand-analysis/components/ProductsSection.tsx",
    "src/presentation/features/brand-analysis/components/BrandingSection.tsx",
    "src/presentation/features/brand-analysis/components/SEOSection.tsx",
    "src/presentation/features/brand-analysis/hooks/useBrandAnalysis.ts",
    "src/presentation/features/brand-analysis/hooks/useBrandUpdate.ts"
)

$fixedCount = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        $originalContent = $content
        
        # Fix BrandAnalysisData import
        $content = $content -replace 'from\s+"@core/types"', 'from "../types"'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            $fixedCount++
            Write-Host "  Fixed: $file" -ForegroundColor Gray
        }
    }
}

Write-Host "`n@core/types import fix complete!" -ForegroundColor Green
Write-Host "  Files fixed: $fixedCount" -ForegroundColor White
