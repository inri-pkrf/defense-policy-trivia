import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SPREADSHEET_ID = '12Yu1M5GooVj6B87F9MnxhzdDjnAtWLQ4d2eiT0EV1Ts';
const SHEET_NAME = 'Sheet1';
const HEADERS = ['תאריך ושעה', 'שם קבוצה', 'ניקוד', 'תוצאה (נכונות/סה"כ)', 'אחוז הצלחה'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const body = await req.json();
    const teamName = body.teamName || 'אנונימי';
    const score = body.score ?? 0;
    const correctCount = body.correctCount ?? 0;
    const total = body.total ?? 0;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

    // Check if headers exist
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();
    const hasHeaders = checkData.values && checkData.values[0] && checkData.values[0][0] === HEADERS[0];

    if (!hasHeaders) {
      // Insert a row at the top for headers
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            insertDimension: {
              range: { sheetId: 0, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
              inheritFromBefore: false,
            },
          }],
        }),
      });

      // Write headers
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:E1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );

      // Format: bold headers, freeze row, column widths, center alignment
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 5 },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true, fontSize: 12 },
                    backgroundColor: { red: 0.88, green: 0.94, blue: 1.0 },
                    horizontalAlignment: 'CENTER',
                  },
                },
                fields: 'userEnteredFormat',
              },
            },
            {
              updateSheetProperties: {
                properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } },
                fields: 'gridProperties.frozenRowCount',
              },
            },
            { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
            { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
            { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 100 }, fields: 'pixelSize' } },
            { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
            { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 120 }, fields: 'pixelSize' } },
          ],
        }),
      });
    }

    // Append data row
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:E:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [[timestamp, teamName, score, `${correctCount}/${total}`, `${percentage}%`]],
        }),
      }
    );

    if (!appendRes.ok) {
      const errorText = await appendRes.text();
      return Response.json({ error: errorText }, { status: 500 });
    }

    const data = await appendRes.json();
    return Response.json({ success: true, updatedRange: data.updates?.updatedRange, percentage });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});