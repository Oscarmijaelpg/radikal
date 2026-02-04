# Fix mismatched quotes in import statements
# This script fixes imports that start with " but end with '

Write-Host "Fixing mismatched quotes in import statements..." -ForegroundColor Green

$files = Get-ChildItem -Path "src" -Include *.ts, *.tsx -Recurse -File

$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Fix pattern: from "path' -> from "path"
    $content = $content -replace 'from\s+"([^"'']+)''', 'from "$1"'
    
    # Fix pattern: import Name from "path' -> import Name from "path"
    $content = $content -replace 'import\s+([^"'']+)\s+from\s+"([^"'']+)''', 'import $1 from "$2"'
    
    # Fix pattern: import { } from "path' -> import { } from "path"
    $content = $content -replace 'import\s+\{([^}]+)\}\s+from\s+"([^"'']+)''', 'import {$1} from "$2"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixedCount++
        Write-Host "  Fixed: $($file.FullName)" -ForegroundColor Gray
    }
}

Write-Host "`nQuote fix complete!" -ForegroundColor Green
Write-Host "  Files fixed: $fixedCount" -ForegroundColor White
