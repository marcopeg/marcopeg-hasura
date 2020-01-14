import React from "react";
import { IonModal, IonContent } from "@ionic/react";
import Lottie from "react-lottie";
import animationData from "./1127-success.json";
import { useSuccessFeedback } from "../../state/use-success-feedback";

const SuccessModal = () => {
  const [{ isOpen, isStopped }, { hide }] = useSuccessFeedback();

  const lottieOptions = {
    options: {
      loop: false,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    },
    height: "80vw",
    width: "80vw",
    isStopped: isStopped,
    isPaused: false,
    eventListeners: [
      {
        eventName: "complete",
        callback: hide
      }
    ]
  };

  return (
    <IonModal isOpen={isOpen} animated={true}>
      <IonContent onClick={hide}>
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Lottie {...lottieOptions} />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SuccessModal;
