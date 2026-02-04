# PowerShell script to update all imports in moved files
# This script uses regex to replace old import paths with new ones

Write-Host "Updating import paths..." -ForegroundColor Green

# Define replacement patterns
$replacements = @(
    # AuthContext imports
    @{Pattern = 'from [''"]\.\.\/src\/context\/AuthContext[''"]'; Replacement = 'from "@context/AuthContext"' },
    @{Pattern = 'from [''"]\.\/src\/context\/AuthContext[''"]'; Replacement = 'from "@context/AuthContext"' },
    @{Pattern = 'from [''"]@\/src\/context\/AuthContext[''"]'; Replacement = 'from "@context/AuthContext"' },
    
    # Supabase imports
    @{Pattern = 'from [''"]\.\.\/src\/lib\/supabase[''"]'; Replacement = 'from "@infrastructure/api/supabase"' },
    @{Pattern = 'from [''"]\.\/src\/lib\/supabase[''"]'; Replacement = 'from "@infrastructure/api/supabase"' },
    @{Pattern = 'from [''"]@\/src\/lib\/supabase[''"]'; Replacement = 'from "@infrastructure/api/supabase"' },
    
    # Constants imports
    @{Pattern = 'from [''"]\.\.\/constants[''"]'; Replacement = 'from "@core/config/constants"' },
    @{Pattern = 'from [''"]\.\/constants[''"]'; Replacement = 'from "@core/config/constants"' },
    @{Pattern = 'from [''"]@\/constants[''"]'; Replacement = 'from "@core/config/constants"' },
    
    # Types imports
    @{Pattern = 'from [''"]\.\.\/types[''"]'; Replacement = 'from "@core/types"' },
    @{Pattern = 'from [''"]\.\/types[''"]'; Replacement = 'from "@core/types"' },
    @{Pattern = 'from [''"]@\/types[''"]'; Replacement = 'from "@core/types"' },
    
    # Component imports (old structure)
    @{Pattern = 'from [''"]\.\.\/components\/'; Replacement = 'from "@shared/components/' },
    @{Pattern = 'from [''"]\.\/components\/'; Replacement = 'from "@shared/components/' },
    @{Pattern = 'from [''"]@\/components\/'; Replacement = 'from "@shared/components/' },
    
    # Feature imports (already in features)
    @{Pattern = 'from [''"]@\/src\/features\/'; Replacement = 'from "@features/' },
    @{Pattern = 'from [''"]\.\.\/\.\.\/\.\.\/features\/'; Replacement = 'from "@features/' },
    
    # Domain imports
    @{Pattern = 'from [''"]@\/src\/domain\/'; Replacement = 'from "@domain/' },
    
    # Infrastructure imports
    @{Pattern = 'from [''"]@\/src\/infrastructure\/'; Replacement = 'from "@infrastructure/' }
)

# Get all TypeScript and TSX files in src
$files = Get-ChildItem -Path "src" -Include *.ts, *.tsx -Recurse -File

$totalFiles = $files.Count
$updatedFiles = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $fileUpdated = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match $replacement.Pattern) {
            $content = $content -replace $replacement.Pattern, $replacement.Replacement
            $fileUpdated = $true
        }
    }
    
    if ($fileUpdated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updatedFiles++
        Write-Host "  Updated: $($file.FullName)" -ForegroundColor Gray
    }
}

Write-Host "`nImport update complete!" -ForegroundColor Green
Write-Host "  Total files scanned: $totalFiles" -ForegroundColor White
Write-Host "  Files updated: $updatedFiles" -ForegroundColor White
