import "./../components/App.css";
// import "./../components/base.css";
import "./../components/fonts.css";
import { useEffect, useState } from "react";
import ColorThemeBtn from "./../components/ColorThemeBtn";

import { Rotate, Reflect, Reverse } from "../components/OperatorsBtns";
import { Scheme, getSchemes } from "../../sharedLib/schemes/Schemes";

import styled from "styled-components";

const scheme_array = Object.values(getSchemes());

export function Operators(props) {
  const operatorsState = props.operatorsState;
  const updateOperatorsState = props.updateOperatorsState;

  function clickRotate() {
    let operatorsState_ = operatorsState;
    operatorsState_["rotate"] = (operatorsState_["rotate"] + 1) % 4;
    updateOperatorsState(operatorsState_);
  }

  function clickReverse() {
    let operatorsState_ = operatorsState;
    operatorsState_["reverse"] = (operatorsState_["reverse"] + 1) % 2;
    updateOperatorsState(operatorsState_);
  }

  function clickReflect() {
    let operatorsState_ = operatorsState;
    operatorsState_["reflect"] = (operatorsState_["reflect"] + 1) % 2;
    updateOperatorsState(operatorsState_);
  }

  function clickScheme() {
    let operatorsState_ = operatorsState;
    if (operatorsState_["scheme"] == -1) {
      return;
    } else {
      operatorsState_["scheme"] =
        (operatorsState_["scheme"] + 1) % scheme_array.length;
      updateOperatorsState(operatorsState_);
    }
  }

  let scheme_index = operatorsState["scheme"];

  let scheme =
    scheme_index == -1
      ? "black"
      : scheme_array[scheme_index].slice(2, 6).join(" ");

  return (
    <div className="container_btns">
      <Reflect
        clickReflect={clickReflect}
        isOn={operatorsState["reflect"] == 0}
      />

      <Rotate rotate={clickRotate} index={operatorsState["rotate"]} />
      <Reverse
        clickReverse={clickReverse}
        isOn={operatorsState["reverse"] == 1}
      />

      <div className="container_btn color_scheme">
        {operatorsState["scheme"] == -1 ? null : (
          <ColorThemeBtn
            colors={scheme_array[operatorsState["scheme"]]}
            clickScheme={clickScheme}
          />
        )}
      </div>
    </div>
  );
}
