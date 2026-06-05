import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import carReducer from "../features/agency/carSlice";
import agencyBookingReducer from "../features/agency/bookingSlice";
import catalogReducer from "../features/catalog/catalogSlice";
import bookingReducer from "../features/booking/bookingSlice";
import clientReducer from "../features/client/clientSlice";
import profileclientReducer from "../features/client/profileSlice";
import agencyClientsReducer from "../features/agency/agencyClientsSlice";
import agencyStatsReducer from "../features/agency/agencyStatsSlice";
import agencyProfileReducer from "../features/agency/agencyProfileSlice";
import dashboardReducer from "../features/agency/dashboardSlice";
import agencyPublicReducer from "../features/public/agencyPublicSlice";
import adminAgenciesReducer from "../features/adminAgencies/adminAgenciesSlice";
import adminCarsReducer from "../features/adminCars/adminCarsSlice";
import adminUsersReducer from "../features/adminUsers/adminUsersSlice";
import adminBookingsReducer from "../features/adminBookings/adminBookingsSlice";

import contactReducer from "../features/contactSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    cars: carReducer,
    agencyBooking: agencyBookingReducer,
    booking: bookingReducer,
    client: clientReducer,
    profileclient: profileclientReducer,
    agencyClients : agencyClientsReducer,
    agencyStats : agencyStatsReducer,
    agencyProfile : agencyProfileReducer  ,
    dashboard: dashboardReducer,
    agencyPublic : agencyPublicReducer, 
    adminAgencies: adminAgenciesReducer,
    adminCars: adminCarsReducer,
    adminUsers: adminUsersReducer,
    adminBookings: adminBookingsReducer,
    contact: contactReducer
    },
});
