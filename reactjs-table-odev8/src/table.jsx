import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function Table() {
  const [suppliers, setSuppliers] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    
    axios.get('https://northwind.vercel.app/api/suppliers')
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
      });
  }, []);

  const deleteSupplier = (id) => {
    var result = window.confirm('Silmek istediğinize emin misiniz???');
    if (result) {
      
      axios.delete(`https://northwind.vercel.app/api/suppliers/${id}`)
        .then((response) => {
          if (response.status === 200) {
            const updatedSuppliers = suppliers.filter((supplier) => supplier.id !== id);
            setSuppliers(updatedSuppliers);
          }
        })
        .catch((error) => {
          console.error('Silme hatası:', error);
        });
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedSuppliers = [...suppliers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSuppliers(sortedSuppliers);
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>Id</th>
            <th onClick={() => requestSort('companyName')}>Company Name</th>
            <th onClick={() => requestSort('contactName')}>Contact Name</th>
            <th onClick={() => requestSort('contactTitle')}>Contact Title</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.companyName}</td>
              <td>{supplier.contactName}</td>
              <td>{supplier.contactTitle}</td>
              <td>
                <button onClick={() => deleteSupplier(supplier.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default Table;
