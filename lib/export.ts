// @ts-ignore - jsPDF types
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Campaign, Placement, ExportData } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export async function exportToPDF(campaign: Campaign, placements: Placement[], exportedBy: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102); // Rossel blue
  doc.text('Rossel - Media Planning', margin, yPosition);
  
  yPosition += 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Campagne: ${campaign.name}`, margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text(`Client: ${campaign.client}`, margin, yPosition);
  
  yPosition += 7;
  doc.text(`Période: ${format(campaign.startDate, 'dd MMMM yyyy', { locale: fr })} - ${format(campaign.endDate, 'dd MMMM yyyy', { locale: fr })}`, margin, yPosition);
  
  yPosition += 7;
  doc.text(`Budget: ${campaign.budget.toLocaleString('fr-BE')} €`, margin, yPosition);
  
  yPosition += 7;
  const totalCost = placements.reduce((sum, p) => sum + p.finalPrice, 0);
  doc.text(`Coût total: ${totalCost.toLocaleString('fr-BE')} €`, margin, yPosition);
  
  yPosition += 15;

  // Placements table
  if (placements.length > 0) {
    doc.setFontSize(14);
    doc.text('Détail des emplacements:', margin, yPosition);
    yPosition += 10;

    // Table headers
    doc.setFontSize(10);
    doc.text('Publication', margin, yPosition);
    doc.text('Type/Position', margin + 50, yPosition);
    doc.text('Taille', margin + 100, yPosition);
    doc.text('Qté', margin + 130, yPosition);
    doc.text('Prix total', margin + 150, yPosition);
    
    yPosition += 5;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    placements.forEach((placement) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(placement.publication.substring(0, 20), margin, yPosition);
      doc.text(`${placement.adType} / ${placement.position}`.substring(0, 20), margin + 50, yPosition);
      doc.text(placement.size.substring(0, 15), margin + 100, yPosition);
      doc.text(placement.quantity.toString(), margin + 130, yPosition);
      doc.text(`${placement.finalPrice.toLocaleString('fr-BE')} €`, margin + 150, yPosition);
      
      yPosition += 7;
    });
  }

  // Footer
  yPosition += 15;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Exporté le ${format(new Date(), 'dd/MM/yyyy à HH:mm')} par ${exportedBy}`, margin, yPosition);

  // Save the PDF
  doc.save(`campagne-${campaign.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
}

export async function exportToExcel(campaign: Campaign, placements: Placement[], exportedBy: string) {
  const workbook = XLSX.utils.book_new();

  // Campaign summary sheet
  const campaignData = [
    ['Campagne', campaign.name],
    ['Client', campaign.client],
    ['Date de début', format(campaign.startDate, 'dd/MM/yyyy')],
    ['Date de fin', format(campaign.endDate, 'dd/MM/yyyy')],
    ['Budget', campaign.budget],
    ['Statut', campaign.status],
    ['Coût total', placements.reduce((sum, p) => sum + p.finalPrice, 0)],
    ['Nombre d\'emplacements', placements.length],
    ['Exporté par', exportedBy],
    ['Date d\'export', format(new Date(), 'dd/MM/yyyy HH:mm')],
  ];

  const campaignSheet = XLSX.utils.aoa_to_sheet(campaignData);
  XLSX.utils.book_append_sheet(workbook, campaignSheet, 'Résumé');

  // Placements details sheet
  if (placements.length > 0) {
    const placementsData = [
      [
        'Publication',
        'Type de publicité',
        'Position',
        'Taille',
        'Dates de diffusion',
        'Quantité',
        'Prix unitaire',
        'Prix total',
        'Remise (%)',
        'Prix final',
        'Notes'
      ],
      ...placements.map(placement => [
        placement.publication,
        placement.adType,
        placement.position,
        placement.size,
        placement.dates.map(d => format(d, 'dd/MM/yyyy')).join(', '),
        placement.quantity,
        placement.unitPrice,
        placement.totalPrice,
        placement.discount,
        placement.finalPrice,
        placement.notes || ''
      ])
    ];

    const placementsSheet = XLSX.utils.aoa_to_sheet(placementsData);
    
    // Auto-fit column widths
    const colWidths = [
      { wch: 20 }, // Publication
      { wch: 25 }, // Type
      { wch: 20 }, // Position
      { wch: 15 }, // Taille
      { wch: 30 }, // Dates
      { wch: 8 },  // Quantité
      { wch: 12 }, // Prix unitaire
      { wch: 12 }, // Prix total
      { wch: 10 }, // Remise
      { wch: 12 }, // Prix final
      { wch: 30 }  // Notes
    ];
    placementsSheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, placementsSheet, 'Emplacements');
  }

  // Financial summary sheet
  const publicationSummary = placements.reduce((acc, placement) => {
    if (!acc[placement.publication]) {
      acc[placement.publication] = { count: 0, total: 0 };
    }
    acc[placement.publication].count += 1;
    acc[placement.publication].total += placement.finalPrice;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const summaryData = [
    ['Publication', 'Nombre d\'emplacements', 'Coût total'],
    ...Object.entries(publicationSummary).map(([pub, data]) => [
      pub,
      data.count,
      data.total
    ]),
    ['', '', ''],
    ['TOTAL', placements.length, placements.reduce((sum, p) => sum + p.finalPrice, 0)]
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé financier');

  // Save the Excel file
  XLSX.writeFile(workbook, `campagne-${campaign.name.replace(/[^a-zA-Z0-9]/g, '-')}.xlsx`);
}

export function generateCampaignReport(campaign: Campaign, placements: Placement[]): ExportData {
  return {
    campaign,
    placements,
    exportDate: new Date(),
    exportedBy: 'Current User'
  };
}

export function calculateCampaignMetrics(placements: Placement[]) {
  const totalCost = placements.reduce((sum, p) => sum + p.finalPrice, 0);
  const totalImpressions = placements.reduce((sum, p) => sum + (p.quantity * p.dates.length), 0);
  const averageCPM = totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0;
  
  const publicationBreakdown = placements.reduce((acc, placement) => {
    if (!acc[placement.publication]) {
      acc[placement.publication] = { cost: 0, count: 0 };
    }
    acc[placement.publication].cost += placement.finalPrice;
    acc[placement.publication].count += 1;
    return acc;
  }, {} as Record<string, { cost: number; count: number }>);

  return {
    totalCost,
    totalImpressions,
    averageCPM,
    placementCount: placements.length,
    publicationBreakdown
  };
}