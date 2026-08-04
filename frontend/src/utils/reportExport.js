const REPORT_HEADERS = ['Fecha', 'Docente', 'Curso', 'Tipo', 'Hora', 'Estado'];

const escapeCsvValue = (value) => {
  const stringValue = String(value ?? '')
  return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
    ? `"${stringValue.replace(/"/g, '""')}"`
    : stringValue
}

export const createCsvContent = (rows) => {
  const lines = [REPORT_HEADERS.join(',')]

  rows.forEach((row) => {
    const values = [row.fecha, row.docente, row.curso, row.tipo, row.hora, row.estado]
    lines.push(values.map(escapeCsvValue).join(','))
  })

  return lines.join('\n')
}

const escapeXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

export const createExcelContent = (rows) => {
  const bodyRows = rows.map((row) => `
      <Row>
        <Cell><Data ss:Type="String">${escapeXml(row.fecha)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.docente)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.curso)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.tipo)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.hora)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(row.estado)}</Data></Cell>
      </Row>`).join('')

  return `<?xml version="1.0"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:html="http://www.w3.org/TR/REC-html40">
    <Worksheet ss:Name="Reporte">
      <Table>
        <Row>
          <Cell><Data ss:Type="String">Fecha</Data></Cell>
          <Cell><Data ss:Type="String">Docente</Data></Cell>
          <Cell><Data ss:Type="String">Curso</Data></Cell>
          <Cell><Data ss:Type="String">Tipo</Data></Cell>
          <Cell><Data ss:Type="String">Hora</Data></Cell>
          <Cell><Data ss:Type="String">Estado</Data></Cell>
        </Row>${bodyRows}
      </Table>
    </Worksheet>
  </Workbook>`
}

export const createPdfHtml = (rows) => {
  const rowsMarkup = rows.map((row) => `
    <tr>
      <td>${escapeXml(row.fecha)}</td>
      <td>${escapeXml(row.docente)}</td>
      <td>${escapeXml(row.curso)}</td>
      <td>${escapeXml(row.tipo)}</td>
      <td>${escapeXml(row.hora)}</td>
      <td>${escapeXml(row.estado)}</td>
    </tr>`).join('')

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Reporte de asistencia</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        th { background: #f3f4f6; }
        h1 { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <h1>Reporte de asistencia</h1>
      <p>Generado desde la vista de reportería.</p>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Docente</th>
            <th>Curso</th>
            <th>Tipo</th>
            <th>Hora</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>${rowsMarkup}</tbody>
      </table>
    </body>
  </html>`
}

const triggerDownload = (filename, content, mimeType) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const exportReport = (rows, format) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false
  }

  if (format === 'CSV') {
    triggerDownload('reporte.csv', createCsvContent(rows), 'text/csv;charset=utf-8')
    return true
  }

  if (format === 'Excel') {
    triggerDownload('reporte.xls', createExcelContent(rows), 'application/vnd.ms-excel;charset=utf-8')
    return true
  }

  if (format === 'PDF') {
    if (typeof window !== 'undefined') {
      const printWindow = window.open('', '_blank', 'width=900,height=700')
      if (printWindow) {
        printWindow.document.write(createPdfHtml(rows))
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => printWindow.print(), 250)
      }
    }
    return true
  }

  return false
}
