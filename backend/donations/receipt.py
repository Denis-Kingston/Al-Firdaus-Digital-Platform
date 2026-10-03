import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_donation_receipt_pdf(donation):
    """Generates a PDF receipt for a completed donation and returns byte content."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "HeaderTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1b4332"),  # Islamic Deep Green
        alignment=1,  # Center
    )

    subtitle_style = ParagraphStyle(
        "HeaderSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#40916c"),
        alignment=1,
    )

    badge_style = ParagraphStyle(
        "Badge",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=16,
        textColor=colors.HexColor("#2d6a4f"),
        alignment=1,
    )

    cell_bold = ParagraphStyle("CellBold", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=11, leading=14)
    cell_normal = ParagraphStyle("CellNormal", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=14)

    elements = []

    # Title & Header
    elements.append(Paragraph("AL-FIRDAUS INSTITUTE & MOSQUE", title_style))
    elements.append(Paragraph("Digital Platform — Official Donation Receipt", subtitle_style))
    elements.append(Spacer(1, 0.15 * inch))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1b4332"), spaceAfter=15))

    # Receipt Info Table
    date_str = donation.created_at.strftime("%B %d, %Y - %H:%M EAT") if donation.created_at else "N/A"
    cause_name = donation.cause.title if donation.cause else "General Mosque & Institute Fund"

    data = [
        [Paragraph("Receipt Number:", cell_bold), Paragraph(f"<b>{donation.reference}</b>", cell_normal)],
        [Paragraph("Date & Time:", cell_bold), Paragraph(date_str, cell_normal)],
        [Paragraph("Donor Name:", cell_bold), Paragraph(donation.donor_name or "Anonymous Donor", cell_normal)],
        [Paragraph("Contact Phone:", cell_bold), Paragraph(donation.donor_phone or "N/A", cell_normal)],
        [Paragraph("Contact Email:", cell_bold), Paragraph(donation.donor_email or "N/A", cell_normal)],
        [Paragraph("Cause / Fund:", cell_bold), Paragraph(cause_name, cell_normal)],
        [Paragraph("Payment Channel:", cell_bold), Paragraph(donation.payment_method or "Selcom Pay", cell_normal)],
        [Paragraph("Payment Status:", cell_bold), Paragraph("<font color='#2d6a4f'><b>COMPLETED & VERIFIED</b></font>", cell_normal)],
        [Paragraph("Amount Paid:", cell_bold), Paragraph(f"<b>{donation.amount:,.2f} TZS</b>", cell_bold)],
    ]

    t = Table(data, colWidths=[2.2 * inch, 4.8 * inch])
    t.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8f9fa")),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#212529")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e9ecef")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#ced4da")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ])
    )

    elements.append(t)
    elements.append(Spacer(1, 0.25 * inch))

    # Stamp / Verification Box
    elements.append(Paragraph("<b>STATUS: PAID & OFFICIAL RECEIPT ISSUED</b>", badge_style))
    elements.append(Spacer(1, 0.2 * inch))

    footer_text = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#6c757d"),
        alignment=1,
    )
    elements.append(Paragraph("Jazakallahu Khayran for your generous contribution to Al-Firdaus Institute & Mosque.", footer_text))
    elements.append(Paragraph("This is a computer-generated receipt verified by Selcom Payment Gateway. No signature required.", footer_text))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
