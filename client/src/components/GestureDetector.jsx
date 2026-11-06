import React, { useRef, useEffect } from "react";

const GestureDetector = ({onGesture}) => {
  const videoRef = useRef(null);
  const [isVideoStarted, setIsVideoStarted] = React.useState(false);
  const [classifier, setClassifier] = React.useState(null);
  const MODEL_URL =
    "https://storage.googleapis.com/tm-model/sG3DX3BM_/model.json";

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedClassifier = await window.ml5.imageClassifier(
          MODEL_URL,
          () => {
            console.log("Gesture Model Loaded!");
          },
        );
        setClassifier(loadedClassifier);
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };

    loadModel();
  }, []);

  const classifyGesture = () => {
    if (classifier && videoRef.current) {
      classifier.classify(videoRef.current, (results, error) => {
        if (error) {
          console.error("Error classifying gesture:", error);
          return;
        }
        if (results && results[0]) {
            onGesture(results[0].label, results[0].confidence);
        }
            
        setTimeout(() => classifyGesture(), 30); // Classify every 30 milliseconds
      });
    } else {
      console.error("Classifier or video element is not available.");
      setTimeout(() => classifyGesture(), 30); // Retry after 30 milliseconds
    }
  };

  const startVideo = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              setIsVideoStarted(true);
              classifyGesture();
            };
          }
        });
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    }
  };

  useEffect(() => {
    if (classifier && !isVideoStarted) {
      startVideo();
    }
  }, [classifier]);

  return (
    <video
      ref={videoRef}
      width="640"
      height="480"
      style={{ display: "none" }}
      autoPlay
      muted
    />
  );
};

export default GestureDetector;