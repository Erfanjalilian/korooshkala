$ErrorActionPreference = "Stop"

$product = (Get-Content "data/products.json" -Raw -Encoding UTF8 | ConvertFrom-Json) |
  Where-Object { $_.id -eq "prd-c142579a" } |
  Select-Object -First 1
$warrantyPattern = "[0-9\u06F0-\u06F9]+\s*(?:\u0645\u0627\u0647|\u0633\u0627\u0644)\s*\u06AF\u0627\u0631\u0627\u0646\u062A\u06CC"
$guarantee = [regex]::Match($product.description, $warrantyPattern).Value
$stdoutPath = Join-Path $env:TEMP "korooshkala-next-test-out.log"
$stderrPath = Join-Path $env:TEMP "korooshkala-next-test-error.log"
$server = Start-Process -FilePath "node" `
  -ArgumentList "node_modules/next/dist/bin/next start --port 3217" `
  -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath

try {
  $url = "http://localhost:3217/products/$($product.id)"
  $html = & curl.exe -sSL --retry 10 --retry-connrefused --retry-delay 1 --max-time 5 $url
  if ($LASTEXITCODE -ne 0) { throw "curl failed with exit code $LASTEXITCODE" }

  $metadata = @{}
  $tags = @()
  foreach ($match in [regex]::Matches(($html -join "`n"), "<meta\b[^>]*>")) {
    $tag = $match.Value
    $key = [regex]::Match($tag, '(?:name|property)="([^"]+)"').Groups[1].Value
    if ($key -in @("product_id", "product_name", "og:image", "product_price", "product_old_price", "availability", "guarantee")) {
      $metadata[$key] = [regex]::Match($tag, 'content="([^"]*)"').Groups[1].Value
      $tags += $tag
    }
  }

  $expectedImage = "https://korooshkala.ir$($product.image)"
  $checks = [ordered]@{
    product_id = $metadata.product_id -eq $product.id
    product_name = $metadata.product_name -eq $product.name
    og_image = $metadata.'og:image' -eq $expectedImage
    product_price = $metadata.product_price -eq ([string]$product.price)
    product_old_price = $metadata.product_old_price -eq ([string]$product.compareAtPrice)
    availability = $metadata.availability -eq "instock"
    guarantee = $metadata.guarantee -eq $guarantee
  }

  $tags
  "SSR_TAG_COUNT=$($tags.Count)"
  "VALUE_CHECKS=$($checks | ConvertTo-Json -Compress)"
  if ($checks.Values -contains $false) { throw "Metadata value check failed" }
} finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  Remove-Item $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
}