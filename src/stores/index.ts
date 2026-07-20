import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import homeReducer from '../features/home/store/homeSlice';
import profileReducer from '../features/profile/store/profileSlice';
import usersReducer from '../features/users/store/usersSlice';
import userslogReducer from '../features/userslog/stores/userslogSlice';
import userslevelReducer from '../features/userslevel/stores/userslevelSlice';
import counterReducer from '../features/counter/stores/counterSlice';
import settingReducer from '../features/setting/stores/settingSlice';
import inventorycategoryReducer from '../features/inventorycategory/stores/inventorycategorySlice';
import inventorytypeReducer from '../features/inventorytype/stores/inventorytypeSlice';
import approvalitemsReducer from '../features/approvalitems/stores/approvalitemsSlice';
import { approvalSchemeReducer } from '../features/approvalscheme/stores/approvalschemeSlice';
import employeeReducer from '../features/employee/stores/employeeSlice';
import customersReducer from '../features/customers/stores/customersSlice';
import customerContactsReducer from '../features/customercontacts/stores/customerContactsSlice';
import productsReducer from '../features/products/stores/productsSlice';
import productUploadReducer from '../features/products/stores/productUploadSlice';
import productCategoryReducer from '../features/productcategory/stores/productCategorySlice';
import { productSubCategoryReducer } from '../features/productsubcategory/stores/productSubCategorySlice';
import productBrandReducer from '../features/productbrand/stores/productBrandSlice';
import productUnitReducer from '../features/productunit/stores/productUnitSlice';
import inventoryReducer from '../features/inventory/stores/inventorySlice';
import productPriceReducer from '../features/productprice/stores/productPriceSlice';
import productPriceMktReducer from '../features/productpricemkt/stores/productPriceMktSlice';
import productPriceAgentReducer from '../features/productpriceagent/stores/productPriceAgentSlice';
import brosurReducer from '../features/brosur/stores/brosurSlice';
import productPriceReqReducer from '../features/productpricereq/stores/productPriceReqSlice';
import csrReducer from '../features/csr/stores/csrSlice';
import cstReducer from '../features/cst/stores/cstSlice';
import lktReducer from '../features/lkt/stores/lktSlice';
import logbookproductReducer from '../features/logbookproduct/stores/logbookproductSlice';
import logbookcustomersReducer from '../features/logbookcustomers/stores/logbookcustomersSlice';
import cekserialnumberReducer from '../features/cekserialnumber/stores/cekserialnumberSlice';
import soReducer from '../features/so/stores/soSlice';
import surveyReducer from '../features/survey/stores/surveySlice';
import salescontractReducer from '../features/salescontract/stores/salescontractSlice';
import salesreturReducer from '../features/salesretur/stores/salesreturSlice';
import listsoReducer from '../features/listso/stores/listsoSlice';
import listpaymentReducer from '../features/listpayment/stores/listpaymentSlice';
import matauangReducer from '../features/matauang/stores/matauangSlice';
import assestsReducer from '../features/assests/stores/assestsSlice';

// import attendanceReducer from '../features/attendance/store/attendanceSlice';
// import customerReducer from '../features/customer/store/customerSlice';
// import productsReducer from '../features/product/store/productSlice';
// import activitiesReducer from '../features/activities/store/activitiesSlice';
// import formReducer from '../features/form/store/formSlice';
// import RequestFormReducer from '../features/requestForm/store/requestFormSlice';
import leadsReducer from '../features/leads/stores/leadsSlice';
import purchaserequisitionsReducer from '../features/purchaserequisitions/stores/purchaserequisitionsSlice';
import suppliersReducer from '../features/suppliers/stores/suppliersSlice';
import quotationsapReducer from '../features/quotationsap/stores/quotationsapSlice';
import poReducer from '../features/po/stores/poSlice';

// import dashboardReducer from '../features/dashboard/stores/dashboardSlice';
import incshipmentReducer from '../features/incshipment/stores/incshipmentSlice';
// import profileReducer from '../features/profile/store/profileSlice';
// import activityLogReducer from '../features/activityLog/store/activityLogSlice';
// import activityLeadsReducer from '../features/activityLeads/store/activityLeadsSlice';
// import reportsReducer from '../features/reports/store/reportsSlice';
import approveReducer from '../features/approve/stores/approveSlice';
import approvebaruReducer from '../features/approvebaru/stores/approvebaruSlice';
import doReducer from '../features/do/stores/doSlice';
import customerinvoiceReducer from '../features/customerinvoice/stores/customerinvoiceSlice';
import paymentReducer from '../features/payment/stores/paymentSlice';
import kasbankinReducer from '../features/akt-kasbankin/stores/kasbankinSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    profile: profileReducer,
    users: usersReducer,
    userslog: userslogReducer,
    userslevel: userslevelReducer,
    counter: counterReducer,
    setting: settingReducer,
    inventorycategory: inventorycategoryReducer,
    inventorytype: inventorytypeReducer,
    approvalitems: approvalitemsReducer,
    approvalscheme: approvalSchemeReducer,
    employee: employeeReducer,
    customers: customersReducer,
    customerContacts: customerContactsReducer,
    products: productsReducer,
    productUpload: productUploadReducer,
    productCategory: productCategoryReducer,
    productSubCategory: productSubCategoryReducer,
    productBrand: productBrandReducer,
    productUnit: productUnitReducer,
    inventory: inventoryReducer,
    productPrice: productPriceReducer,
    productPriceMkt: productPriceMktReducer,
    productPriceAgent: productPriceAgentReducer,
    brosur: brosurReducer,
    productPriceReq: productPriceReqReducer,
    csr: csrReducer,
    cst: cstReducer,
    lkt: lktReducer,
    logbookproduct: logbookproductReducer,
    logbookcustomers: logbookcustomersReducer,
    cekserialnumber: cekserialnumberReducer,
    so: soReducer,
    survey: surveyReducer,
    salescontract: salescontractReducer,
    salesretur: salesreturReducer,
    listso: listsoReducer,
    listpayment: listpaymentReducer,
    matauang: matauangReducer,
    assests: assestsReducer,
    // attendance: attendanceReducer,
    // customer: customerReducer,
    // product: productsReducer,
    // activities: activitiesReducer,
    // form: formReducer,
    // requestForm: RequestFormReducer,
    leads: leadsReducer,
    purchaserequisitions: purchaserequisitionsReducer,
    suppliers: suppliersReducer,
    quotationsap: quotationsapReducer,
    po: poReducer,
    incshipment: incshipmentReducer,
    approve: approveReducer,
    approvebaru: approvebaruReducer,
    do: doReducer,
    customerinvoice: customerinvoiceReducer,
    payment: paymentReducer,
    kasbankin: kasbankinReducer,
    // dashboard: dashboardReducer,
    // profile: profileReducer,
    // activityLog: activityLogReducer,
    // activityLeads: activityLeadsReducer,
    // reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
