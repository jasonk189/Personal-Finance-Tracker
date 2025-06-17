from flask import Blueprint, request, jsonify
from models import db, Transaction

bp = Blueprint('api', __name__)

# GET all transactions
@bp.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([
        {
            'id': t.id,
            'date': t.date,
            'type': t.type,
            'category': t.category,
            'description': t.description,
            'amount': t.amount
        }
        for t in transactions
    ])


# POST a new transaction
@bp.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    try:
        new_transaction = Transaction(
            date=data.get('date'),
            type=data.get('type'),
            category=data.get('category'),
            description=data.get('description'),
            amount=float(data.get('amount'))
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({"message": "Transaction added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# DELETE a transaction by ID
@bp.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted"})

# PUT to update a transaction by ID
@bp.route('/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    t = Transaction.query.get_or_404(id)
    data = request.get_json()

    t.date = data.get('date', t.date)
    t.type = data.get('type', t.type)
    t.category = data.get('category', t.category)
    t.description = data.get('description', t.description)
    t.amount = data.get('amount', t.amount)

    db.session.commit()
    return jsonify({"message": "Transaction updated"})
