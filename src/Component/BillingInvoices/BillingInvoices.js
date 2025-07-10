import React from 'react'
import styles from '../BillingInvoices/BillingInvoices.module.css'

const BillingInvoices = () => {
    const data = [
  {
    id: 1,
    time: '12:06pm',
    date: '28 May 2025',
    amount: '$119',
  },
  {
    id: 2,
    time: '11:06 am',
    date: '05 Apr 2025',
    amount: '$299',
  },
  {
    id: 3,
    time: '01:15 pm',
    date: '01 May 2025',
    amount: '$119',
  },
];
  return (
     <div className={styles.container}>
      <h3 className={styles.title}>Billing & Invoices</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Invoice Date</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((invoice, index) => (
            <tr key={invoice.id}>
              <td>{String(index + 1).padStart(2, '0')}</td>
              <td>
                <div className={styles.dateCell}>
                  <span className={styles.time}>{invoice.time}</span>
                  <br />
                  <span className={styles.date}>{invoice.date}</span>
                </div>
              </td>
              <td>
                <span className={styles.amount}>{invoice.amount}</span>
              </td>
              <td>
                <div className={styles.actionIcon}>
                  <img src='/svg/download-invoice.svg' alt='download-invoice'/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BillingInvoices
