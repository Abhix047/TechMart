import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  try {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true
    });
    
    // Set Colors
    const black = [15, 15, 15];
    const gray = [100, 100, 100];
    const borderGray = [230, 230, 230];

    // 1. OFFICIAL TECHMART LOGO DRAWING
    doc.setFillColor(black[0], black[1], black[2]);
    doc.roundedRect(20, 20, 10, 10, 2, 2, "F"); // Outer black box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(23, 23, 4, 4, 1, 1, "F"); // Inner white box
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text("TechMart", 33, 27.5);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("PREMIUM ELECTRONICS & ARCHIVE", 33, 31);

    // 2. INVOICE TITLE (High-End Editorial)
    doc.setFont("times", "normal");
    doc.setFontSize(36);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text("INVOICE", 190, 29, { align: "right" });

    // 3. HEADER META DATA (Grid Layout)
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.line(20, 42, 190, 42);

    // Left Column: Billed To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("BILLED TO:", 20, 52);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(order.user?.name || "Valued Customer", 20, 59);
    doc.setFontSize(9);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text(order.shippingAddress?.phone || "+91 00000 00000", 20, 64);
    doc.text(order.shippingAddress?.address || "Address details", 20, 69);
    doc.text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}`, 20, 74);

    // Right Column: Order Info
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER INFO:", 130, 52);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(`Ref No: #${(order._id || "N/A").toUpperCase().slice(-8)}`, 130, 59);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 130, 64);
    doc.text(`Status: ${order.isDelivered ? "DELIVERED" : "CONFIRMED"}`, 130, 69);

    doc.line(20, 82, 190, 82);

    // 4. ITEMS TABLE (Amazon/Luxury Hybrid)
    const items = order.orderItems || [];
    const tableData = items.map((item) => [
      item.name || "Unknown Product",
      item.qty || 1,
      `INR ${Number(item.price || 0).toLocaleString()}`,
      `INR ${(Number(item.price || 0) * Number(item.qty || 1)).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL"]],
      body: tableData,
      theme: "plain",
      headStyles: { 
        textColor: black, 
        fontSize: 8,
        fontStyle: "bold",
        halign: "left",
        cellPadding: { bottom: 5 }
      },
      styles: { 
        font: "times", 
        fontSize: 10,
        cellPadding: 8,
        textColor: [40, 40, 40],
        lineWidth: 0,
      },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      didDrawCell: (data) => {
        if (data.section === 'body') {
          doc.setDrawColor(245, 245, 245);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      }
    });

    // 5. SUMMARY SECTION (Right Aligned)
    let finalY = doc.lastAutoTable.finalY + 15;
    const summaryX = 190;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Subtotal", 140, finalY, { align: "right" });
    doc.text(`INR ${Number(order.itemsPrice || order.totalPrice || 0).toLocaleString()}`, summaryX, finalY, { align: "right" });

    finalY += 8;
    doc.text("Shipping & Handling", 140, finalY, { align: "right" });
    doc.text(`INR ${Number(order.shippingPrice || 0).toLocaleString()}`, summaryX, finalY, { align: "right" });

    finalY += 12;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(130, finalY - 5, 190, finalY - 5);

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text("Total Paid", 130, finalY + 5);
    doc.text(`INR ${Number(order.totalPrice || 0).toLocaleString()}`, summaryX, finalY + 5, { align: "right" });

    // 6. PAYMENT INFO & SIGNATURE (Footer Area)
    const bottomY = 245;
    
    // Payment Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PAYMENT INFORMATION", 20, bottomY);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text(`Mode of Payment: ${order.paymentMethod || "Online / Digital"}`, 20, bottomY + 7);


    // Signature Block (Handwritten Style)
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("times", "italic");
    doc.setFontSize(24);
    doc.text("Abhishek Kumar", 190, bottomY + 10, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("AUTHORIZED SIGNATURE", 190, bottomY + 16, { align: "right" });

    // Final Footer
    doc.setFontSize(8);
    doc.text("Thank you for your purchase. We value your partnership.", 105, 285, { align: "center" });

    // 7. TRIGGER DOWNLOAD
    doc.save(`TechMart_Invoice_${(order._id || "Order").slice(-6).toUpperCase()}.pdf`);
  } catch (error) {
    console.error("Critical Invoice Error:", error);
    alert("Invoice generation failed. Please try refreshing the page.");
  }
};
