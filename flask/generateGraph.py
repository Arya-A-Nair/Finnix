import queue

def generateGraph(edges, nodes):
    print(nodes)
    adj = dict()
    visited = []
    topologicalSort = []
    depthVals = dict()
    nodeDepth = dict()

    for edge in edges:
        arr = adj.get(edge["source"], [])
        arr.append(edge["target"])
        adj[edge["source"]] = arr

    def dfs(node):
        visited.append(node)

        arr = adj.get(node, [])
        for v in arr:
            if v not in visited:
                dfs(v)

        topologicalSort.append(node)

    for key in adj.keys():
        if key not in visited:
            dfs(key)

    topologicalSort.reverse()
    visited.clear()

    def dfs2(node, depth=0):
        visited.append(node)

        a = depthVals.get(depth, 0)
        depthVals[depth] = a + 1

        nodeDepth[node] = depth

        arr = adj.get(node, [])
        for v in arr:
            if v not in visited:
                dfs2(v, depth + 1)

    for node in topologicalSort:
        if node not in visited:
            dfs2(node)

    
    constDepth = depthVals.copy()

    for i in range(len(nodes)):
        nodes[i]["position"] = {
            "y": nodeDepth.get(nodes[i]["id"], 0) * 169,
            "x": depthVals.get(nodeDepth.get(nodes[i]["id"], 0), 0) * 169 - constDepth.get(nodeDepth.get(nodes[i]["id"], 0), 0) * 169 / 2,
        }
        depthVals[nodeDepth.get(nodes[i]["id"], 0)] = depthVals.get(nodeDepth.get(nodes[i]["id"], 0), 0) - 1

    return nodes
