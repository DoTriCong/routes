document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('.booking-table tbody');
    const searchInput = document.querySelector('.booking-controls input');
    const filters = document.querySelectorAll('.booking-controls select');
    const addButton = document.querySelector('.btn-add');
    const pagination = document.querySelector('.pagination');
    const rowsPerPage = 2;
    let currentPage = 1;
  
    let passengers = JSON.parse(localStorage.getItem('passengers')) || [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        ticket: '#VE12345',
        route: 'TP HCM - Đà Lạt',
        date: '2025-04-25',
        status: 'Đã thanh toán'
      },
      {
        id: 2,
        name: 'Trần Thị B',
        phone: '0987654321',
        ticket: '#VE12346',
        route: 'Hà Nội - Hải Phòng',
        date: '2025-04-26',
        status: 'Chưa thanh toán'
      }
    ];
  
    function saveToLocalStorage() {
      localStorage.setItem('passengers', JSON.stringify(passengers));
    }
    document.querySelector('.sidebar a[href="#"]').addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../pages/admin.html';
    });
    function renderTable() {
      tbody.innerHTML = '';
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const paginatedPassengers = passengers.slice(start, end);
  
      paginatedPassengers.forEach(passenger => {
        const row = `
          <tr>
            <td>${passenger.id}</td>
            <td>
              <div class="customer-info">
                <img src="https://i.pravatar.cc/40?img=${passenger.id}" alt="avatar">
                <div>
                  <strong>${passenger.name}</strong><br>
                  <small>${passenger.phone}</small>
                </div>
              </div>
            </td>
            <td>${passenger.ticket}</td>
            <td>${passenger.route}</td>
            <td>${passenger.date}</td>
            <td><span class="badge ${passenger.status === 'Đã thanh toán' ? 'paid' : 'unpaid'}">${passenger.status}</span></td>
            <td>
              <button class="action-btn edit" data-id="${passenger.id}">✏️</button>
              <button class="action-btn delete" data-id="${passenger.id}">🗑️</button>
            </td>
          </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
      });
  
      renderPagination();
      attachEditDeleteEvents();
    }
  
    function renderPagination() {
      pagination.innerHTML = '';
      const totalPages = Math.ceil(passengers.length / rowsPerPage);
  
      const prevBtn = `<button ${currentPage === 1 ? 'disabled' : ''} class="page-btn" data-page="${currentPage - 1}">Previous</button>`;
      pagination.insertAdjacentHTML('beforeend', prevBtn);
  
      for (let i = 1; i <= totalPages; i++) {
        const btn = `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        pagination.insertAdjacentHTML('beforeend', btn);
      }
  
      const nextBtn = `<button ${currentPage === totalPages ? 'disabled' : ''} class="page-btn" data-page="${currentPage + 1}">Next</button>`;
      pagination.insertAdjacentHTML('beforeend', nextBtn);
  
      document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', () => {
          const page = parseInt(button.getAttribute('data-page'));
          if (!isNaN(page)) {
            currentPage = page;
            renderTable();
          }
        });
      });
    }
  
    searchInput.addEventListener('input', () => {
      const searchValue = searchInput.value.toLowerCase();
      document.querySelectorAll('.booking-table tbody tr').forEach(row => {
        const customerName = row.querySelector('td:nth-child(2) strong').textContent.toLowerCase();
        row.style.display = customerName.includes(searchValue) ? '' : 'none';
      });
    });
  
    filters.forEach(filter => {
      filter.addEventListener('change', () => {
        const routeValue = filters[0].value;
        const statusValue = filters[1].value.toLowerCase();
        document.querySelectorAll('.booking-table tbody tr').forEach(row => {
          const route = row.querySelector('td:nth-child(4)').textContent;
          const status = row.querySelector('td:nth-child(6) .badge').textContent.toLowerCase();
          const matchesRoute = routeValue === 'Tất cả chuyến' || route.includes(routeValue);
          const matchesStatus = statusValue === 'tất cả trạng thái' || status.includes(statusValue);
  
          row.style.display = matchesRoute && matchesStatus ? '' : 'none';
        });
      });
    });
  
    addButton.addEventListener('click', () => {
      Swal.fire({
        title: 'Thêm khách hàng mới',
        html: `
          <input id="customer-name" class="swal2-input" placeholder="Tên khách hàng">
          <input id="customer-phone" class="swal2-input" placeholder="Số điện thoại">
          <input id="ticket-code" class="swal2-input" placeholder="Mã vé">
          <input id="route" class="swal2-input" placeholder="Tuyến">
          <input id="travel-date" type="date" class="swal2-input">
          <select id="status" class="swal2-input">
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chưa thanh toán">Chưa thanh toán</option>
          </select>
        `,
        confirmButtonText: 'Thêm',
        showCancelButton: true,
        preConfirm: () => {
          const name = document.getElementById('customer-name').value.trim();
          const phone = document.getElementById('customer-phone').value.trim();
          const ticket = document.getElementById('ticket-code').value.trim();
          const route = document.getElementById('route').value.trim();
          const date = document.getElementById('travel-date').value;
          const status = document.getElementById('status').value;
  
          if (!name || !phone || !ticket || !route || !date) {
            Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin!');
          }
  
          return { name, phone, ticket, route, date, status };
        }
      }).then(result => {
        if (result.isConfirmed) {
          const newPassenger = {
            id: passengers.length + 1,
            ...result.value
          };
          passengers.push(newPassenger);
          saveToLocalStorage();
          renderTable();
          Swal.fire('Thành công!', 'Khách hàng mới đã được thêm.', 'success');
        }
      });
    });
  
    function attachEditDeleteEvents() {
      document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', (event) => {
          const id = parseInt(event.target.getAttribute('data-id'));
          const passenger = passengers.find(p => p.id === id);
  
          Swal.fire({
            title: 'Chỉnh sửa thông tin khách hàng',
            html: `
              <input id="edit-name" class="swal2-input" value="${passenger.name}">
              <input id="edit-phone" class="swal2-input" value="${passenger.phone}">
              <input id="edit-ticket" class="swal2-input" value="${passenger.ticket}">
              <input id="edit-route" class="swal2-input" value="${passenger.route}">
              <input id="edit-date" type="date" class="swal2-input" value="${passenger.date}">
              <select id="edit-status" class="swal2-input">
                <option value="Đã thanh toán" ${passenger.status === 'Đã thanh toán' ? 'selected' : ''}>Đã thanh toán</option>
                <option value="Chưa thanh toán" ${passenger.status === 'Chưa thanh toán' ? 'selected' : ''}>Chưa thanh toán</option>
              </select>
            `,
            confirmButtonText: 'Lưu',
            showCancelButton: true,
            preConfirm: () => {
              const name = document.getElementById('edit-name').value.trim();
              const phone = document.getElementById('edit-phone').value.trim();
              const ticket = document.getElementById('edit-ticket').value.trim();
              const route = document.getElementById('edit-route').value.trim();
              const date = document.getElementById('edit-date').value;
              const status = document.getElementById('edit-status').value;
  
              if (!name || !phone || !ticket || !route || !date) {
                Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin!');
              }
  
              return { name, phone, ticket, route, date, status };
            }
          }).then(result => {
            if (result.isConfirmed) {
              Object.assign(passenger, result.value);
              saveToLocalStorage();
              renderTable();
              Swal.fire('Thành công!', 'Thông tin khách hàng đã được cập nhật.', 'success');
            }
          });
        });
      });
  
      document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', (event) => {
          const id = parseInt(event.target.getAttribute('data-id'));
          const passenger = passengers.find(p => p.id === id);
  
          Swal.fire({
            title: 'Xóa khách hàng',
            text: `Bạn có chắc chắn muốn xóa ${passenger.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
          }).then(result => {
            if (result.isConfirmed) {
              passengers = passengers.filter(p => p.id !== id);
              saveToLocalStorage();
              renderTable();
              Swal.fire('Thành công!', 'Khách hàng đã được xóa.', 'success');
            }
          });
        });
      });
    }
  
    renderTable();
  });