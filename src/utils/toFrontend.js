export function toFrontendId(doc) {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(toFrontendId);
  const d = doc.toObject ? doc.toObject() : { ...doc };
  if (d._id) {
    d.id = d._id.toString();
    delete d._id;
  }
  return d;
}
