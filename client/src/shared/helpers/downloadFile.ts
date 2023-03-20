const downloadFile = (fileName: string, fileBodyString: string, mimeType?: string): void => {
  const linkElement = document.createElement('a');
  const currentMimeType = mimeType || 'text/plain';
  if (currentMimeType === 'application/pdf') {
    linkElement.href = fileBodyString;
  } else {
    linkElement.href = URL.createObjectURL(new Blob([fileBodyString], {
      type: currentMimeType,
    }));
  }
  linkElement.download = fileName;
  linkElement.style.display = 'none';
  const { body } = document;
  body.appendChild(linkElement).click();
  body.removeChild(linkElement);
};

export { downloadFile };
