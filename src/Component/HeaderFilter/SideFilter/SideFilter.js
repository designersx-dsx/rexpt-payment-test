import React from 'react'
import styles from './SideFilter.module.css'

function SideFilter() {
  return (
    <div>
 <div className={styles.OffcanvasMain} style={{ padding: '20px' }}>
          <h3>Filter by</h3>
          <hr></hr>

          <input type="search" placeholder="Search..." style={{ width: '100%', padding: '10px', marginBottom: '20px' }} />
         

<div className={styles.section}>
        <div className={styles.label}>Lead Type</div>
        <label className={styles.checkbox}>Dynamic
          <input type="checkbox" />
          
        </label>
        <label className={styles.checkbox}>
            Dynamic
          <input type="checkbox" />
        </label>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>Channel</div>
        <label className={styles.radio}>
            Web widget
          <input type="radio" name="channel" />
          
        </label>
        <label className={styles.radio}>
            Phone number
          <input type="radio" name="channel" />
          
        </label>
        <label className={styles.radio}>
            All
          <input type="radio" name="channel" />
        </label>
      </div>

<hr></hr>

      <div className={styles.actions}>
        <button className={styles.clear}>Clear All</button>
        <button className={styles.apply}>Apply</button>
      </div>



        </div>


    </div>
  )
}

export default SideFilter