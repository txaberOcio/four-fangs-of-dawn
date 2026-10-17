# Crea los accesos directos de Four Fangs of Dawn (lo llama install.cmd)
$ErrorActionPreference = 'Stop'
$dir = Join-Path $env:LOCALAPPDATA 'Programs\Four Fangs of Dawn'
$w = New-Object -ComObject WScript.Shell
$destinos = @(
  (Join-Path ([Environment]::GetFolderPath('Desktop')) 'Four Fangs of Dawn.lnk'),
  (Join-Path ([Environment]::GetFolderPath('Programs')) 'Four Fangs of Dawn.lnk')
)
foreach ($ruta in $destinos) {
  $s = $w.CreateShortcut($ruta)
  $s.TargetPath = Join-Path $dir 'FourFangsOfDawn.exe'
  $s.WorkingDirectory = $dir
  $s.IconLocation = Join-Path $dir 'vampiro.ico'
  $s.Description = 'Four Fangs of Dawn'
  $s.Save()
}
$u = $w.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Programs')) 'Desinstalar Four Fangs of Dawn.lnk'))
$u.TargetPath = Join-Path $dir 'Desinstalar.cmd'
$u.WorkingDirectory = $dir
$u.Save()
