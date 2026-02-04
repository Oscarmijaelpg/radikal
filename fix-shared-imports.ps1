# Fix shared component imports to include subdirectories
# Updates @shared/components/ComponentName to @shared/components/category/ComponentName

Write-Host "Fixing shared component import paths..." -ForegroundColor Green

$replacements = @{
    '@shared/components/SectionCard' = '@shared/components/layout/SectionCard'
    '@shared/components/TagInput'    = '@shared/components/forms/TagInput'
    '@shared/components/ColorPicker' = '@shared/components/forms/ColorPicker'
    '@shared/components/contentgen'  = '@shared/components/contentgen'
}

$files = Get-ChildItem -Path "src" -Include *.ts, *.tsx -Recurse -File
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $fileChanged = $false
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $new
            $fileChanged = $true
        }
    }
    
    if ($fileChanged) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixedCount++
        Write-Host "  Fixed: $($file.FullName)" -ForegroundColor Gray
    }
}

Write-Host "`nShared component import fix complete!" -ForegroundColor Green
Write-Host "  Files fixed: $fixedCount" -ForegroundColor White
