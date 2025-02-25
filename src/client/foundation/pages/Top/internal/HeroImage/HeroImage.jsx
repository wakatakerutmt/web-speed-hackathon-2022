import React from "react";
import styled from "styled-components";

const Image = styled.img`
  display: block;
  margin: 0 auto;
`;

/**
 * @typedef Props
 * @type {object}
 * @property {string} url
 */

/** @type {React.VFC<Props>} */
export const HeroImage = () => {
  return <Image 
    alt="" 
    decoding="async"  
    height="735" 
    src="/assets/images/hero.avif"
    style={{height: "auto", width: "100%"}}
    width="1024"
  />;
};
