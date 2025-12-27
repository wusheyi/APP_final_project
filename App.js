import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationScreen from './src/screens/NotificationScreen';
// Teacher
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';
import CreateAssignmentScreen from './src/screens/CreateAssignmentScreen';
import TeacherQnAScreen from './src/screens/TeacherQnAScreen';
import AssignmentListScreen from './src/screens/AssignmentListScreen';
import StatusDashboardScreen from './src/screens/StatusDashboardScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultScreen from './src/screens/ResultScreen';
// Student
import StudentAssignmentListScreen from './src/screens/StudentAssignmentListScreen';
import QuestionScreen from './src/screens/QuestionScreen';

// Icons
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// --- Navigation Stacks ---

function HomeStack({ navigation, route }) {
  const { user } = route.params || {}; // Pass user down
  const { theme } = useTheme();

  // Helper for Burger Menu
  const MenuButton = () => (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={24} color="#fff" />
    </TouchableOpacity>
  );

  // Helper for Logout Button
  const LogoutButton = () => (
    <TouchableOpacity
      onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
      style={{ marginRight: 15 }}
    >
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        initialParams={{ user }}
        options={{
          title: '首頁',
          headerLeft: () => <MenuButton />, // Add Hamburger
          headerRight: () => <LogoutButton />, // Add Logout
        }}
      />
      {/* Teacher Routes */}
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} options={{ title: '管理面板' }} />
      <Stack.Screen name="TeacherQnA" component={TeacherQnAScreen} options={{ title: '學生問答' }} />
      <Stack.Screen name="CreateAssignment" component={CreateAssignmentScreen} options={{ title: '新增作業' }} />
      <Stack.Screen name="AssignmentList" component={AssignmentListScreen} options={{ title: '選擇作業' }} />
      <Stack.Screen name="StatusDashboard" component={StatusDashboardScreen} options={{ title: '繳交狀態' }} />
      {/* Student Routes */}
      <Stack.Screen name="StudentAssignmentList" component={StudentAssignmentListScreen} options={{ title: '我的作業' }} />
      <Stack.Screen name="Question" component={QuestionScreen} options={{ title: '提出問題' }} />
      {/* Common */}
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: '掃描 QR Code' }} />
      <Stack.Screen name="Result" component={ResultScreen} options={{ title: '結果', headerLeft: null }} />
    </Stack.Navigator>
  );
}

function MainTabs({ route }) {
  const { user } = route.params || {}; // Get user from Drawer
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
        },
        headerShown: false, // Stack header handles title
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        initialParams={{ user }}
        options={{ title: '首頁' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        initialParams={{ user }}
        options={{ title: '設定' }}
      />
    </Tab.Navigator>
  );
}

function DrawerGroup({ route }) {
  const { user } = route.params || {};
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // We use Stack/Tab headers
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={MainTabs}
        initialParams={{ user }}
        options={{
          title: '首頁',
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        initialParams={{ user }}
        options={{
          title: '通知中心',
          headerShown: true, // Show header for this screen since it's direct in Drawer
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#fff',
          drawerIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  const { theme, themeMode } = useTheme();

  return (
    <NavigationContainer>
      {/* Dynamic Status Bar - Safety check for theme */}
      <StatusBar
        style={themeMode === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme?.colors?.background || '#fff'}
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={DrawerGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}