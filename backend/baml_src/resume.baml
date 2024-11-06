// Defining a data model.
class ExtractedDoc {
  transactionList Transaction[] @description("The list of transactions extracted from the document.")
}

class Transaction {
  senderAccount string
  receiverAccount string
  date string
  senderName string?
  receiverName string?
  amount float
  id string @description("The unique identifier for the transaction. Make it a random UUID.")
  createdBy string @description("The user account that created the transaction.")
}

// Create a function to extract the resume from a string.
function ExtractDoc(doc: image[]) -> ExtractedDoc {
  // Specify a client as provider/model-name
  // you can use custom LLM params with a custom client name from clients.baml like "client CustomHaiku"
  client CustomSonnet
  prompt #"
    Extract from this content:
    {{ doc }}

    {{ ctx.output_format }}
  "#
}

// Test the function with a sample resume. Open the VSCode playground to run this.
test doc {
  functions [ExtractDoc]
  args {
    doc [
      {
        url "https://i.ibb.co/wyB8F46/SBI-Bank-Statement-1691580368016-314327775.jpg"
      }
    ]
  }
}
