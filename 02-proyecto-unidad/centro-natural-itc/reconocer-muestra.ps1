$ErrorActionPreference='Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Speech
$motor = New-Object System.Speech.Recognition.SpeechRecognitionEngine -ArgumentList ([System.Globalization.CultureInfo]::GetCultureInfo('es-ES'))
try {
    $opciones = New-Object System.Speech.Recognition.Choices
    $opciones.Add([string[]]@('siguiente','anterior','seleccionar','ayuda','parar'))
    $gramatica = New-Object System.Speech.Recognition.GrammarBuilder
    $gramatica.Culture = $motor.RecognizerInfo.Culture
    $gramatica.Append($opciones)
    $motor.LoadGrammar((New-Object System.Speech.Recognition.Grammar -ArgumentList $gramatica))
    $motor.SetInputToWaveFile((Join-Path $PSScriptRoot 'muestras/orden-siguiente.wav'))
    $resultado = $motor.Recognize([TimeSpan]::FromSeconds(8))
    if ($null -eq $resultado) { throw 'No se ha reconocido ninguna orden en la muestra.' }
    @{texto=$resultado.Text;confianza=$resultado.Confidence;motor=$motor.RecognizerInfo.Description;origen='WAV sintetizado; reconocimiento local real'} | ConvertTo-Json -Compress
} finally { $motor.Dispose() }
