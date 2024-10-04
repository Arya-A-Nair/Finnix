import request from "request";
import backendURL from "../constants/backendURL";

const createNodes = {
  async operation(req, res) {
    const { nodes, edges } = req.body;
    const options = {
      url: `${backendURL}createNodes`,
      body: JSON.stringify({
        nodes,
        edges,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    request.post(options, function (err, httpResponse, body) {
      return res.status(200).json({
        message: "Nodes created successfully",
        data: JSON.parse(body),
      });
    });
  },
};
export default createNodes;
