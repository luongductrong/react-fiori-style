import { cn } from '@/libs/utils';
import { downloadFile } from '../helpers/download-file';
import { useFilePreview } from '../hooks/use-file-preview';
import { Link as UI5Link } from '@ui5/webcomponents-react/Link';
import { pushErrorMessages } from '@/libs/helpers/error-messages';
import { MessageStrip } from '@ui5/webcomponents-react/MessageStrip';

interface FilePreviewProps {
  mimeType?: string;
  fileContent?: string;
  fileName?: string;
  fileExtension?: string;
  className?: string;
  onlyImage?: boolean;
}

export function FilePreview(props: FilePreviewProps) {
  const { mimeType, fileContent, fileName, fileExtension, className, onlyImage } = props;
  const preview = useFilePreview(mimeType, fileContent, fileName);

  const handleDownload = function () {
    const success = downloadFile(fileContent, fileName, mimeType);
    if (!success) {
      pushErrorMessages(['Failed to download file.']);
    }
  };

  if (onlyImage && !preview.isImage) {
    return null;
  }
  if (preview.isImage) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center',
          {
            'p-4 rounded-lg border border-dashed': !onlyImage,
          },
          className,
        )}
      >
        <img src={preview.dataUrl} alt="preview" className="w-auto h-auto object-cover" />
      </div>
    );
  }

  if (preview.isPdf) {
    return <div dangerouslySetInnerHTML={{ __html: preview.pdfHtml }} className={cn('w-auto h-auto', className)} />;
  }

  if (preview.isText) {
    return (
      <div className={cn('w-auto h-auto min-h-60 border border-dashed p-4 rounded-lg', className)}>
        <pre className="whitespace-pre-wrap wrap-break-word overflow-auto">{preview.textContent}</pre>
      </div>
    );
  }

  if (preview.isUnsupported) {
    return (
      <MessageStrip design="Critical" hideCloseButton className="w-full text-wrap">
        This {fileExtension ? `".${fileExtension}"` : ''} file is not supported for preview.{' '}
        <UI5Link onClick={handleDownload}>Click here to download</UI5Link>
      </MessageStrip>
    );
  }

  return (
    <MessageStrip design="Negative" hideCloseButton className="w-full">
      No preview available.
    </MessageStrip>
  );
}
