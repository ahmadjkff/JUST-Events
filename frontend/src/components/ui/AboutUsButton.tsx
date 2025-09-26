import React from "react";
import "../../styles/ui/AboutUsButton.css";

type AboutUsButtonProps = {
  text?: string;
  size?: "small" | "medium" | "large";
};

const AboutUsButton: React.FC<AboutUsButtonProps> = ({
  text = "Hover me",
  size = "medium",
}) => {
  return (
    <button className={`slice ${size}`}>
      <span className="text">{text}</span>
    </button>
  );
};

export default AboutUsButton;

// Examples
{/* <AboutUsButton text="Small Btn" size="small" />
<AboutUsButton text="Default Medium" /> 
<AboutUsButton text="Large Btn" size="large" /> */}