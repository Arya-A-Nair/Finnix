import React from "react";
import { MarkerType } from "reactflow";
/**
 * Requires 2 arrays of objects Nodes and Edges
 * See all propertes on `reactflow` docs.
 */
export const templateDataNodes = [
  {
    id: "1",
    position: { x: 15, y: 0 },
    // type: "cNode1",
    data: {
      label: (
        <>
          <div>Transaction Id: 1529303</div>
          <div>Amount: ₹ 5,00,000</div>
        </>
      ),
    },
    style: {
      background: "#D6D5E6",
      color: "#333",
      border: "1px solid #222138",
    },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: {
      label: (
        <>
          <div>Transaction Id: 1529303</div>
          <div>Amount: ₹ 5,00,000</div>
        </>
      ),
    },
  },
  {
    id: "3",
    position: { x: 15, y: 200 },
    data: {
      label: (
        <>
          <div>Transaction Id: 16094</div>
          <div>Amount: ₹ 4,00,000</div>
        </>
      ),
    },
  },
  {
    id: "4",
    position: { x: 210, y: 100 },
    type: "cNode1",
    data: {
      label: (
        <>
          <div>Transaction Id: 18090</div>
          <div>Amount: ₹ 3,00,000</div>
        </>
      ),
    },
  },
];

export const templateDataEdges = [
  { id: "e1-2", type: "straight", source: "1", target: "2" },
  { id: "e2-3", type: "straight", source: "2", target: "3" },
  {
    id: "e4-1",
    type: "step",
    source: "4",
    target: "1",
    markerEnd: {
      type: MarkerType.Arrow,
      width: 20,
      height: 20,
      color: "#FF0072",
    },
    style: {
      strokeWidth: 2,
      stroke: "#FF0072",
    },
  },
  {
    id: "e3-4",
    type: "step",
    source: "3",
    target: "4",
    markerEnd: {
      type: MarkerType.Arrow,
      width: 20,
      height: 20,
      color: "#FF0072",
    },
    style: {
      strokeWidth: 2,
      stroke: "#FF0072",
    },
  },
];
