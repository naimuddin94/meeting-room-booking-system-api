import httpStatus from 'http-status';
import { ApiResponse, asyncHandler } from '../../utils';
import { PaymentService } from './payment.service';

const getPaymentKey = asyncHandler(async (req, res) => {
  const { price } = req.body;
  const result = await PaymentService.generatePaymentKey(price);
  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(
        httpStatus.OK,
        result,
        'Payment key retrieved successfully',
      ),
    );
});

export const PaymentController = {
  getPaymentKey,
};
