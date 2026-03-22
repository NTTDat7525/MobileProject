import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PaymentButton from "../app/screens/Create_qr";

describe("PaymentButton (React Native)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders button with correct text", () => {
    const { getByText } = render(<PaymentButton />);
    expect(getByText("Thanh toán VNPay")).toBeTruthy();
  });

  it("calls fetch and handles paymentUrl", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ paymentUrl: "http://vnpay.vn/payment" }),
      })
    );

    const { getByText } = render(<PaymentButton />);
    fireEvent.press(getByText("Thanh toán VNPay"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("shows alert when paymentUrl is missing", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
    global.alert = jest.fn();

    const { getByText } = render(<PaymentButton />);
    fireEvent.press(getByText("Thanh toán VNPay"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Không tạo được payment URL");
    });
  });

  it("shows alert when fetch throws error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));
    global.alert = jest.fn();

    const { getByText } = render(<PaymentButton />);
    fireEvent.press(getByText("Thanh toán VNPay"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Có lỗi xảy ra khi tạo thanh toán");
    });
  });
});