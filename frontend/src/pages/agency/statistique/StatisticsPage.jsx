import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 1. استيراد الـ Thunks والـ Selectors
import { fetchAgencyStatistics } from '../../../features/agency/agencyStatsThunks';
import { 
    selectStatsSummary, 
    selectStatsCharts, 
    selectTopCars, 
    selectStatsLoading 
} from '../../../features/agency/statsSelectors';
import './StatisticsPage.css';
import StatsHeader from './components/StatsHeader';
import PerformanceCards from './components/PerformanceCards';
import BookingTrendsChart from './components/BookingTrendsChart';
import MonthlyRevenueChart from './components/MonthlyRevenueChart';
import VehicleDetailsTable from './components/VehicleDetailsTable';
const StatisticsPage = () => {
    const dispatch = useDispatch();
    const summary = useSelector(selectStatsSummary);
    const charts = useSelector(selectStatsCharts);
    const topCars = useSelector(selectTopCars);
    const loading = useSelector(selectStatsLoading);
    useEffect(() => {
        dispatch(fetchAgencyStatistics());
    }, [dispatch]);
    console.log("Charts dans le composant:", charts);
    console.log("Top Cars dans le composant:", topCars);
    console.log("Loading dans le composant:", loading);
    console.log("Summary dans le composant:", summary);
    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-blue-500)] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-10 md:space-y-12 p-4 md:p-8">
            
            <StatsHeader />

            <PerformanceCards summary={summary} />
            
            <div className="grid grid-cols-1 gap-8 lg:gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BookingTrendsChart data={charts?.bookings} />
                </div>

                <div className="lg:col-span-1">
                    <MonthlyRevenueChart data={charts?.revenue} />
                </div>
            </div>

            <VehicleDetailsTable vehicles={topCars} />

        </div>
    );
};

export default StatisticsPage;