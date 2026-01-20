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

export function exportToPDF(records, fileName = 'reports', visibleColumns = null, summary = null) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('Attendance & Leave Reports', 14, 22);
  
  // Date range info
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 30);
  
  // Define column mapping - order matters for data extraction
  const columnMap = [
    { id: 'date', label: 'Date', getValue: (record, type) => {
      if (type === 'attendance') return format(record.date, 'MMM d, yyyy');
      return format(record.date, 'MMM d, yyyy');
    }},
    { id: 'user', label: 'User', getValue: (record, type) => {
      const user = type === 'attendance' ? record.data.userId || {} : record.data.userId || {};
      return user.name || 'Unknown';
    }},
    { id: 'recordType', label: 'Record Type', getValue: (record, type) => {
      return type === 'attendance' ? 'Attendance' : 'Leave';
    }},
    { id: 'punchIn', label: 'Punch In', getValue: (record, type) => {
      if (type === 'attendance') {
        const punchIn = new Date(record.data.punchInTime);
        return format(punchIn, 'HH:mm:ss');
      }
      return '-';
    }},
    { id: 'punchOut', label: 'Punch Out', getValue: (record, type) => {
      if (type === 'attendance' && record.data.punchOutTime) {
        const punchOut = new Date(record.data.punchOutTime);
        return format(punchOut, 'HH:mm:ss');
      }
      return '-';
    }},
    { id: 'hours', label: 'Hours', getValue: (record, type) => {
      if (type === 'attendance' && record.data.punchOutTime) {
        const punchIn = new Date(record.data.punchInTime);
        const punchOut = new Date(record.data.punchOutTime);
        const hours = ((punchOut.getTime() - punchIn.getTime()) / (1000 * 60 * 60)).toFixed(2);
        return `${hours}h`;
      }
      return '-';
    }},
    { id: 'lateReason', label: 'Late Reason', getValue: (record, type) => {
      return type === 'attendance' ? (record.data.punchInLateReason || '-') : '-';
    }},
    { id: 'earlyReason', label: 'Early Reason', getValue: (record, type) => {
      return type === 'attendance' ? (record.data.punchOutEarlyReason || '-') : '-';
    }},
    { id: 'status', label: 'Status', getValue: (record, type) => {
      if (type === 'attendance') {
        return record.data.punchOutTime ? 'Completed' : 'In Progress';
      }
      return '-';
    }},
    { id: 'leaveType', label: 'Leave Type', getValue: (record, type) => {
      return type === 'leave' ? getLeaveTypeLabel(record.data.leaveType) : '-';
    }},
    { id: 'leaveDuration', label: 'Leave Duration', getValue: (record, type) => {
      if (type === 'leave') {
        const leave = record.data;
        return leave.type === 'full-day' ? 'Full Day' : `Half Day (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`;
      }
      return '-';
    }},
    { id: 'leavePeriod', label: 'Leave Period', getValue: (record, type) => {
      if (type === 'leave') {
        const leave = record.data;
        return `${format(new Date(leave.startDate), 'MMM d')} - ${format(new Date(leave.endDate), 'MMM d, yyyy')}`;
      }
      return '-';
    }},
    { id: 'leaveReason', label: 'Leave Reason', getValue: (record, type) => {
      return type === 'leave' ? (record.data.reason || '-') : '-';
    }},
    { id: 'leaveStatus', label: 'Leave Status', getValue: (record, type) => {
      return type === 'leave' ? (record.data.status.charAt(0).toUpperCase() + record.data.status.slice(1)) : '-';
    }},
    { id: 'reviewedBy', label: 'Reviewed By', getValue: (record, type) => {
      return type === 'leave' ? (record.data.reviewedBy?.name || '-') : '-';
    }},
    { id: 'rejectionReason', label: 'Rejection Reason', getValue: (record, type) => {
      return type === 'leave' ? (record.data.rejectionReason || '-') : '-';
    }}
  ];
  
  // Filter columns based on visibility (if provided, otherwise show all)
  const visibleColumnMap = visibleColumns 
    ? columnMap.filter(col => visibleColumns[col.id] === true)
    : columnMap;
  
  // Prepare table data with only visible columns
  const tableData = records.map(record => {
    const type = record.type;
    return visibleColumnMap.map(col => col.getValue(record, type));
  });
  
  // Table headers for visible columns only
  const headers = [visibleColumnMap.map(col => col.label)];
  
  // Calculate column widths dynamically
  const columnStyles = {};
  const baseWidth = 180 / visibleColumnMap.length; // Distribute width across visible columns
  visibleColumnMap.forEach((col, index) => {
    // Adjust width based on column type
    let width = baseWidth;
    if (col.id === 'date') width = 25;
    else if (col.id === 'user') width = 25;
    else if (col.id === 'recordType') width = 20;
    else if (col.id === 'punchIn' || col.id === 'punchOut') width = 18;
    else if (col.id === 'hours') width = 15;
    else if (col.id === 'lateReason' || col.id === 'earlyReason' || col.id === 'leaveReason') width = 30;
    else if (col.id === 'leavePeriod') width = 35;
    else if (col.id === 'rejectionReason') width = 30;
    else width = 20;
    
    columnStyles[index] = { cellWidth: width };
  });
  
  let startY = 35;
  
  // Add summary section if provided
  if (summary) {
    doc.setFontSize(12);
    doc.text('Summary', 14, startY);
    startY += 8;
    
    const summaryData = [
      ['Metric', 'Value'],
      ['Late Arrivals', summary.lateArrivals.toString()],
      ['Early Leaves', summary.earlyLeaves.toString()],
      ['Sick Leave', `${summary.sickLeave.toFixed(1)} days`],
      ['Paid Leave', `${summary.paidLeave.toFixed(1)} days`],
      ['Unpaid Leave', `${summary.unpaidLeave.toFixed(1)} days`],
      ['Work From Home', `${summary.workFromHome.toFixed(1)} days`]
    ];
    
    autoTable(doc, {
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: startY,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [100, 100, 100] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 50 }
      }
    });
    
    startY = doc.lastAutoTable.finalY + 10;
  }
  
  // Add main data table
  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 100, 100] }, // Neutral gray color instead of primary
    columnStyles: columnStyles
  });
  
  doc.save(`${fileName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function exportToExcel(records, fileName = 'reports', visibleColumns = null, summary = null) {
  // Define column mapping for Excel export
  const columnMap = [
    { id: 'date', label: 'Date', getValue: (record, type) => {
      return format(record.date, 'MMM d, yyyy');
    }},
    { id: 'user', label: 'User Name', getValue: (record, type) => {
      const user = type === 'attendance' ? record.data.userId || {} : record.data.userId || {};
      return user.name || 'Unknown';
    }},
    { id: 'userEmail', label: 'User Email', getValue: (record, type) => {
      const user = type === 'attendance' ? record.data.userId || {} : record.data.userId || {};
      return user.email || '-';
    }},
    { id: 'recordType', label: 'Record Type', getValue: (record, type) => {
      return type === 'attendance' ? 'Attendance' : 'Leave';
    }},
    { id: 'punchIn', label: 'Punch In', getValue: (record, type) => {
      if (type === 'attendance') {
        const punchIn = new Date(record.data.punchInTime);
        return format(punchIn, 'HH:mm:ss');
      }
      return '-';
    }},
    { id: 'punchOut', label: 'Punch Out', getValue: (record, type) => {
      if (type === 'attendance' && record.data.punchOutTime) {
        const punchOut = new Date(record.data.punchOutTime);
        return format(punchOut, 'HH:mm:ss');
      }
      return '-';
    }},
    { id: 'hours', label: 'Hours', getValue: (record, type) => {
      if (type === 'attendance' && record.data.punchOutTime) {
        const punchIn = new Date(record.data.punchInTime);
        const punchOut = new Date(record.data.punchOutTime);
        const hours = ((punchOut.getTime() - punchIn.getTime()) / (1000 * 60 * 60)).toFixed(2);
        return `${hours}h`;
      }
      return '-';
    }},
    { id: 'lateReason', label: 'Late Reason', getValue: (record, type) => {
      return type === 'attendance' ? (record.data.punchInLateReason || '-') : '-';
    }},
    { id: 'earlyReason', label: 'Early Reason', getValue: (record, type) => {
      return type === 'attendance' ? (record.data.punchOutEarlyReason || '-') : '-';
    }},
    { id: 'status', label: 'Status', getValue: (record, type) => {
      if (type === 'attendance') {
        return record.data.punchOutTime ? 'Completed' : 'In Progress';
      }
      return '-';
    }},
    { id: 'leaveType', label: 'Leave Type', getValue: (record, type) => {
      return type === 'leave' ? getLeaveTypeLabel(record.data.leaveType) : '-';
    }},
    { id: 'leaveDuration', label: 'Leave Duration', getValue: (record, type) => {
      if (type === 'leave') {
        const leave = record.data;
        return leave.type === 'full-day' ? 'Full Day' : `Half Day (${leave.halfDayType === 'first-half' ? 'First Half' : 'Second Half'})`;
      }
      return '-';
    }},
    { id: 'leavePeriod', label: 'Leave Period', getValue: (record, type) => {
      if (type === 'leave') {
        const leave = record.data;
        return `${format(new Date(leave.startDate), 'MMM d')} - ${format(new Date(leave.endDate), 'MMM d, yyyy')}`;
      }
      return '-';
    }},
    { id: 'leaveReason', label: 'Leave Reason', getValue: (record, type) => {
      return type === 'leave' ? (record.data.reason || '-') : '-';
    }},
    { id: 'leaveStatus', label: 'Leave Status', getValue: (record, type) => {
      return type === 'leave' ? (record.data.status.charAt(0).toUpperCase() + record.data.status.slice(1)) : '-';
    }},
    { id: 'reviewedBy', label: 'Reviewed By', getValue: (record, type) => {
      return type === 'leave' ? (record.data.reviewedBy?.name || '-') : '-';
    }},
    { id: 'rejectionReason', label: 'Rejection Reason', getValue: (record, type) => {
      return type === 'leave' ? (record.data.rejectionReason || '-') : '-';
    }}
  ];
  
  // Filter columns based on visibility (if provided, otherwise show all)
  // For Excel, we always include userEmail if user is visible, and handle user column separately
  let visibleColumnMap = visibleColumns 
    ? columnMap.filter(col => {
        if (col.id === 'userEmail') {
          // Include email if user column is visible (for admin reports)
          return visibleColumns['user'] === true;
        }
        return visibleColumns[col.id] === true;
      })
    : columnMap;
  
  // Prepare data with only visible columns
  const excelData = records.map(record => {
    const type = record.type;
    const row = {};
    visibleColumnMap.forEach(col => {
      row[col.label] = col.getValue(record, type);
    });
    return row;
  });
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Calculate number of columns needed
  const numCols = visibleColumnMap.length;
  
  // Helper function to pad row to required column count
  const padRow = (row) => {
    const padded = [...row];
    while (padded.length < numCols) {
      padded.push('');
    }
    return padded;
  };
  
  // Prepare complete worksheet data array
  const worksheetData = [];
  
  // Add summary section if provided
  if (summary && typeof summary === 'object') {
    // Ensure summary has all required properties with defaults
    const safeSummary = {
      lateArrivals: summary.lateArrivals || 0,
      earlyLeaves: summary.earlyLeaves || 0,
      sickLeave: summary.sickLeave || 0,
      paidLeave: summary.paidLeave || 0,
      unpaidLeave: summary.unpaidLeave || 0,
      workFromHome: summary.workFromHome || 0
    };
    
    // Add summary rows (all padded to numCols)
    worksheetData.push(padRow(['Summary']));
    worksheetData.push(padRow([]));
    worksheetData.push(padRow(['Metric', 'Value']));
    worksheetData.push(padRow(['Late Arrivals', safeSummary.lateArrivals]));
    worksheetData.push(padRow(['Early Leaves', safeSummary.earlyLeaves]));
    worksheetData.push(padRow(['Sick Leave', `${safeSummary.sickLeave.toFixed(1)} days`]));
    worksheetData.push(padRow(['Paid Leave', `${safeSummary.paidLeave.toFixed(1)} days`]));
    worksheetData.push(padRow(['Unpaid Leave', `${safeSummary.unpaidLeave.toFixed(1)} days`]));
    worksheetData.push(padRow(['Work From Home', `${safeSummary.workFromHome.toFixed(1)} days`]));
    worksheetData.push(padRow([]));
    worksheetData.push(padRow([]));
  }
  
  // Add headers
  const headers = visibleColumnMap.map(col => col.label);
  worksheetData.push(headers);
  
  // Add data rows
  excelData.forEach(row => {
    const dataRow = visibleColumnMap.map(col => row[col.label]);
    worksheetData.push(dataRow);
  });
  
  // Create worksheet from complete data
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths for data columns
  const colWidths = visibleColumnMap.map(col => {
    if (col.id === 'date') return { wch: 15 };
    else if (col.id === 'user' || col.id === 'userEmail') return { wch: 25 };
    else if (col.id === 'recordType') return { wch: 15 };
    else if (col.id === 'punchIn' || col.id === 'punchOut') return { wch: 12 };
    else if (col.id === 'hours') return { wch: 10 };
    else if (col.id === 'lateReason' || col.id === 'earlyReason' || col.id === 'leaveReason') return { wch: 30 };
    else if (col.id === 'leavePeriod') return { wch: 35 };
    else if (col.id === 'rejectionReason') return { wch: 30 };
    else return { wch: 20 };
  });
  
  // If summary exists, merge the title row and set column widths
  if (summary && typeof summary === 'object') {
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } } // Merge summary title row across all columns
    ];
  }
  
  // Set column widths
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');
  XLSX.writeFile(wb, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}
