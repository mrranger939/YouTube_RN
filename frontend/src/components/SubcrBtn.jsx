
import { Button } from "@heroui/react";
import confetti from "canvas-confetti";
import { useState } from "react";


export default function SubcrBtn() {
    // Subscription State
    const [sub, setSub] = useState({
      text: "Subscribe",
      status: false,
      color: "danger",
      class: "text-white",
      btn: "solid",
    });
  
    const toggleSubscription = () => {
      console.log(sub);
      if (sub.status) {
        setSub({
          text: "Subscribe",
          status: false,
          color: "danger",
          class: "text-white",
          btn: "solid",
        });
      } else {
        setSub({
          text: "Subscribed",
          status: true,
          color: "default",
          class: "text-dark",
          btn: "ghost",
        });
      }
      handleConfetti()
    };
  
    const handleConfetti = () => {
      if (!sub.status)
        confetti({
          origin: { x: 0.18, y: 0.75 },
          particleCount: 500,
          gravity: 0.25,
          decay: 0.6,
          spread: 360,
        });
    };
  
    return (
      <Button
        className={`text-tiny ${sub.class}`}
        variant={sub.btn}
        color={sub.color}
        radius="full"
        size="md"
        onPress={toggleSubscription}
      >
        {sub.text}
      </Button>
    );
  }
  