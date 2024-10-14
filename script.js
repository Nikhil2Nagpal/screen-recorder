/*const start = async() => {
  const stream = await navigator.mediaDevices.getDisplayMedia(
    {
      video:{
        mediaSource: "screen",
      }
    }
  )
  const data = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable=(e)=>{
    data.push(e.data);
  }
  mediaRecorder.start()
  mediaRecorder.onstop=(e)=>{
    document.querySelector("video").src=URL.createObjectURL(
      new Blob(data,{
        type:data[0].type,
      })
    )
  }
}

start()*/

let mediaRecorder;
    let combinedStream;
    let data = [];

    const startRecording = async () => {
      // Screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen"
        }
      });

      // Front camera capture
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      // Merge screen and camera streams
      const audioTracks = screenStream.getAudioTracks();
      const videoTracks = [...screenStream.getVideoTracks(), ...cameraStream.getVideoTracks()];
      combinedStream = new MediaStream([...audioTracks, ...videoTracks]);

      // Start recording
      mediaRecorder = new MediaRecorder(combinedStream);
      mediaRecorder.ondataavailable = (e) => {
        data.push(e.data);
      };

      mediaRecorder.start();

      // Enable stop button and disable start button
      document.getElementById("startBtn").disabled = true;
      document.getElementById("stopBtn").disabled = false;
    };

    const stopRecording = () => {
      mediaRecorder.stop();

      mediaRecorder.onstop = () => {
        const videoElement = document.querySelector("video");
        videoElement.src = URL.createObjectURL(new Blob(data, { type: data[0].type }));

        // Reset buttons
        document.getElementById("startBtn").disabled = false;
        document.getElementById("stopBtn").disabled = true;
        data = []; // Reset data
      };
    };

    // Event listeners for buttons
    document.getElementById("startBtn").addEventListener("click", startRecording);
    document.getElementById("stopBtn").addEventListener("click", stopRecording);