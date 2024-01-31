// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************
// Base schema definition
module.exports = `
type Alert {
    message: String!
}

input PaginateInput {
    id: ID
    page: Int
    limit: Int
}

type AuthPayload {
    token: String!
    trainer: Trainer!
}

type Query {
    _: String
}

type Mutation {
    _: String
}
`