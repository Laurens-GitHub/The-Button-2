import React from "react";
import "./App.css";
import axios from "axios";
import Button from "@mui/material/Button";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soundUrl: "",
      loaded: false,
      idle: true,
      disabled: true,
    };
  }

  componentDidMount() {
    /** Requests soundUrl from API once upon page render */

    axios.get("http://localhost:3001/get").then((response) => {
      this.setState({
        soundUrl: response.data,
        loaded: true,
        disabled: false,
      });
    });
  }

  loadSound = async () => {
    /** Requests soundUrl from API and updates button states */

    try {
      const url = await axios.get("http://localhost:3001/get");
      this.setState({
        soundUrl: url.data,
        loaded: true,
        disabled: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  initialState = () => {
    /** Resets the button */

    this.setState({
      soundUrl: "",
      loaded: false,
      idle: true,
      disabled: true,
    });
  };

  handleClick = async (e) => {
    /** Plays the loaded sound and requests a new random sound to be played next.
  Disables button until current sound is finished and next sound is ready. */

    try {
      e.target.disabled = true;
      const sound = new Audio(this.state.soundUrl);
      await sound.play();

      sound.addEventListener("ended", async () => {
        if (!sound.paused === false) {
          try {
            const url = await axios.get("http://localhost:3001/get");
            this.setState({
              soundUrl: url.data,
              loaded: true,
              disabled: false,
            });
            e.target.disabled = false;
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="mainButton">
        <div className="buttonBorder">
          <Button
            variant="contained"
            className="Button"
            sx={{
              width: 100,
              height: 100,
              backgroundColor: "red",
              borderRadius: 50,
              ":hover": {bgcolor: "#C00101"},
              // border: "5px solid",
              // borderColor: "black",
            }}
            // onClick={this.handleClick}
          >
            Play Sound
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
