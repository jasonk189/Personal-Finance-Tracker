from flask import Response
from models import Transaction
import csv
import io

def export_to_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Date', 'Type', 'Category', 'Description', 'Amount'])

    transactions = Transaction.query.all()
    for t in transactions:
        writer.writerow([t.date, t.type, t.category, t.description, t.amount])

    output.seek(0)
    return Response(output, mimetype='text/csv',
                    headers={"Content-Disposition": "attachment;filename=transactions.csv"})
