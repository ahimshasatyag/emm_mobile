import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, interpolate, Extrapolate } from 'react-native-reanimated';
import {
    ChevronDown, Home, LogOut, Shield, Users, Building2, Database, Tags,
    Wrench, TrendingUp, ShoppingBag, CheckSquare, Warehouse, Calculator,
    FolderTree, Archive, MessageCircle, UserCircle, FilePieChart, Hash, Settings as SettingsIcon, Package
} from 'lucide-react-native';
import { BottomBarNavigator } from './BottomBarNavigator';
import { theme } from '../../theme/theme';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout as logoutAction } from '../../features/auth/store/authSlice';
import { UserListScreen } from '../../features/users/screens/UserListScreen';
import { UsersLogListScreen } from '../../features/userslog/screens/UsersLogListScreen';
import { UsersLevelListScreen } from '../../features/userslevel/screens/UsersLevelListScreen';
import { ProductListScreen } from '../../features/products/screens/ProductListScreen';
import { ProductCategoryListScreen } from '../../features/productcategory/screens/ProductCategoryListScreen';
import { ProductSubCategoryListScreen } from '../../features/productsubcategory/screens/ProductSubCategoryListScreen';
import { ProductBrandListScreen } from '../../features/productbrand/screens/ProductBrandListScreen';
const Drawer = createDrawerNavigator();
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const iconMap: Record<string, any> = {
    Shield, Users, Building2, Database, Tags, Wrench, TrendingUp, ShoppingBag,
    CheckSquare, Warehouse, Calculator, FolderTree, Archive, MessageCircle, UserCircle, FilePieChart, Hash, Package
};
const SIDEBAR_MENUS = [
    {
        id: '101',
        title: 'Administrator',
        iconName: 'Shield',
        color: '#6366f1',
        subMenus: ['Users', 'Users Log', 'Users Level', 'Counter', 'Setting', 'Inventory Category', 'Inventory Type', 'Approval Items', 'Approval Scheme']
    },
    {
        id: '102',
        title: 'Data Employee',
        iconName: 'Users',
        color: '#3b82f6',
        subMenus: ['Employee', 'Division', 'Position']
    },
    {
        id: '103',
        title: 'Data Customers',
        iconName: 'Building2',
        color: '#06b6d4',
        subMenus: ['Company', 'Contact']
    },
    {
        id: '105',
        title: 'Data Product',
        iconName: 'Database',
        color: '#10b981',
        subMenus: ['Product', 'Category', 'Sub Category', 'Unit', 'Brand', 'Serial Number']
    },
    {
        id: '104',
        title: 'Product Price',
        iconName: 'Tags',
        color: '#f59e0b',
        subMenus: ['Product Price', 'Product Price Marketing', 'Product Price Agent', 'Log Search', 'Brosur', 'Product Price Request']
    },
    {
        id: '106',
        title: 'After Sale Service',
        iconName: 'Wrench',
        color: '#f43f5e',
        subMenus: ['Customer Request (CSR)', 'Suport Ticket (CST)', 'Lembar Kerja Teknisi (LKT)', 'Log Book Product', 'Log Book Customers', 'Cek Serial Number']
    },
    {
        id: '107',
        title: 'Sales',
        iconName: 'TrendingUp',
        color: '#8b5cf6',
        subMenus: ['Quotations', 'Sales Order', 'Survey', 'Sales Contract', 'Sales Retur', 'List SO', 'LEADS']
    },
    {
        id: '108',
        title: 'Purchase',
        iconName: 'ShoppingBag',
        color: '#ec4899',
        subMenus: ['Suppliers', 'Purchase Requisitions', 'Quotations AP', 'PO', 'Incoming Shipments']
    },
    {
        id: '109',
        title: 'Approval',
        iconName: 'CheckSquare',
        color: '#14b8a6',
        subMenus: ['Approval List', 'Approval Baru']
    },
    {
        id: '110',
        title: 'Warehouse',
        iconName: 'Warehouse',
        color: '#eab308',
        subMenus: ['Delivery Order', 'Inventory']
    },
    {
        id: '111',
        title: 'Accounting',
        iconName: 'Calculator',
        color: '#64748b',
        subMenus: ['Customer Invoices', 'Payment', 'Penerimaan Kas dan Bank', 'List Payment', 'Mata Uang', 'Asset Management', 'Asset Schedule']
    },
    {
        id: '112',
        title: 'Data',
        iconName: 'FolderTree',
        color: '#84cc16',
        subMenus: ['Daftar Induk Document', 'Pengajuan Anggaran Perjalanan Dinas Luar']
    },
    {
        id: '113',
        title: 'Repository Tanda Terima',
        iconName: 'Archive',
        color: '#78716c',
        subMenus: ['Repository Tanda Terima']
    },
    {
        id: '114',
        title: 'Whatsapp',
        iconName: 'MessageCircle',
        color: '#22c55e',
        subMenus: ['Chat']
    },
    {
        id: '115',
        title: 'HRIS',
        iconName: 'UserCircle',
        color: '#d946ef',
        subMenus: ['External Link HRIS']
    },
    {
        id: '116',
        title: 'Reporting',
        iconName: 'FilePieChart',
        color: '#0ea5e9',
        subMenus: ['AR Invoice']
    }
];
interface CustomExpandableMenuProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    subMenus: string[];
    isExpanded: boolean;
    activeSubMenu: string | null;
    onToggle: (id: string) => void;
    onSubMenuPress: (menu: string) => void;
}
function CustomExpandableMenu({ id, title, icon, subMenus, isExpanded, activeSubMenu, onToggle, onSubMenuPress }: CustomExpandableMenuProps) {
    const rotateValue = useSharedValue(0);
    React.useEffect(() => {
        rotateValue.value = withSpring(isExpanded ? 1 : 0);
    }, [isExpanded]);
    const animatedRotateStyle = useAnimatedStyle(() => {
        const rotation = interpolate(rotateValue.value, [0, 1], [0, 180]);
        return { transform: [{ rotate: `${rotation}deg` }] };
    });
    const hasActiveSubMenu = activeSubMenu ? subMenus.includes(activeSubMenu) : false;
    return (
        <View className="mb-2">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onToggle(id)}
                className="flex-row items-center px-4 py-3 rounded-lg shadow-sm border"
                style={{
                    backgroundColor: hasActiveSubMenu ? theme.colors.primaryContainer : 'white',
                    borderColor: hasActiveSubMenu ? 'transparent' : '#f9fafb'
                }}
            >
                <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: hasActiveSubMenu ? 'rgba(255,255,255,0.5)' : '#f9fafb' }}
                >
                    {icon}
                </View>
                <Text
                    className="flex-1 font-bold text-[13px]"
                    style={{ color: hasActiveSubMenu ? theme.colors.primary : '#1f2937' }}
                >
                    {title}
                </Text>
                <Animated.View style={animatedRotateStyle}>
                    <ChevronDown color={hasActiveSubMenu ? theme.colors.primary : theme.colors.outline} size={18} />
                </Animated.View>
            </TouchableOpacity>
            {isExpanded && (
                <View className="pl-12 pr-4 pt-1 pb-2">
                    {subMenus.map((menu, index) => {
                        const isActive = menu === activeSubMenu;
                        return (
                            <TouchableOpacity
                                key={index}
                                className="py-2 px-3 rounded-lg mb-1"
                                onPress={() => onSubMenuPress(menu)}
                            >
                                <Text className="font-bold text-[13px]" style={{ color: isActive ? theme.colors.primary : '#6b7280' }}>{menu}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
function CustomDrawerContent(props: DrawerContentComponentProps) {
    const dispatch = useAppDispatch();
    const logout = () => dispatch(logoutAction());
    const currentRouteName = props.state.routeNames[props.state.index];
    const isDashboardActive = currentRouteName === 'MainTabs';
    const getActiveSubMenu = (route: string) => {
        if (route === 'UserList') return 'Users';
        if (route === 'UsersLogList') return 'Users Log';
        if (route === 'UsersLevelList') return 'Users Level';
        if (route === 'Counter') return 'Counter';
        if (route === 'SettingList') return 'Setting';
        if (route === 'InventoryCategoryList') return 'Inventory Category';
        if (route === 'InventoryTypeList') return 'Inventory Type';
        if (route === 'ApprovalItemsList') return 'Approval Items';
        if (route === 'ApprovalSchemeList') return 'Approval Scheme';
        if (route === 'EmployeeList') return 'Employee';
        if (route === 'CustomerList') return 'Company';
        if (route === 'CustomerContactList') return 'Contact';
        if (route === 'ProductList') return 'Product';
        if (route === 'ProductCategoryList') return 'Category';
        if (route === 'ProductSubCategoryList') return 'Sub Category';
        if (route === 'ProductBrandList') return 'Brand';
        if (route === 'ProductUnitList') return 'Unit';
        if (route === 'InventoryList') return 'Serial Number';
        if (route === 'ProductPriceList') return 'Product Price';
        if (route === 'ProductPriceMktList') return 'Product Price Marketing';
        if (route === 'ProductPriceAgentList') return 'Product Price Agent';
        if (route === 'ProductPriceReqListScreen') return 'Product Price Request';
        return null;
    };
    const activeSubMenu = getActiveSubMenu(currentRouteName);
    const activeMenuId = SIDEBAR_MENUS.find(menu => activeSubMenu && menu.subMenus.includes(activeSubMenu))?.id || null;
    const [expandedMenuId, setExpandedMenuId] = useState<string | null>(activeMenuId);
    React.useEffect(() => {
        setExpandedMenuId(activeMenuId);
    }, [activeMenuId]);
    const handleToggleMenu = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedMenuId((prev) => (prev === id ? null : id));
    };
    return (
        <View className="flex-1 bg-[#f9fafb]">
            <View className="p-6 pt-12 pb-6 border-b border-gray-200 bg-white">
                <Text className="text-2xl font-extrabold" style={{ color: theme.colors.primary }}>EMMA</Text>
                <Text className="text-xs text-gray-500 font-medium mt-1">ERP Mobile System</Text>
            </View>
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <Text className="text-xs font-bold text-gray-400 mb-3 ml-2 uppercase tracking-wider">Main Menus</Text>
                <TouchableOpacity
                    className="flex-row items-center px-4 py-3 rounded-lg mb-2"
                    style={{ backgroundColor: isDashboardActive ? theme.colors.primaryContainer : 'transparent' }}
                    onPress={() => {
                        setExpandedMenuId(null);
                        props.navigation.navigate('MainTabs');
                    }}
                >
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: isDashboardActive ? 'rgba(255,255,255,0.5)' : '#f9fafb' }}>
                        <Home color={isDashboardActive ? theme.colors.primary : '#4b5563'} size={18} />
                    </View>
                    <Text className="font-bold text-[13px]" style={{ color: isDashboardActive ? theme.colors.primary : '#4b5563' }}>Dashboard</Text>
                </TouchableOpacity>
                {SIDEBAR_MENUS.map((menu) => {
                    const IconComponent = iconMap[menu.iconName];
                    const isActiveParent = activeSubMenu ? menu.subMenus.includes(activeSubMenu) : false;
                    return (
                        <CustomExpandableMenu
                            key={menu.id}
                            id={menu.id}
                            title={menu.title}
                            icon={IconComponent ? <IconComponent color={isActiveParent ? theme.colors.primary : menu.color} size={18} /> : <Home color={isActiveParent ? theme.colors.primary : menu.color} size={18} />}
                            subMenus={menu.subMenus}
                            isExpanded={expandedMenuId === menu.id}
                            activeSubMenu={activeSubMenu}
                            onToggle={handleToggleMenu}
                            onSubMenuPress={(subMenuName) => {
                                if (subMenuName === 'Users') {
                                    props.navigation.navigate('UserList');
                                } else if (subMenuName === 'Users Log') {
                                    props.navigation.navigate('UsersLogList');
                                } else if (subMenuName === 'Users Level') {
                                    props.navigation.navigate('UsersLevelList');
                                } else if (subMenuName === 'Counter') {
                                    props.navigation.navigate('Counter');
                                } else if (subMenuName === 'Setting') {
                                    props.navigation.navigate('SettingList');
                                } else if (subMenuName === 'Inventory Category') {
                                    props.navigation.navigate('InventoryCategoryList');
                                } else if (subMenuName === 'Inventory Type') {
                                    props.navigation.navigate('InventoryTypeList');
                                } else if (subMenuName === 'Approval Items') {
                                    props.navigation.navigate('ApprovalItemsList');
                                } else if (subMenuName === 'Approval Scheme') {
                                    props.navigation.navigate('ApprovalSchemeList');
                                } else if (subMenuName === 'Employee') {
                                    props.navigation.navigate('EmployeeList');
                                } else if (subMenuName === 'Company') {
                                    props.navigation.navigate('CustomerList');
                                } else if (subMenuName === 'Contact') {
                                    props.navigation.navigate('CustomerContactList');
                                } else if (subMenuName === 'Product') {
                                    props.navigation.navigate('ProductList');
                                } else if (subMenuName === 'Category') {
                                    props.navigation.navigate('ProductCategoryList');
                                } else if (subMenuName === 'Sub Category') {
                                    props.navigation.navigate('ProductSubCategoryList');
                                } else if (subMenuName === 'Brand') {
                                    props.navigation.navigate('ProductBrandList');
                                } else if (subMenuName === 'Unit') {
                                    props.navigation.navigate('ProductUnitList');
                                } else if (subMenuName === 'Inventory' || subMenuName === 'Serial Number') {
                                    props.navigation.navigate('InventoryList');
                                } else if (subMenuName === 'Product Price') {
                                    props.navigation.navigate('ProductPriceList');
                                } else if (subMenuName === 'Product Price Marketing') {
                                    props.navigation.navigate('ProductPriceMktList', { timestamp: Date.now() });
                                } else if (subMenuName === 'Product Price Agent') {
                                    props.navigation.navigate('ProductPriceAgentList', { timestamp: Date.now() });
                                } else if (subMenuName === 'Brosur') {
                                    props.navigation.navigate('Brosur', { timestamp: Date.now() });
                                } else if (subMenuName === 'Product Price Request') {
                                    props.navigation.navigate('ProductPriceReqListScreen', { timestamp: Date.now() });
                                }
                            }}
                        />
                    );
                })}
                {/* Spacer for bottom padding */}
                <View className="h-6" />
            </ScrollView>
            <View className="p-4 border-t border-gray-200 bg-white">
                <TouchableOpacity
                    className="flex-row items-center px-4 py-3 rounded-lg bg-gray-100"
                    onPress={logout}
                >
                    <LogOut color="#4b5563" size={20} />
                    <Text className="ml-3 font-bold text-gray-600">Keluar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export function SideBarNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: { width: '85%' }
            }}
        >
            <Drawer.Screen name="MainTabs" component={BottomBarNavigator} />
            <Drawer.Screen name="UserList" component={UserListScreen} />
            <Drawer.Screen name="UsersLogList" component={UsersLogListScreen} />
            <Drawer.Screen name="UsersLevelList" component={UsersLevelListScreen} />
            <Drawer.Screen name="Counter" component={require('../../features/counter/screens/CounterListScreen').CounterListScreen} />
            <Drawer.Screen name="SettingList" component={require('../../features/setting/screens/SettingListScreen').SettingListScreen} />
            <Drawer.Screen name="InventoryCategoryList" component={require('../../features/inventorycategory/screens/InventoryCategoryListScreen').InventoryCategoryListScreen} />
            <Drawer.Screen name="InventoryTypeList" component={require('../../features/inventorytype/screens/InventoryTypeListScreen').InventoryTypeListScreen} />
            <Drawer.Screen name="ApprovalItemsList" component={require('../../features/approvalitems/screens/ApprovalItemsListScreen').ApprovalItemsListScreen} />
            <Drawer.Screen name="ApprovalSchemeList" component={require('../../features/approvalscheme/screens/ApprovalSchemeListScreen').ApprovalSchemeListScreen} />
            <Drawer.Screen name="EmployeeList" component={require('../../features/employee/screens/EmployeeListScreen').EmployeeListScreen} />
            <Drawer.Screen name="CustomerList" component={require('../../features/customers/screens/CustomerListScreen').CustomerListScreen} />
            <Drawer.Screen name="CustomerContactList" component={require('../../features/customercontacts/screens/CustomerContactListScreen').CustomerContactListScreen} />
            <Drawer.Screen name="ProductList" component={require('../../features/products/screens/ProductListScreen').ProductListScreen} />
            <Drawer.Screen name="ProductCategoryList" component={require('../../features/productcategory/screens/ProductCategoryListScreen').ProductCategoryListScreen} />
            <Drawer.Screen name="ProductSubCategoryList" component={require('../../features/productsubcategory/screens/ProductSubCategoryListScreen').ProductSubCategoryListScreen} />
            <Drawer.Screen
                name="ProductBrandList"
                component={ProductBrandListScreen}
                options={{
                    drawerLabel: 'Merek Produk',
                    title: 'Merek Produk',
                }}
            />
            <Drawer.Screen name="ProductUnitList" component={require('../../features/productunit/screens/ProductUnitListScreen').ProductUnitListScreen} />
            <Drawer.Screen name="InventoryList" component={require('../../features/inventory/screens/InventoryListScreen').InventoryListScreen} />
            <Drawer.Screen name="ProductPriceList" component={require('../../features/productprice/screens/ProductPriceListScreen').ProductPriceListScreen} />
            <Drawer.Screen
                name="ProductPriceMktList"
                component={require('../../features/productpricemkt/screens/ProductPriceMktListScreen').ProductPriceMktListScreen}
                options={{ unmountOnBlur: true }}
            />
            <Drawer.Screen
                name="ProductPriceAgentList"
                component={require('../../features/productpriceagent/screens/ProductPriceAgentListScreen').ProductPriceAgentListScreen}
                options={{ unmountOnBlur: true }}
            />
        </Drawer.Navigator>
    );
}
