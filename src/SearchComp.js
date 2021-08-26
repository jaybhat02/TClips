import React, { useState, useEffect } from "react";
import { Form, Input, Button, List, Image, Loader } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import twitchPoint from "./twitch.png";

export default function SearchComp({ setClipInfo, setResetSort }) {
  const [Streamer, setStreamer] = useState("");
  var ClipInfo = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const absMin = new Date(2016, 6, 26);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const absMax = new Date();
  const [MinDate, setMinDate] = useState(absMin);
  const [MaxDate, setMaxDate] = useState(absMax);
  var tomorrow = new Date(absMin);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var yesterday = new Date(absMax);
  yesterday.setDate(yesterday.getDate() - 1);
  const [CalMinDate, setCalMinDate] = useState(tomorrow);
  const [CalMaxDate, setCalMaxDate] = useState(yesterday);
  const [LoaderAct, setLoaderAct] = useState(false);
  const setToday = false;
  const [inst, setInst] = useState(
    <div style={{ marginTop: 15, marginBottom: 25 }} id="inst">
      <List size="big">
        <List.Item>
          <Image
            size="mini"
            src={twitchPoint}
          />
          <List.Content>
            Search your favourite streamers and get their best clips to download
          </List.Content>
        </List.Item>
        <List.Item>
          <Image
            size="mini"
            src={twitchPoint}          />
          <List.Content>
            Optional: You can select a minimum date, maximum date or a range of
            dates to query the clips you wish to download
          </List.Content>
        </List.Item>
        <List.Item>
          <Image
            size="mini"
            src={twitchPoint}          />
          <List.Content>
            Sort the clips how ever you like to find what you are looking for
          </List.Content>
        </List.Item>
      </List>
    </div>
  );

  useEffect(() => {
    if (MaxDate < absMin && MaxDate !== null) {
      alert(
        "The maximum date you have inputed is before twitch clips existed. This will not yield anything. Please change the maximum date."
      );
    }
    if (MinDate > absMax && MinDate !== null) {
      alert(
        "The minimum date you have inputed is in the future. This will not yield anything. Please change the minimum date."
      );
    }
    if (MinDate >= MaxDate && MinDate !== null) {
      alert(
        "The minimum date you have inputed is after maximum date. This will not yield anything. Please change the minimum date."
      );
    }
  }, [MaxDate, MinDate, absMax, absMin]);

  function changeMin(event, data) {
    var dateValue;
    if (data.value !== null) {
      dateValue = data.value;
    } else {
      dateValue = absMin;
    }
    setMinDate(dateValue);
    var tomorrow = new Date(dateValue);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCalMinDate(tomorrow);
  }
  function changeMax(event, data) {
    var dateValue;
    if (data.value !== null) {
      dateValue = data.value;
    } else {
      dateValue = absMax;
    }
    setMaxDate(dateValue);
    var yesterday = new Date(dateValue);
    yesterday.setDate(yesterday.getDate() - 1);
    setCalMaxDate(yesterday);
  }

  function getClips() {
    setLoaderAct(true);
    if (MaxDate === null) {
      setMaxDate(absMax);
    }
    if (MinDate === null) {
      setMinDate(absMax);
    }
    const req = {
      Streamer: { Streamer },
      MaxDate: { MaxDate },
      MinDate: { MinDate },
    };
    console.log(Streamer);
    console.log(MinDate.toISOString() + " to " + MaxDate.toISOString());
    if (Streamer === "") {
      alert("Please Enter Streamer Name");
    } else {
      fetch("https://tclips.herokuapp.com/streamer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      })
        .then((response) => {
          if (response.ok) {
            console.log("response worked!");
            return response.json();
          } else {
            console.log("response did not work!");
          }
        })
        .then((data) => {
          ClipInfo = data;

          if (
            typeof ClipInfo === "undefined" ||
            ClipInfo["clipInfo"].length === 0
          ) {
            alert("No Clips Found");
          } else {
            setInst("");
            setResetSort(new Date().toISOString());

            setClipInfo(ClipInfo);
          }
          setLoaderAct(false)
        });
    }
    
  }

  return (
    <div>
      <Form style={{ textAlign: "center", marginTop: 10 }}>
        
        <Input
          value={Streamer}
          onChange={(e) => setStreamer(e.target.value)}
          size="large"
          icon="search"
          style={{ width: 450, marginTop: 40 }}
          id="search"
          placeholder="Streamer Name"
          maxLength="25"
        />

        <Button
          color="violet"
          onClick={getClips}
          size="large"
          style={{ width: 200, marginLeft: 15, marginRight: 15 }}
          id="submitButton"
        >
          Submit
        </Button>

        <SemanticDatepicker
          id="initialDate"
          minDate={absMin}
          maxDate={CalMaxDate}
          onChange={changeMin}
          showToday={setToday}
          label="From: "
        />
        <SemanticDatepicker
          id="finalDate"
          minDate={CalMinDate}
          maxDate={absMax}
          onChange={changeMax}
          showToday={setToday}
          label="To:"
        />
      </Form>
      <Loader size='medium' inverted inline='centered' active={LoaderAct}/>
      <div>{inst}</div>
    </div>
  );
}
