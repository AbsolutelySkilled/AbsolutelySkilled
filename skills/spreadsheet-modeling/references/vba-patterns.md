<!-- Part of the spreadsheet-modeling AbsolutelySkilled skill. Load this file when
     working with VBA macros, Google Apps Script, UserForms, automation, or
     external API calls from spreadsheets. -->

# VBA and Apps Script Patterns

## VBA fundamentals

### Loop through rows efficiently

```vba
Sub ProcessRows()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Data")

    Dim lastRow As Long
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row

    Dim i As Long
    For i = 2 To lastRow
        ' Read values
        Dim name As String
        name = ws.Cells(i, 1).Value

        Dim amount As Double
        amount = ws.Cells(i, 2).Value

        ' Write result
        ws.Cells(i, 3).Value = amount * 1.1
    Next i
End Sub
```

### Use arrays for speed (avoid cell-by-cell reads)

```vba
Sub FastProcess()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Data")

    Dim lastRow As Long
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row

    ' Read entire range into array (much faster than cell-by-cell)
    Dim data As Variant
    data = ws.Range("A2:D" & lastRow).Value

    Dim results() As Variant
    ReDim results(1 To UBound(data, 1), 1 To 1)

    Dim i As Long
    For i = 1 To UBound(data, 1)
        results(i, 1) = data(i, 2) * data(i, 3)  ' Price * Quantity
    Next i

    ' Write results back in one operation
    ws.Range("E2:E" & lastRow).Value = results
End Sub
```

> Reading/writing arrays is 10-100x faster than cell-by-cell operations.
> Always use this pattern for datasets larger than ~100 rows.

### Error handling

```vba
Sub SafeOperation()
    On Error GoTo ErrorHandler

    ' ... risky operations ...

    Exit Sub

ErrorHandler:
    MsgBox "Error " & Err.Number & ": " & Err.Description, vbCritical
    ' Optionally log to a sheet
    Dim logWs As Worksheet
    Set logWs = ThisWorkbook.Sheets("Log")
    Dim logRow As Long
    logRow = logWs.Cells(logWs.Rows.Count, "A").End(xlUp).Row + 1
    logWs.Cells(logRow, 1).Value = Now()
    logWs.Cells(logRow, 2).Value = Err.Description
End Sub
```

### Screen updating and calculation toggles

```vba
Sub OptimizedMacro()
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    Application.EnableEvents = False

    ' ... bulk operations ...

    Application.EnableEvents = True
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
End Sub
```

> Always re-enable these in a Finally-style pattern. If an error occurs before
> re-enabling, Excel stays in manual calc mode until the user notices.

---

## VBA UserForms

### Basic input form pattern

```vba
' In UserForm code module
Private Sub btnSubmit_Click()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Data")

    Dim nextRow As Long
    nextRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row + 1

    ws.Cells(nextRow, 1).Value = txtName.Value
    ws.Cells(nextRow, 2).Value = CDbl(txtAmount.Value)
    ws.Cells(nextRow, 3).Value = cboCategory.Value
    ws.Cells(nextRow, 4).Value = Now()

    MsgBox "Record added.", vbInformation
    Unload Me
End Sub

Private Sub UserForm_Initialize()
    ' Populate combo box
    cboCategory.AddItem "Revenue"
    cboCategory.AddItem "Expense"
    cboCategory.AddItem "Transfer"
End Sub
```

### Validate form inputs

```vba
Private Sub btnSubmit_Click()
    If Trim(txtName.Value) = "" Then
        MsgBox "Name is required.", vbExclamation
        txtName.SetFocus
        Exit Sub
    End If

    If Not IsNumeric(txtAmount.Value) Then
        MsgBox "Amount must be a number.", vbExclamation
        txtAmount.SetFocus
        Exit Sub
    End If

    ' ... proceed with submission ...
End Sub
```

---

## VBA API calls (HTTP requests)

### GET request using XMLHTTP

