import FormData from 'form-data';
import axios, { AxiosResponse } from "axios"
export const ImageToText = async(file: Express.Multer.File):Promise<string|null>=>{
    const formData:FormData = new FormData();
    formData.append('OCREngine',2); 
    formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });
      const ocrBaseUrl: string | undefined = process.env.OCR_SPACE_BASE_URL;
 
    if(!ocrBaseUrl)
      {
        return null
      }

    const response:AxiosResponse<any, any> = await axios.post(ocrBaseUrl, formData, {
      headers: {
        'apiKey':process.env.OCR_SPACE_API_KEY
      }
    });

    let formattedText = ""
    response.data.ParsedResults.forEach((obj:any)=>{
        formattedText+=obj.ParsedText
    })
   if(formattedText.length===0){
    return formattedText;
   }
    return formattedText || null
}
