using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Payments
{
    public class PaymentService : IPaymentService
    {
        public Task<string> CreatePaymentUrlAsync(Guid orderId)
        {
            throw new NotImplementedException();
        }
    }
}
