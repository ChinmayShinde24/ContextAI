export const validateUploadedPdf = (file) => {
  if (!file) {
    return {
      ok: false,
      status: 400,
      message: 'No PDF file uploaded',
    }
  }

  if (file.mimetype !== 'application/pdf') {
    return {
      ok: false,
      status: 400,
      message: 'Only PDF files are allowed',
    }
  }

  return { ok: true }
}
