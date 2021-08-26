import React from "react";
import { Container, Header, Image } from "semantic-ui-react";
import "./App.css";
import logo from "./TwitchIcon.png";

export default function TopHeader() {
  // Render it
  return (
    <Container>
      <Header as="h1" style={{ paddingTop: 50, fontSize: 50, textAlign: "center", }}>
        <Image src={logo} />
        <Header.Content id='head'>
          T-Clips
          <Header.Subheader>Download Twitch Clips Easily</Header.Subheader>
        </Header.Content>
      </Header>
      
    </Container>
    

  );
}
