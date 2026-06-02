import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp } from 'lucide-react';

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
// Dans ton composant Statistics.jsx




    useEffect(() => {
        dispatch(fetchAgencyStatistics());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        /* space-y-12 crée un espacement vertical important entre chaque bloc principal */
        <div className="animate-fade-in space-y-12 p-4 md:p-8 max-w-[1600px] mx-auto text-white">
            
            {/* Section 1: Header */}
      <div className="space-y-8">

            <StatsHeader />
            {/* Section 2: Métriques clés */}
            <PerformanceCards summary={summary} />
            
      </div>
            {/* Section 3: Graphiques (Grid) */}
            <div className="space-y-8">
                <h2 className="text-lg font-semibold text-white px-1 inline-flex items-center gap-2">
                    <TrendingUp size={18} className="text-red-500" />
                    Analyses Graphiques
                </h2>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <BookingTrendsChart data={charts?.bookings} />
                    </div>
                    <div className="lg:col-span-4">
                        <MonthlyRevenueChart data={charts?.revenue} />
                    </div>
                </div>
            </div>

            {/* Section 4: Tableau de flotte */}
            <div className="space-y-8 pt-4">
                <h2 className="text-lg font-semibold text-white px-1">Performance de la Flotte</h2>
                <VehicleDetailsTable vehicles={topCars} />
            </div>

        </div>
    );
};

export default StatisticsPage;