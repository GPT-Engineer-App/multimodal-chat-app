import React, { useState, useRef } from "react";
import { Container, Button, VStack, Text, useToast, Spinner, Box } from "@chakra-ui/react";
import { FaVideo, FaStop, FaUpload } from "react-icons/fa";

const Index = () => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const toast = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
        videoRef.current.srcObject = null;
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start video recording.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleUpload = async () => {
    if (!videoBlob) {
      toast({
        title: "Error",
        description: "No video to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", videoBlob, "video.mp4");

      const response = await fetch("YOUR_BACKEND_UPLOAD_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload video.");
      }

      const result = await response.json();
      console.log(result);

      toast({
        title: "Success",
        description: "Video uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Handle AI response here
      // Example: const aiResponse = await fetchAIResponse(result.fileUrl);
      // console.log(aiResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Video Recording and Upload</Text>
        <Box>
          <video ref={videoRef} width="400" height="300" autoPlay muted />
        </Box>
        <Button leftIcon={recording ? <FaStop /> : <FaVideo />} colorScheme={recording ? "red" : "green"} onClick={recording ? handleStopRecording : handleStartRecording}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
        {videoBlob && (
          <Button leftIcon={<FaUpload />} colorScheme="blue" onClick={handleUpload} isLoading={loading}>
            Upload Video
          </Button>
        )}
        {loading && <Spinner />}
      </VStack>
    </Container>
  );
};

export default Index;