```vba
Function FetchJSON(url As String) As String
    Dim http As Object
    Set http = CreateObject("MSXML2.XMLHTTP")

    http.Open "GET", url, False
    http.setRequestHeader "Content-Type", "application/json"
    http.send

    If http.Status = 200 Then
        FetchJSON = http.responseText
    Else
        FetchJSON = "Error: " & http.Status & " " & http.statusText
    End If
End Function
```

### Parse JSON response (using VBA-JSON library)

```vba
' Requires: https://github.com/VBA-tools/VBA-JSON imported as JsonConverter module
Sub ImportAPIData()
    Dim json As String
    json = FetchJSON("https://api.example.com/data")

    Dim parsed As Object
    Set parsed = JsonConverter.ParseJson(json)

    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Import")
    Dim row As Long
    row = 2

    Dim item As Variant
    For Each item In parsed
        ws.Cells(row, 1).Value = item("id")
        ws.Cells(row, 2).Value = item("name")
        ws.Cells(row, 3).Value = item("value")
        row = row + 1
    Next item
End Sub
```

---

## Google Apps Script patterns

### Read and write ranges

```javascript
function processData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Data");

  // Read all data at once (fast)
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Process rows
  const results = data.slice(1).map(row => {
    const revenue = row[1];
    const cost = row[2];
    return [revenue - cost, (revenue - cost) / revenue];
  });

  // Write results in one call (fast)
  const outputRange = sheet.getRange(2, headers.length + 1, results.length, 2);
  outputRange.setValues(results);
}
```

> Like VBA arrays, batch `getValues()` / `setValues()` is orders of magnitude
> faster than cell-by-cell `getValue()` / `setValue()`.

### Custom menu

```javascript
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Custom Tools")
    .addItem("Refresh Data", "refreshData")
    .addItem("Send Report", "sendWeeklyReport")
    .addSeparator()
    .addItem("Archive Old Rows", "archiveRows")
    .addToUi();
}
```

### Fetch external API data

```javascript
function importFromAPI() {
  const url = "https://api.example.com/data";
  const options = {
    method: "get",
    headers: { "Authorization": "Bearer " + getApiKey() },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);

  if (response.getResponseCode() !== 200) {
    throw new Error("API error: " + response.getResponseCode());
  }

  const data = JSON.parse(response.getContentText());
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Import");

  // Clear old data and write new
  sheet.getRange("A2:Z").clearContent();

  const rows = data.map(item => [item.id, item.name, item.value, new Date()]);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
}

function getApiKey() {
  return PropertiesService.getScriptProperties().getProperty("API_KEY");
}
```

> Store API keys in Script Properties (File > Project properties > Script
> properties), never hardcoded in the script.

### Scheduled triggers

```javascript
function createScheduledTriggers() {
  // Delete existing triggers first
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // Daily data refresh at 6 AM
  ScriptApp.newTrigger("importFromAPI")
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();

  // Weekly report every Monday at 9 AM
  ScriptApp.newTrigger("sendWeeklyReport")
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}
```

### Sidebar / dialog UI

```javascript
function showSidebar() {
  const html = HtmlService.createHtmlOutput(`
    <h3>Data Filter</h3>
    <label>Region:</label>
    <select id="region">
      <option>All</option>
      <option>West</option>
      <option>East</option>
    </select>
    <br><br>
    <button onclick="google.script.run.filterByRegion(
      document.getElementById('region').value)">
      Apply Filter
    </button>
  `).setTitle("Filter Panel");

  SpreadsheetApp.getUi().showSidebar(html);
}
```

---

## Common gotchas

| Issue | Platform | Solution |
|---|---|---|
| VBA array is 1-based after Range.Value read | Excel VBA | Use `LBound`/`UBound`, not hardcoded indices |
| Apps Script 6-minute timeout | Google Sheets | Break work into batches, use continuation with PropertiesService |
| XMLHTTP blocked by CORS/firewall | Excel VBA | Use `MSXML2.ServerXMLHTTP` or `WinHttp.WinHttpRequest` instead |
| Trigger quota (20 triggers per user) | Google Sheets | Consolidate triggers into fewer functions that dispatch internally |
| Macro security blocks execution | Excel VBA | Save as .xlsm, enable macros, or sign the VBA project |
