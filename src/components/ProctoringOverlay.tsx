import React, { useRef, useEffect } from 'react';
import useProctorStore from '@/store/useProctorStore';
import type { MutableRefObject } from 'react';

type Props = {
  enabledByDefault?: boolean;
  onReady?: () => void;
  videoRef?: MutableRefObject<HTMLVideoElement | null>;
  cameraEnabled?: boolean;
  stream?: MediaStream | null;
};

export const ProctoringOverlay: React.FC<Props> = ({ enabledByDefault = false, onReady, videoRef, cameraEnabled, stream }) => {
  const overlayRef = useRef<HTMLVideoElement | null>(null);
  const start = useProctorStore((s) => s.start);
  const stop = useProctorStore((s) => s.stop);
  const warnings = useProctorStore((s) => s.warnings);
  const violations = useProctorStore((s) => s.violations);

  useEffect(() => {
    onReady?.();
    return () => {};
  }, [enabledByDefault, start, stop, onReady]);

  // Mirror the main video stream into the small overlay video (if provided)
  useEffect(() => {
    if (!overlayRef.current) return;
    
    if (stream) {
      overlayRef.current.srcObject = stream;
    } else if (videoRef && videoRef.current) {
      overlayRef.current.srcObject = videoRef.current.srcObject as MediaStream | null;
    }
  }, [videoRef, cameraEnabled, stream]);

  return (
    <div className="proctor-overlay fixed bottom-4 left-4 z-50">
      <div className="w-48 p-2 bg-card/90 rounded-lg border border-border/50">
        <div className="text-sm font-medium mb-2">Proctoring</div>
        <div className="mb-2">
          <video
            ref={(r) => (overlayRef.current = r)}
            autoPlay
            muted
            playsInline
            className="w-40 h-28 rounded-md object-cover bg-black"
          />
        </div>
        <div className="text-xs text-muted-foreground mb-2">Warnings: {warnings}</div>
        <div className="text-xs text-muted-foreground mb-2">Violations: {violations.length}</div>
        {/* Start/Stop controls removed — overlay is display-only */}
      </div>
    </div>
  );
};

export default ProctoringOverlay;
