import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SideBarNavigator } from './SideBarNavigator';
import { UserFormScreen } from '../../features/users/screens/UserFormScreen';
import { UserEditScreen } from '../../features/users/screens/UserEditScreen';
import { ProductBrandFormScreen } from '../../features/productbrand/screens/ProductBrandFormScreen';
import { ProductBrandEditScreen } from '../../features/productbrand/screens/ProductBrandEditScreen';

import { ProductUnitListScreen } from '../../features/productunit/screens/ProductUnitListScreen';
import { ProductUnitFormScreen } from '../../features/productunit/screens/ProductUnitFormScreen';
import { ProductUnitEditScreen } from '../../features/productunit/screens/ProductUnitEditScreen';
import { InventoryListScreen } from '../../features/inventory/screens/InventoryListScreen';
import { InventoryFormScreen } from '../../features/inventory/screens/InventoryFormScreen';
import { InventoryEditScreen } from '../../features/inventory/screens/InventoryEditScreen';
import { ProductPriceAgentDetailScreen } from '../../features/productpriceagent/screens/ProductPriceAgentDetailScreen';
import { ProductPriceReqFormScreen } from '../../features/productpricereq/screens/ProductPriceReqFormScreen';
import { ProductPriceReqEditScreen } from '../../features/productpricereq/screens/ProductPriceReqEditScreen';
import { CsrFormScreen } from '../../features/csr/screens/CsrFormScreen';
import { CsrEditScreen } from '../../features/csr/screens/CsrEditScreen';
import { CstListScreen } from '../../features/cst/screens/CstListScreen';
import { CstEditScreen } from '../../features/cst/screens/CstEditScreen';

const Stack = createNativeStackNavigator();

