import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Box, IconButton, TextField, Drawer, MenuItem, Slider, Button,
  List, ListItem, ListItemText, Collapse, Typography, Pagination, FormControlLabel, Checkbox, Select
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ClearIcon from '@mui/icons-material/Clear';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import moment from 'moment';
import Fuse from 'fuse.js';
import sampleData from './sample-data.json';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    category: [],
    subcategory: [],
    price: [0, 1000],
    sale_price: [0, 1000],
    createdAt: [null, null],
    updatedAt: [null, null],
  });
  const [sortModel, setSortModel] = useState({});
  const [page, setPage] = useState(0);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    setData(sampleData);
  }, []);

  useEffect(() => {
    const grouped = {};
    data.forEach((row) => {
      if (!grouped[row.category]) {
        grouped[row.category] = {};
      }
      if (!grouped[row.category][row.subcategory]) {
        grouped[row.category][row.subcategory] = [];
      }
      grouped[row.category][row.subcategory].push(row);
    });
    setGroupedData(grouped);
  }, [data]);

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', enableSorting: true },
      { accessorKey: 'name', header: 'Name', enableSorting: true },
      { accessorKey: 'category', header: 'Category', enableSorting: true, enableGrouping: true },
      { accessorKey: 'subcategory', header: 'Subcategory', enableSorting: true, enableGrouping: true },
      { accessorKey: 'price', header: 'Price', enableSorting: true },
      { accessorKey: 'sale_price', header: 'Sale Price', enableSorting: true },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableSorting: true,
        Cell: ({ cell }) => moment(cell.value).format('DD-MMM-YYYY HH:mm')
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        enableSorting: true,
        Cell: ({ cell }) => moment(cell.value).format('DD-MMM-YYYY HH:mm')
      }
    ],
    []
  );

  useEffect(() => {
    const initialVisibility = columns.reduce((acc, column) => {
      acc[column.accessorKey] = true;
      return acc;
    }, {});
    setColumnVisibility(initialVisibility);
  }, [columns]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const fuse = useMemo(() => new Fuse(data, { keys: ['name'], threshold: 0.3 }), [data]);

  const filteredData = useMemo(() => {
    let filtered = data.filter((row) => {
      const matchesName = row.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesCategory = filters.category.length === 0 || filters.category.includes(row.category);
      const matchesSubcategory = filters.subcategory.length === 0 || filters.subcategory.includes(row.subcategory);
      const matchesPrice = row.price >= filters.price[0] && row.price <= filters.price[1];
      const matchesSalePrice = row.sale_price === undefined || (row.sale_price >= filters.sale_price[0] && row.sale_price <= filters.sale_price[1]);
      const matchesCreatedAt = (!filters.createdAt[0] || new Date(row.createdAt) >= filters.createdAt[0]) &&
                                (!filters.createdAt[1] || new Date(row.createdAt) <= filters.createdAt[1]);
      const matchesUpdatedAt = (!filters.updatedAt[0] || new Date(row.updatedAt) >= filters.updatedAt[0]) &&
                                (!filters.updatedAt[1] || new Date(row.updatedAt) <= filters.updatedAt[1]);

      return matchesName && matchesCategory && matchesSubcategory && matchesPrice && matchesSalePrice && matchesCreatedAt && matchesUpdatedAt;
    });

    if (globalFilter) {
      filtered = fuse.search(globalFilter.toLowerCase()).map((result) => result.item);
    }

    return filtered;
  }, [data, globalFilter, filters, fuse]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortModel.key) {
      sorted.sort((a, b) => {
        if (a[sortModel.key] < b[sortModel.key]) return sortModel.direction === 'asc' ? -1 : 1;
        if (a[sortModel.key] > b[sortModel.key]) return sortModel.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortModel]);

  const categoryFacets = useMemo(() => {
    const facetCounts = {};
    data.forEach((row) => {
      if (facetCounts[row.category]) {
        facetCounts[row.category]++;
      } else {
        facetCounts[row.category] = 1;
      }
    });
    return facetCounts;
  }, [data]);

  const subcategoryFacets = useMemo(() => {
    const facetCounts = {};
    data.forEach((row) => {
      if (facetCounts[row.subcategory]) {
        facetCounts[row.subcategory]++;
      } else {
        facetCounts[row.subcategory] = 1;
      }
    });
    return facetCounts;
  }, [data]);

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log('Subcategory clicked:', subcategory);
  };

  const paginatedData = useMemo(() => {
    const start = page * 10;
    return sortedData.slice(start, start + 10);
  }, [page, sortedData]);

  const handleColumnVisibilityChange = (columnKey) => (event) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: event.target.checked,
    }));
  };

  const handleSortChange = (key) => (event) => {
    const direction = event.target.value;
    setSortModel({ key, direction });
  };

  const openDrawer = (type) => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <TextField
          label="Search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginRight: 16 }}
        />
        <IconButton onClick={() => openDrawer('visibility')}>
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={() => openDrawer('filter')}>
          <FilterListIcon />
        </IconButton>
        <IconButton onClick={() => openDrawer('sort')}>
          <SortIcon />
        </IconButton>
        <IconButton onClick={() => openDrawer('group')}>
          <GroupWorkIcon />
        </IconButton>
      </Box>
      <MaterialReactTable
        columns={columns}
        data={paginatedData}
        state={{ columnVisibility }}
        enableSorting={true}
        enableGrouping={true}
        initialState={{ pagination: { pageSize: 10, pageIndex: page } }}
        onColumnVisibilityChange={(updatedColumnVisibility) => setColumnVisibility(updatedColumnVisibility)}
      />
      <Box display="flex" justifyContent="center" p={2}>
        <Pagination
          count={Math.ceil(sortedData.length / 10)}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
        />
      </Box>
      <Drawer
        anchor="right"
        open={isDrawerOpen && drawerType === 'visibility'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Column Visibility
          </Typography>
          {columns.map((column) => (
            <FormControlLabel
              key={column.accessorKey}
              control={
                <Checkbox
                  checked={columnVisibility[column.accessorKey] ?? true}
                  onChange={handleColumnVisibilityChange(column.accessorKey)}
                />
              }
              label={column.header}
            />
          ))}
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isDrawerOpen && drawerType === 'filter'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <TextField
            label="Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Typography gutterBottom>Category</Typography>
          <Select
            multiple
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            renderValue={(selected) => selected.join(', ')}
          >
            {Object.keys(categoryFacets).map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={filters.category.includes(category)} />
                {category} ({categoryFacets[category]})
              </MenuItem>
            ))}
          </Select>
          <Typography gutterBottom>Subcategory</Typography>
          <Select
            multiple
            value={filters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            renderValue={(selected) => selected.join(', ')}
          >
            {Object.keys(subcategoryFacets).map((subcategory) => (
              <MenuItem key={subcategory} value={subcategory}>
                <Checkbox checked={filters.subcategory.includes(subcategory)} />
                {subcategory} ({subcategoryFacets[subcategory]})
              </MenuItem>
            ))}
          </Select>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={filters.price}
            onChange={(e, newValue) => handleFilterChange('price', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            style={{ marginBottom: 16 }}
          />
          <Typography gutterBottom>Sale Price Range</Typography>
          <Slider
            value={filters.sale_price}
            onChange={(e, newValue) => handleFilterChange('sale_price', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            style={{ marginBottom: 16 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography gutterBottom>Created At</Typography>
            <DateRangePicker
              startText="Start"
              endText="End"
              value={filters.createdAt}
              onChange={(newValue) => handleFilterChange('createdAt', newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} variant="outlined" fullWidth margin="normal" />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} variant="outlined" fullWidth margin="normal" />
                </>
              )}
            />
            <Typography gutterBottom>Updated At</Typography>
            <DateRangePicker
              startText="Start"
              endText="End"
              value={filters.updatedAt}
              onChange={(newValue) => handleFilterChange('updatedAt', newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} variant="outlined" fullWidth margin="normal" />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} variant="outlined" fullWidth margin="normal" />
                </>
              )}
            />
          </LocalizationProvider>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setFilters({
              name: '',
              category: [],
              subcategory: [],
              price: [0, 1000],
              sale_price: [0, 1000],
              createdAt: [null, null],
              updatedAt: [null, null],
            })} variant="outlined" startIcon={<ClearIcon />}>
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isDrawerOpen && drawerType === 'sort'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Sort
          </Typography>
          {columns.map((column) => (
            <Box key={column.accessorKey} mb={2}>
              <Typography>{column.header}</Typography>
              <Select
                value={sortModel.key === column.accessorKey ? sortModel.direction : ''}
                onChange={handleSortChange(column.accessorKey)}
                displayEmpty
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </Box>
          ))}
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isDrawerOpen && drawerType === 'group'}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Group By
          </Typography>
          <List>
            {Object.keys(groupedData).map((category) => (
              <React.Fragment key={category}>
                <ListItem button onClick={() => handleCategoryClick(category)}>
                  <ListItemText primary={category} />
                </ListItem>
                <Collapse in={true} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {Object.keys(groupedData[category]).map((subcategory) => (
                      <ListItem button key={subcategory} onClick={() => handleSubcategoryClick(subcategory)}>
                        <ListItemText primary={subcategory} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default DataTable;
