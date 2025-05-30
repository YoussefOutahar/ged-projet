import os
from math import ceil
from io import BytesIO
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak

from flask import current_app

from utils import get_french_date, chunk_data

font_path = os.path.join('resources', 'fonts', 'Verdana.ttf')
pdfmetrics.registerFont(TTFont('Verdana', font_path))
    
def create_signature_tables(signature_data, styles):
    current_app.logger.debug("Creating signature tables")
    
    num_tables = ceil(len(signature_data) / 4)
    
    tables = []
    
    for table_num in range(num_tables):
        table_data = [['' for _ in range(2)] for _ in range(2)]
        
        top_center_style = ParagraphStyle(
            'TopCenterText',
            parent=styles['CenterText'],
            alignment=TA_CENTER,
            spaceAfter=6
        )
        
        for i in range(2):
            for j in range(2):
                signature_index = table_num * 4 + i * 2 + j
                if signature_index < len(signature_data):
                    table_data[i][j] = Paragraph(f"<u>{signature_data[signature_index]}</u>", top_center_style)
        
        table_width = 7.5 * inch
        col_width = table_width / 2
        
        table_height = 10 * inch
        row_height = table_height / 2

        signature_table = Table(table_data, 
                                colWidths=[col_width] * 2, 
                                rowHeights=[row_height] * 2)

        signature_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Verdana'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
        ]))

        tables.append(signature_table)
        
        if table_num < num_tables - 1:
            tables.append(PageBreak())

    return tables


def create_fiche_parapheur_pdf(data_entries, signature_data):
    current_app.logger.debug("Creating Fiche Parapheur PDF")
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CenterHeading', fontName='Verdana', fontSize=14, leading=16, alignment=TA_CENTER))
    styles.add(ParagraphStyle(name='NormalText', fontName='Verdana', fontSize=10, leading=12))
    styles.add(ParagraphStyle(name='CenterText', fontName='Verdana', fontSize=10, leading=12, alignment=TA_CENTER))

    elements = []
    
    current_date = get_french_date()

    header_data = [
        [Paragraph("<u>15-1-2024/DM/DPS/DMP/18</u>", styles['NormalText']), Paragraph(f"<u>Rabat le : {current_date}</u>", styles['NormalText'])]
    ]
    header_table = Table(header_data, colWidths=[4*inch, 3*inch])
    header_table.setStyle(TableStyle([('ALIGN', (0, 0), (0, 0), 'LEFT'), ('ALIGN', (1, 0), (1, 0), 'RIGHT')]))
    elements.append(header_table)
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("<u>FICHE PARAPHEUR</u>", styles['CenterHeading']))
    elements.append(Spacer(1, 12))
    
    chunked_data_entries = list(chunk_data(data_entries, 20))
    
    for index,chunk in enumerate(chunked_data_entries):
        table_data = [
            ["DESIGNATION", "N° / DATE\nENREGISTREMENT", "SOCIETE", "DESTINATAIRE"]
        ]
    
        for entry in chunk:
            table_data.append([
                Paragraph(entry['designation'], styles['CenterText']),
                Paragraph(entry['enregistrement'], styles['CenterText']),
                Paragraph(entry['societe'], styles['CenterText']),
                ""  # Keep DESTINATAIRE column empty for data rows
            ])
    
        destinataire_text = """MONSIEUR LE MINISTRE DE LA SANTE ET DE LA PROTECTION SOCIALE
            <br/><br/>
            S/C DE LA VOIE HIERARCHIQUE"""
        table_data[1][3] = Paragraph(destinataire_text, styles['CenterText'])
    
        
        total_entries = len(data_entries)
        table_data.append([Paragraph(f"Nombre total des CE / Parapheur : {total_entries}", styles['NormalText']), "", "", ""])
    
        available_height = 9 * inch
    
        header_height = 0.4 * inch
        data_row_height = 0.2 * inch
        total_row_height = 0.3 * inch
        num_data_rows = len(chunk)
    
        total_content_height = header_height + (num_data_rows * data_row_height) + total_row_height
        remaining_height = available_height - total_content_height
    
        if num_data_rows > 0:
            extra_height_per_row = remaining_height / num_data_rows
            data_row_height += extra_height_per_row
    
        row_heights = [header_height] + [data_row_height] * num_data_rows + [total_row_height]
    
        main_table = Table(table_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 3*inch], rowHeights=row_heights)
        main_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, 0), 0.5, colors.black),  # Grid for header row
            ('BOX', (0, 0), (-1, -1), 0.5, colors.black),  # Outer border
            ('LINEBELOW', (0, -2), (-1, -2), 0.5, colors.black),  # Line above total row
            ('LINEAFTER', (0, 0), (2, -1), 0.5, colors.black),  # Vertical lines between columns
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('ALIGN', (0, 1), (2, -2), 'LEFT'),  # Left align data in first three columns
            ('ALIGN', (3, 1), (3, -2), 'CENTER'),  # Center align DESTINATAIRE
            ('SPAN', (3, 1), (3, -2)),  # Span DESTINATAIRE column
            ('SPAN', (0, -1), (-1, -1)),  # Span the last row (Nombre total)
            ('FONTNAME', (0, 0), (-1, -1), 'Verdana'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),  # Light grey background for header
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
        ]))
    
        elements.append(main_table)
        
        elements.append(PageBreak())

    signature_tables = create_signature_tables(signature_data, styles)
    elements.extend(signature_tables)

    doc.build(elements)
    buffer.seek(0)
    return buffer