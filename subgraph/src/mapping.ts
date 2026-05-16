import { BigInt, Bytes, store } from "@graphprotocol/graph-ts"
import {
  TrueStamp,
  DocumentUploaded,
  DocumentRevoked,
  AccessGranted,
  AccessRevoked,
  NomineeUpdated
} from "../generated/TrueStamp/TrueStamp"
import { Document, AccessGrant, User } from "../generated/schema"

export function handleDocumentUploaded(event: DocumentUploaded): void {
  let doc = new Document(event.params.docId)
  doc.owner = event.params.owner
  doc.issuer = event.params.issuer
  doc.cid = event.params.cid
  doc.isRevoked = false
  doc.timestamp = event.block.timestamp
  doc.save()

  // Ensure user entity exists
  let user = User.load(event.params.owner)
  if (user == null) {
    user = new User(event.params.owner)
    user.save()
  }
}

export function handleDocumentRevoked(event: DocumentRevoked): void {
  let doc = Document.load(event.params.docId)
  if (doc != null) {
    doc.isRevoked = true
    doc.save()
  }
}

export function handleAccessGranted(event: AccessGranted): void {
  let grantId = event.params.docId.toHexString() + "-" + event.params.verifier.toHexString()
  let grant = new AccessGrant(grantId)
  grant.document = event.params.docId
  grant.verifier = event.params.verifier
  grant.save()
}

export function handleAccessRevoked(event: AccessRevoked): void {
  let grantId = event.params.docId.toHexString() + "-" + event.params.verifier.toHexString()
  store.remove('AccessGrant', grantId)
}

export function handleNomineeUpdated(event: NomineeUpdated): void {
  let user = User.load(event.params.owner)
  if (user == null) {
    user = new User(event.params.owner)
  }
  user.nominee = event.params.nominee
  user.save()
}
