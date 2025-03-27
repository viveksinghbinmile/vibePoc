import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchSalesReport, setFilters, clearFilters } from '../../redux/slices/adminSlice';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ProductStats from './ProductStats';
import ProductImportExport from './ProductImportExport';
import ProductVariants from './ProductVariants';
import ProductReviews from './ProductReviews';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { salesReport, loading, error, filters } = useAppSelector((state) => state.admin);
  const [tabValue, setTabValue] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSalesReport({
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      category: filters.category || undefined,
    }));
  }, [dispatch, filters]);

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    dispatch(
      setFilters({
        [field]: date ? date.toISOString() : null,
      })
    );
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setFilters({
        category: event.target.value || null,
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportData = () => {
    if (!salesReport) return;

    const data = {
      summary: {
        totalSales: salesReport.totalSales,
        totalOrders: salesReport.totalOrders,
        averageOrderValue: salesReport.averageOrderValue,
      },
      salesByCategory: salesReport.salesByCategory,
      salesByMonth: salesReport.salesByMonth,
      topProducts: salesReport.topProducts,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setTabValue(6); // Switch to Product Variants tab
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportData}
          disabled={!salesReport}
        >
          Export Data
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Sales Overview" />
          <Tab label="User Management" />
          <Tab label="Product Management" />
          <Tab label="Category Management" />
          <Tab label="Product Stats" />
          <Tab label="Import/Export" />
          <Tab label="Product Variants" />
          <Tab label="Product Reviews" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate ? new Date(filters.startDate) : null}
                  onChange={handleDateChange('startDate')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate ? new Date(filters.endDate) : null}
                  onChange={handleDateChange('endDate')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Category"
                value={filters.category || ''}
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {salesReport?.salesByCategory.map((category) => (
                  <MenuItem key={category.category} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4" color="primary">
                ${salesReport?.totalSales.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" color="primary">
                {salesReport?.totalOrders}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Average Order Value
              </Typography>
              <Typography variant="h4" color="primary">
                ${salesReport?.averageOrderValue.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sales by Category
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={salesReport?.salesByCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {salesReport?.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Sales
              </Typography>
              <BarChart
                width={400}
                height={300}
                data={salesReport?.salesByMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Products Table */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Top Products
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Total Sales</TableCell>
                  <TableCell align="right">Quantity Sold</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesReport?.topProducts.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="right">${product.totalSales.toFixed(2)}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <UserManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ProductManagement onProductSelect={handleProductSelect} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <CategoryManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <ProductStats />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <ProductImportExport />
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        {selectedProductId ? (
          <ProductVariants productId={selectedProductId} />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Please select a product from the Product Management tab to view its variants
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={7}>
        {selectedProductId ? (
          <ProductReviews productId={selectedProductId} />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Please select a product from the Product Management tab to view its reviews
            </Typography>
          </Box>
        )}
      </TabPanel>
    </Container>
  );
};

export default AdminDashboard; 