import dagre from "dagre";

import { replaceSpaceWithUnderscore } from "./text-utils";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 150;
const nodeHeight = 25;

const getLayoutedElements = (flowData, direction = "TB") => {
  const { nodes, edges } = flowData;
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    };

    return node;
  });

  return { layoutedNodes: nodes, layoutedEdges: edges };
};

const getMermaidGraphFromFlowData = (flowData) => {
  const { edges } = flowData;
  let graphContent = "graph LR;";
  edges.forEach(({ source, target }) => {
    graphContent =
      graphContent +
      `${source.replace(" ", "_")}-->${replaceSpaceWithUnderscore(target)};`;
  });
  return graphContent;
};

const getMermaidSequenceDiagremFromFlowData = (flowData) => {
  const { edges } = flowData;
  let graphContent = "sequenceDiagram;autonumber;";
  edges.forEach(({ source, target }) => {
    graphContent =
      graphContent +
      `${source.replace(" ", "_")}->>${replaceSpaceWithUnderscore(target)}: ;`;
  });
  return graphContent;
};

export {
  getLayoutedElements,
  getMermaidGraphFromFlowData,
  getMermaidSequenceDiagremFromFlowData
};
