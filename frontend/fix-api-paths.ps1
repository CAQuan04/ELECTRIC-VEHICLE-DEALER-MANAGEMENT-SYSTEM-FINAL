$filePath = "src\utils\api\services\dealer.api.js"
$content = Get-Content $filePath -Raw
$content = $content -replace "'/api/", "'/"
$content = $content -replace '"/api/', '"/'
$content = $content -replace '`/api/', '`/'
Set-Content $filePath $content -NoNewline
Write-Host "Fixed API paths in dealer.api.js"
