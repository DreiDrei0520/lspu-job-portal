# LSPU Personnel Selection Board - Evaluation System Guide

## 🎯 **Overview**

The evaluation system allows admins to assess applicants using official LSPU Personnel Selection Board criteria. The system automatically displays the appropriate evaluation form based on the job category:

- **Teaching Positions** → Teaching Criteria
- **Non-Teaching Positions** → Non-Teaching Criteria

---

## 📋 **Evaluation Categories (Both Teaching & Non-Teaching)**

Both evaluation forms share the same main categories with different weightings:

| Category                            | Weight   | Description                            |
| ----------------------------------- | -------- | -------------------------------------- |
| **I. Potential**                    | 15%      | Interview performance + Aptitude test  |
| **II. Education**                   | 40%      | Educational qualifications and degrees |
| **III. Experience**                 | 20%      | Work experience relevance and duration |
| **IV. Training**                    | 10%      | Professional training and seminars     |
| **V. Eligibility**                  | 10%      | Civil Service, Board/Bar exams         |
| **VI. Outstanding Accomplishments** | 5%       | Citations, honors, recognitions        |
| **TOTAL**                           | **100%** | Overall assessment score               |

---

## 🔍 **How the System Determines Criteria**

### **Automatic Detection:**

The system checks the job category in this order:

1. **Job Category Field** (if set explicitly during job posting)
2. **Job Title Keywords** (looks for teaching-related terms)

```typescript
// Teaching Position detected if:
- job.category === 'teaching'
- job.title contains: "teacher", "instructor", "professor"

// Otherwise: Non-Teaching Position
```

### **Examples:**

| Job Title                   | Category Detected |
| --------------------------- | ----------------- |
| English Language Teacher    | Teaching ✅       |
| Computer Science Instructor | Teaching ✅       |
| Professor of Mathematics    | Teaching ✅       |
| Senior Web Developer        | Non-Teaching ✅   |
| Administrative Assistant    | Non-Teaching ✅   |
| HR Specialist               | Non-Teaching ✅   |

---

## 📊 **Detailed Criteria Breakdown**

### **I. POTENTIAL (15%)**

#### **Interview Component (10% - 70 points max)**

All 7 criteria are rated 0-10 points each:

1. **Personality** (Pleasing personal appearance)
2. **Communication Skills** (Smart, courteous, refined manner)
3. **Analytical Skills** (Insight, intelligence, emotional stability)
4. **Achievement Orientation** (Result-oriented, creative, innovative)
5. **Leadership/Management** (Planning and organizing skills)
6. **Relationship Management** (Networking, rapport building)
7. **Job Fit** (Flexibility, commitment, longevity)

**Total:** 70 points possible

#### **Aptitude Test (5% - 5 points max)**

Select one rating:

- **Superior** - 5 points
- **Above Average** - 4 points
- **Average** - 3 points
- **Below Average** - 2 points
- **Lowest** - 1 point

**Potential Score Calculation:**

```
Potential = (Interview Total / 70 × 10) + Aptitude Test
Maximum: 15 points
```

---

### **II. EDUCATION (40%)**

This is where **Teaching** and **Non-Teaching** criteria differ:

---

#### **🎓 TEACHING POSITION CRITERIA**

**Basic Requirement:**

- **Masteral Degree** - 35 points (automatic)

**Additional Points - Doctoral Degree/Units:**

- Completed 20% of total units - **1 point**
- Completed 40% of total units - **2 points**
- Completed 60% of total units - **3 points**
- Completed 80% of total units (CAR) - **4 points**
- Completed 100% of total units - **5 points**

**Plus:**

- **Relevance and Appropriateness** - Up to 40 points

**Education Score Calculation (Teaching):**

```
Education Total = Relevance + Doctoral Units
Maximum: 40 points (if relevance = 40 and doctoral = 0)
         45 points (if relevance = 40 and doctoral = 5)
```

---

#### **💼 NON-TEACHING POSITION CRITERIA**

**Basic Requirement:**

- **Per Qualification Standards** - 30 points (automatic)

**Additional Points - Masteral Degree/Units:**

