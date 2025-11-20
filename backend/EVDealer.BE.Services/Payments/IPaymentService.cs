using NHibernate.Criterion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Payments
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentUrlAsync(Guid orderId);
    }
}
