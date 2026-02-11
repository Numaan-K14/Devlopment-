import { useEffect, useRef, useState } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { FaPause, FaPlay } from "react-icons/fa6";
import { HiOutlineMicrophone } from "react-icons/hi2";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import CustomButton from "../button";
import { CoustomTextarea } from "./coustom-textarea";

const SpeachtoText = ({
  name,
  setFieldValue,
  value,
  onRecordingStop,
  disabled,
  showButton,
  disableEditCommentry = false,
  showEditBox = false,
  isRecording,
}: {
  name: string;
  disabled?: boolean;
  setFieldValue: (field: string, value: any) => void;
  value?: string;
  onRecordingStop?: (audioFile: File, commentary: string) => void;
  showButton?: boolean;
  disableEditCommentry?: boolean;
  showEditBox?: boolean;
  isRecording: (status: boolean) => void;
}) => {
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [transcriptBuffer, setTranscriptBuffer] = useState("");

  const transcriptRef = useRef<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = function () {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });

        const url = URL.createObjectURL(audioBlob);
        console.log(url, "<------ url");
        setAudioURL(url);
        isRecording(false);
        setFieldValue("commentary", transcriptRef.current);
        setFieldValue("audio_file", audioFile);
        onRecordingStop?.(audioFile, transcriptRef.current || "");
      };

      mediaRecorderRef.current.start();
      SpeechRecognition.startListening({ continuous: true });
      resetTranscript();
      setRecording(true);
      isRecording(true);
      setPaused(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  useEffect(() => {
    if (!paused) {
      setTranscriptBuffer(transcript);
      setFieldValue(name, transcript);
      transcriptRef.current = transcriptBuffer;
    }
  }, [transcript, paused, name, setFieldValue]);

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setPaused(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const formattedLines =
    value &&
    value.split(/(?=Assessor:|Participant:)/g).map((line, index) => (
      <p key={index} className='mb-2'>
        {line.trim()}
      </p>
    ));

  return (
    <div className='relative'>
      <div className='absolute right-2 top-2 flex gap-2'>
        {!recording && showButton && (
          <CustomButton
            disabled={disabled}
            onClick={startRecording}
            className={`border border-[#A5ACBA] ${disabled === true ? "bg-[#A5ACBA]" : "bg-green-500"}  text-white rounded-full p-2 !ml-1`}
            title='Start Recording'
          >
            <HiOutlineMicrophone className='size-4' />
            {audioURL ? "Reset and record again" : "start recording"}
          </CustomButton>
        )}

        {recording && !paused && (
          <>
            <CustomButton
              onClick={pauseRecording}
              className='border border-[#A5ACBA] bg-yellow-500 text-white rounded-full p-2'
              title='Pause Recording'
            >
              <FaPause className='size-4' /> Pause Recording
            </CustomButton>
            <CustomButton
              onClick={stopRecording}
              className='border border-[#A5ACBA] bg-red-600 text-white rounded-full p-2'
              title='Stop Recording'
              variant='destructive'
            >
              <FaRegStopCircle className='size-4' /> Stop Recording
            </CustomButton>
          </>
        )}

        {recording && paused && (
          <>
            <CustomButton
              onClick={resumeRecording}
              className='border border-[#A5ACBA] bg-blue-500 text-white rounded-full p-2'
              title='Resume Recording'
            >
              <FaPlay className='size-4' />
              Resume Recording
            </CustomButton>
            <CustomButton
              onClick={stopRecording}
              className='border border-[#A5ACBA] bg-red-600 text-white rounded-full p-2'
              title='Stop Recording'
            >
              <FaRegStopCircle className='size-4' /> Stop Recording
            </CustomButton>
          </>
        )}
      </div>

      {mediaRecorderRef?.current?.state !== "inactive" &&
        value &&
        !recording &&
        !showEditBox && (
          <p className='min-h-[217px] pr-10 border w-full text-muted-foreground text-sm rounded-[5px] p-2 '>
            {formattedLines}
          </p>
        )}

      {!recording && showEditBox && (
        <CoustomTextarea
          name={`commentary`}
          className='w-full !min-h-full h-[220px]'
          disabled={disableEditCommentry}
        />
      )}

      {audioURL && !recording && showButton ? (
        <div className='mt-4'>
          <audio
            controls
            src={audioURL}
            className='w-full mt-2'
            style={{ width: "calc(100% - 420px)" }}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SpeachtoText;
