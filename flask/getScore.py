from sourceToSink import sourceToSink

def calculate_score(indirect_amount, direct_amount):
    difference = indirect_amount - direct_amount

    max_difference = max(indirect_amount, direct_amount)
    min_difference = min(indirect_amount, direct_amount)
    
    if max_difference == min_difference:
        return 1

    normalized_difference = (difference - min_difference) / (max_difference - min_difference)

    score = 1 + normalized_difference * 9

    return min(max(score, 1), 10)

def getScore(transactions, source):

    score = 0

    setMoney = dict()
    nodes = set()

    for transaction in transactions:
        if(transaction["senderAccount"] == source):
            setMoney["receiverAccount"] = setMoney.get("receiverAccount", 0) + transaction["amount"]

        if(transaction["senderAccount"] != source): nodes.add(transaction["senderAccount"])
        if(transaction["receiverAccount"] != source): nodes.add(transaction["receiverAccount"])

    for node in nodes:
        indirectAmount = sourceToSink(source, node, transactions)
        directAmount = setMoney.get("node", 1)
        score += calculate_score(indirectAmount, directAmount)

    return score / max(1, len(nodes))


        
