import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProductStats } from '../../redux/slices/productStatsSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface CategoryStat {
  category: string;
  count: number;
  totalValue: number;
  averagePrice: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface ProductStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryStats: CategoryStat[];
  salesStats: {
    totalSales: number;
    averageOrderValue: number;
    topProducts: TopProduct[];
  };
}

const ProductStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.productStats);

  useEffect(() => {
    dispatch(fetchProductStats());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Product Statistics
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">
                {stats.totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4">
                ${stats.totalValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.lowStockCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.outOfStockCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Distribution */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Category Distribution
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.categoryStats.map((entry: CategoryStat, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              {stats.categoryStats.map((category: CategoryStat, index: number) => (
                <React.Fragment key={category.category}>
                  <ListItem>
                    <ListItemText
                      primary={category.category}
                      secondary={`${category.count} products - $${category.totalValue.toLocaleString()} total value`}
                    />
                  </ListItem>
                  {index < stats.categoryStats.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Sales Performance */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sales Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.salesStats.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Total Sales"
                  secondary={`$${stats.salesStats.totalSales.toLocaleString()}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Average Order Value"
                  secondary={`$${stats.salesStats.averageOrderValue.toLocaleString()}`}
                />
              </ListItem>
              <Divider />
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Top Products
              </Typography>
              {stats.salesStats.topProducts.map((product: TopProduct, index: number) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.sales} units - $${product.revenue.toLocaleString()} revenue`}
                    />
                  </ListItem>
                  {index < stats.salesStats.topProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductStats; 