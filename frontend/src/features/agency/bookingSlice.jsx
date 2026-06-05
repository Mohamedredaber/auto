import { createSlice } from "@reduxjs/toolkit";
import { 
    getAgencyBookings, 
    getBookingStats, 
    updateBookingStatus, 
    cancelAgencyBooking 
} from "./bookingThunks";

const initialState = {
    bookings: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15
    },
    stats: null,
    singleBooking: null,
    isLoading: false,
    errors: null,
    isModalOpen: false,
    selectedStatus: 'all'
};

const agencyBookingSlice = createSlice({
    name: "agencyBooking",
    initialState,
    reducers: {
        setModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        },
        setSelectedStatus: (state, action) => {
            state.selectedStatus = action.payload;
        },
        clearErrors: (state) => {
            state.errors = null;
        }
    },
    extraReducers: (builder) => {
        builder
            /* Fetch All Bookings */
            .addCase(getAgencyBookings.pending, (state) => {
                state.isLoading = true;
                state.errors = null;
            })
            .addCase(getAgencyBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings = action.payload.data;
                state.pagination = action.payload.meta || state.pagination;
            })
            .addCase(getAgencyBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload;
            })

            /* Fetch Stats */
            .addCase(getBookingStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })

            /* Update Status */
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                state.singleBooking = action.payload;
            })

            /* Cancel Booking */
            .addCase(cancelAgencyBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index].status = 'canceled';
                }
            });
    }
});

export const { setModalOpen, setSelectedStatus, clearErrors } = agencyBookingSlice.actions;
export default agencyBookingSlice.reducer;