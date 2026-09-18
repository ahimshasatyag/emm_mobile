import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SideBarNavigator } from './SideBarNavigator';
import { UserFormScreen } from '../../features/users/screens/UserFormScreen';
import { UserEditScreen } from '../../features/users/screens/UserEditScreen';
import { ProductBrandFormScreen } from '../../features/productbrand/screens/ProductBrandFormScreen';
import { ProductBrandEditScreen } from '../../features/productbrand/screens/ProductBrandEditScreen';
import { ProductUnitFormScreen } from '../../features/productunit/screens/ProductUnitFormScreen';
import { ProductUnitEditScreen } from '../../features/productunit/screens/ProductUnitEditScreen';
import { ProductsnListScreen } from '../../features/productsn/screens/ProductsnListScreen';
import { ProductsnFormScreen } from '../../features/productsn/screens/ProductsnFormScreen';
import { ProductsnEditScreen } from '../../features/productsn/screens/ProductsnEditScreen';
import { ProductPriceAgentDetailScreen } from '../../features/productpriceagent/screens/ProductPriceAgentDetailScreen';
import { ProductPriceReqFormScreen } from '../../features/productpricereq/screens/ProductPriceReqFormScreen';
import { ProductPriceReqEditScreen } from '../../features/productpricereq/screens/ProductPriceReqEditScreen';
import { CsrFormScreen } from '../../features/csr/screens/CsrFormScreen';
import { CsrEditScreen } from '../../features/csr/screens/CsrEditScreen';
import { PurchaseRequisitionListScreen } from '../../features/purchaserequisitions/screens/PurchaseRequisitionListScreen';
import { PurchaseRequisitionFormScreen } from '../../features/purchaserequisitions/screens/PurchaseRequisitionFormScreen';
import { PurchaseRequisitionEditScreen } from '../../features/purchaserequisitions/screens/PurchaseRequisitionEditScreen';
import { PurchaseRequisitionListPRScreen } from '../../features/purchaserequisitions/screens/PurchaseRequisitionListPRScreen';
import { CstListScreen } from '../../features/cst/screens/CstListScreen';
import { CstEditScreen } from '../../features/cst/screens/CstEditScreen';
import { LktListScreen } from '../../features/lkt/screens/LktListScreen';
import { LktEditScreen } from '../../features/lkt/screens/LktEditScreen';
import { LktEditCloseScreen } from '../../features/lkt/screens/LktEditCloseScreen';
import { LktFormScreen } from '../../features/lkt/screens/LktFormScreen';
import { RealisasiFormScreen } from '../../features/lkt/screens/RealisasiFormScreen';
import { RealisasiEditScreen } from '../../features/lkt/screens/RealisasiEditScreen';
import LktPrintLabel from '../../features/lkt/screens/LktPrintLabel';
import LktPrintDinas from '../../features/lkt/screens/LktPrintDinas';
import LktPrintBast from '../../features/lkt/screens/LktPrintBast';
import { LktViewBast } from '../../features/lkt/screens/LktViewBast';
import { LogbookProductListScreen } from '../../features/logbookproduct/screens/LogbookProductListScreen';
import { LogbookProductFormScreen } from '../../features/logbookproduct/screens/LogbookProductFormScreen';
import { LogbookProductEditScreen } from '../../features/logbookproduct/screens/LogbookProductEditScreen';
import { LogbookCustomersListScreen } from '../../features/logbookcustomers/screens/LogbookCustomersListScreen';
import { LogbookCustomersFormScreen } from '../../features/logbookcustomers/screens/LogbookCustomersFormScreen';
import { LogbookCustomersEditScreen } from '../../features/logbookcustomers/screens/LogbookCustomersEditScreen';
import { CekSerialNumberScreen } from '../../features/cekserialnumber/screens/CekSerialNumberScreen';
import { ListSOScreen } from '../../features/listso/screens/ListSOScreen';
import { ListSODetailScreen } from '../../features/listso/screens/ListSODetailScreen';
import { LeadsScreen } from '../../features/leads/screens/LeadsScreen';
import { LeadsEditScreen } from '../../features/leads/screens/LeadsEditScreen';
import { SuppliersListScreen } from '../../features/suppliers/screens/SuppliersListScreen';
import { SuppliersFormScreen } from '../../features/suppliers/screens/SuppliersFormScreen';
import { SuppliersEditScreen } from '../../features/suppliers/screens/SuppliersEditScreen';
import { QuotationsAPListScreen } from '../../features/quotationsap/screens/QuotationsAPListScreen';
import { QuotationsAPFormScreen } from '../../features/quotationsap/screens/QuotationsAPFormScreen';
import { QuotationsAPEditScreen } from '../../features/quotationsap/screens/QuotationsAPEditScreen';
import { PoListScreen } from '../../features/po/screens/PoListScreen';
import { PoFormScreen } from '../../features/po/screens/PoFormScreen';
import { PoEditScreen } from '../../features/po/screens/PoEditScreen';
import { IncshipmentListScreen } from '../../features/incshipment/screens/IncshipmentListScreen';
import { IncshipmentFormScreen } from '../../features/incshipment/screens/IncshipmentFormScreen';
import { IncshipmentEditScreen } from '../../features/incshipment/screens/IncshipmentEditScreen';
import { IncshipmentPrintScreen } from '../../features/incshipment/screens/IncshipmentPrintScreen';
import { ApproveListScreen } from '../../features/approve/screens/ApproveListScreen';
import { ApprovebaruListScreen } from '../../features/approvebaru/screens/ApprovebaruListScreen';
import { DoListScreen } from '../../features/do/screens/DoListScreen';
import { DoEditScreen } from '../../features/do/screens/DoEditScreen';
import { DoEditSplitScreen } from '../../features/do/screens/DoEditSplitScreen';
import DoPrintSjScreen from '../../features/do/screens/DoPrintSjScreen';
import { CustomerInvoiceListScreen } from '../../features/customerinvoice/screens/CustomerInvoiceListScreen';
import { CustomerInvoiceEditScreen } from '../../features/customerinvoice/screens/CustomerInvoiceEditScreen';
import { CustomerInvoicePrintInvoiceScreen } from '../../features/customerinvoice/screens/CustomerInvoicePrintInvoiceScreen';
import { CustomerInvoicePrintInvoice2Screen } from '../../features/customerinvoice/screens/CustomerInvoicePrintInvoice2Screen';
import { CustomerInvoicePrintTTScreen } from '../../features/customerinvoice/screens/CustomerInvoicePrintTTScreen';
import { CustomerInvoicePrintTT2Screen } from '../../features/customerinvoice/screens/CustomerInvoicePrintTT2Screen';
import { CustomerInvoicePIDetailScreen } from '../../features/customerinvoice/screens/CustomerInvoicePIDetailScreen';
import { CustomerInvoiceInvDetailScreen } from '../../features/customerinvoice/screens/CustomerInvoiceInvDetailScreen';
import { CustomerInvoiceInvLeasingDetailScreen } from '../../features/customerinvoice/screens/CustomerInvoiceInvLeasingDetailScreen';
import { SOPrintScreen } from '../../features/so/screens/SOPrintScreen';
import { SOPrintQScreen } from '../../features/so/screens/SOPrintQScreen';
import { PaymentListScreen } from '../../features/payment/screens/PaymentListScreen';
import { PaymentEditScreen } from '../../features/payment/screens/PaymentEditScreen';
import { PaymentFormScreen } from '../../features/payment/screens/PaymentFormScreen';
import { KasBankInListScreen } from '../../features/akt-kasbankin/screens/KasBankInListScreen';
import { KasBankInFormScreen } from '../../features/akt-kasbankin/screens/KasBankInFormScreen';
import { ListPaymentScreen } from '../../features/listpayment/screens/ListPaymentScreen';
import { ListPaymentDetailScreen } from '../../features/listpayment/screens/ListPaymentDetailScreen';
import { MataUangScreen } from '../../features/matauang/screens/MataUangScreen';
import { AssestsListScreen } from '../../features/assests/screens/AssestsListScreen';
import { AssestFormScreen } from '../../features/assests/screens/AssestFormScreen';
import { AssestsEditScreen } from '../../features/assests/screens/AssestsEditScreen';
import { TandaTerimaCustListScreen } from '../../features/tandaterimacust/screens/TandaTerimaCustListScreen';
import { TandaTerimaCustFormScreen } from '../../features/tandaterimacust/screens/TandaTerimaCustFormScreen';
import { TandaTerimaCustEditScreen } from '../../features/tandaterimacust/screens/TandaTerimaCustEditScreen';
import { WhatsappChatRoomScreen } from '../../features/whatsappchat/screens/WhatsappChatRoomScreen';
import { WhatsappLogScreen } from '../../features/whatsappchat/screens/WhatsappLogScreen';
import { UsersLevelFormScreen } from '../../features/userslevel/screens/UsersLevelFormScreen';
import { UsersLevelEditScreen } from '../../features/userslevel/screens/UsersLevelEditScreen';
import { SalesReturListScreen } from '../../features/salesretur/screens/SalesReturListScreen';
import { LeadsFormScreen } from '../../features/leads/screens/LeadsFormScreen';
import { CounterEditScreen } from '../../features/counter/screens/CounterEditScreen';
import { SettingFormScreen } from '../../features/setting/screens/SettingFormScreen';
import { SettingEditScreen } from '../../features/setting/screens/SettingEditScreen';
import { InventoryCategoryFormScreen } from '../../features/inventorycategory/screens/InventoryCategoryFormScreen';
import { InventoryCategoryEditScreen } from '../../features/inventorycategory/screens/InventoryCategoryEditScreen';
import { InventoryTypeFormScreen } from '../../features/inventorytype/screens/InventoryTypeFormScreen';
import { InventoryTypeEditScreen } from '../../features/inventorytype/screens/InventoryTypeEditScreen';
import { ApprovalItemsFormScreen } from '../../features/approvalitems/screens/ApprovalItemsFormScreen';
import { ApprovalItemsEditScreen } from '../../features/approvalitems/screens/ApprovalItemsEditScreen';
import { ApprovalSchemeListScreen } from '../../features/approvalscheme/screens/ApprovalSchemeListScreen';
import { ApprovalSchemeFormScreen } from '../../features/approvalscheme/screens/ApprovalSchemeFormScreen';
import { ApprovalSchemeEditScreen } from '../../features/approvalscheme/screens/ApprovalSchemeEditScreen';
import { EmployeeListScreen } from '../../features/employee/screens/EmployeeListScreen';
import { EmployeeFormScreen } from '../../features/employee/screens/EmployeeFormScreen';
import { EmployeeEditScreen } from '../../features/employee/screens/EmployeeEditScreen';
import { EmployeeDivisiFormScreen } from '../../features/employeedivisi/screens/EmployeeDivisiFormScreen';
import { EmployeeDivisiEditScreen } from '../../features/employeedivisi/screens/EmployeeDivisiEditScreen';
import { EmployeePosisiScreen } from '../../features/employeeposisi/screens/EmployeePosisiScreen';
import { EmployeePosisiFormScreen } from '../../features/employeeposisi/screens/EmployeePosisiFormScreen';
import { EmployeePosisiEditScreen } from '../../features/employeeposisi/screens/EmployeePosisiEditScreen';
import { CustomerListScreen } from '../../features/customers/screens/CustomerListScreen';
import { CustomerFormScreen } from '../../features/customers/screens/CustomerFormScreen';
import { CustomerEditScreen } from '../../features/customers/screens/CustomerEditScreen';
import { CustomerContactFormScreen } from '../../features/customercontacts/screens/CustomerContactFormScreen';
import { CustomerContactEditScreen } from '../../features/customercontacts/screens/CustomerContactEditScreen';
import { ProductListScreen } from '../../features/products/screens/ProductListScreen';
import { ProductUploadScreen } from '../../features/products/screens/ProductUploadScreen';
import { ProductFormScreen } from '../../features/products/screens/ProductFormScreen';
import { ProductEditScreen } from '../../features/products/screens/ProductEditScreen';
import { ProductCategoryListScreen } from '../../features/productcategory/screens/ProductCategoryListScreen';
import { ProductCategoryFormScreen } from '../../features/productcategory/screens/ProductCategoryFormScreen';
import { ProductCategoryEditScreen } from '../../features/productcategory/screens/ProductCategoryEditScreen';
import { ProductSubCategoryListScreen } from '../../features/productsubcategory/screens/ProductSubCategoryListScreen';
import { ProductSubCategoryFormScreen } from '../../features/productsubcategory/screens/ProductSubCategoryFormScreen';
import { ProductSubCategoryEditScreen } from '../../features/productsubcategory/screens/ProductSubCategoryEditScreen';
import { ProductPriceListScreen } from '../../features/productprice/screens/ProductPriceListScreen';
import { ProductPriceFormScreen } from '../../features/productprice/screens/ProductPriceFormScreen';
import { ProductPriceEditScreen } from '../../features/productprice/screens/ProductPriceEditScreen';
import { ProductPriceMultipleScreen } from '../../features/productprice/screens/ProductPriceMultipleScreen';
import { ProductPriceUploadScreen } from '../../features/productprice/screens/ProductPriceUploadScreen';
import { ProductPriceMktDetailScreen } from '../../features/productpricemkt/screens/ProductPriceMktDetailScreen';
import { QuotationFormScreen } from '../../features/quotations/screens/QuotationFormScreen';
import { QuotationEditScreen } from '../../features/quotations/screens/QuotationEditScreen';
import { QuotationEditSurveyScreen } from '../../features/quotations/screens/QuotationEditSurveyScreen';
import { QuotationEditPdfScreen } from '../../features/quotations/screens/QuotationEditPdfScreen';
import { SOEditScreen } from '../../features/so/screens/SOEditScreen';
import { SalesContractFormScreen } from '../../features/salescontract/screens/SalesContractFormScreen';
import { SalesContractEditScreen } from '../../features/salescontract/screens/SalesContractEditScreen';
import { SalesReturFormScreen } from '../../features/salesretur/screens/SalesReturFormScreen';
import { SalesReturEditScreen } from '../../features/salesretur/screens/SalesReturEditScreen';
import { SurveyFormScreen } from '../../features/survey/screens/SurveyFormScreen';
import { SurveyEditScreen } from '../../features/survey/screens/SurveyEditScreen';
import { InventoryScheduleListScreen } from '../../features/inventoryschedule/screens/InventoryScheduleListScreen';
import { InventoryScheduleFormScreen } from '../../features/inventoryschedule/screens/InventoryScheduleFormScreen';
import { InventoryScheduleEditScreen } from '../../features/inventoryschedule/screens/InventoryScheduleEditScreen';
import { SopDivisionScreen } from '../../features/sop/screens/SopDivisionScreen';
import { SopListScreen } from '../../features/sop/screens/SopListScreen';
import { SopFormScreen } from '../../features/sop/screens/SopFormScreen';
import { SopEditScreen } from '../../features/sop/screens/SopEditScreen';

