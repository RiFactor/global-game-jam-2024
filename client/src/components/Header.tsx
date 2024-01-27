import React, { useEffect, useState } from "react";
import { permittedKeysOne, permittedKeysTwo } from "../constants/keyboard";
import UserData from "../data/UserData";

const Header = () => {
  return (
    <div>
      <ul id="messages"></ul>
    </div>
  );
};

export default Header;