- Completed 25% of total units - **1 point**
- Completed 50% of total units - **2 points**
- Completed 75% of total units - **3 points**
- Completed Academic Requirements (CAR) - **4 points**
- Completed 100% of total units - **5 points**

**Additional Points - Doctoral Degree/Units:**

- Completed 25% of total units - **6 points**
- Completed 50% of total units - **7 points**
- Completed 75% of total units - **8 points**
- Completed Academic Requirements (CAR) - **9 points**
- Completed 100% of total units - **10 points**

**Plus:**

- **Relevance and Appropriateness** - Up to 40 points

**Education Score Calculation (Non-Teaching):**

```
Education Total = Relevance + Masteral Units + Doctoral Units
Maximum: 40 points (if relevance = 40, no additional units)
         55 points (if relevance = 40, masteral = 5, doctoral = 10)
```

---

### **III. EXPERIENCE (20%)**

**Base Experience Points:**

- **5 to 10 years** - 15 points
- **3 to 4 years** - 10 points
- **1 to 2 years** - 5 points

**Additional Points:**

- **1 point** for every year beyond 10 years

**Example:**

```
Applicant with 13 years experience:
- Base: 15 points (5-10 years bracket)
- Additional: 3 points (13 - 10 = 3 extra years)
- Total: 18 points
```

**Experience Score Calculation:**

```
Experience = Base Points + Additional Points
Maximum: 20 points
```

---

### **IV. TRAINING (10%)**

**Base Training:**

- **Relevance and Appropriateness (40 hours)** - Up to 5 points

**Additional Points:**

- **1 point** for every 8 hours of additional training

**Example:**

```
Applicant with 80 hours of training:
- Base: 5 points (40 hours)
- Additional: 5 points (40 extra hours ÷ 8 = 5)
- Total: 10 points
```

**Training Score Calculation:**

```
Training = Base + (Additional Hours ÷ 8)
Maximum: 10 points
```

---

### **V. ELIGIBILITY (10%)**

**Eligible Certifications:**

