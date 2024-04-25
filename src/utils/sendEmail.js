import nodemailer from 'nodemailer'

export const sendEmail = async(order) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'duonghp1991@gmail.com',
      pass: 'vgfc aaqi egcv luay'
    }
  })

  let bill_total = 0

  for (let index in order.productOrder) {
    bill_total += order.productOrder[index].totalPrice
  }

  const attactmentImg = order.productOrder.map(product => {
    return {
      filename: `${product.image}`,
      path: `http://localhost:5000/${product.image}`,
      cid: `image-${product.image}`
    }
  })

  const orderProductStr = order.productOrder.map(product => {
    return `<tr>
        <td style="border: 1px solid black;">${product.name}</td>
        <td style="border: 1px solid black;"><img src=${'cid:image-' + product.image} width="60px" /></td>
        <td style="border: 1px solid black;">${product.price.toLocaleString('it-IT', { style : 'currency', currency : 'VND' })}</td>
        <td style="border: 1px solid black;">${product.amount}</td>
        <td style="border: 1px solid black;">${product.totalPrice.toLocaleString('it-IT', { style : 'currency', currency : 'VND' })}</td>
      </tr>`
  })

  await transporter.sendMail({
    from: 'duonghp1991@gmail.com',
    to: 'duongnnfx21064@funix.edu.vn', //order.email
    subject: 'Order',
    text: 'Hello customer',
    html: `
      <div>
        <h3>Xin chào ${order.name}</h3>
        <p>Phone: ${order.phone}</p>
        <table style="border: 1px solid #000; border-collapse: collapse;">
          <thead>
            <td style="border: 1px solid black; font-weight: bold">Tên sản phẩm</td>
            <td style="border: 1px solid black; font-weight: bold">Hình ảnh</td>
            <td style="border: 1px solid black; font-weight: bold">Giá</td>
            <td style="border: 1px solid black; font-weight: bold">Số lượng</td>
            <td style="border: 1px solid black; font-weight: bold">Thành tiền</td>
          </thead>
          <tbody>
            ${orderProductStr}
          </tbody>
        </table>
        <p style="font-weight: bold; font-size: 24px;">Tổng thanh toán: ${bill_total.toLocaleString('it-IT', { style : 'currency', currency : 'VND' })}</p>
      </div>
    `,
    attachments: attactmentImg
  })
}
