import React, { useState } from "react";

export default function SmartDeliveryDashboard() {

  // ------------------------------------------------
  // DELIVERY NETWORK GRAPH
  // ------------------------------------------------

  const graph = {
    A: { B: 4, C: 2 },
    B: { A: 4, C: 1, D: 5 },
    C: { A: 2, B: 1, D: 8, E: 10 },
    D: { B: 5, C: 8, E: 2 },
    E: { C: 10, D: 2 },
  };

  // ------------------------------------------------
  // START LOCATION STATE
  // ------------------------------------------------

  const [start, setStart] = useState("A");

  // ------------------------------------------------
  // DIJKSTRA ALGORITHM
  // ------------------------------------------------

  function dijkstra(graph, start) {

    const distances = {};
    const previous = {};
    const visited = new Set();

    // Initialize distances
    for (let node in graph) {

      distances[node] = Infinity;
      previous[node] = null;
    }

    distances[start] = 0;

    while (visited.size < Object.keys(graph).length) {

      let currentNode = null;
      let minDistance = Infinity;

      // Find nearest node
      for (let node in distances) {

        if (!visited.has(node) && distances[node] < minDistance) {

          minDistance = distances[node];
          currentNode = node;
        }
      }

      if (currentNode === null) break;

      visited.add(currentNode);

      // Update neighbors
      for (let neighbor in graph[currentNode]) {

        const distance =
          distances[currentNode] + graph[currentNode][neighbor];

        if (distance < distances[neighbor]) {

          distances[neighbor] = distance;
          previous[neighbor] = currentNode;
        }
      }
    }

    return { distances, previous };
  }

  // ------------------------------------------------
  // PATH RECONSTRUCTION
  // ------------------------------------------------

  function getPath(previous, destination) {

    const path = [];

    while (destination !== null) {

      path.push(destination);
      destination = previous[destination];
    }

    return path.reverse();
  }

  // ------------------------------------------------
  // GREEDY DELIVERY OPTIMIZATION
  // ------------------------------------------------

  function greedyRoute(graph, start) {

    const visited = new Set();
    const route = [start];

    let current = start;
    let totalDistance = 0;

    visited.add(current);

    while (visited.size < Object.keys(graph).length) {

      let nearest = null;
      let minDistance = Infinity;

      // Find nearest unvisited node
      for (let node in graph) {

        if (visited.has(node)) continue;

        if (graph[current][node] !== undefined) {

          const distance = graph[current][node];

          if (distance < minDistance) {

            nearest = node;
            minDistance = distance;
          }
        }
      }

      // If no direct connection exists
      if (nearest === null) {

        for (let node in graph) {

          if (!visited.has(node)) {

            nearest = node;
            minDistance = 0;
            break;
          }
        }
      }

      route.push(nearest);

      visited.add(nearest);

      totalDistance += minDistance;

      current = nearest;
    }

    return { route, totalDistance };
  }

  // ------------------------------------------------
  // EXECUTION
  // ------------------------------------------------

  const { distances, previous } = dijkstra(graph, start);

  const greedy = greedyRoute(graph, start);

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #020617, #0f172a)",
        color: "white",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >

      {/* TITLE */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "40px"
        }}
      >

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
            color: "#38bdf8"
          }}
        >
          Smart Delivery Route Optimization
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "18px"
          }}
        >
          Live Delivery Tracking using Dijkstra & Greedy Algorithms
        </p>

      </div>

      {/* SELECT LOCATION */}

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "25px",
          borderRadius: "18px",
          marginBottom: "30px"
        }}
      >

        <h2 style={{ color: "#38bdf8" }}>
          Select Starting Location
        </h2>

        <select
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "18px",
            marginTop: "15px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#0f172a",
            color: "white"
          }}
        >

          {Object.keys(graph).map((node) => (

            <option key={node} value={node}>
              {node}
            </option>

          ))}

        </select>

      </div>

      {/* LIVE ROUTE VISUALIZATION */}

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "30px",
          borderRadius: "18px",
          marginBottom: "30px"
        }}
      >

        <h2
          style={{
            color: "#22c55e",
            marginBottom: "25px"
          }}
        >
          Live Route Visualization
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >

          {greedy.route.map((node, index) => (

            <React.Fragment key={index}>

              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background:
                    node === start
                      ? "#22c55e"
                      : "#38bdf8",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  boxShadow: "0 0 20px rgba(56,189,248,0.6)"
                }}
              >
                {node}
              </div>

              {index !== greedy.route.length - 1 && (

                <div
                  style={{
                    fontSize: "35px",
                    color: "#facc15",
                    fontWeight: "bold"
                  }}
                >
                  →
                </div>

              )}

            </React.Fragment>

          ))}

        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "24px",
            color: "#facc15",
            fontWeight: "bold"
          }}
        >
          Total Delivery Distance : {greedy.totalDistance}
        </div>

      </div>

      {/* DIJKSTRA RESULTS */}

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "25px",
          borderRadius: "18px"
        }}
      >

        <h2
          style={{
            color: "#4ade80",
            marginBottom: "20px"
          }}
        >
          Dijkstra Shortest Paths
        </h2>

        {Object.keys(graph).map((destination) => {

          const path = getPath(previous, destination);

          return (

            <div
              key={destination}
              style={{
                backgroundColor: "#0f172a",
                padding: "20px",
                marginTop: "15px",
                borderRadius: "12px",
                borderLeft: "5px solid #38bdf8"
              }}
            >

              <h3>
                {start} → {destination}
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "18px"
                }}
              >
                Route: {path.join(" → ")}
              </p>

              <p
                style={{
                  color: "#facc15",
                  fontSize: "20px",
                  fontWeight: "bold"
                }}
              >
                Distance: {distances[destination]}
              </p>

            </div>

          );
        })}

      </div>

    </div>
  );
}