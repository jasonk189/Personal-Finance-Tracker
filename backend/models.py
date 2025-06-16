from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String)
    type = db.Column(db.String)
    category = db.Column(db.String)
    description = db.Column(db.String)
    amount = db.Column(db.Float)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "type": self.type,
            "category": self.category,
            "description": self.description,
            "amount": self.amount
        }
