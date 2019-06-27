import React, { useState, useContext, useEffect } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import axios from "axios";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import withRoot from "../../withRoot";
import Context from "../../context";
import PinIcon from "./PinIcon";
import NavBar from "../layout/Navbar";
import Blog from "../blog/Blog";
import Loading from "../pages/Loading";

let INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 11
};

const Map = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);

  let viewportVal = {};
  !state.currentPin
    ? (viewportVal = INITIAL_VIEWPORT)
    : (viewportVal = {
        latitude: state.currentPin.latitude,
        longitude: state.currentPin.longitude
      });

  const [viewport, setViewport] = useState(viewportVal);
  const [userPosition, setUserPosition] = useState(INITIAL_VIEWPORT);
  const [popup, setPopup] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // get user's current position
  useEffect(() => {
    const getUserPosition = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          setViewport({ ...viewport, latitude, longitude });
          setUserPosition({ latitude, longitude });
        });
      }
    };
    getUserPosition();
    // if currentt pin assigned, set popup as well
    if (state.currentPin) {
      setPopup(state.currentPin);
    }
    // clean up upon dismounting
    return function() {
      setViewport(null);
      setUserPosition(null);
    };
  }, [state.currentPin]);

  // get all memories
  const getMeMemories = async () => {
    try {
      const { data } = await axios.get("/pins/all");
      // hold memories on state and end loading screen upon successful fetch
      if (data) {
        dispatch({ type: "MEMORIES", payload: data });
        setLoading(false);
      }
    } catch (err) {
      setErrors({ error: "There has been an error retrieving memories" });
    }
  };
  // call to get user's memories
  useEffect(() => {
    getMeMemories();
    // clenup user memories & single memory from state upon dismounting
    return function() {
      dispatch({ type: "MEMORIES", payload: [] });
      dispatch({ type: "SET_PIN", payload: null });
    };
  }, []);

  // set specific memory upon click on a pin on map
  const handleSelectPin = async pin => {
    setPopup(pin);
    await dispatch({ type: "SET_PIN", payload: pin });

    // check to see if user is the author of the current pin
    if (pin.author === state.user.name) {
      dispatch({ type: "SET_PIN_AUTHOR", payload: state.user });
    } else {
      // if not, get the user info of the author
      const { data } = await axios.get(`/users/${pin.author}`);
      dispatch({ type: "SET_PIN_AUTHOR", payload: data });
    }
  };

  // create new draft pin when map is clicked
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    const [longitude, latitude] = lngLat;
    // set draft with lat and long
    dispatch({ type: "DRAFT", payload: { longitude, latitude } });
    setPopup(null);
  };

  // check if the user is the author of the pin
  const isAuthUser = () => state.user.name === popup.author;

  // delete pin
  const handleDeletePin = async pin => {
    // setLoading(true);
    try {
      const { statusText } = await axios.delete(`/pins/${pin._id}`);
      // upon successful deletion;
      // set popup, clean singleMemory and get all memories again
      if (statusText === "OK") {
        setPopup(null);
        dispatch({ type: "SET_PIN", payload: null });
        getMeMemories();
      }
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data);
        console.log(errors);
      }
    }
  };

  // return circularprogress until loading is set to false
  if (loading) {
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <NavBar page="map" />
        <Loading />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <NavBar page="map" />
      <div
        className={
          mobileSize ? classes.mapAndContentMobile : classes.mapAndContent
        }
      >
        <ReactMapGL
          width="100%"
          height={mobileSize ? "calc(100vh - 57px)" : "calc(100vh - 64px)"}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxApiAccessToken="pk.eyJ1IjoiYWxpY2FuLWFreXV6IiwiYSI6ImNqdWV0YmZnbTA3NHk0Ym1mOHV0MzRrM2sifQ.2_XSjPYwun5Fux9EpoCdBw"
          scrollZoom={!mobileSize}
          onViewportChange={newViewport => setViewport(newViewport)}
          onClick={handleMapClick}
          {...viewport}
        >
          {/* Nav Control Items */}
          <div className={classes.navigationControl}>
            <NavigationControl
              onViewportChange={newViewport => setViewport(newViewport)}
            />
          </div>

          {/* User Current Location */}
          {userPosition && (
            <Marker
              latitude={userPosition.latitude}
              longitude={userPosition.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon size={40} color="white" />
            </Marker>
          )}

          {/* All User Memories */}
          {state.memories.map((pin, index) => (
            <Marker
              key={index}
              latitude={Number(pin.latitude)}
              longitude={Number(pin.longitude)}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                onClick={() => handleSelectPin(pin)}
                size={25}
                color={pin.author === state.user.name ? "#ff8f00" : "green"}
              />
            </Marker>
          ))}

          {/* Draft Memory */}
          {state.draft && (
            <Marker
              latitude={state.draft.latitude}
              longitude={state.draft.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon size={30} color="brown" />
            </Marker>
          )}

          {/* Popup dialog for created pins */}
          {popup && (
            <Popup
              anchor="top"
              latitude={Number(popup.latitude)}
              longitude={Number(popup.longitude)}
              closeOnClick={false}
              onClose={() => {
                dispatch({ type: "SET_PIN", payload: null });
                setPopup(null);
              }}
            >
              <img
                className={
                  mobileSize ? classes.popupImageMobile : classes.popupImage
                }
                src={popup.image}
                alt={popup.title}
              />
              <div className={classes.popupTab}>
                {isAuthUser() && (
                  <Button onClick={() => handleDeletePin(popup)}>
                    <DeleteIcon className={classes.deleteIcon} />
                  </Button>
                )}
              </div>
            </Popup>
          )}
        </ReactMapGL>
        <div
          className={mobileSize ? classes.blogHolderMobile : classes.blogHolder}
        >
          {state.currentPin || state.draft ? <Blog /> : null}
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  mapAndContent: {
    display: "flex",
    height: "calc(100vh - 64px)"
  },
  blogHolder: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "black"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  ////////////////////// MOBILE //////////////////////
  mapAndContentMobile: {
    display: "flex",
    flexDirection: "column",
    marginTop: "57px"
  },
  blogHolderMobile: {
    width: "100%"
  },
  popupImageMobile: {
    padding: "0.2em",
    height: 120,
    width: 120,
    objectFit: "cover"
  }
};

export default withRoot(withStyles(styles)(Map));
