import React from "react";

import { Handle, Position } from "reactflow";
/**
 *
 * @description This is custom node for `reactflow` with connecters position switched oposite than default
 * @returns React Component
 */
function ReverseNode({ data, style }) {
  return (
    <>
      <Handle type="source" position={Position.Top} />
      {/* <Handle type="target" position={Position.Top} /> */}
      {data.label}
      <Handle type="target" position={Position.Bottom} />
    </>
  );
}

export default ReverseNode;
