// backend/src/controllers/csvController.ts
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const processCsvBatch = async (req: Request, res: Response) => {
  try {
    const { rows } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty rows array provided.' });
    }

    // We use Flash for speed and cost-efficiency on large data tasks
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemInstruction = `
      You are a strict data extraction engine for the GrowEasy CRM.
      Map the provided raw JSON array of CSV rows into the exact CRM schema.
      
      CRITICAL RULES:
      1. crm_status: MUST be one of [GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE].
      2. data_source: MUST be one of [leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots]. Leave blank if unsure.
      3. crm_note: Aggregate all unmapped columns, extra emails, extra phone numbers, and remarks here.
      4. Filter: If a row has NEITHER an email NOR a mobile number, DO NOT include it in the output array.
      5. Dates: Convert 'created_at' to a standard ISO 8601 string.
      
      Return ONLY a JSON array of objects matching this exact schema:
      [
        {
          "created_at": "string", "name": "string", "email": "string", "country_code": "string",
          "mobile_without_country_code": "string", "company": "string", "city": "string",
          "state": "string", "country": "string", "lead_owner": "string", "crm_status": "string",
          "crm_note": "string", "data_source": "string", "possession_time": "string", "description": "string"
        }
      ]
    `;

    const prompt = `${systemInstruction}\n\nRAW DATA TO PROCESS:\n${JSON.stringify(rows)}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // SANITIZATION: Strip markdown backticks before parsing
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const mappedRecords = JSON.parse(responseText);
      
      res.status(200).json({
        success: true,
        processedCount: mappedRecords.length,
        data: mappedRecords
      });
    } catch (parseError) {
      console.error("Failed to parse Gemini output. Raw text:", responseText);
      res.status(500).json({ error: 'AI returned invalid JSON.' });
    }

  } catch (error) {
    console.error("AI Extraction Error:", error);
    res.status(500).json({ error: 'Failed to process batch via AI.' });
  }
};