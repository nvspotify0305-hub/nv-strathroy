(function (global) {
  "use strict";

  const MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  function normalizeText(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function normalizeKey(value) {
    return normalizeText(value).toUpperCase();
  }

  function xmlEscape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function roundedExportValue(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) return value;
    return Math.round((value + Number.EPSILON) * 10000) / 10000;
  }

  function safeWorksheetName(name) {
    return normalizeText(name || "Sheet")
      .replace(/[\[\]\*\/\\\?:]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 31) || "Sheet";
  }

  function exportColumnLabels(rows) {
    const labels = [];
    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (!labels.includes(key)) labels.push(key);
      });
    });
    return labels;
  }

  function columnWidth(column) {
    const key = normalizeKey(column);
    if (key === "ACCT" || key.includes("ACCREF")) return 10;
    if (key.startsWith("LODG") || key === "TOTAL") return 14;
    if (key.includes("PRODUCT") || key.includes("DESCRIPTION")) return 32;
    if (key.includes("CUSTOMER") || key.includes("ANALYSIS") || key.includes("NAME")) return 28;
    if (key.includes("DOCUMENT") || key.includes("DATE") || key.includes("MONTH")) return 15;
    if (key.includes("PRICE") || key.includes("VALUE") || key.includes("REBATE") || key.includes("LITRES") || key.includes("QTY") || key.includes("ROWS")) return 14;
    if (key.includes("BASIS") || key.includes("DEPOT") || key.includes("ROUTE") || key.includes("CODE") || key.includes("OFFICE") || key.includes("BILLING") || key.includes("SITE") || key.includes("ACCOUNT")) return 16;
    return 18;
  }

  function totalableColumn(column) {
    const key = normalizeKey(column);
    return key.includes("QTY") ||
      key.includes("QUANTITY") ||
      key.includes("VOLUME") ||
      key.includes("LITRES") ||
      key.includes("VALUE") ||
      key.includes("REBATE") ||
      key.includes("AMOUNT") ||
      key.includes("EUR") ||
      key.includes("COUNT") ||
      key.includes("ROWS");
  }

  function currencyColumn(column) {
    const key = normalizeKey(column);
    return key.includes("VALUE") || key.includes("REBATE") || key.includes("AMOUNT") || key.includes("EUR") || key.includes("PRICE");
  }

  function percentColumn(column) {
    return normalizeKey(column).includes("%");
  }

  function withTotalRow(rows, columns) {
    if (!rows.length || !columns.length) return rows;
    const total = {};
    let labelled = false;
    columns.forEach((column) => {
      if (totalableColumn(column) && !percentColumn(column)) {
        total[column] = rows.reduce((sum, row) => {
          const value = row[column];
          return sum + (typeof value === "number" && Number.isFinite(value) ? value : 0);
        }, 0);
        return;
      }
      if (!labelled && !percentColumn(column)) {
        total[column] = "Total";
        labelled = true;
      } else {
        total[column] = "";
      }
    });
    return [...rows, total];
  }

  function colName(index) {
    let out = "";
    let n = index + 1;
    while (n) {
      const mod = (n - 1) % 26;
      out = String.fromCharCode(65 + mod) + out;
      n = Math.floor((n - 1) / 26);
    }
    return out;
  }

  function cellRef(row, col) {
    return `${colName(col)}${row}`;
  }

  function cellStyle(value, style, column) {
    if (style) return style;
    if (typeof value !== "number" || !Number.isFinite(value)) return 0;
    if (percentColumn(column)) return 6;
    if (currencyColumn(column)) return normalizeKey(column).includes("PRICE") ? 7 : 5;
    return 4;
  }

  function cellXml(value, row, col, style = 0, column = "") {
    const ref = cellRef(row, col);
    const resolvedStyle = cellStyle(value, style, column);
    if (typeof value === "number" && Number.isFinite(value)) {
      return `<c r="${ref}" s="${resolvedStyle}"><v>${roundedExportValue(value)}</v></c>`;
    }
    return `<c r="${ref}" t="inlineStr" s="${resolvedStyle}"><is><t>${xmlEscape(value)}</t></is></c>`;
  }

  function rowXml(cells, rowNumber, style = 0, columns = []) {
    return `<row r="${rowNumber}">${cells.map((value, col) => cellXml(value, rowNumber, col, style, columns[col] || "")).join("")}</row>`;
  }

  function sheetXml(config) {
    if (Array.isArray(config.rawRows) && config.rawRows.length) {
      const columns = Array.isArray(config.columns) ? config.columns : [];
      const maxCols = Math.max(columns.length, ...config.rawRows.map((row) => Array.isArray(row.cells) ? row.cells.length : 0), 1);
      const rows = config.rawRows.map((row, idx) => rowXml(row.cells || [], idx + 1, row.style || 0, row.columns || columns)).join("");
      const lastCol = colName(maxCols - 1);
      const lastRow = config.rawRows.length;
      const filterRow = config.autoFilterRow || 0;
      const freezeRow = config.freezeRow || filterRow || 1;
      const autoFilter = filterRow ? `<autoFilter ref="A${filterRow}:${lastCol}${lastRow}"/>` : "";
      const customWidths = Array.isArray(config.columnWidths) ? config.columnWidths : [];
      const merges = Array.isArray(config.merges) ? config.merges.filter(Boolean) : [];
      const mergeCells = merges.length ? `<mergeCells count="${merges.length}">${merges.map((ref) => `<mergeCell ref="${xmlEscape(ref)}"/>`).join("")}</mergeCells>` : "";
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="${freezeRow}" topLeftCell="A${freezeRow + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols>${Array.from({ length: maxCols }, (_, i) => `<col min="${i + 1}" max="${i + 1}" width="${Number(customWidths[i]) || columnWidth(columns[i] || "")}" customWidth="1"/>`).join("")}</cols>
  <sheetData>${rows}</sheetData>${autoFilter}${mergeCells}
</worksheet>`;
    }

    const rows = Array.isArray(config.rows) && config.rows.length ? config.rows : [{ Message: "No rows for this report." }];
    const columns = Array.isArray(config.columns) && config.columns.length ? config.columns : exportColumnLabels(rows);
    const safeColumns = columns.length ? columns : ["Message"];
    const exportRows = Array.isArray(config.rows) && config.rows.length ? withTotalRow(rows, safeColumns) : rows;
    const meta = [
      [config.familyTitle || "Strathroy Dairy Report"],
      [config.title || config.name || "Report"],
      ["Period", config.periodText || ""],
      ["Filters", config.filterText || "All records"],
      ["Rows", rows.length],
      []
    ];
    const allRows = [
      ...meta.map((cells, idx) => ({ cells, style: idx === 0 ? 1 : idx === 1 ? 2 : idx >= 2 && idx <= 4 ? 3 : 0, columns: [] })),
      { cells: safeColumns, style: 8, columns: safeColumns },
      ...exportRows.map((row) => ({ cells: safeColumns.map((column) => row[column] ?? ""), style: 0, columns: safeColumns }))
    ];
    const rowXmls = allRows.map((row, idx) => rowXml(row.cells, idx + 1, row.style, row.columns)).join("");
    const lastRow = allRows.length;
    const lastCol = colName(safeColumns.length - 1);
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="7" topLeftCell="A8" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols>${safeColumns.map((column, idx) => `<col min="${idx + 1}" max="${idx + 1}" width="${columnWidth(column)}" customWidth="1"/>`).join("")}</cols>
  <sheetData>${rowXmls}</sheetData>
  <autoFilter ref="A7:${lastCol}${lastRow}"/>
</worksheet>`;
  }

  function stylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="4">
    <numFmt numFmtId="164" formatCode="_(* #,##0.00_);[Red]_(* (#,##0.00);_(* &quot;-&quot;??_);_(@_)"/>
    <numFmt numFmtId="165" formatCode="_(* #,##0.0000_);[Red]_(* (#,##0.0000);_(* &quot;-&quot;????_);_(@_)"/>
    <numFmt numFmtId="166" formatCode="#,##0.00"/>
    <numFmt numFmtId="167" formatCode="0.00%"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="10"/><name val="Arial"/></font>
    <font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>
    <font><b/><sz val="12"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>
  </fonts>
  <fills count="6">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1F477E"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF2F9E44"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFEAF2FF"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF244A85"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFD9E2F3"/></left><right style="thin"><color rgb="FFD9E2F3"/></right><top style="thin"><color rgb="FFD9E2F3"/></top><bottom style="thin"><color rgb="FFD9E2F3"/></bottom><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="9">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1"/>
    <xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="167" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
  }

  function crcTable() {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    return table;
  }

  const CRC = crcTable();
  const enc = new TextEncoder();
  const u16 = (n) => [n & 255, (n >>> 8) & 255];
  const u32 = (n) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function zip(files) {
    const parts = [];
    const central = [];
    let offset = 0;
    files.forEach((file) => {
      const nameBytes = enc.encode(file.name);
      const data = enc.encode(file.text);
      const crc = crc32(data);
      const local = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nameBytes.length), ...u16(0), ...nameBytes, ...data]);
      parts.push(local);
      central.push({ nameBytes, data, crc, offset });
      offset += local.length;
    });
    const centralStart = offset;
    central.forEach((entry) => {
      const c = new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(entry.crc), ...u32(entry.data.length), ...u32(entry.data.length), ...u16(entry.nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(entry.offset), ...entry.nameBytes]);
      parts.push(c);
      offset += c.length;
    });
    const centralSize = offset - centralStart;
    parts.push(new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(centralSize), ...u32(centralStart), ...u16(0)]));
    return new Blob(parts, { type: MIME });
  }

  function workbookBlob(sheets) {
    const safeSheets = Array.isArray(sheets) && sheets.length ? sheets : [{ name: "Report", rows: [] }];
    const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${safeSheets.map((sheet, idx) => `<sheet name="${xmlEscape(safeWorksheetName(sheet.name))}" sheetId="${idx + 1}" r:id="rId${idx + 1}"/>`).join("")}</sheets></workbook>`;
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
    const wbRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${safeSheets.map((sheet, idx) => `<Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${idx + 1}.xml"/>`).join("")}<Relationship Id="rId${safeSheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${safeSheets.map((sheet, idx) => `<Override PartName="/xl/worksheets/sheet${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`;
    return zip([
      { name: "[Content_Types].xml", text: contentTypesXml },
      { name: "_rels/.rels", text: relsXml },
      { name: "xl/workbook.xml", text: workbookXml },
      { name: "xl/_rels/workbook.xml.rels", text: wbRelsXml },
      { name: "xl/styles.xml", text: stylesXml() },
      ...safeSheets.map((sheet, idx) => ({ name: `xl/worksheets/sheet${idx + 1}.xml`, text: sheetXml(sheet) }))
    ]);
  }

  function normalizeWorkbookFileName(fileName) {
    const clean = normalizeText(fileName || "strathroy_report.xlsx") || "strathroy_report.xlsx";
    return /\.xlsx$/i.test(clean) ? clean : clean.replace(/\.[^.]+$/i, "") + ".xlsx";
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = normalizeWorkbookFileName(fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportStyledReportWorkbook(sheets, fileName) {
    downloadBlob(workbookBlob(sheets), fileName);
  }

  global.StrathroyExcelExport = {
    exportStyledReportWorkbook,
    exportColumnLabels,
    safeWorksheetName,
    workbookBlob,
    normalizeWorkbookFileName
  };
})(window);
