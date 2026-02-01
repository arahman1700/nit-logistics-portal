
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, FileText, CheckCircle, AlertCircle, Truck, Package, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { MOCK_PROJECTS, AIRTABLE_WAREHOUSES, AIRTABLE_SUPPLIERS, MOCK_MRRV, AIRTABLE_EMPLOYEES } from '../constants';

export const ResourceForm: React.FC = () => {
  const { formType } = useParams<{ formType: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  // Real data from Airtable
  const projectOptions = MOCK_PROJECTS.map(p => p.name);
  const warehouseOptions = AIRTABLE_WAREHOUSES.map(w => w.name);
  const supplierOptions = AIRTABLE_SUPPLIERS.map(s => s.name);
  const mrrvOptions = MOCK_MRRV.map(m => `${m.id} - ${m.supplier}`);
  const inspectorOptions = AIRTABLE_EMPLOYEES.filter(e => e.department === 'Warehouse' || e.department === 'Logistics').map(e => e.name);

  const formConfig = useMemo(() => {
    switch (formType) {
      case 'mirv':
        return {
          title: 'طلب صرف مواد',
          titleEn: 'Material Issue Request',
          code: 'MIRV',
          subtitle: 'N-MS-NIT-LSS-FRM-0102',
          icon: Package,
          sections: [
            {
              title: 'معلومات أساسية | Basic Information',
              fields: [
                { key: 'requestDate', label: 'تاريخ الطلب | Request Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
                { key: 'project', label: 'المشروع | Project', type: 'select', options: projectOptions, required: true },
                { key: 'warehouse', label: 'المستودع | Warehouse', type: 'select', options: warehouseOptions, required: true },
                { key: 'requester', label: 'مقدم الطلب | Requester', type: 'text', defaultValue: 'Current User', readOnly: true },
              ]
            },
            {
              title: 'تفاصيل الطلب | Request Details',
              fields: [
                { key: 'purpose', label: 'الغرض من الصرف | Purpose of Issue', type: 'textarea', required: true, placeholder: 'صرف كابلات كهربائية لأعمال التركيب...' },
                { key: 'estimatedValue', label: 'القيمة التقديرية (ريال) | Estimated Value (SAR)', type: 'number', required: true },
                { key: 'approvalLevel', label: 'مستوى الموافقة | Approval Level', type: 'select', options: ['Level 1 - Storekeeper', 'Level 2 - Logistics Manager', 'Level 3 - Department Head'], required: true },
                { key: 'notes', label: 'ملاحظات | Notes', type: 'textarea' },
              ]
            }
          ]
        };
      case 'mrrv':
        return {
          title: 'سند استلام مواد',
          titleEn: 'Material Receiving Report',
          code: 'MRRV',
          subtitle: 'N-MS-NIT-LSS-FRM-0101',
          icon: Package,
          sections: [
            {
              title: 'تفاصيل الاستلام | Receipt Details',
              fields: [
                { key: 'date', label: 'تاريخ الاستلام | Receipt Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
                { key: 'supplier', label: 'المورد | Supplier', type: 'select', options: supplierOptions, required: true },
                { key: 'project', label: 'المشروع | Project', type: 'select', options: projectOptions, required: true },
                { key: 'warehouse', label: 'المستودع | Warehouse', type: 'select', options: warehouseOptions, required: true },
              ]
            },
            {
              title: 'المستندات | Documents',
              fields: [
                { key: 'poNumber', label: 'رقم أمر الشراء | PO Number', type: 'text', required: true, placeholder: 'PO-2026-00XXX' },
                { key: 'deliveryNote', label: 'إشعار التسليم | Delivery Note (DN)', type: 'text', required: true, placeholder: 'DN-XXXXX' },
                { key: 'receivedBy', label: 'المستلم | Received By', type: 'text', defaultValue: 'Current User', readOnly: true },
                { key: 'rfimRequired', label: 'يتطلب فحص (RFIM)؟ | Requires Inspection?', type: 'checkbox' },
                { key: 'attachments', label: 'المرفقات | Attachments', type: 'file' },
              ]
            }
          ]
        };
      case 'jo':
        return {
          title: 'أمر عمل جديد',
          titleEn: 'New Job Order',
          code: 'JO',
          subtitle: 'N-MS-NIT-LSS-FRM-0201',
          icon: Truck,
          sections: [
            {
              title: 'معلومات الطلب | Request Information',
              fields: [
                { key: 'requestDate', label: 'تاريخ الطلب | Request Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
                { key: 'project', label: 'المشروع | Project', type: 'select', options: projectOptions, required: true },
                { key: 'requester', label: 'مقدم الطلب | Requester', type: 'text', defaultValue: 'Current User', readOnly: true },
                { key: 'priority', label: 'الأولوية | Priority', type: 'select', options: ['Normal', 'High', 'Critical'], required: true },
              ]
            },
            {
              title: 'نوع الخدمة | Service Type',
              fields: [
                { key: 'joType', label: 'نوع أمر العمل | Job Order Type', type: 'select', options: ['Transport - نقل', 'Equipment - معدات', 'Generator_Rental - تأجير مولد', 'Generator_Maintenance - صيانة مولد', 'Rental_Daily - تأجير يومي', 'Scrap - سكراب'], required: true },
                { key: 'equipmentRequested', label: 'المعدات المطلوبة | Equipment Requested', type: 'select', options: ['Forklift 3T', 'Forklift 5T', 'Forklift 7T', 'Crane 30T', 'Crane 50T', 'Boom Truck 10T', 'Trella', 'Diyanna', 'Generator 100KVA', 'Generator 250KVA', 'Generator 500KVA'], required: true },
                { key: 'description', label: 'الوصف | Description', type: 'textarea', required: true, placeholder: 'نقل مواد من المستودع إلى الموقع...' },
              ]
            },
            {
              title: 'تفاصيل النقل (إن وجد) | Transport Details',
              fields: [
                { key: 'pickupLocation', label: 'موقع الاستلام | Pickup Location', type: 'text', placeholder: 'Dammam Warehouse' },
                { key: 'deliveryLocation', label: 'موقع التسليم | Delivery Location', type: 'text', placeholder: 'Project Site' },
                { key: 'cargoWeight', label: 'وزن الحمولة (طن) | Cargo Weight (Tons)', type: 'number' },
                { key: 'numberOfTrailers', label: 'عدد المقطورات | Number of Trailers', type: 'number' },
              ]
            },
            {
              title: 'معلومات إضافية | Additional Information',
              fields: [
                { key: 'supplierPreferred', label: 'المورد المفضل | Preferred Supplier', type: 'select', options: ['Any - أي مورد', ...supplierOptions] },
                { key: 'notes', label: 'ملاحظات | Notes', type: 'textarea' },
                { key: 'attachments', label: 'المرفقات | Attachments', type: 'file' },
              ]
            }
          ]
        };
      case 'rfim':
        return {
          title: 'طلب فحص مواد',
          titleEn: 'Request for Inspection of Materials',
          code: 'RFIM',
          subtitle: 'N-MS-NIT-QC-FRM-0101',
          icon: Shield,
          sections: [
            {
              title: 'ربط السند | Voucher Reference',
              fields: [
                { key: 'mrrvId', label: 'رقم سند الاستلام | MRRV Reference', type: 'select', options: mrrvOptions, required: true },
                { key: 'inspectionDate', label: 'تاريخ الفحص المطلوب | Required Inspection Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
              ]
            },
            {
              title: 'تفاصيل الفحص | Inspection Details',
              fields: [
                { key: 'inspectionType', label: 'نوع الفحص | Inspection Type', type: 'select', options: ['Visual - فحص بصري', 'Functional - فحص وظيفي', 'Dimensional - فحص أبعاد', 'Lab Test - فحص مخبري'], required: true },
                { key: 'priority', label: 'الأولوية | Priority', type: 'select', options: ['Normal', 'Urgent', 'Critical'], required: true },
                { key: 'inspector', label: 'المفتش | Inspector', type: 'select', options: inspectorOptions },
              ]
            },
            {
              title: 'الأصناف للفحص | Items to Inspect',
              fields: [
                { key: 'itemsDescription', label: 'وصف الأصناف | Items Description', type: 'textarea', required: true, placeholder: 'كابلات كهربائية 50مم - 500 متر\nقواطع كهربائية - 20 قطعة' },
                { key: 'specifications', label: 'المواصفات المطلوبة | Required Specifications', type: 'textarea', placeholder: 'مطابقة للمواصفات السعودية SASO...' },
                { key: 'notes', label: 'ملاحظات | Notes', type: 'textarea' },
              ]
            }
          ]
        };
      case 'osd':
        return {
          title: 'تقرير تلف/نقص/زيادة',
          titleEn: 'Over/Short/Damage Report',
          code: 'OSD',
          subtitle: 'N-MS-NIT-QC-FRM-0102',
          icon: AlertTriangle,
          sections: [
            {
              title: 'ربط السند | Voucher Reference',
              fields: [
                { key: 'mrrvId', label: 'رقم سند الاستلام | MRRV Reference', type: 'select', options: mrrvOptions, required: true },
                { key: 'reportDate', label: 'تاريخ التقرير | Report Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
              ]
            },
            {
              title: 'تفاصيل المشكلة | Issue Details',
              fields: [
                { key: 'reportType', label: 'نوع المشكلة | Issue Type', type: 'select', options: ['Shortage - نقص', 'Overage - زيادة', 'Damage - تلف'], required: true },
                { key: 'qtyAffected', label: 'الكمية المتأثرة | Quantity Affected', type: 'number', required: true },
                { key: 'description', label: 'الوصف | Description', type: 'textarea', required: true, placeholder: 'تلف في العبوات الخارجية...' },
              ]
            },
            {
              title: 'الإجراء المطلوب | Action Required',
              fields: [
                { key: 'actionRequired', label: 'الإجراء | Action', type: 'select', options: ['Contact Supplier - التواصل مع المورد', 'Replace - استبدال', 'Accept As-Is - قبول كما هو', 'Return - إرجاع', 'Claim Insurance - مطالبة تأمين'], required: true },
                { key: 'notes', label: 'ملاحظات | Notes', type: 'textarea' },
                { key: 'attachments', label: 'صور/مستندات | Photos/Documents', type: 'file' },
              ]
            }
          ]
        };
      case 'mrv':
        return {
          title: 'سند إرجاع مواد',
          titleEn: 'Material Return Voucher',
          code: 'MRV',
          subtitle: 'N-MS-NIT-LSS-FRM-0103',
          icon: RefreshCw,
          sections: [
            {
              title: 'معلومات الإرجاع | Return Information',
              fields: [
                { key: 'returnDate', label: 'تاريخ الإرجاع | Return Date', type: 'date', required: true, defaultValue: new Date().toISOString().split('T')[0] },
                { key: 'project', label: 'المشروع | Project', type: 'select', options: projectOptions, required: true },
                { key: 'warehouse', label: 'المستودع المستلم | Receiving Warehouse', type: 'select', options: warehouseOptions, required: true },
                { key: 'returnType', label: 'نوع الإرجاع | Return Type', type: 'select', options: ['Surplus - فائض', 'Damaged - تالف', 'Wrong Item - صنف خاطئ', 'Project Completion - انتهاء مشروع'], required: true },
              ]
            },
            {
              title: 'تفاصيل المواد | Material Details',
              fields: [
                { key: 'itemsDescription', label: 'وصف الأصناف | Items Description', type: 'textarea', required: true, placeholder: 'كابلات كهربائية - 100 متر (فائض)\nمعدات سلامة - 10 قطع (غير مستخدمة)' },
                { key: 'reason', label: 'سبب الإرجاع | Return Reason', type: 'textarea', required: true, placeholder: 'فائض كمية بعد انتهاء المرحلة الأولى...' },
                { key: 'condition', label: 'حالة المواد | Material Condition', type: 'select', options: ['New - جديد', 'Good - جيد', 'Fair - مقبول', 'Damaged - تالف'], required: true },
              ]
            },
            {
              title: 'معلومات إضافية | Additional Information',
              fields: [
                { key: 'returnedBy', label: 'المرجع | Returned By', type: 'text', defaultValue: 'Current User', readOnly: true },
                { key: 'notes', label: 'ملاحظات | Notes', type: 'textarea' },
                { key: 'attachments', label: 'المرفقات | Attachments', type: 'file' },
              ]
            }
          ]
        };
      default:
        return {
          title: 'نموذج عام',
          titleEn: 'Generic Form',
          code: 'GEN',
          subtitle: 'Standard Operation Form',
          icon: FileText,
          sections: [
            {
              title: 'التفاصيل | Details',
              fields: [
                { key: 'description', label: 'الوصف | Description', type: 'textarea', required: true }
              ]
            }
          ]
        };
    }
  }, [formType, projectOptions, warehouseOptions, supplierOptions, mrrvOptions, inspectorOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      console.log('Form Submitted:', formType, formData);
    }, 1000);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const FormIcon = formConfig.icon;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] glass-card rounded-2xl p-8 text-center animate-fade-in mx-auto max-w-2xl mt-10 border border-green-500/30 bg-gradient-to-b from-green-900/10 to-transparent">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">تم الإرسال بنجاح</h2>
        <p className="text-gray-400 mb-2">Request Submitted Successfully</p>
        <p className="text-gray-400 mb-8 max-w-md">
          النموذج <span className="text-nesma-secondary font-medium">{formConfig.subtitle}</span> تم حفظه بنجاح. سيتم إشعار القسم المختص للمراجعة.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setSubmitted(false); setFormData({}); }}
            className="px-6 py-3 border border-white/20 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            إرسال آخر | Submit Another
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 bg-gradient-to-r from-nesma-primary to-nesma-dark border border-nesma-primary/50 text-white rounded-xl hover:shadow-[0_0_20px_rgba(46,49,146,0.4)] transition-all"
          >
            العودة للرئيسية | Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
        <span onClick={() => navigate('/admin')} className="cursor-pointer hover:text-nesma-secondary transition-colors">Dashboard</span>
        <span className="text-gray-600">/</span>
        <span className="cursor-pointer hover:text-nesma-secondary transition-colors">Forms</span>
        <span className="text-gray-600">/</span>
        <span className="text-white font-medium">{formConfig.code}</span>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="border-b border-white/10 p-8 bg-gradient-to-r from-nesma-primary/20 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{formConfig.title}</h1>
              <p className="text-lg text-gray-400 mb-3">{formConfig.titleEn}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-nesma-secondary/10 text-nesma-secondary border border-nesma-secondary/30 px-2 py-1 rounded">
                  {formConfig.subtitle}
                </span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  الحقول المطلوبة | Required fields
                </span>
              </div>
            </div>
            <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <FormIcon className="text-nesma-secondary" size={28} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {formConfig.sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <span className="w-1 h-6 bg-nesma-secondary rounded-full shadow-[0_0_8px_rgba(128,209,233,0.6)]"></span>
                {section.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx} className={`flex flex-col gap-2 ${field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}`}>
                    <label className="text-sm font-medium text-gray-300 ml-1">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        className="nesma-input px-4 py-3 w-full appearance-none bg-white/5 border border-white/10 rounded-xl text-white focus:border-nesma-secondary focus:ring-1 focus:ring-nesma-secondary outline-none transition-all"
                        required={field.required}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      >
                        <option value="">اختر... | Select...</option>
                        {field.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="nesma-input px-4 py-3 w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl text-white focus:border-nesma-secondary focus:ring-1 focus:ring-nesma-secondary outline-none transition-all"
                        required={field.required}
                        placeholder={field.placeholder || 'أدخل التفاصيل هنا... | Enter details here...'}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-nesma-secondary rounded border-gray-500 focus:ring-nesma-secondary bg-transparent"
                          onChange={(e) => handleInputChange(field.key, e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">نعم | Yes</span>
                      </label>
                    ) : field.type === 'file' ? (
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 hover:border-nesma-secondary/50 transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                          <FileText className="text-gray-400 group-hover:text-nesma-secondary transition-colors" size={24} />
                        </div>
                        <span className="block text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                          اضغط لرفع الملفات | Click to upload
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PDF, PNG, JPG حتى 10MB</span>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        className="nesma-input px-4 py-3 w-full bg-white/5 border border-white/10 rounded-xl text-white focus:border-nesma-secondary focus:ring-1 focus:ring-nesma-secondary outline-none transition-all"
                        required={field.required}
                        defaultValue={field.defaultValue}
                        readOnly={field.readOnly}
                        placeholder={field.placeholder || (field.readOnly ? '' : `أدخل ${field.label}`)}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-white/20 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white font-medium transition-all"
            >
              إلغاء | Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-nesma-primary hover:bg-nesma-accent text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-nesma-primary/30 hover:shadow-nesma-primary/50 transition-all transform hover:-translate-y-1"
            >
              <Save size={18} />
              حفظ وإرسال | Save & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
