document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        Swal.fire({
            title: 'Chuyển trang!',
            text: `Bạn đã chọn: ${link.textContent}`,
            icon: 'info',
            confirmButtonText: 'Tiếp tục'
        }).then((result) => {
            if (result.isConfirmed) {
                // Chỉ thực hiện điều hướng sau khi người dùng bấm "Tiếp tục"
                window.location.href = '../pages/passenger.html';
            }
        });
    });
});

  // Dashboard: Cập nhật số liệu thống kê
  const stats = {
    totalPassengers: 2547,
    activeRoutes: 186,
    successRate: 87.5,
    todayRevenue: 847245
  };
  
  function updateDashboard() {
    document.querySelector('.card:nth-child(1) p').textContent = stats.totalPassengers;
    document.querySelector('.card:nth-child(2) p').textContent = stats.activeRoutes;
    document.querySelector('.card:nth-child(3) p').textContent = `${stats.successRate}%`;
    document.querySelector('.card:nth-child(4) p').textContent = `$${stats.todayRevenue.toLocaleString()}`;
  }
  
  document.addEventListener('DOMContentLoaded', updateDashboard);
  
  // Bảng Hành khách: Hiển thị chi tiết hành khách
  document.querySelectorAll('.table tbody a').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const customerName = link.closest('tr').querySelector('td:nth-child(2)').textContent;
      const route = link.closest('tr').querySelector('td:nth-child(3)').textContent;
      const status = link.closest('tr').querySelector('td:nth-child(4)').textContent;
      Swal.fire({
        title: 'Chi tiết hành khách',
        html: `<strong>Tên:</strong> ${customerName}<br>
               <strong>Tuyến:</strong> ${route}<br>
               <strong>Trạng thái:</strong> ${status}`,
        icon: 'info',
        confirmButtonText: 'Đóng'
      });
    });
  });
  
  // Hủy vé: Xác nhận hành động
  function confirmCancel(ticketID) {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn sắp hủy vé: ${ticketID}. Hành động này không thể hoàn tác!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vâng, hủy!',
      cancelButtonText: 'Không, giữ nguyên!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Đã hủy!',
          `Vé ${ticketID} đã được hủy thành công.`,
          'success'
        );
      }
    });
  }
  
  // Gán sự kiện hủy vé (ví dụ trên trạng thái "Đã hủy")
  document.querySelectorAll('.status.cancelled').forEach(status => {
    const ticketID = status.closest('tr').querySelector('td:nth-child(1)').textContent;
    status.addEventListener('click', () => confirmCancel(ticketID));
  });
  