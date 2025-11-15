import { Complaint } from 'orm/entities/transit/Complaint';

type TripPreview = {
  id: string;
  route: {
    id: string;
    number: string;
  } | null;
  driver: {
    id: string;
    fullName: string;
  } | null;
};

export class ComplaintResponseDTO {
  id: string;
  type: string;
  message: string;
  status: string;
  user: {
    id: string;
    fullName: string;
  } | null;
  trip: TripPreview | null;

  constructor(complaint: Complaint) {
    this.id = complaint.id;
    this.type = complaint.type;
    this.message = complaint.message;
    this.status = complaint.status;
    this.user = complaint.user
      ? {
          id: complaint.user.id,
          fullName: complaint.user.fullName,
        }
      : null;
    this.trip = complaint.trip
      ? {
          id: complaint.trip.id,
          route: complaint.trip.route
            ? {
                id: complaint.trip.route.id,
                number: complaint.trip.route.number,
              }
            : null,
          driver: complaint.trip.driver
            ? {
                id: complaint.trip.driver.id,
                fullName: complaint.trip.driver.fullName,
              }
            : null,
        }
      : null;
  }
}
