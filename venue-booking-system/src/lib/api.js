import Parse from "./parse.js";

function toLocal(obj) {
  return { id: obj.id, ...obj.toJSON() };
}

export async function fetchVenues() {
  const q = new Parse.Query("Venue");
  q.limit(100);
  q.descending("popularity");
  return (await q.find()).map(toLocal);
}

export async function fetchBookings() {
  const q = new Parse.Query("Booking");
  q.limit(500);
  q.descending("createdAt");
  return (await q.find()).map(toLocal);
}

export async function fetchReviews() {
  const q = new Parse.Query("Review");
  q.limit(200);
  return (await q.find()).map(toLocal);
}

export async function createBooking(data) {
  const Booking = Parse.Object.extend("Booking");
  const obj = new Booking();
  Object.entries(data).forEach(([k, v]) => obj.set(k, v));
  return toLocal(await obj.save());
}

export async function updateBooking(objectId, updates) {
  const obj = await new Parse.Query("Booking").get(objectId);
  Object.entries(updates).forEach(([k, v]) => obj.set(k, v));
  await obj.save();
}

export async function updateVenue(objectId, updates) {
  const obj = await new Parse.Query("Venue").get(objectId);
  Object.entries(updates).forEach(([k, v]) => obj.set(k, v));
  await obj.save();
}

export async function deleteVenue(objectId) {
  const obj = await new Parse.Query("Venue").get(objectId);
  await obj.destroy();
}
