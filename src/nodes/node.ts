import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value } from "../types";
import { NodeState } from "../types";

const initialState: NodeState = {
  killed: false,
  x: null,
  decided: null,
  k: null
};

// Créez une variable pour stocker l'état actuel du nœud
let currentState: NodeState = { ...initialState };

export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

  // TODO implement this
  // this route allows retrieving the current status of the node
  node.get("/status", (req, res) => {
    // Vérifier si le nœud est défectueux
    if (isFaulty) {
      // Si le nœud est défectueux, répondre avec un code de statut 500 et le message "faulty"
      res.status(500).send("faulty");
  } else {
      // Si le nœud n'est pas défectueux, répondre avec un code de statut 200 et le message "live"
      res.status(200).send("live");
  }
});

  // TODO implement this
  // this route allows the node to receive messages from other nodes
  node.post("/message", (req, res) => {
    // Vous pouvez ajouter ici la logique pour traiter les messages envoyés par les autres nœuds
    const message = req.body.message; // Supposons que le message est envoyé dans le corps de la requête
    // Traitement du message
    res.send("Message received"); // Réponse à l'autre nœud
  });

  // TODO implement this
  // this route is used to start the consensus algorithm
  node.get("/start", async (req, res) => {
    // Vous pouvez ajouter ici la logique pour démarrer l'algorithme de consensus
    // Par exemple, appeler une fonction qui démarre l'algorithme
    res.send("Consensus algorithm started");
  });
  // TODO implement this
  // this route is used to stop the consensus algorithm
  node.get("/stop", async (req, res) => {
    // Vous pouvez ajouter ici la logique pour arrêter l'algorithme de consensus
    // Par exemple, appeler une fonction qui arrête l'algorithme
    res.send("Consensus algorithm stopped");
  });
  // TODO implement this
  // get the current state of a node
  node.get("/getState", (req, res) => {
    // Vous pouvez ajouter ici la logique pour obtenir l'état actuel du nœud
    // Par exemple, renvoyer un objet JSON contenant l'état actuel du nœud
    res.json({
      nodeId: nodeId,
      state: currentState
    });
  });
  
  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