- **RA 1080** (Teacher's License)
- **CSC Exam** (Civil Service Commission)
- **BAR Exam** (Lawyers)
- **BOARD Exam** (Professional licenses)

**Scoring:**

- Has eligible certification - **10 points**
- Partial/In-progress - **5 points**
- None - **0 points**

**Eligibility Score:**

```
Maximum: 10 points
```

---

### **VI. OUTSTANDING ACCOMPLISHMENTS (5%)**

**Qualifying Accomplishments:**

- Citations
- Recognitions
- Honor Graduates (Cum Laude, Magna Cum Laude, Summa Cum Laude)
- Board/Bar Topnotcher
- CSC Topnotcher

**Scoring:**

- Outstanding accomplishments - Up to **5 points**
- No accomplishments - **0 points**

**Accomplishments Score:**

```
Maximum: 5 points
```

---

## 🎯 **How to Use the Evaluation Form**

### **Step 1: Access the Evaluation Form**

1. Log in as **Admin** or **Superadmin**
2. Go to **Applications** tab
3. Find the applicant you want to evaluate
4. Click the **🏆 "Evaluate"** button (amber/orange color)

---

### **Step 2: Verify Applicant Information**

The form automatically displays:

- ✅ Applicant Name
- ✅ Position Applied For
- ✅ Job Category (Teaching or Non-Teaching)

**Important:** Verify the category is correct before proceeding!

---

### **Step 3: Enter Evaluator Name**

```
┌─────────────────────────────────┐
│ Evaluator Name                  │
│ [Enter your name]               │
└─────────────────────────────────┘
```

This is **required** - the form won't submit without it.

---

### **Step 4: Complete Each Section**

#### **Section I: POTENTIAL**

**Interview Criteria (7 items):**

For each criterion, enter a score from **0 to 10**:

```
Personality                    [___10___]
Communication Skills           [___10___]
Analytical Skills              [___10___]
Achievement Orientation        [___10___]
Leadership/Management          [___10___]
Relationship Management        [___10___]
Job Fit                        [___10___]
────────────────────────────────────────
Total Interview Score:         70/70
```

**Aptitude Test:**

Select ONE option:

- ⭕ Superior (5 points)
- ⭕ Above Average (4 points)
- ⭕ Average (3 points)
- ⭕ Below Average (2 points)
- ⭕ Lowest (1 point)

**Live Calculation:**

```
┌─────────────────────────────────┐
│ Potential Score (15%)           │
│ 15.00                           │
└─────────────────────────────────┘
```

---

#### **Section II: EDUCATION**

**Relevance and Appropriateness:**

```
Relevance of Education (Max: 40)  [___30___]
```

**For TEACHING Positions:**

```
Basic Minimum (Masteral): 35 points ✓

Doctoral Degree/Units:
⭕ Completed 20% (1 point)
⭕ Completed 40% (2 points)
⭕ Completed 60% (3 points)
⭕ Completed 80% - CAR (4 points)
⭕ Completed 100% (5 points)
⭕ None (0 points)
```

**For NON-TEACHING Positions:**

```
Basic Minimum (Per QS): 30 points ✓

Masteral Degree/Units:
⭕ Completed 25% (1 point)
⭕ Completed 50% (2 points)
⭕ Completed 75% (3 points)
⭕ Completed CAR (4 points)
⭕ Completed 100% (5 points)
⭕ None (0 points)

Doctoral Degree/Units:
⭕ Completed 25% (6 points)
⭕ Completed 50% (7 points)
⭕ Completed 75% (8 points)
⭕ Completed CAR (9 points)
⭕ Completed 100% (10 points)
⭕ None (0 points)
```

**Live Calculation:**

```
┌─────────────────────────────────┐
│ Education Score (40%)           │
│ 37.00                           │
└─────────────────────────────────┘
```

---

#### **Section III: EXPERIENCE**

**Years of Experience:**

Select ONE option:

```
⭕ 5 to 10 years (15 points)
⭕ 3 to 4 years (10 points)
⭕ 1 to 2 years (5 points)
```

**Additional Years (>10 years):**

```
Additional points (1 per year)  [___5___]
```

**Example:**

- Selected: 5 to 10 years = 15 points
- Additional: 5 years = 5 points
- Total: 20 points (15 years experience)

**Live Calculation:**

```
┌─────────────────────────────────┐
│ Experience Score (20%)          │
│ 20.00                           │
└─────────────────────────────────┘
```

---

#### **Section IV: TRAINING**

```
Training Relevance (40hrs)      [___5___]
Additional Training (per 8hrs)  [___5___]
```

**Example:**

- Relevance: 5 points (40 hours)
- Additional: 5 points (5 × 8 = 40 extra hours)
- Total: 10 points (80 hours total)

**Live Calculation:**

```
┌─────────────────────────────────┐
│ Training Score (10%)            │
│ 10.00                           │
└─────────────────────────────────┘
```

---

#### **Section V: ELIGIBILITY**

```
RA 1080, CSC, BAR/BOARD Exam    [___10___]
```

Enter **0 to 10** based on qualifications.

**Live Calculation:**

```
┌─────────────────────────────────┐
│ Eligibility Score (10%)         │
│ 10.00                           │
└─────────────────────────────────┘
```

---

#### **Section VI: OUTSTANDING ACCOMPLISHMENTS**

```
Citations, Honors, etc.         [___5___]
```

Enter **0 to 5** based on accomplishments.

**Live Calculation:**

```
┌─────────────────────────────────┐
│ Accomplishments Score (5%)      │
│ 5.00                            │
└─────────────────────────────────┘
```

---

### **Step 5: Review Summary**

The **SUMMARY OF SCORES** section displays automatically:

```
┌──────────────────────────────────────┐
│ SUMMARY OF SCORES                    │
├──────────────────────────────────────┤
│ I. Potential (15%)       15.00      │
│ II. Education (40%)      37.00      │
│ III. Experience (20%)    20.00      │
│ IV. Training (10%)       10.00      │
│ V. Eligibility (10%)     10.00      │
│ VI. Accomplishments (5%)  5.00      │
├══════════════════════════════════════┤
│ TOTAL (100%)             97.00      │
└──────────────────────────────────────┘
```

**This summary updates in real-time as you enter scores!**

---

### **Step 6: Submit Evaluation**

1. Review all scores carefully
2. Ensure evaluator name is entered
3. Click **"Submit Evaluation"** button

```
┌─────────────────────────────────┐
│ [Cancel]  [💾 Submit Evaluation]│
└─────────────────────────────────┘
```

**Success Message:**

```
✅ Evaluation submitted successfully!
```

The form will close and return you to the Applications tab.

---

## 📊 **Score Interpretation**

### **Rating Scale:**

| Score Range | Rating                | Interpretation          |
| ----------- | --------------------- | ----------------------- |
| 90-100      | **Outstanding**       | Exceptional candidate   |
| 80-89       | **Very Satisfactory** | Strong candidate        |
| 70-79       | **Satisfactory**      | Good candidate          |
| 60-69       | **Fair**              | Acceptable candidate    |
| Below 60    | **Poor**              | Does not meet standards |

---

## 🎯 **Example: Teaching Position Evaluation**

**Applicant:** Dey Guzman  
**Position:** English Language Teacher  
**Category:** Teaching ✓

### **Scores:**

| Criteria                | Details         | Score     |
| ----------------------- | --------------- | --------- |
| **I. Potential**        |                 |           |
| - Interview             | 70/70 (all 10s) | 10.00     |
| - Aptitude              | Superior        | 5.00      |
| **Subtotal**            |                 | **15.00** |
|                         |                 |           |
| **II. Education**       |                 |           |
| - Relevance             | 30/40           | 30.00     |
| - Basic (Masteral)      | Automatic       | 35.00     |
| - Doctoral Units        | None            | 0.00      |
| **Subtotal**            | 30/40 × 40%     | **30.00** |
|                         |                 |           |
| **III. Experience**     |                 |           |
| - Years                 | 5-10 years      | 15.00     |
| - Additional            | 5 years extra   | 5.00      |
| **Subtotal**            |                 | **20.00** |
|                         |                 |           |
| **IV. Training**        |                 |           |
| - Relevance             | 40 hours        | 5.00      |
| - Additional            | 40 hours (5×8)  | 5.00      |
| **Subtotal**            |                 | **10.00** |
|                         |                 |           |
| **V. Eligibility**      | RA 1080 (LET)   | **5.00**  |
| **VI. Accomplishments** | Cum Laude       | **5.00**  |
|                         |                 |           |
| **GRAND TOTAL**         |                 | **85.00** |

**Rating:** Very Satisfactory ⭐⭐⭐⭐

---

## 🎯 **Example: Non-Teaching Position Evaluation**

**Applicant:** John Andrei Guzman  
**Position:** Senior Web Developer  
**Category:** Non-Teaching ✓

### **Scores:**

| Criteria                | Details          | Score     |
| ----------------------- | ---------------- | --------- |
| **I. Potential**        |                  |           |
| - Interview             | 70/70 (all 10s)  | 10.00     |
| - Aptitude              | Superior         | 5.00      |
| **Subtotal**            |                  | **15.00** |
|                         |                  |           |
| **II. Education**       |                  |           |
| - Relevance             | 37/40            | 37.00     |
| - Basic (Per QS)        | Automatic        | 30.00     |
| - Masteral Units        | None             | 0.00      |
| - Doctoral Units        | 50% complete     | 7.00      |
| **Subtotal**            | 37/40 × 40%      | **37.00** |
|                         |                  |           |
| **III. Experience**     |                  |           |
| - Years                 | 5-10 years       | 15.00     |
| - Additional            | None             | 0.00      |
| **Subtotal**            |                  | **15.00** |
|                         |                  |           |
| **IV. Training**        |                  |           |
| - Relevance             | 40 hours         | 5.00      |
| - Additional            | 40 hours (5×8)   | 5.00      |
| **Subtotal**            |                  | **10.00** |
|                         |                  |           |
| **V. Eligibility**      | CSC Professional | **10.00** |
| **VI. Accomplishments** | Industry Awards  | **5.00**  |
|                         |                  |           |
| **GRAND TOTAL**         |                  | **92.00** |

**Rating:** Outstanding ⭐⭐⭐⭐⭐

---

## 🔍 **Key Differences: Teaching vs Non-Teaching**

| Aspect              | Teaching             | Non-Teaching                |
| ------------------- | -------------------- | --------------------------- |
| **Basic Education** | Masteral (35 pts)    | Per QS (30 pts)             |
| **Masteral Units**  | N/A                  | 1-5 points                  |
| **Doctoral Units**  | 1-5 points           | 6-10 points                 |
| **Focus**           | Academic credentials | Professional qualifications |

---

## 💾 **Data Storage**

### **Evaluation Record Includes:**

```json
{
  "id": "evaluation:1234567890",
  "applicationId": "application:1234567890",
  "applicantName": "Dey Guzman",
  "position": "English Language Teacher",
  "jobCategory": "teaching",
  "evaluatorName": "Dr. Maria Santos",
  "potential": {
    "personality": 10,
    "communication": 10,
    "analytical": 10,
    "achievement": 10,
    "leadership": 10,
    "relationship": 10,
    "jobFit": 10,
    "interviewTotal": 70,
    "aptitudeTest": 5,
    "score": "15.00"
  },
  "education": {
    "relevance": 30,
    "basic": 30,
    "masteralUnits": 0,
    "doctoralUnits": 0,
    "total": 30,
    "score": "30.00"
  },
  "summary": {
    "potential": "15.00",
    "education": "30.00",
    "experience": "20.00",
    "training": "10.00",
    "eligibility": "5.00",
    "accomplishments": "5.00",
    "total": "85.00"
  },
  "totalScore": "85.00",
  "evaluatedAt": "2024-01-15T10:30:00Z",
  "evaluatedBy": "user:admin123"
}
```

---

## 🛡️ **Access Control**

### **Who Can Evaluate:**

- ✅ **Admins**
- ✅ **Superadmins**

### **Who Cannot Evaluate:**

- ❌ **Applicants**
- ❌ **Unauthenticated users**

---

## 🎨 **UI Features**

### **Color Coding:**

| Element               | Color               | Purpose         |
| --------------------- | ------------------- | --------------- |
| Section Headers       | Teal background     | Organization    |
| Teaching Criteria     | Teal borders        | Identification  |
| Non-Teaching Criteria | Blue/Purple borders | Differentiation |
| Score Summary         | Teal gradient       | Emphasis        |
| Evaluate Button       | Amber               | Action          |
| Submit Button         | Teal                | Confirmation    |

### **Live Calculations:**

All scores update **in real-time** as you enter values:

- ✅ Interview totals
- ✅ Section scores
- ✅ Summary totals
- ✅ Grand total

### **Validation:**

- ✅ Evaluator name required
- ✅ Number limits enforced (0-10, etc.)
- ✅ Radio button exclusivity

---

## 📱 **Responsive Design**

The evaluation form works on:

- ✅ Desktop (optimized)
- ✅ Tablet (responsive)
- ✅ Mobile (scrollable)

---

## ✅ **Best Practices**

### **Before Evaluating:**

1. Review applicant's complete application
2. Check all submitted documents
3. Verify work experience and education
4. Review interview notes

### **During Evaluation:**

1. Be objective and fair
2. Base scores on evidence
3. Use the full range (0-10)
4. Take notes if needed

### **After Evaluation:**

1. Review summary before submitting
2. Verify evaluator name is correct
3. Double-check calculations
4. Submit and confirm success

---

## 🎉 **Summary**

The LSPU Evaluation System provides:

✅ **Automatic criteria selection** based on job category  
✅ **Official LSPU assessment forms** for both teaching and non-teaching  
✅ **Real-time score calculation** for immediate feedback  
✅ **Comprehensive evaluation** across 6 major criteria  
✅ **Secure data storage** with evaluator tracking  
✅ **Professional interface** matching LSPU branding

**The system ensures fair, standardized, and transparent evaluation of all applicants!** 🏆✨