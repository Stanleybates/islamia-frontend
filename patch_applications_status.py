#!/usr/bin/env python3
import shutil
from pathlib import Path

FILE_PATH = Path("src/controllers/paymentController.js")

OLD = "  const payment = await paymentModel.createPayment({ user_id: user ? user.id : null, amount, method, status: 'paid', transaction_id: transactionId });"

NEW = """  const payment = await paymentModel.createPayment({ user_id: user ? user.id : null, amount, method, status: 'paid', transaction_id: transactionId });

  // Mark the originating application as paid so admin dashboards reflect it
  await pool.query(
    `UPDATE applications SET status = 'Paid' WHERE email = $1 OR phone = $2`,
    [email, phoneNumber]
  );"""

def main():
    if not FILE_PATH.exists():
        print(f"ERROR: {FILE_PATH} not found. Run this from your backend project root.")
        return

    text = FILE_PATH.read_text()

    if NEW in text:
        print("Fix already applied. Nothing to do.")
        return

    if OLD not in text:
        print("ERROR: Could not find the expected line. Nothing was modified.")
        return

    backup_path = FILE_PATH.with_suffix(".js.bak2")
    shutil.copy(FILE_PATH, backup_path)
    print(f"Backup saved to {backup_path}")

    text = text.replace(OLD, NEW, 1)
    FILE_PATH.write_text(text)
    print(f"Patched {FILE_PATH} successfully.")

if __name__ == "__main__":
    main()
