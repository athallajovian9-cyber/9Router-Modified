' 9Router Modified // Silent Boot Launcher
' Checks if server is running; starts it hidden if not; opens dashboard.
Option Explicit
Dim sh, fso, app, http, running, nodeCmd
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
app = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = app

' 1. Health check: is the server already up?
running = False
On Error Resume Next
Set http = CreateObject("Microsoft.XMLHTTP")
http.open "GET", "http://localhost:9900/api/health", False
http.setTimeouts 1000, 1000, 2000, 2000
http.send
If Err.Number = 0 Then
    If http.Status = 200 Then running = True
End If
Err.Clear
On Error GoTo 0

' 2. Start hidden if not running
If Not running Then
    ' Prefer system Node, fall back to bundled Hermes Node
    If fso.FileExists("C:\Program Files\nodejs\node.exe") Then
        nodeCmd = "cmd /c ""C:\Program Files\nodejs\node.exe"" server.js"
    ElseIf fso.FileExists("C:\Users\RDC\AppData\Local\hermes\tools\node-26.7.0-win32-x64\node.exe") Then
        nodeCmd = "cmd /c ""C:\Users\RDC\AppData\Local\hermes\tools\node-26.7.0-win32-x64\node.exe"" server.js"
    Else
        nodeCmd = "cmd /c node server.js"
    End If
    ' Style 0 = hidden window (no console flash)
    sh.Run nodeCmd, 0, False
    WScript.Sleep 1000
End If

' 3. Open dashboard in default browser
sh.Run "http://localhost:9900", 1, False
