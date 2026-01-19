import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const getLeaveTypeLabel = (type) => {
  const labels = {
    'sick-leave': 'Sick Leave',
    'paid-leave': 'Paid Leave',
    'unpaid-leave': 'Unpaid Leave',
    'work-from-home': 'Work From Home'
  };
  return labels[type] || type;
};

export function exportToPDF(records, fileName = 'reports') {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('Attendance & Leave Reports', 14, 22);
  
  // Date range info
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 30);
  
  // Prepare table data
  const tableData = records.map(record => {
    if (record.type === 'attendance') {
      const report = record.data;
      const user = report.userId || {};
      const punchIn = new Date(report.punchInTime);
      const punchOut = report.punchOutTime ? new Date(report.punchOutTime) : null;
      const hours = punchOut 
        ? ((punchOut.getTime() - punchIn.getTime()) / (1000 * 60 * 60)).toFixed(2)
        : '-';
      
      return [
        format(record.date, 'MMM d, yyyy'),
        user.name || 'Unknown',
        'Attendance',
        format(punchIn, 'HH:mm:ss'),
        punchOut ? format(punchOut, 'HH:mm:ss') : '-',
        hours !== '-' ? `${hours}h` : '-',
        report.punchInLateReason || '-',
        report.punchOutEarlyReason || '-',
        punchOut ? 'Completed' : 'In Progress',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-'
      ];
    } else {
      const leave = record.data;
      const user = leave.userId || {};
      
      return [
        format(record.date, 'MMM d, yyyy'),
        user.name || 'Unknown',
        'Leave',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        getLeaveTypeLabel(leave.leaveType),
        leave.type === 'full-day' ? 'Full Day' : `Half Day (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`,
        `${format(new Date(leave.startDate), 'MMM d')} - ${format(new Date(leave.endDate), 'MMM d, yyyy')}`,
        leave.reason || '-',
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
        leave.reviewedBy?.name || '-',
        leave.rejectionReason || '-'
      ];
    }
  });
  
  // Table headers
  const headers = [
    ['Date', 'User', 'Record Type', 'Punch In', 'Punch Out', 'Hours', 'Late Reason', 'Early Reason', 'Status', 
     'Leave Type', 'Leave Duration', 'Leave Period', 'Leave Reason', 'Leave Status', 'Reviewed By', 'Rejection Reason']
  ];
  
  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [227, 154, 46] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 15 },
      5: { cellWidth: 30 },
      6: { cellWidth: 30 },
      7: { cellWidth: 20 },
      8: { cellWidth: 25 },
      9: { cellWidth: 25 },
      10: { cellWidth: 30 },
      11: { cellWidth: 40 },
      12: { cellWidth: 20 },
      13: { cellWidth: 25 },
      14: { cellWidth: 30 }
    }
  });
  
  doc.save(`${fileName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function exportToExcel(records, fileName = 'reports') {
  // Prepare data
  const excelData = records.map(record => {
    if (record.type === 'attendance') {
      const report = record.data;
      const user = report.userId || {};
      const punchIn = new Date(report.punchInTime);
      const punchOut = report.punchOutTime ? new Date(report.punchOutTime) : null;
      const hours = punchOut 
        ? ((punchOut.getTime() - punchIn.getTime()) / (1000 * 60 * 60)).toFixed(2)
        : '-';
      
      return {
        'Date': format(record.date, 'MMM d, yyyy'),
        'Record Type': 'Attendance',
        'User Name': user.name || '-',
        'User Email': user.email || '-',
        'Punch In': format(punchIn, 'HH:mm:ss'),
        'Punch Out': punchOut ? format(punchOut, 'HH:mm:ss') : '-',
        'Hours': hours !== '-' ? `${hours}h` : '-',
        'Late Reason': report.punchInLateReason || '-',
        'Early Reason': report.punchOutEarlyReason || '-',
        'Status': punchOut ? 'Completed' : 'In Progress',
        'Leave Type': '-',
        'Leave Duration': '-',
        'Leave Period': '-',
        'Leave Reason': '-',
        'Leave Status': '-',
        'Reviewed By': '-',
        'Rejection Reason': '-'
      };
    } else {
      const leave = record.data;
      const user = leave.userId || {};
      
      return {
        'Date': format(record.date, 'MMM d, yyyy'),
        'Record Type': 'Leave',
        'User Name': user.name || '-',
        'User Email': user.email || '-',
        'Punch In': '-',
        'Punch Out': '-',
        'Hours': '-',
        'Late Reason': '-',
        'Early Reason': '-',
        'Status': '-',
        'Leave Type': getLeaveTypeLabel(leave.leaveType),
        'Leave Duration': leave.type === 'full-day' ? 'Full Day' : `Half Day (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`,
        'Leave Period': `${format(new Date(leave.startDate), 'MMM d')} - ${format(new Date(leave.endDate), 'MMM d, yyyy')}`,
        'Leave Reason': leave.reason || '-',
        'Leave Status': leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
        'Reviewed By': leave.reviewedBy?.name || '-',
        'Rejection Reason': leave.rejectionReason || '-'
      };
    }
  });
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // Date
    { wch: 15 }, // Record Type
    { wch: 20 }, // User Name
    { wch: 25 }, // User Email
    { wch: 12 }, // Punch In
    { wch: 12 }, // Punch Out
    { wch: 10 }, // Hours
    { wch: 30 }, // Late Reason
    { wch: 30 }, // Early Reason
    { wch: 15 }, // Status
    { wch: 20 }, // Leave Type
    { wch: 25 }, // Leave Duration
    { wch: 30 }, // Leave Period
    { wch: 40 }, // Leave Reason
    { wch: 15 }, // Leave Status
    { wch: 20 }, // Reviewed By
    { wch: 30 }  // Rejection Reason
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');
  XLSX.writeFile(wb, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}
