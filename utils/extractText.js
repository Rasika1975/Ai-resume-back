const extractText = async (buffer) => {
  const pdfParse = (await import("pdf-parse")).default;

  const data = await pdfParse(buffer);
  return data.text;
};

export default extractText;
