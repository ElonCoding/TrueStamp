import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// The GraphQL endpoint will need to be configured in ApolloProvider once deployed
// e.g., https://api.thegraph.com/subgraphs/name/truestamp-subgraph

export const GET_USER_DOCUMENTS = gql`
  query GetUserDocuments($owner: Bytes!) {
    documents(where: { owner: $owner }, orderBy: timestamp, orderDirection: desc) {
      id
      owner
      issuer
      cid
      timestamp
      isRevoked
    }
  }
`;

export const GET_ISSUER_DOCUMENTS = gql`
  query GetIssuerDocuments($issuer: Bytes!) {
    documents(where: { issuer: $issuer }, orderBy: timestamp, orderDirection: desc) {
      id
      owner
      issuer
      cid
      timestamp
      isRevoked
    }
  }
`;

export const GET_DOCUMENT_ACCESS = gql`
  query GetDocumentAccess($docId: Bytes!) {
    accessGrants(where: { document: $docId }) {
      id
      verifier
    }
  }
`;

export const GET_USER_NOMINEE = gql`
  query GetUserNominee($owner: Bytes!) {
    user(id: $owner) {
      id
      nominee
    }
  }
`;

export const useUserDocuments = (ownerAddress: string) => {
  return useQuery(GET_USER_DOCUMENTS, {
    variables: { owner: ownerAddress.toLowerCase() },
    skip: !ownerAddress,
  });
};

export const useIssuerDocuments = (issuerAddress: string) => {
  return useQuery(GET_ISSUER_DOCUMENTS, {
    variables: { issuer: issuerAddress.toLowerCase() },
    skip: !issuerAddress,
  });
};
