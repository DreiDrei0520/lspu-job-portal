# 🔍 Search & Filter Guide - Admin Dashboard

## Overview
The Applications and Evaluations tabs now have comprehensive search and filter functionality to help admins quickly find and manage applicant data.

---

## 📋 **Applications Tab**

### Search Functionality
- **Search Bar**: Located at the top of the Applications tab
- **Searchable Fields**:
  - Applicant Name
  - Applicant Email
  - Job Title

### Filter Options
- **Status Filter**: Dropdown to filter applications by status
  - All Statuses (default)
  - Pending
  - Under Review
  - Shortlisted
  - Interview Scheduled
  - Exam Scheduled
  - For Requirements
  - Accepted
  - Rejected

### Features
- ✅ **Real-time Search**: Results update as you type
- ✅ **Combined Filters**: Search and status filter work together
- ✅ **Result Counter**: Shows "X of Y" applications matching filters
- ✅ **Clear Filters Button**: Quickly reset all filters
- ✅ **Empty State**: Helpful message when no results match filters

---

## 📊 **Evaluations Tab**

### Search Functionality
- **Enhanced Search Bar**: Searches across multiple fields
- **Searchable Fields**:
  - Applicant Name
  - Applicant Email
  - Job Title/Position
  - Evaluator Name

### Filter Options

#### 1. **Category Filter**
- All Categories (default)
- Teaching Positions
- Non-Teaching Positions

#### 2. **Score Range Filter**
- All Score Ranges (default)
- Excellent (90-100%)
- Very Good (80-89%)
- Good (70-79%)
- Satisfactory (60-69%)
- Needs Improvement (<60%)

### Features
- ✅ **Multi-field Search**: Search by applicant or evaluator
- ✅ **Multiple Filters**: Combine category and score filters
- ✅ **Smart Filtering**: All filters work together seamlessly
- ✅ **Result Counter**: Shows "X of Y" evaluations matching criteria
- ✅ **Clear Filters Button**: Reset all search and filter criteria
- ✅ **Empty State**: Helpful message with option to clear filters

---

## 💡 **Usage Tips**

### Finding Specific Applications
1. Use the search bar to quickly find applicants by name or email
2. Combine with status filter to find e.g., "all shortlisted applicants named John"
3. Clear filters to return to full list

### Analyzing Evaluations
1. **By Performance**: Use score range filter to view top performers (Excellent/Very Good)
2. **By Position Type**: Filter teaching vs non-teaching evaluations
3. **By Evaluator**: Search by evaluator name to review specific admin's assessments
4. **Combined Analysis**: E.g., "All teaching positions with excellent scores"

### Best Practices
- **Start Broad**: Begin with general search, then narrow with filters
- **Use Clear Filters**: Reset often to avoid missing relevant results
- **Check Counters**: Pay attention to "X of Y" to know how many results are filtered out
- **Empty Results**: If you see "No results found," try clearing filters or broadening search

---

## 🎯 **Example Use Cases**

### Applications Tab
```
Scenario: Find all pending teaching applications
1. Enter "teaching" in search bar
2. Select "Pending" from status dropdown
Result: Shows only pending applications for teaching positions
```

```
Scenario: Check applications from a specific candidate
1. Type candidate's name in search bar
2. View all their applications across different positions
```

### Evaluations Tab
```
Scenario: Review top candidates for teaching positions
1. Select "Teaching Positions" from category filter
2. Select "Excellent (90-100%)" from score range
Result: Shows only teaching position evaluations with 90%+ scores
```

```
Scenario: Find evaluations conducted by a specific admin
1. Type admin's name in search bar
Result: Shows all evaluations by that evaluator
```

```
Scenario: Identify candidates needing review
1. Select "Needs Improvement (<60%)" from score range
2. Review these evaluations for potential re-assessment
```

---

## 🔧 **Technical Details**

### Filter Logic
- **Applications**: Filters use AND logic (search + status must both match)
- **Evaluations**: All filters use AND logic (search + category + score must all match)
- **Case Insensitive**: All searches are case-insensitive
- **Partial Matching**: Search matches partial strings (e.g., "John" matches "Johnny")

### Performance
- Filtering happens client-side for instant results
- No server calls needed when filtering
- Optimized for large datasets

---

## 📝 **Notes**

- Filters persist while staying on the same tab
- Switching tabs does NOT clear filters
- Manually clear filters or reload page to reset
- Search works on visible text fields only
- Score ranges are based on the totalScore field in evaluations

---

**Last Updated**: Current Version  
**Feature**: Search & Filter Enhancement  
**Components**: AdminDashboard - Applications & Evaluations Tabs
