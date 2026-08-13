"use client";

import { useCallback, useRef, useState } from "react";

// Micro-learning ethos (Blueprint Section 14): speaking responses are short.
// Auto-stop well before anyone accidentally leaves the mic running.
const MAX_DURATION_MS = 90_000;

function getSupportedMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const candidate of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }
  return "audio/webm";
}

export type RecorderStatus = "idle" | "recording" | "recorded" | "error";

export function useAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    recorderRef.current?.stop();
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: mimeType }));
        setStatus("recorded");
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      recorderRef.current = recorder;
      setStatus("recording");
      timeoutRef.current = setTimeout(stop, MAX_DURATION_MS);
    } catch {
      setError("Couldn't access your microphone — check your browser's permission settings.");
      setStatus("error");
    }
  }, [stop]);

  const reset = useCallback(() => {
    setAudioBlob(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { status, audioBlob, error, start, stop, reset };
}
