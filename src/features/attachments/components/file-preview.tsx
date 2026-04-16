import { cn } from '@/libs/utils';
import { useFilePreview } from '../hooks/use-file-preview';
import { MessageStrip } from '@ui5/webcomponents-react/MessageStrip';

export function FilePreview({
  mimeType,
  fileContent,
  fileName,
  fileExtension,
  className,
  onlyImage,
}: {
  mimeType?: string;
  fileContent?: string;
  fileName?: string;
  fileExtension?: string;
  className?: string;
  onlyImage?: boolean;
}) {
  const preview = useFilePreview(mimeType, fileContent, fileName);

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
      <MessageStrip design="Critical" hideCloseButton style={{ width: '100%' }}>
        This {fileExtension ? `".${fileExtension}"` : ''} file is not supported for preview.
      </MessageStrip>
    );
  }
  // TODO: Make it a button to download the file

  return (
    <MessageStrip design="Negative" hideCloseButton style={{ width: '100%' }}>
      No preview available.
    </MessageStrip>
  );
}
