import React from 'react'
import { Button, Card } from 'react-bootstrap'

const Order = ({order}) => {

    
    return (
        <Card className="mt-3">
                     
            <Card.Body>
              
            <div class="row justify-content-between align-items-center">
                <div class="col-md">
                  <h5>Order Details: #{order.ordernum}</h5>
                    <p class="fs--1">{order.date}</p>
                    <div><strong class="me-2">Status: </strong>
                        <div class="badge rounded-pill badge-soft-success fs--2">{order.status}<span class="fas fa-check ms-1" data-fa-transform="shrink-2"></span></div>
                    </div>
                </div>
                <div class="col-auto">
                  <button class="btn btn-falcon-default btn-sm me-1 mb-2 mb-sm-0" type="button"><span class="fas fa-arrow-down me-1"> </span>Download (.pdf)</button>
                </div>
              </div>
            </Card.Body>
        </Card>
    )
}
const QRCode = ({ code }) => {
    return (
        <Card className="mt-3">
            <Card.Body>
                 <h5>QR Code</h5>
            </Card.Body>
        </Card>
    )
}

const Item = ({item}) => {
    return (
        <tr class="border-200">
            <td class="align-middle">
            <h6 class="mb-0 text-nowrap">{item.name}</h6>
            <p class="mb-0">{item.details}</p>
            </td>
            <td class="align-middle text-center">{item.quantity}</td>
            <td class="align-middle text-end">{item.rate}</td>
            <td class="align-middle text-end">{item.amount}</td>
        </tr>
    )
}
const OrderItems = ({order}) => {
    const items = [
        { name: "Platinum web package", rate: "%6.9", amount: "$69", details: "these are the detials", quantity: "10"},
        { name: "Platinum web package", rate: "%6.9", amount: "$69", details: "these are the detials", quantity: "10" },
        { name: "Platinum web package", rate: "%6.9", amount: "$69", details: "these are the detials", quantity: "10" },
        { name: "Platinum web package", rate: "%6.9", amount: "$69", details: "these are the detials", quantity: "10" },
        { name: "Platinum web package", rate: "%6.9", amount: "$69", details: "these are the detials", quantity: "10" },
    ]
    return (
        <Card className="mt-3">    
            <Card.Body className="">
              <div class="table-responsive fs--1">
                <table class="table table-striped border-bottom">
                  <thead class="bg-200 text-900">
                    <tr>
                      <th class="border-0">Products</th>
                      <th class="border-0 text-center">Quantity</th>
                      <th class="border-0 text-end">Rate</th>
                      <th class="border-0 text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                        {items.map(item => (<Item item={item}></Item>))}
                  </tbody>
                </table>
             </div>
            {/*we will use order.attribute to ge ttotal subtotal and other things here*/}
              <div class="row g-0 justify-content-end">
                <div class="col-auto">
                  <table class="table table-sm table-borderless fs--1 text-end">
                    <tr>
                      <th class="text-900">Subtotal:</th>
                      <td class="fw-semi-bold">$6,230.00 </td>
                    </tr>
                    <tr>
                      <th class="text-900">Tax 5%:</th>
                      <td class="fw-semi-bold">$311.50</td>
                    </tr>
                    <tr class="border-top">
                      <th class="text-900">Total:</th>
                      <td class="fw-semi-bold">$6541.50</td>
                    </tr>
                  </table>
                </div>
              </div>
            </Card.Body>
        </Card>
    )
}

export const OrderDetails = () => {
    const order = { ordernum: "196", date: "26/04/2019", price: "$69", address: "Ashley Kirlin, 43304 Prosacco Shore South Dejuanfurt, MO 18623-0505", type: "Link Road", status: "completed", email: "ashley@example.com", name: "Ashley Kirlin" }

    return (
        <>
            <Order order={order} />
            <QRCode />
            <OrderItems order={order} />
        </>
    )
}