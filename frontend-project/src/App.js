import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash ,faCircleChevronRight,faAnglesRight,faCircleChevronLeft,faAnglesLeft} from '@fortawesome/free-solid-svg-icons';
import './App.css';

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function App() {
  const [adminData, setAdminData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState({});
  const rowsPerPage = 10;

  const formatRole = (role) => {
    return capitalizeFirstLetter(role);
  }

  const dataAdmin = async () => {
    const res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    const data = await res.json();
    setAdminData(data);
    setFilteredData(data);
  };

  useEffect(() => {
    dataAdmin();
  }, []);


  useEffect(() => {
    const filteredResults = adminData.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [searchTerm, adminData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleEdit = (row) => {
    setIsEditing(true);
    setEditedRow(row);
  };

  const deleteRow = (id) => {
    setAdminData((prevData) => prevData.filter((admin) => admin.id !== id));
    setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((rowId) => rowId !== id));
  };

  // Delete selected rows
  const deleteSelectedRows = () => {
    setAdminData((prevData) => prevData.filter((admin) => !selectedRows.includes(admin.id)));
    setSelectedRows([]);
  };

  const toggleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    setSelectedRows(prevSelectedRows =>
      selectAll
        ? [] // If selectAll is true, deselect all rows
        : currentRows.map(admin => admin.id) // If selectAll is false, select all current displayed rows
    );
  };

  return (
    <div className="App">
      <h1>Admin UI</h1>
      <Container>
        <form>
          <InputGroup className="my-5">
            <Form.Control
              placeholder="search by name, email or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </form>
        <Table className="mt-3">
          <thead>
            <tr>
            <th>
                <Form.Check
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((admin) => (
              <tr key={admin.id} className={selectedRows.includes(admin.id) ? 'selected' : ''}>
                <td>
                  <Form.Check
                    type="checkbox"
                    onChange={() => toggleRowSelection(admin.id)}
                    checked={selectedRows.includes(admin.id)}
                  />
                </td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{formatRole(admin.role)}</td>
                <td>
                  <button onClick={() => handleEdit(admin)} > <FontAwesomeIcon icon={faPenToSquare} /></button>{' '}
                  <button onClick={() => deleteRow(admin.id)}> <FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className='delete'>
          <div >
            <Button variant="danger" onClick={deleteSelectedRows} disabled={selectedRows.length === 0}>
              Delete Selected
        </Button>
          </div>
        <div className="pagination">
        
          <Button variant="light" onClick={(e) => handlePageChange(1)} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
          <Button variant="light" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faCircleChevronLeft} />
          </Button>
          <Button variant="light" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <FontAwesomeIcon icon={faCircleChevronRight} />
          </Button>
          <Button variant="light" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        </div>
      </div>
      </Container>
    </div>
  );
}

export default App;
