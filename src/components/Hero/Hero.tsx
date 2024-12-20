import React from "react";
import { IonText } from "@ionic/react";

interface HeroSection {}

const HeroSection: React.FC<HeroSection> = () => {
  return (
    <div
      className="relative w-full h-screen bg-center bg-cover"
      style={{ backgroundImage: "url('/hero-img.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-transparent"></div>

      <div className="relative flex items-center justify-left pl-24 h-full">
        <IonText className="text-white font-semibold text-4xl text-left">
          <p>Tentang kami </p>
          <br />
          <p>p l a n t w i s e</p>
        </IonText>
      </div>
    </div>
  );
};

export default HeroSection;
