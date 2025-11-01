// Ghi chú: Đảm bảo bạn có đủ các using ở đầu file.
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Common.MLModels;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.ML;
using Microsoft.ML.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.AI
{
    // Ghi chú: Lớp chứa toàn bộ logic về AI, đã được nâng cấp để đảm bảo độ tin cậy và chuyên nghiệp.
    public class DemandForecastService : IDemandForecastService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MLContext _mlContext;
        private readonly ILogger<DemandForecastService> _logger;

        private readonly string _modelStoragePath = Path.Combine(AppContext.BaseDirectory, "AIModels");
        private readonly string _modelFilePath;
        private readonly string _modelScoreFilePath;

        public DemandForecastService(IUnitOfWork unitOfWork, ILogger<DemandForecastService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mlContext = new MLContext(seed: 0);

            Directory.CreateDirectory(_modelStoragePath);
            _modelFilePath = Path.Combine(_modelStoragePath, "DemandForecastModel.zip");
            _modelScoreFilePath = Path.Combine(_modelStoragePath, "ModelScore.txt");
        }

        // === PHƯƠNG THỨC CHÍNH ĐIỀU PHỐI TOÀN BỘ QUY TRÌNH ===
        public async Task RunDemandForecastProcessAsync()
        {
            _logger.LogInformation("Bắt đầu quy trình dự báo nhu cầu lúc {time}", DateTime.UtcNow);

            // BƯỚC 1: LẤY VÀ KIỂM TRA DỮ LIỆU HUẤN LUYỆN
            var trainingDataView = await GetTrainingDataViewAsync();
            if (trainingDataView == null || trainingDataView.GetRowCount() < 10) // Yêu cầu tối thiểu 10 bản ghi để học
            {
                _logger.LogWarning("Không đủ dữ liệu lịch sử để huấn luyện mô hình (cần ít nhất 10). Dừng quy trình.");
                return;
            }
            _logger.LogInformation("Đã có {count} bản ghi để huấn luyện.", trainingDataView.GetRowCount());

            // BƯỚC 2: HUẤN LUYỆN VÀ ĐÁNH GIÁ MÔ HÌNH MỚI
            _logger.LogInformation("Bắt đầu huấn luyện và đánh giá mô hình mới...");
            var (newModel, newModelMetrics) = TrainAndEvaluateModel(trainingDataView);
            // Ghi chú: RSquared là chỉ số đo độ phù hợp của mô hình, càng gần 1 càng tốt.
            _logger.LogInformation("Huấn luyện xong. Điểm RSquared của mô hình mới: {score}", newModelMetrics.RSquared);

            // BƯỚC 3: LỰA CHỌN MÔ HÌNH TỐT NHẤT ĐỂ SỬ DỤNG
            var bestModel = GetBestModel(newModel, newModelMetrics.RSquared);

            // BƯỚC 4: DÙNG MÔ HÌNH TỐT NHẤT ĐỂ DỰ BÁO VÀ LƯU KẾT QUẢ
            _logger.LogInformation("Bắt đầu tạo dự báo cho kỳ tiếp theo...");
            await GenerateAndSaveForecastsAsync(bestModel);

            _logger.LogInformation("Quy trình dự báo nhu cầu đã hoàn tất thành công lúc {time}", DateTime.UtcNow);
        }

        // --- CÁC PHƯƠNG THỨC HỖ TRỢ CHI TIẾT ---

        // Ghi chú: Phương thức này chịu trách nhiệm lấy dữ liệu từ CSDL và chuyển đổi thành định dạng IDataView.
        private async Task<IDataView?> GetTrainingDataViewAsync()
        {
            // Ghi chú: Lấy tất cả dữ liệu bán hàng đã hoàn thành trước thời điểm hiện tại.
            var historicalData = await _unitOfWork.Analytics.GetHistoricalSalesDataAsync(DateOnly.FromDateTime(DateTime.UtcNow));
            _logger.LogInformation("Đã tìm thấy {count} bản ghi OrderItem lịch sử để huấn luyện.", historicalData.Count());

            if (!historicalData.Any())
            {
                return null;
            }

            // Ghi chú: Chuyển đổi dữ liệu thô (List<OrderItem>) thành định dạng "thức ăn" cho AI (IEnumerable<SalesDataInput>).
            var formattedData = historicalData.Select(item => new SalesDataInput
            {
                Quantity = item.Quantity,
                Year = item.Order.OrderDate.Year,
                Month = item.Order.OrderDate.Month,
                Day = item.Order.OrderDate.Day,
                DayOfWeek = (float)item.Order.OrderDate.DayOfWeek,
                EncodedVehicleId = item.VehicleId,
                EncodedDealerId = item.Order.DealerId
            });

            return _mlContext.Data.LoadFromEnumerable(formattedData);
        }

        // Ghi chú: Huấn luyện, đánh giá và trả về mô hình cùng "điểm số" của nó (metrics).
        private (ITransformer model, RegressionMetrics metrics) TrainAndEvaluateModel(IDataView fullDataView)
        {
            var trainTestData = _mlContext.Data.TrainTestSplit(fullDataView, testFraction: 0.2, seed: 0);

            var pipeline = _mlContext.Transforms
                .Concatenate("Features", "Year", "Month", "DayOfWeek", "EncodedVehicleId", "EncodedDealerId")
                .Append(_mlContext.Regression.Trainers.FastTree(labelColumnName: "Quantity", featureColumnName: "Features"));

            var model = pipeline.Fit(trainTestData.TrainSet);
            var predictions = model.Transform(trainTestData.TestSet);
            var metrics = _mlContext.Regression.Evaluate(predictions, labelColumnName: "Quantity", scoreColumnName: "Score");

            return (model, metrics);
        }

        // Ghi chú: Lựa chọn giữa mô hình mới và mô hình cũ, và lưu phiên bản tốt hơn vào file.
        private ITransformer GetBestModel(ITransformer newModel, double newModelScore)
        {
            if (File.Exists(_modelFilePath) && File.Exists(_modelScoreFilePath))
            {
                var oldModelScoreText = File.ReadAllText(_modelScoreFilePath);
                if (double.TryParse(oldModelScoreText, out var oldModelScore) && newModelScore < oldModelScore)
                {
                    _logger.LogInformation("Mô hình mới (Score: {newScore}) không tốt hơn mô hình cũ (Score: {oldScore}). Giữ lại mô hình cũ.", newModelScore, oldModelScore);
                    return _mlContext.Model.Load(_modelFilePath, out _);
                }
            }

            _logger.LogInformation("Mô hình mới tốt hơn. Lưu phiên bản mới vào hệ thống.");
            _mlContext.Model.Save(newModel, null, _modelFilePath);
            File.WriteAllText(_modelScoreFilePath, newModelScore.ToString());
            return newModel;
        }

        // Ghi chú: Dùng mô hình tốt nhất để dự báo và lưu kết quả vào CSDL.
        private async Task GenerateAndSaveForecastsAsync(ITransformer model)
        {
            var predictionEngine = _mlContext.Model.CreatePredictionEngine<SalesDataInput, SalesPredictionOutput>(model);

            var today = DateTime.UtcNow;
            var firstDayOfNextMonth = new DateOnly(today.Year, today.Month, 1).AddMonths(1);
            var lastDayOfNextMonth = firstDayOfNextMonth.AddMonths(1).AddDays(-1);

            await _unitOfWork.DemandForecasts.ClearForecastsForPeriodAsync(firstDayOfNextMonth);

            var allVehicles = await _unitOfWork.Vehicles.GetAllBasicAsync();
            var allDealers = await _unitOfWork.Dealers.GetAllBasicAsync();

            var forecastsToSave = new List<DemandForecast>();

            foreach (var vehicle in allVehicles)
            {
                foreach (var dealer in allDealers)
                {
                    var inputForPrediction = new SalesDataInput
                    {
                        Year = firstDayOfNextMonth.Year,
                        Month = firstDayOfNextMonth.Month,
                        DayOfWeek = (float)firstDayOfNextMonth.DayOfWeek,
                        EncodedVehicleId = vehicle.VehicleId,
                        EncodedDealerId = dealer.DealerId
                    };

                    var prediction = predictionEngine.Predict(inputForPrediction);

                    forecastsToSave.Add(new DemandForecast
                    {
                        VehicleId = vehicle.VehicleId,
                        DealerId = dealer.DealerId,
                        ForecastPeriodStart = firstDayOfNextMonth,
                        ForecastPeriodEnd = lastDayOfNextMonth,
                        PredictedQuantity = (int)Math.Max(0, Math.Round(prediction.PredictedQuantity)),
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _unitOfWork.DemandForecasts.AddRangeAsync(forecastsToSave);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Đã lưu thành công {count} bản ghi dự báo mới vào CSDL.", forecastsToSave.Count);
        }

        // Ghi chú: Phương thức này được gọi bởi Controller để trả về kết quả cho người dùng.
        public async Task<IEnumerable<DemandForecastDto>> GetLatestForecastsAsync()
        {
            var forecastsFromDb = await _unitOfWork.DemandForecasts.GetLatestForecastsAsync();
            var forecastDtos = forecastsFromDb.Select(f => new DemandForecastDto
            {
                ForecastId = f.ForecastId,
                VehicleId = f.VehicleId,
                VehicleName = f.Vehicle.Model,
                DealerId = f.DealerId,
                DealerName = f.Dealer?.Name,
                ForecastPeriodStart = f.ForecastPeriodStart,
                ForecastPeriodEnd = f.ForecastPeriodEnd,
                PredictedQuantity = f.PredictedQuantity,
                CreatedAt = f.CreatedAt
            });
            return forecastDtos;
        }
    }
}