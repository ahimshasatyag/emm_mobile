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

// import attendanceReducer from '../features/attendance/store/attendanceSlice';
// import customerReducer from '../features/customer/store/customerSlice';
// import productsReducer from '../features/product/store/productSlice';
// import activitiesReducer from '../features/activities/store/activitiesSlice';
// import formReducer from '../features/form/store/formSlice';
// import RequestFormReducer from '../features/requestForm/store/requestFormSlice';
// import leadsReducer from '../features/leads/store/leadsSlice';
// import dashboardReducer from '../features/dashboard/store/dashboardSlice';
// import profileReducer from '../features/profile/store/profileSlice';
// import activityLogReducer from '../features/activityLog/store/activityLogSlice';
// import activityLeadsReducer from '../features/activityLeads/store/activityLeadsSlice';
// import reportsReducer from '../features/reports/store/reportsSlice';

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
    // attendance: attendanceReducer,
    // customer: customerReducer,
    // product: productsReducer,
    // activities: activitiesReducer,
    // form: formReducer,
    // requestForm: RequestFormReducer,
    // leads: leadsReducer,
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
