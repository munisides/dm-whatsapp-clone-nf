// import Header from "components/header/Header";
import Sidebar from "./Sidebar";
import React from "react";
import styled from "styled-components";

const Layout = ({ children }) => (
  <StyledWrapper>
    {/* <Header /> */}
    <StyledBody>
      <Sidebar />
      {children}
    </StyledBody>
  </StyledWrapper>
);

export default Layout;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StyledBody = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
`;