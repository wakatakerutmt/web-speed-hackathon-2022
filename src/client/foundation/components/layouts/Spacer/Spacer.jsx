import React from "react";
import styled from "styled-components";

const spacingMap = {
  m: "margin",
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  mt: "marginTop",

  p: "padding",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  pt: "paddingTop",
};

const Wrapper = styled.div((props) => {
  return Object.entries(spacingMap).reduce((acc, [key, cssProperty]) => {
    const value = props[key];

    if (value != null) {
      acc[cssProperty] = typeof value === "number" ? `${value}px` : `${value}`;
    } else {
      acc[cssProperty] = "0px";
    }

    return acc;
  }, {});
});

const SpacerOrigin = ({ children, ...rest }) => {
  return <Wrapper {...rest}>{children}</Wrapper>
};

/** @type {React.FC<{ [K in keyof spacingMap]?: number | string }>} */
export const Spacer = React.memo(SpacerOrigin)
