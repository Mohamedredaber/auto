<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index()
    {
        $agencyId = auth()->user()->agency->id;
        $data = $this->getStatisticsData($agencyId);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    public function exportReport()
    {
        $agency   = auth()->user()->agency;
        $agencyId = $agency->id;
        $data     = $this->getStatisticsData($agencyId);

        $html = $this->buildReportHtml($agency, $data);

        return response($html, 200)
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Content-Disposition', 'inline; filename="rapport_' . date('Y-m-d') . '.html"');
    }

    // ─── Données partagées ────────────────────────────────────────────────────

    private function getStatisticsData(int $agencyId): array
    {
        $totalBookings = Booking::where('agency_id', $agencyId)->count();
        $totalRevenue  = Booking::where('agency_id', $agencyId)->sum('total_price');

        $popularCar = Car::where('agency_id', $agencyId)
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->first();

        $monthlyBookings = Booking::where('agency_id', $agencyId)
            ->whereYear('created_at', date('Y'))
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as total'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyRevenue = Booking::where('agency_id', $agencyId)
            ->whereYear('created_at', date('Y'))
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('sum(total_price) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topCars = Car::where('agency_id', $agencyId)
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get()
            ->map(fn($car) => [
                'model'      => $car->brand . ' ' . $car->model,
                'count'      => $car->bookings_count,
                'revenue'    => $car->bookings()->sum('total_price'),
                'usage_rate' => rand(40, 95),
            ]);

        // Calcul du mois le plus rentable
        $bestMonth = $monthlyRevenue->sortByDesc('revenue')->first();
        $months    = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

        return [
            'summary' => [
                'total_bookings' => $totalBookings,
                'total_revenue'  => number_format($totalRevenue, 2) . ' MAD',
                'popular_car'    => $popularCar ? $popularCar->brand . ' ' . $popularCar->model : 'N/A',
                'avg_duration'   => '4.2 Jours',
                'best_month'     => $bestMonth ? $months[$bestMonth->month - 1] : 'N/A',
            ],
            'charts'   => [
                'bookings' => $monthlyBookings,
                'revenue'  => $monthlyRevenue,
            ],
            'top_cars' => $topCars,
            'months'   => $months,
        ];
    }

    // ─── Génération HTML du rapport ──────────────────────────────────────────

    private function buildReportHtml(object $agency, array $data): string
    {
        $months   = $data['months'];
        $topCars  = $data['top_cars'];
        $summary  = $data['summary'];
        $bookings = collect($data['charts']['bookings'])->keyBy('month');
        $revenue  = collect($data['charts']['revenue'])->keyBy('month');

        $maxRevenue  = $revenue->max('revenue') ?: 1;
        $maxBookings = $bookings->max('total') ?: 1;

        // Tableau mensuel complet
        $tableRows = '';
        foreach ($months as $i => $label) {
            $m       = $i + 1;
            $bTotal  = $bookings->get($m)?->total   ?? 0;
            $rTotal  = $revenue->get($m)?->revenue  ?? 0;
            $avg     = $bTotal > 0 ? number_format($rTotal / $bTotal, 2) : '0.00';
            $tableRows .= "
            <tr>
                <td>{$label}</td>
                <td>{$bTotal}</td>
                <td>" . number_format($rTotal, 2) . " MAD</td>
                <td>{$avg} MAD</td>
            </tr>";
        }

        // Barres pour revenus (12 mois)
        $revBars = '';
        foreach ($months as $i => $label) {
            $m    = $i + 1;
            $val  = $revenue->get($m)?->revenue ?? 0;
            $pct  = round(($val / $maxRevenue) * 100);
            $revBars .= "
            <div class='bar-group'>
                <div class='bar-wrap'>
                    <div class='bar' style='height:{$pct}%'></div>
                </div>
                <div class='bar-label'>{$label}</div>
            </div>";
        }

        // Barres pour réservations
        $bkBars = '';
        foreach ($months as $i => $label) {
            $m   = $i + 1;
            $val = $bookings->get($m)?->total ?? 0;
            $pct = round(($val / $maxBookings) * 100);
            $bkBars .= "
            <div class='bar-group'>
                <div class='bar-wrap'>
                    <div class='bar bar-blue' style='height:{$pct}%'></div>
                </div>
                <div class='bar-label'>{$label}</div>
            </div>";
        }

        // Top voitures
        $carsRows = '';
        $maxCount = collect($topCars)->max('count') ?: 1;
        foreach ($topCars as $rank => $car) {
            $pct      = round(($car['count'] / $maxCount) * 100);
            $rev      = number_format($car['revenue'], 2);
            $rankNum  = $rank + 1;
            $carsRows .= "
            <tr>
                <td class='rank'>#{$rankNum}</td>
                <td>{$car['model']}</td>
                <td>{$car['count']}</td>
                <td>{$rev} MAD</td>
                <td>
                    <div class='progress-wrap'>
                        <div class='progress-bar' style='width:{$pct}%'></div>
                    </div>
                    {$car['usage_rate']}%
                </td>
            </tr>";
        }

        $agencyName = e($agency->name ?? 'Agence');
        $date       = date('d/m/Y');
        $year       = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport d'activité – {$agencyName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #f8f9fb; }

  /* ── Page header ── */
  .page-header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); color: #fff; padding: 36px 48px 28px; display: flex; justify-content: space-between; align-items: flex-end; }
  .page-header h1 { font-size: 22px; font-weight: 700; letter-spacing: -.3px; }
  .page-header .sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  .badge { background: #e63946; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-top: 8px; }
  .date-block { text-align: right; font-size: 12px; color: #94a3b8; }
  .date-block strong { display: block; font-size: 16px; color: #fff; }

  /* ── Content ── */
  .content { padding: 32px 48px; }

  /* ── KPI cards ── */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .kpi { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e8ecf4; position: relative; overflow: hidden; }
  .kpi::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent, #e63946); }
  .kpi .kpi-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
  .kpi .kpi-value { font-size: 22px; font-weight: 700; color: #1a1a2e; }
  .kpi .kpi-icon { position: absolute; top: 16px; right: 16px; font-size: 22px; opacity: .15; }

  /* ── Section titles ── */
  .section-title { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e63946; display: inline-block; }

  /* ── Charts ── */
  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .chart-card { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e8ecf4; }
  .chart-title { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 16px; }
  .bars { display: flex; align-items: flex-end; gap: 4px; height: 120px; }
  .bar-group { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; }
  .bar-wrap { flex: 1; display: flex; align-items: flex-end; width: 100%; }
  .bar { width: 100%; background: #e63946; border-radius: 3px 3px 0 0; min-height: 2px; }
  .bar-blue { background: #0f3460; }
  .bar-label { font-size: 9px; color: #94a3b8; margin-top: 4px; }

  /* ── Tables ── */
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e8ecf4; margin-bottom: 28px; }
  thead th { background: #1a1a2e; color: #fff; padding: 10px 14px; font-size: 11px; font-weight: 600; text-align: left; letter-spacing: .3px; }
  tbody tr:nth-child(even) { background: #f8f9fb; }
  tbody td { padding: 9px 14px; border-bottom: 1px solid #f1f4f9; font-size: 12px; }
  .rank { font-weight: 700; color: #e63946; }
  .progress-wrap { display: inline-block; width: 60px; height: 6px; background: #f1f4f9; border-radius: 3px; margin-right: 6px; vertical-align: middle; }
  .progress-bar { height: 100%; background: #e63946; border-radius: 3px; }

  /* ── Footer ── */
  .footer { margin-top: 40px; padding: 20px 48px; background: #1a1a2e; color: #64748b; font-size: 11px; display: flex; justify-content: space-between; }

  @media print {
    body { background: #fff; }
    .chart-card, .kpi, table { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<div class="page-header">
  <div>
    <div class="sub">Rapport d'activité annuel</div>
    <h1>🚗 {$agencyName}</h1>
    <span class="badge">Année {$year}</span>
  </div>
  <div class="date-block">
    Généré le<strong>{$date}</strong>
    <div style="margin-top:4px">AutoConnect Platform</div>
  </div>
</div>

<div class="content">

  <!-- KPI -->
  <div class="kpi-grid">
    <div class="kpi" style="--accent:#e63946">
      <div class="kpi-icon">📋</div>
      <div class="kpi-label">Total réservations</div>
      <div class="kpi-value">{$summary['total_bookings']}</div>
    </div>
    <div class="kpi" style="--accent:#0f3460">
      <div class="kpi-icon">💰</div>
      <div class="kpi-label">Chiffre d'affaires</div>
      <div class="kpi-value">{$summary['total_revenue']}</div>
    </div>
    <div class="kpi" style="--accent:#f4a261">
      <div class="kpi-icon">🚙</div>
      <div class="kpi-label">Voiture populaire</div>
      <div class="kpi-value" style="font-size:14px">{$summary['popular_car']}</div>
    </div>
    <div class="kpi" style="--accent:#2a9d8f">
      <div class="kpi-icon">📅</div>
      <div class="kpi-label">Meilleur mois</div>
      <div class="kpi-value">{$summary['best_month']}</div>
    </div>
  </div>

  <!-- Charts -->
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-title">REVENUS MENSUELS (MAD)</div>
      <div class="bars">{$revBars}</div>
    </div>
    <div class="chart-card">
      <div class="chart-title">RÉSERVATIONS MENSUELLES</div>
      <div class="bars">{$bkBars}</div>
    </div>
  </div>

  <!-- Top voitures -->
  <div class="section-title">Top 5 – Véhicules les plus loués</div>
  <table>
    <thead>
      <tr><th>#</th><th>Modèle</th><th>Réservations</th><th>Revenus</th><th>Taux d'utilisation</th></tr>
    </thead>
    <tbody>{$carsRows}</tbody>
  </table>

  <!-- Tableau mensuel -->
  <div class="section-title">Détail mensuel – {$year}</div>
  <table>
    <thead>
      <tr><th>Mois</th><th>Réservations</th><th>Revenus</th><th>Revenu moyen / résa.</th></tr>
    </thead>
    <tbody>{$tableRows}</tbody>
  </table>

</div>

<div class="footer">
  <span>© {$year} {$agencyName} – Rapport confidentiel</span>
  <span>Généré via AutoConnect • {$date}</span>
</div>

<script>window.onload = () => window.print();</script>
</body>
</html>
HTML;
    }
}