export function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* SideBarNavigator acts as the primary layout for the authenticated area */}
            <Stack.Screen name="Drawer" component={SideBarNavigator} />
            {/* You can add screens here that shouldn't show the Drawer (e.g. details pages) */}
            <Stack.Screen name="UserForm" component={UserFormScreen} />
            <Stack.Screen name="UserEdit" component={UserEditScreen} />

            <Stack.Screen name="InventoryList" component={InventoryListScreen} />
            <Stack.Screen name="InventoryForm" component={InventoryFormScreen} />
            <Stack.Screen name="InventoryEdit" component={InventoryEditScreen} />
            <Stack.Screen name="UsersLevelForm" component={require('../../features/userslevel/screens/UsersLevelFormScreen').UsersLevelFormScreen} />
            <Stack.Screen name="UsersLevelEdit" component={require('../../features/userslevel/screens/UsersLevelEditScreen').UsersLevelEditScreen} />
            <Stack.Screen name="CounterEdit" component={require('../../features/counter/screens/CounterEditScreen').CounterEditScreen} />
            <Stack.Screen name="SettingForm" component={require('../../features/setting/screens/SettingFormScreen').SettingFormScreen} />
            <Stack.Screen name="SettingEdit" component={require('../../features/setting/screens/SettingEditScreen').SettingEditScreen} />
            <Stack.Screen name="InventoryCategoryForm" component={require('../../features/inventorycategory/screens/InventoryCategoryFormScreen').InventoryCategoryFormScreen} />
            <Stack.Screen name="InventoryCategoryEdit" component={require('../../features/inventorycategory/screens/InventoryCategoryEditScreen').InventoryCategoryEditScreen} />
            <Stack.Screen name="InventoryTypeForm" component={require('../../features/inventorytype/screens/InventoryTypeFormScreen').InventoryTypeFormScreen} />
            <Stack.Screen name="InventoryTypeEdit" component={require('../../features/inventorytype/screens/InventoryTypeEditScreen').InventoryTypeEditScreen} />
            <Stack.Screen
                name="ApprovalItemsForm"
                getComponent={() => require('../../features/approvalitems/screens/ApprovalItemsFormScreen').ApprovalItemsFormScreen}
            />
            <Stack.Screen
                name="ApprovalItemsEdit"
                getComponent={() => require('../../features/approvalitems/screens/ApprovalItemsEditScreen').ApprovalItemsEditScreen}
            />

            {/* Approval Scheme */}
            <Stack.Screen
                name="ApprovalSchemeList"
                getComponent={() => require('../../features/approvalscheme/screens/ApprovalSchemeListScreen').ApprovalSchemeListScreen}
            />
            <Stack.Screen
                name="ApprovalSchemeForm"
                getComponent={() => require('../../features/approvalscheme/screens/ApprovalSchemeFormScreen').ApprovalSchemeFormScreen}
            />
            <Stack.Screen
                name="ApprovalSchemeEdit"
                getComponent={() => require('../../features/approvalscheme/screens/ApprovalSchemeEditScreen').ApprovalSchemeEditScreen}
            />

            {/* Employee */}
            <Stack.Screen
                name="EmployeeList"
                getComponent={() => require('../../features/employee/screens/EmployeeListScreen').EmployeeListScreen}
            />
            <Stack.Screen
                name="EmployeeForm"
                getComponent={() => require('../../features/employee/screens/EmployeeFormScreen').EmployeeFormScreen}
            />
            <Stack.Screen
                name="EmployeeEdit"
                getComponent={() => require('../../features/employee/screens/EmployeeEditScreen').EmployeeEditScreen}
            />

            {/* Customers */}
            <Stack.Screen
                name="CustomerList"
                getComponent={() => require('../../features/customers/screens/CustomerListScreen').CustomerListScreen}
            />
            <Stack.Screen
                name="CustomerForm"
                getComponent={() => require('../../features/customers/screens/CustomerFormScreen').CustomerFormScreen}
            />
            <Stack.Screen
                name="CustomerEdit"
                getComponent={() => require('../../features/customers/screens/CustomerEditScreen').CustomerEditScreen}
            />
            <Stack.Screen
                name="CustomerContactForm"
                getComponent={() => require('../../features/customercontacts/screens/CustomerContactFormScreen').CustomerContactFormScreen}
            />
            <Stack.Screen
                name="CustomerContactEdit"
                getComponent={() => require('../../features/customercontacts/screens/CustomerContactEditScreen').CustomerContactEditScreen}
            />
            <Stack.Screen
                name="ProductList"
                getComponent={() => require('../../features/products/screens/ProductListScreen').ProductListScreen}
            />
            <Stack.Screen
                name="ProductUpload"
                getComponent={() => require('../../features/products/screens/ProductUploadScreen').ProductUploadScreen}
            />
            <Stack.Screen
                name="ProductForm"
                getComponent={() => require('../../features/products/screens/ProductFormScreen').ProductFormScreen}
            />
            <Stack.Screen
                name="ProductEdit"
                getComponent={() => require('../../features/products/screens/ProductEditScreen').ProductEditScreen}
            />
            {/* Product Categories */}
            <Stack.Screen
                name="ProductCategoryList"
                getComponent={() => require('../../features/productcategory/screens/ProductCategoryListScreen').ProductCategoryListScreen}
            />
            <Stack.Screen
                name="ProductCategoryForm"
                getComponent={() => require('../../features/productcategory/screens/ProductCategoryFormScreen').ProductCategoryFormScreen}
            />
            <Stack.Screen
                name="ProductCategoryEdit"
                getComponent={() => require('../../features/productcategory/screens/ProductCategoryEditScreen').ProductCategoryEditScreen}
            />
            {/* Product Sub Categories */}
            <Stack.Screen
                name="ProductSubCategoryList"
                getComponent={() => require('../../features/productsubcategory/screens/ProductSubCategoryListScreen').ProductSubCategoryListScreen}
            />
            <Stack.Screen
                name="ProductSubCategoryForm"
                getComponent={() => require('../../features/productsubcategory/screens/ProductSubCategoryFormScreen').ProductSubCategoryFormScreen}
            />
            <Stack.Screen
                name="ProductSubCategoryEdit"
                getComponent={() => require('../../features/productsubcategory/screens/ProductSubCategoryEditScreen').ProductSubCategoryEditScreen}
            />
            {/* Product Brand */}
            <Stack.Screen
                name="ProductBrandForm"
                component={ProductBrandFormScreen}
            />
            <Stack.Screen
                name="ProductBrandEdit"
                component={ProductBrandEditScreen}
            />
            {/* Product Unit */}
            <Stack.Screen
                name="ProductUnitForm"
                component={ProductUnitFormScreen}
            />
            <Stack.Screen
                name="ProductUnitEdit"
                component={ProductUnitEditScreen}
            />
            {/* Product Price */}
            <Stack.Screen
                name="ProductPriceList"
                getComponent={() => require('../../features/productprice/screens/ProductPriceListScreen').ProductPriceListScreen}
            />
            <Stack.Screen
                name="ProductPriceForm"
                getComponent={() => require('../../features/productprice/screens/ProductPriceFormScreen').ProductPriceFormScreen}
            />
            <Stack.Screen
                name="ProductPriceEdit"
                getComponent={() => require('../../features/productprice/screens/ProductPriceEditScreen').ProductPriceEditScreen}
            />
            <Stack.Screen
                name="ProductPriceMultiple"
                getComponent={() => require('../../features/productprice/screens/ProductPriceMultipleScreen').ProductPriceMultipleScreen}
            />
            <Stack.Screen
                name="ProductPriceUpload"
                getComponent={() => require('../../features/productprice/screens/ProductPriceUploadScreen').ProductPriceUploadScreen}
            />
            <Stack.Screen
                name="ProductPriceMktDetailScreen"
                getComponent={() => require('../../features/productpricemkt/screens/ProductPriceMktDetailScreen').ProductPriceMktDetailScreen}
            />
            <Stack.Screen
                name="ProductPriceAgentDetailScreen"
                component={ProductPriceAgentDetailScreen}
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
        </Stack.Navigator>
    );
}
