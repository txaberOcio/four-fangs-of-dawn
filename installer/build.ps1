# Crea el ejecutable del juego y su instalador (solo Windows, sin instalar herramientas extra).
#   Uso:  npm run build:exe          (o:  powershell -ExecutionPolicy Bypass -File installer/build.ps1)
# Resultado en la carpeta dist/:
#   FourFangsOfDawn.exe             -> el juego completo en un solo ejecutable (servidor + juego, sin instalar Node)
#   FourFangsOfDawn-Setup.exe       -> instalador: copia el juego, crea accesos directos y lo abre
param([switch]$SkipExe)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
if (-not (Test-Path node_modules)) { npm ci }
New-Item -ItemType Directory -Force dist | Out-Null

if (-not $SkipExe) {
  Write-Host 'Empaquetando el juego en un ejecutable (puede tardar unos minutos la primera vez)...'
  npx --yes @yao-pkg/pkg server/index.js --config package.json --targets node24-win-x64 --output dist/FourFangsOfDawn.exe --compress GZip
  if ($LASTEXITCODE -ne 0) { throw 'pkg ha fallado' }
}

# IExpress no soporta bien las rutas con espacios: todo se prepara en una carpeta temporal sin espacios
$work = Join-Path $env:TEMP 'ffd_setup'
if (Test-Path $work) { Remove-Item -Recurse -Force $work }
$stage = Join-Path $work 'files'
New-Item -ItemType Directory -Force $stage | Out-Null
Copy-Item dist\FourFangsOfDawn.exe $stage
Copy-Item installer\install.cmd, installer\Desinstalar.cmd, installer\crear-accesos.ps1 $stage
Copy-Item public\vampiro.ico $stage

$final = Join-Path $root 'dist\FourFangsOfDawn-Setup.exe'
if (Test-Path $final) { Remove-Item -Force $final }
$out = Join-Path $work 'FourFangsOfDawn-Setup.exe'
$sed = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgressWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=%InstallPrompt%
DisplayLicense=%DisplayLicense%
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=%PostInstallCmd%
AdminQuietInstCmd=%AdminQuietInstCmd%
UserQuietInstCmd=%UserQuietInstCmd%
SourceFiles=SourceFiles
[Strings]
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=$out
FriendlyName=Four Fangs of Dawn
AppLaunched=install.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
FILE0="FourFangsOfDawn.exe"
FILE1="install.cmd"
FILE2="Desinstalar.cmd"
FILE3="vampiro.ico"
FILE4="crear-accesos.ps1"
[SourceFiles]
SourceFiles0=$stage\
[SourceFiles0]
%FILE0%=
%FILE1%=
%FILE2%=
%FILE3%=
%FILE4%=
"@
$sedPath = Join-Path $work 'Setup.sed'
Set-Content -Path $sedPath -Value $sed -Encoding ASCII
Write-Host 'Creando el instalador...'
Start-Process -FilePath "$env:WINDIR\System32\iexpress.exe" -ArgumentList '/N', '/Q', $sedPath -Wait -NoNewWindow
$t = 0; while (-not (Test-Path $out) -and $t -lt 180) { Start-Sleep 1; $t++ }
if (-not (Test-Path $out)) { throw "IExpress no ha generado el instalador (revisa $sedPath)" }
Start-Sleep 2
Copy-Item $out $final -Force
Get-Item dist\FourFangsOfDawn.exe, dist\FourFangsOfDawn-Setup.exe | Select-Object Name, @{n = 'MB'; e = { [math]::Round($_.Length / 1MB, 1) } }
