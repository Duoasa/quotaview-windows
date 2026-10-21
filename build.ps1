param([switch]$Test)
$ErrorActionPreference = 'Stop'
$qvRoot = $PSScriptRoot
$qvFramework = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319'
$qvCompiler = Join-Path $qvFramework 'csc.exe'
if (-not (Test-Path -LiteralPath $qvCompiler)) { throw 'The Windows .NET Framework compiler is unavailable.' }
$qvOutput = Join-Path $qvRoot 'bin'
New-Item -ItemType Directory -Path $qvOutput -Force | Out-Null
$qvReferences = @('System.dll', 'System.Core.dll', 'System.Web.Extensions.dll', 'System.Xaml.dll', 'System.Windows.Forms.dll', 'System.Drawing.dll', 'WPF/WindowsBase.dll', 'WPF/PresentationCore.dll', 'WPF/PresentationFramework.dll')
$qvArguments = @('/nologo', '/target:winexe', '/platform:x64', '/optimize+', '/codepage:65001', '/warn:4', ('/out:' + (Join-Path $qvOutput 'QuotaView.Windows.exe')), ('/win32manifest:' + (Join-Path $qvRoot 'app.manifest')))
foreach ($qvReference in $qvReferences) { $qvArguments += '/reference:' + (Join-Path $qvFramework $qvReference) }
$qvSources = Get-ChildItem -LiteralPath (Join-Path $qvRoot 'src') -Filter '*.cs' | Select-Object -ExpandProperty FullName
& $qvCompiler @qvArguments @qvSources
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
Copy-Item -LiteralPath (Join-Path $qvRoot 'QuotaView.Windows.exe.config') -Destination $qvOutput -Force
Write-Output ('Built ' + (Join-Path $qvOutput 'QuotaView.Windows.exe'))
if ($Test) {
    $qvTestArgs = @('/nologo', '/target:exe', '/platform:x64', '/codepage:65001', ('/out:' + (Join-Path $qvOutput 'QuotaView.Smoke.exe')), ('/reference:' + (Join-Path $qvFramework 'System.Web.Extensions.dll')))
    & $qvCompiler @qvTestArgs (Join-Path $qvRoot 'src/LocalSessions.cs') (Join-Path $qvRoot 'tests/Smoke.cs')
    if ($LASTEXITCODE -ne 0) { throw 'Smoke test compilation failed.' }
    & (Join-Path $qvOutput 'QuotaView.Smoke.exe')
    if ($LASTEXITCODE -ne 0) { throw 'Smoke tests failed.' }
}
