import networkx as nx

def sourceToSink(source, sink, transactions):
    G = nx.DiGraph()

    for transaction in transactions:
        sender = transaction["senderAccount"]
        receiver = transaction["receiverAccount"]
        amount = transaction["amount"]
        G.add_edge(sender, receiver, capacity=amount)

    flow_value, flow_dict = nx.maximum_flow(G, source, sink)

    #returns an integer, the actual money transferred from person A to person B
    return flow_value