const Stack = createNativeStackNavigator();

export function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* SideBarNavigator acts as the primary layout for the authenticated area */}
            <Stack.Screen
                name="Drawer"
                component={SideBarNavigator}
                options={{ headerShown: false }} />

            {/* You can add screens here that shouldn't show the Drawer (e.g. details pages) */}
            <Stack.Screen
                name="UserForm"
                component={UserFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="UserEdit"
                component={UserEditScreen}
                options={{ headerShown: false }} />

            {/* Inventory */}
            <Stack.Screen
                name="InventoryList"
                component={ProductsnListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="InventoryForm"
                component={ProductsnFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="InventoryEdit"
                component={ProductsnEditScreen}
                options={{ headerShown: false }} />

            {/* Cek Serial Number */}
            <Stack.Screen
                name="CekSerialNumber"
                component={CekSerialNumberScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="UsersLevelForm"
                component={UsersLevelFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="UsersLevelEdit"
                component={UsersLevelEditScreen}
                options={{ headerShown: false }} />

            {/* Sales Retur */}
            <Stack.Screen
                name="SalesReturListScreen"
                component={SalesReturListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SalesReturFormScreen"
                component={SalesReturFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SalesReturEditScreen"
                component={SalesReturEditScreen}
                options={{ headerShown: false }}
            />

            {/* Purchase Requisition */}
            <Stack.Screen
                name="PurchaseRequisitionListScreen"
                component={PurchaseRequisitionListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PurchaseRequisitionFormScreen"
                component={PurchaseRequisitionFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PurchaseRequisitionEditScreen"
                component={PurchaseRequisitionEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PurchaseRequisitionListPRScreen"
                component={PurchaseRequisitionListPRScreen}
                options={{ headerShown: false }} />

            {/* List SO */}
            <Stack.Screen
                name="ListSOScreen"
                component={ListSOScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="ListSODetailScreen"
                component={ListSODetailScreen}
                options={{ headerShown: false }} />

            {/* Leads */}
            <Stack.Screen
                name="LeadsScreen"
                component={LeadsScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="LeadsFormScreen"
                component={LeadsFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="LeadsEditScreen"
                component={LeadsEditScreen}
                options={{ headerShown: false }} />

            {/* Suppliers */}
            <Stack.Screen
                name="SuppliersListScreen"
                component={SuppliersListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="SuppliersFormScreen"
                component={SuppliersFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="SuppliersEditScreen"
                component={SuppliersEditScreen}
                options={{ headerShown: false }} />

            {/* Quotations AP */}
            <Stack.Screen
                name="QuotationsAPListScreen"
                component={QuotationsAPListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="QuotationsAPFormScreen"
                component={QuotationsAPFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="QuotationsAPEditScreen"
                component={QuotationsAPEditScreen}
                options={{ headerShown: false }} />

            {/* Purchase Order */}
            <Stack.Screen
                name="PoListScreen"
                component={PoListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="PoFormScreen"
                component={PoFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="PoEditScreen"
                component={PoEditScreen}
                options={{ headerShown: false }} />

            {/* Incoming Shipment */}
            <Stack.Screen
                name="IncshipmentListScreen"
                component={IncshipmentListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="IncshipmentFormScreen"
                component={IncshipmentFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="IncshipmentEditScreen"
                component={IncshipmentEditScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="IncshipmentPrintScreen"
                component={IncshipmentPrintScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="ApproveListScreen"
                component={ApproveListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="ApprovebaruListScreen"
                component={ApprovebaruListScreen}
                options={{ headerShown: false }} />

            {/* Delivery Order */}
            <Stack.Screen
                name="DoListScreen"
                component={DoListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="DoEditScreen"
                component={DoEditScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="DoEditSplitScreen"
                component={DoEditSplitScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="DoPrintSjScreen"
                component={DoPrintSjScreen}
                options={{ headerShown: false }} />

            {/* Customer Invoice */}
            <Stack.Screen
                name="CustomerInvoiceListScreen"
                component={CustomerInvoiceListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoiceEditScreen"
                component={CustomerInvoiceEditScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoicePrintInvoiceScreen"
                component={CustomerInvoicePrintInvoiceScreen}
                options={{ headerShown: false }} />

            {/* Customer Invoice Print */}
            <Stack.Screen
                name="CustomerInvoicePrintInvoice2Screen"
                component={CustomerInvoicePrintInvoice2Screen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoicePrintTTScreen"
                component={CustomerInvoicePrintTTScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoicePrintTT2Screen"
                component={CustomerInvoicePrintTT2Screen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoicePIDetailScreen"
                component={CustomerInvoicePIDetailScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoiceInvDetailScreen"
                component={CustomerInvoiceInvDetailScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="CustomerInvoiceInvLeasingDetailScreen"
                component={CustomerInvoiceInvLeasingDetailScreen}
                options={{ headerShown: false }} />

            {/* Print SO */}
            <Stack.Screen
                name="SOPrintScreen"
                component={SOPrintScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="SOPrintQScreen"
                component={SOPrintQScreen}
                options={{ headerShown: false }} />

            {/* Payment List */}
            <Stack.Screen
                name="PaymentList"
                component={PaymentListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="PaymentEdit"
                component={PaymentEditScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="PaymentForm"
                component={PaymentFormScreen}
                options={{ headerShown: false }} />

            {/* Penerimaan kas dan Bank */}
            <Stack.Screen
                name="KasBankInList"
                component={KasBankInListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="KasBankInForm"
                component={KasBankInFormScreen}
                options={{ headerShown: false }} />

            {/* List Payment */}
            <Stack.Screen
                name="ListPaymentScreen"
                component={ListPaymentScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="ListPaymentDetailScreen"
                component={ListPaymentDetailScreen}
                options={{ headerShown: false }} />

            {/* Mata Uang */}
            <Stack.Screen
                name="MataUangScreen"
                component={MataUangScreen}
                options={{ headerShown: false }} />

            {/* Assests */}
            <Stack.Screen
                name="AssestsListScreen"
                component={AssestsListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="AssestFormScreen"
                component={AssestFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="AssestsEditScreen"
                component={AssestsEditScreen}
                options={{ headerShown: false }} />

            {/* Counter */}
            <Stack.Screen
                name="CounterEdit"
                component={CounterEditScreen}
                options={{ headerShown: false }} />

            {/* Setting */}
            <Stack.Screen
                name="SettingForm"
                component={SettingFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="SettingEdit"
                component={SettingEditScreen}
                options={{ headerShown: false }} />

            {/* Inventory Category */}
            <Stack.Screen
                name="InventoryCategoryForm"
                component={InventoryCategoryFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="InventoryCategoryEdit"
                component={InventoryCategoryEditScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="InventoryTypeForm"
                component={InventoryTypeFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="InventoryTypeEdit"
                component={InventoryTypeEditScreen}
                options={{ headerShown: false }} />


            {/* Approval Items */}
            <Stack.Screen
                name="ApprovalItemsForm"
                component={ApprovalItemsFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ApprovalItemsEdit"
                component={ApprovalItemsEditScreen}
                options={{ headerShown: false }}
            />

            {/* Approval Scheme */}
            <Stack.Screen
                name="ApprovalSchemeList"
                component={ApprovalSchemeListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ApprovalSchemeForm"
                component={ApprovalSchemeFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ApprovalSchemeEdit"
                component={ApprovalSchemeEditScreen}
                options={{ headerShown: false }}
            />

            {/* Employee */}
            <Stack.Screen
                name="EmployeeList"
                component={EmployeeListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmployeeForm"
                component={EmployeeFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmployeeEdit"
                component={EmployeeEditScreen}
                options={{ headerShown: false }}
            />

            {/* Employee Divisi */}
            <Stack.Screen
                name="EmployeeDivisiForm"
                component={EmployeeDivisiFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmployeeDivisiEdit"
                component={EmployeeDivisiEditScreen}
                options={{ headerShown: false }}
            />

            {/* Employee Posisi */}
            <Stack.Screen
                name="EmployeePosisiList"
                component={EmployeePosisiScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmployeePosisiForm"
                component={EmployeePosisiFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmployeePosisiEdit"
                component={EmployeePosisiEditScreen}
                options={{ headerShown: false }}
            />

            {/* Customers */}
            <Stack.Screen
                name="CustomerList"
                component={CustomerListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomerForm"
                component={CustomerFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomerEdit"
                component={CustomerEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomerContactForm"
                component={CustomerContactFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomerContactEdit"
                component={CustomerContactEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductList"
                component={ProductListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductUpload"
                component={ProductUploadScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductForm"
                component={ProductFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductEdit"
                component={ProductEditScreen}
                options={{ headerShown: false }}
            />
            {/* Product Categories */}
            <Stack.Screen
                name="ProductCategoryList"
                component={ProductCategoryListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductCategoryForm"
                component={ProductCategoryFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductCategoryEdit"
                component={ProductCategoryEditScreen}
                options={{ headerShown: false }}
            />
            {/* Product Sub Categories */}
            <Stack.Screen
                name="ProductSubCategoryList"
                component={ProductSubCategoryListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductSubCategoryForm"
                component={ProductSubCategoryFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductSubCategoryEdit"
                component={ProductSubCategoryEditScreen}
                options={{ headerShown: false }}
            />
            {/* Product Brand */}
            <Stack.Screen
                name="ProductBrandForm"
                component={ProductBrandFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductBrandEdit"
                component={ProductBrandEditScreen}
                options={{ headerShown: false }}
            />
            {/* Product Unit */}
            <Stack.Screen
                name="ProductUnitForm"
                component={ProductUnitFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductUnitEdit"
                component={ProductUnitEditScreen}
                options={{ headerShown: false }}
            />
            {/* Product Price */}
            <Stack.Screen
                name="ProductPriceList"
                component={ProductPriceListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceForm"
                component={ProductPriceFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceEdit"
                component={ProductPriceEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceMultiple"
                component={ProductPriceMultipleScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceUpload"
                component={ProductPriceUploadScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceMktDetailScreen"
                component={ProductPriceMktDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceAgentDetailScreen"
                component={ProductPriceAgentDetailScreen}
                options={{ headerShown: false }}
            />
            {/* Product Price Requests */}
            <Stack.Screen
                name="ProductPriceReqFormScreen"
                component={ProductPriceReqFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductPriceReqEditScreen"
                component={ProductPriceReqEditScreen}
                options={{ headerShown: false }}
            />

            {/* CSR */}
            <Stack.Screen
                name="CsrFormScreen"
                component={CsrFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CsrEditScreen"
                component={CsrEditScreen}
                options={{ headerShown: false }}
            />
            {/* CST */}
            <Stack.Screen
                name="CstListScreen"
                component={CstListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CstEditScreen"
                component={CstEditScreen}
                options={{ headerShown: false }}
            />
            {/* LKT */}
            <Stack.Screen
                name="LktListScreen"
                component={LktListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktEditScreen"
                component={LktEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktEditCloseScreen"
                component={LktEditCloseScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktFormScreen"
                component={LktFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RealisasiForm"
                component={RealisasiFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RealisasiEdit"
                component={RealisasiEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktPrintLabel"
                component={LktPrintLabel}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktPrintDinas"
                component={LktPrintDinas}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktPrintBast"
                component={LktPrintBast}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LktViewBast"
                component={LktViewBast}
                options={{ headerShown: false }}
            />
            {/* Logbook Product */}
            <Stack.Screen
                name="LogbookProductListScreen"
                component={LogbookProductListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="LogbookProductFormScreen"
                component={LogbookProductFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="LogbookProductEditScreen"
                component={LogbookProductEditScreen}
                options={{ headerShown: false }} />

            {/* Logbook Customers */}
            <Stack.Screen
                name="LogbookCustomersListScreen"
                component={LogbookCustomersListScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="LogbookCustomersFormScreen"
                component={LogbookCustomersFormScreen}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="LogbookCustomersEditScreen"
                component={LogbookCustomersEditScreen}
                options={{ headerShown: false }} />

            {/* Quotations */}
            <Stack.Screen
                name="QuotationForm"
                component={QuotationFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QuotationEdit"
                component={QuotationEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QuotationEditSurvey"
                component={QuotationEditSurveyScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QuotationEditPdf"
                component={QuotationEditPdfScreen}
                options={{ headerShown: false }}
            />

            {/* Sales Orders */}
            <Stack.Screen
                name="SOEdit"
                component={SOEditScreen}
                options={{ headerShown: false }}
            />

            {/* Sales Contract */}
            <Stack.Screen
                name="SalesContractForm"
                component={SalesContractFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SalesContractEdit"
                component={SalesContractEditScreen}
                options={{ headerShown: false }}
            />

            {/* Sales Retur */}
            <Stack.Screen
                name="SalesReturForm"
                component={SalesReturFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SalesReturEdit"
                component={SalesReturEditScreen}
                options={{ headerShown: false }}
            />

            {/* Survey */}
            <Stack.Screen
                name="SurveyForm"
                component={SurveyFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SurveyEdit"
                component={SurveyEditScreen}
                options={{ headerShown: false }}
            />

            {/* Inventory Schedule */}
            <Stack.Screen
                name="InventoryScheduleListScreen"
                component={InventoryScheduleListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="InventoryScheduleFormScreen"
                component={InventoryScheduleFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="InventoryScheduleEditScreen"
                component={InventoryScheduleEditScreen}
                options={{ headerShown: false }}
            />

            {/* SOP */}
            <Stack.Screen
                name="SopDivisionScreen"
                component={SopDivisionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SopListScreen"
                component={SopListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SopFormScreen"
                component={SopFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SopEditScreen"
                component={SopEditScreen}
                options={{ headerShown: false }}
            />

            {/* Repository Tanda Terima */}
            <Stack.Screen
                name="TandaTerimaCustListScreen"
                component={TandaTerimaCustListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TandaTerimaCustFormScreen"
                component={TandaTerimaCustFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TandaTerimaCustEditScreen"
                component={TandaTerimaCustEditScreen}
                options={{ headerShown: false }}
            />
            {/* Whatsapp Chat */}
            <Stack.Screen
                name="WhatsappChatRoomScreen"
                component={WhatsappChatRoomScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WhatsappLogScreen"
                component={WhatsappLogScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
