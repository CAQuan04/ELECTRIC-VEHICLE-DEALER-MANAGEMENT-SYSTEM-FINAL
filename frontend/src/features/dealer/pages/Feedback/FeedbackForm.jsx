import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  MessageSquarePlus,
  Edit,
  Save,
  X,
  User,
  MessageSquare,
  AlertTriangle,
  FileText,
  ShoppingCart,
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

// Import components
import {
  PageContainer,
  PageHeader,
  Button,
  FormGroup,
  Label,
  Input,
  Select,
  InfoSection,
  ActionBar
} from '../../components';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const { feedbackId } = useParams();
  const { startLoading, stopLoading } = usePageLoading();
  
  const isEditMode = !!feedbackId;

  const [formData, setFormData] = useState({
    customerId: '',
    type: 'Positive',
    content: '',
    relatedOrderId: '',
    status: 'Pending',
    note: ''
  });

  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Type options
  const typeOptions = [
    { value: 'Positive', label: '👍 Tích cực' },
    { value: 'Negative', label: '👎 Tiêu cực' },
    { value: 'Complaint', label: '⚠️ Khiếu nại' }
  ];

  // Status options (for edit mode)
  const statusOptions = [
    { value: 'Pending', label: '⏳ Chờ xử lý' },
    { value: 'InProgress', label: '⚙️ Đang xử lý' },
    { value: 'Resolved', label: '✅ Đã giải quyết' }
  ];

  useEffect(() => {
    loadCustomers();
    if (isEditMode) {
      loadFeedbackData();
    }
  }, [feedbackId]);

  const loadCustomers = async () => {
    try {
      const result = await dealerAPI.getCustomers();
      if (result.success) {
        // Ensure data is an array
        setCustomers(Array.isArray(result.data) ? result.data : []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    }
  };

  const loadFeedbackData = async () => {
    try {
      startLoading('Đang tải thông tin phản hồi...');
      
      const result = await dealerAPI.getFeedbackById(feedbackId);
      
      if (result.success && result.data) {
        const feedback = result.data;
        setFormData({
          customerId: feedback.customerId || '',
          type: feedback.type || 'Positive',
          content: feedback.content || '',
          relatedOrderId: feedback.relatedOrderId || '',
          status: feedback.status || 'Pending',
          note: feedback.note || ''
        });
      } else {
        notifications.error('Lỗi', result.message || 'Không thể tải thông tin phản hồi');
        navigate('/dealer/feedback');
      }
    } catch (error) {
      console.error('Error loading feedback data:', error);
      notifications.error('Lỗi', 'Không thể tải thông tin phản hồi');
      navigate('/dealer/feedback');
    } finally {
      stopLoading();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer validation
    if (!formData.customerId) {
      newErrors.customerId = 'Vui lòng chọn khách hàng';
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Vui lòng chọn loại phản hồi';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notifications.warning('Validation', 'Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setIsSubmitting(true);
      startLoading(isEditMode ? 'Đang cập nhật...' : 'Đang tạo phản hồi...');

      // Prepare data
      const submitData = {
        customerId: parseInt(formData.customerId),
        type: formData.type,
        content: formData.content,
        relatedOrderId: formData.relatedOrderId ? parseInt(formData.relatedOrderId) : null
      };

      // Add status and note for edit mode
      if (isEditMode) {
        submitData.status = formData.status;
        submitData.note = formData.note;
      }

      let result;
      if (isEditMode) {
        result = await dealerAPI.updateFeedback(feedbackId, submitData);
      } else {
        result = await dealerAPI.createFeedback(submitData);
      }

      if (result.success) {
        notifications.success(
          'Thành công', 
          isEditMode ? 'Cập nhật phản hồi thành công' : 'Tạo phản hồi thành công'
        );
        navigate('/dealer/feedback');
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      notifications.error('Lỗi', 'Không thể lưu phản hồi');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const handleCancel = () => {
    navigate('/dealer/feedback');
  };

  // Convert customers to options
  const customerOptions = customers.map(customer => ({
    value: customer.customerId,
    label: `${customer.name} - ${customer.email}`
  }));

  return (
    <PageContainer>
      <PageHeader
        title={isEditMode ? '✏️ Chỉnh sửa phản hồi' : '➕ Tạo phản hồi mới'}
        description={isEditMode ? 'Cập nhật thông tin phản hồi/khiếu nại' : 'Ghi nhận phản hồi hoặc khiếu nại từ khách hàng'}
        onBack={() => navigate('/dealer/feedback')}
      />

      <form onSubmit={handleSubmit}>
        {/* Feedback Information */}
        <InfoSection title="📝 Thông tin phản hồi" icon={<MessageSquare size={20} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <FormGroup error={errors.customerId}>
                <Label required icon={<User size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Khách hàng
                </Label>
                <Select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  options={customerOptions}
                  placeholder="-- Chọn khách hàng --"
                  disabled={isEditMode}
                  error={!!errors.customerId}
                />
                {errors.customerId && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.customerId}</span>}
              </FormGroup>

              <FormGroup error={errors.type}>
                <Label required icon={<AlertTriangle size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Loại phản hồi
                </Label>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={typeOptions}
                  placeholder="-- Chọn loại --"
                  error={!!errors.type}
                />
                {errors.type && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.type}</span>}
              </FormGroup>
            </div>

            <FormGroup error={errors.relatedOrderId}>
              <Label icon={<ShoppingCart size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                Mã đơn hàng liên quan (tùy chọn)
              </Label>
              <Input
                type="number"
                name="relatedOrderId"
                value={formData.relatedOrderId}
                onChange={handleChange}
                placeholder="Nhập mã đơn hàng (nếu có)"
              />
            </FormGroup>

            <FormGroup error={errors.content}>
              <Label required icon={<FileText size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                Nội dung phản hồi/khiếu nại
              </Label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                placeholder="Nhập nội dung chi tiết phản hồi hoặc khiếu nại..."
                className={`
                  w-full px-6 py-4 rounded-2xl 
                  dark:bg-gray-800/50
                  border-2 border-gray-200 dark:border-gray-700
                  dark:text-white
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-4 
                  focus:ring-cyan-500/20 dark:focus:ring-cyan-500/20
                  focus:border-cyan-500 dark:focus:border-cyan-500
                  transition-all duration-300
                  backdrop-blur-sm
                  hover:border-cyan-400 dark:hover:border-cyan-600
                  ${errors.content ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                `}
              />
              {errors.content && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.content}</span>}
            </FormGroup>
          </div>
        </InfoSection>

        {/* Processing Information (Edit Mode Only) */}
        {isEditMode && (
          <InfoSection title="⚙️ Thông tin xử lý" icon={<Clock size={20} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <FormGroup>
                <Label icon={<Clock size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Trạng thái xử lý
                </Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                />
              </FormGroup>

              <FormGroup>
                <Label icon={<FileText size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Ghi chú xử lý
                </Label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Nhập ghi chú về quá trình xử lý, kết quả..."
                  className="w-full px-6 py-4 rounded-2xl dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm hover:border-cyan-400 dark:hover:border-cyan-600"
                />
              </FormGroup>
            </div>
          </InfoSection>
        )}

        {/* Form Actions */}
        <ActionBar>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
            icon={<X size={18} />}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? null : (isEditMode ? <Save size={18} /> : <MessageSquarePlus size={18} />)}
          >
            {isSubmitting ? '⏳ Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo phản hồi')}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default FeedbackForm;
