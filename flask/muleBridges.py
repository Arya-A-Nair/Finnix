import networkx as nx

def muleBridges(transactions):

    graph = nx.Graph()

    moneyTransfer = {}

    for transaction in transactions:
        sender = transaction["senderAccount"]
        receiver = transaction["receiverAccount"]
        amount = transaction["amount"]
        moneyTransfer[sender] = moneyTransfer.get(sender, 0) + amount
        graph.add_edge(sender, receiver)

    visited = set()
    parent = {}
    low = {}
    disc = {}
    ap = []

    def dfs(node):
        nonlocal time
        child_count = 0
        visited.add(node)

        amountTransfer = moneyTransfer.get(node, 0)

        disc[node] = time
        low[node] = time
        time += 1

        for neighbor in graph.neighbors(node):
            if neighbor not in visited:
                parent[neighbor] = node
                child_count += 1
                dfs(neighbor)

                low[node] = min(low[node], low[neighbor])

                if parent[node] is None and child_count > 1 and [node, amountTransfer] not in ap:
                    ap.append([node, amountTransfer])
                if parent[node] is not None and low[neighbor] >= disc[node] and [node, amountTransfer] not in ap:
                    ap.append([node, amountTransfer])

            elif neighbor != parent[node]:
                low[node] = min(low[node], disc[neighbor])

    time = 0
    for node in graph.nodes:
        if node not in visited:
            parent[node] = None
            dfs(node)

    arr = []

    for i in ap:
        arr.append({"accountNumber" : i[0], "amount" : i[1]})
    #returns a set of tuples, each which contains the node number and amount transferred
    return arr

