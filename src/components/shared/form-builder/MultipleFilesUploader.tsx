'use client';

import { FileIcon, Upload, X } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';

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
  FileUploadTrigger
} from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { ManipulatedFile } from './types';

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
}

export const MultipleFilesUploader = ({
  className,
  multiple = true,
  maxFiles,
  maxSize,
  files = [],
  onFilesChange: setFiles,
  onUpload
}: MultipleFilesUploaderProps) => {
  const filesRef = useRef(files);
  filesRef.current = files;

  // Native File objects for FileUpload (new / in-progress uploads)
  const nativeFiles = useMemo(
    () => files.filter((f) => f.file != null).map((f) => f.file as File),
    [files]
  );

  // Already-uploaded entries that have only a URL (no native File)
  const uploadedFiles = useMemo(() => files.filter((f) => !f.file && f.url), [files]);

  const handleValueChange = useCallback(
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

  const handleRemoveUploaded = useCallback(
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
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border">
                <FileIcon className="size-5 text-muted-foreground" />
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
