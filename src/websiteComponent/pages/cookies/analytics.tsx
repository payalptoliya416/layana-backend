import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-J7SRQMK3Y7");
};

export const trackPageView = (path) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });   
};
