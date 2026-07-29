'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

import { 
  Download, 
  ExternalLink, 
  FileIcon, 
  Upload, 
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  getFileIcon
} from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { ManipulatedFile } from './types';
import React from 'react';

interface MultipleFilesUploaderProps {
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  files?: ManipulatedFile[];
  onFilesChange?: (e: ManipulatedFile[]) => void;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => Promise<void> | void;
  onFileOpen?: (file: ManipulatedFile) => void;
  onFileDownload?: (file: ManipulatedFile) => void;
}

const UploadedFileIcon = ({ mf }: { mf: ManipulatedFile }) => {
  const extension = mf.name.split('.').pop()?.toLowerCase() ?? '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);

  const { data: fetchedUrl } = useQuery({
    queryKey: ['upload', mf.serverId],
    queryFn: () => api.upload.getUploadById(Number(mf.serverId)),
    enabled: isImage && !!mf.serverId && !mf.url,
    staleTime: Infinity
  });

  const finalUrl = mf.url || fetchedUrl;

  if (isImage && finalUrl) {
    return (
      // biome-ignore lint/performance/noImgElement: dynamic file URLs from user uploads don't work well with Next.js Image optimization
      <img src={finalUrl} alt={mf.name} className="size-full object-cover" />
    );
  }

  return getFileIcon(mf.name, undefined, "size-5");
};

export const MultipleFilesUploader = ({
  className,
  multiple = true,
  maxFiles,
  maxSize,
  files = [],
  onFilesChange: setFiles,
  onUpload,
  onFileOpen,
  onFileDownload
}: MultipleFilesUploaderProps) => {
  const filesRef = React.useRef(files);
  filesRef.current = files;

  // Native File objects for FileUpload (new / in-progress uploads)
  const nativeFiles = React.useMemo(
    () => files.filter((f) => f.file != null).map((f) => f.file as File),
    [files]
  );

  // Already-uploaded entries that have only a URL (no native File)
  const uploadedFiles = React.useMemo(() => files.filter((f) => !f.file && f.serverId), [files]);

  const handleValueChange = React.useCallback(
    (newNativeFiles: File[]) => {
      if (!setFiles) return;
      const current = filesRef.current;
      const newNativeSet = new Set(newNativeFiles);

      // Keep url-only entries unchanged
      const urlOnlyFiles = current.filter((mf) => !mf.file);

      const existingNativeFiles = current.filter((mf) => mf.file != null);
      const existingFileRefs = new Set(existingNativeFiles.map((mf) => mf.file));

      const updatedNativeFiles: ManipulatedFile[] = [];

      for (const nativeFile of newNativeFiles) {
        if (existingFileRefs.has(nativeFile)) {
          const existing = existingNativeFiles.find((mf) => mf.file === nativeFile);
          if (existing) updatedNativeFiles.push(existing);
        } else {
          // Brand-new file dropped / selected by the user
          updatedNativeFiles.push({
            id: crypto.randomUUID(),
            file: nativeFile,
            name: nativeFile.name,
            progress: 0,
            serverId: ''
          });
        }
      }

      setFiles([...urlOnlyFiles, ...updatedNativeFiles]);
    },
    [setFiles]
  );

  const handleOpen = React.useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  const handleDownload = React.useCallback((url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleRemoveUploaded = React.useCallback(
    (id: string) => {
      if (!setFiles) return;
      setFiles(filesRef.current.filter((f) => f.id !== id));
    },
    [setFiles]
  );

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      <FileUpload
        maxFiles={maxFiles}
        maxSize={maxSize}
        className="flex flex-row"
        value={nativeFiles}
        onValueChange={handleValueChange}
        onUpload={onUpload}
        multiple={multiple}>
        <FileUploadDropzone className="flex-1">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Drag & drop files here</p>
            <p className="text-xs text-muted-foreground">Files will show upload progress</p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList className="flex-1">
          {nativeFiles.map((file, index) => (
            <FileUploadItem key={index} value={file}>
              <FileUploadItemPreview />
              <div className="flex flex-1 flex-col gap-1">
                <FileUploadItemMetadata />
                <FileUploadItemProgress variant="linear" />
              </div>
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>

      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploadedFiles.map((mf) => (
            <div key={mf.id} className="relative flex items-center gap-2.5 rounded-md border p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border overflow-hidden">
                <UploadedFileIcon mf={mf} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium truncate">{mf.name}</p>
                {mf.url && (
                  <a
                    href={mf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:underline truncate">
                    {mf.url}
                  </a>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => {
                  if (onFileOpen) onFileOpen(mf);
                  else if (mf.url) handleOpen?.(mf.url);
                }}>
                <ExternalLink className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => {
                  if (onFileDownload) onFileDownload(mf);
                  else if (mf.url) handleDownload?.(mf.url);
                }}>
                <Download className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => handleRemoveUploaded(mf.id)}>
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
