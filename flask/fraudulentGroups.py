import networkx as nx
import community

def fraudulentGroups(transactions):

    G = nx.Graph()

    for transaction in transactions:
        G.add_edge(transaction['senderAccount'], transaction['receiverAccount'])
            
    partition = community.best_partition(G)
    values = dict()

    for key in partition.keys():

        arr = values.get(partition[key], [])
        arr.append(key)
        values[partition[key]] = arr

    finalDict = dict()

    for key in values.keys():
        if(len(values[key]) >= 3):
            finalDict[key] = values[key]

    #this is a dictionary which returns which community each node belongs to 
    #key is account number, value is community number
    return finalDict

